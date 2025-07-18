use super::utils::extract_card_and_job_type;
use crate::models::api_struct::{Job, Pipeline, TestReport};
use crate::models::enums::ProjectId;
use crate::models::response::ByCardsResponse;
use chrono::{Days, Utc};
use gitlab::api::projects::pipelines::{PipelineJobs, PipelineTestReportSummary, Pipelines};
use gitlab::api::{paged, AsyncQuery, Pagination};
use gitlab::AsyncGitlab;
use std::collections::HashMap;
pub type AsyncResult<T> = Result<T, Box<dyn std::error::Error + Send + Sync + 'static>>;
use futures::stream::{FuturesUnordered, StreamExt};
use std::sync::{Arc, Mutex};
pub async fn get_project_pipelines(
    project_id: &ProjectId,
    client: &AsyncGitlab,
    since_day: u64,
    branch_name: String,
) -> Result<Vec<Pipeline>, Box<dyn std::error::Error>> {
    let endpoint = Pipelines::builder()
        .project(project_id.to_string())
        .ref_(branch_name)
        .updated_after(Utc::now().checked_sub_days(Days::new(since_day)).unwrap())
        .build()?;
    let pipelines: Vec<Pipeline> = paged(endpoint, Pagination::All).query_async(client).await?;
    Ok(pipelines)
}

pub async fn get_pipeline_jobs(
    project_id: &ProjectId,
    pipelines_id: u64,
    client: &AsyncGitlab,
) -> AsyncResult<Vec<Job>> {
    let endpoint = PipelineJobs::builder()
        .project(project_id.to_string())
        .pipeline(pipelines_id)
        .build()?;
    let jobs: Vec<Job> = paged(endpoint, Pagination::All).query_async(client).await?;
    Ok(jobs)
}

pub async fn get_pipeline_test_summary(
    project_id: &ProjectId,
    pipelines_id: u64,
    client: &AsyncGitlab,
) -> AsyncResult<TestReport> {
    let endpoint = PipelineTestReportSummary::builder()
        .project(project_id.to_string())
        .pipeline(pipelines_id)
        .build()?;

    let test_report: TestReport = endpoint.query_async(client).await?;
    Ok(test_report)
}


pub async fn build_front_response_concurrency(
    pipelines: Vec<Pipeline>,
    client: &AsyncGitlab,
) -> AsyncResult<ByCardsResponse> {
    let  response = Arc::new(Mutex::new(ByCardsResponse::default()));
let mut pipeline_futures = FuturesUnordered::new();

  for pipeline in pipelines {
    let client = client.clone();
    let response = response.clone();

    pipeline_futures.push(async move {
      // Launch in concurence job and test_summary API Calls
      let (jobs_res, report_res) = tokio::join!(
        get_pipeline_jobs(&ProjectId::Ci, pipeline.id, &client),
        get_pipeline_test_summary(&ProjectId::Ci, pipeline.id, &client),
      );

      let jobs = match jobs_res {
        Ok(j) => j,
        Err(e) => {
          eprintln!("error job call on pipeline {}: {:?}", pipeline.id, e);
          return;
        }
      };

      let report_map = Arc::new(Mutex::new(match report_res {
        Ok(report) => report
          .test_suites
          .into_iter()
          .map(|ts| (ts.name.clone(), ts))
          .collect(),
        Err(_) => HashMap::new(),
      }));

      let mut job_futures = FuturesUnordered::new();
      for mut job in jobs {
        let pipeline = pipeline.clone();
        let response = response.clone();
        let report_map = report_map.clone();

        job_futures.push(async move {
          if let Some((card_type, job_type)) = extract_card_and_job_type(&job.name) {
            if job_type.is_test() {
              if let Some(ts) = report_map.lock().unwrap().remove(&job.name) {
                job.tests_report = Some(ts);
              }
            }
            // Lock response to insert it the job
            let mut resp = response.lock().unwrap();
            resp.insert_job(&card_type, job_type, &pipeline, job);
          }
        });
      }

      // Wait all jobs are done for this pipeline
      while job_futures.next().await.is_some() {}
    });
  }

  // Wait for all pipeline to be done
  while pipeline_futures.next().await.is_some() {}

  let resp = Arc::try_unwrap(response).unwrap().into_inner().unwrap();
  Ok(resp)

}
