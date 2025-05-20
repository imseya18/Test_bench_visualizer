use super::utils::extract_card_and_job_type;
use crate::models::api_struct::{Job, Pipeline, TestReport};
use crate::models::enums::ProjectId;
use crate::models::response::ByCardsResponse;
use chrono::{Days, Utc};
use gitlab::api::projects::pipelines::{PipelineTestReportSummary ,PipelineJobs, Pipelines};
use gitlab::api::{paged, AsyncQuery, Pagination};
use gitlab::AsyncGitlab;

pub type AsyncResult<T> = Result<T, Box<dyn std::error::Error + Send + Sync + 'static>>;


pub async fn get_project_pipelines(
    project_id: &ProjectId,
    client: &AsyncGitlab,
    since_day: u64,
    pipeline_name: String,
) -> Result<Vec<Pipeline>, Box<dyn std::error::Error>> {
    let endpoint = Pipelines::builder()
        .project(project_id.to_string())
        .ref_(pipeline_name)
        .updated_after(Utc::now().checked_sub_days(Days::new(since_day)).unwrap())
        .build()?;
    let pipelines: Vec<Pipeline> = paged(endpoint, Pagination::All).query_async(client).await?;
    for pipeline in &pipelines {
        println!("ref de pipeline: {:?}", pipeline.pipeline_ref);
    }
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


pub async fn build_front_response(
    pipelines: Vec<Pipeline>,
    client: &AsyncGitlab,
) -> AsyncResult<ByCardsResponse> {
    let mut response = ByCardsResponse::default();
    for pipeline in pipelines {
        match get_pipeline_jobs(&ProjectId::Ci, pipeline.id, client).await {
            Ok(jobs) => {
                let mut tests_report_res =
                    get_pipeline_test_summary(&ProjectId::Ci, pipeline.id, client).await;
                for mut job in jobs {
                    if let Some((card_type, job_type)) = extract_card_and_job_type(&job.name) {
                        if job_type.is_test() {
                            if let Ok(test_report) = tests_report_res.as_mut() {
                                for (index, test) in test_report.test_suites.iter().enumerate() {
                                    if test.name == job.name {
                                        let suite = test_report.test_suites.remove(index);
                                        job.tests_report = Some(suite);
                                        break;
                                    }
                                }
                            }
                        }
                        response.insert_job(&card_type, job_type, &pipeline, job);
                    }
                }
            }
            Err(_) => println!("error job call on pipeline: {:?}", pipeline.id),
        };
    }
    Ok(response)
}
