use super::utils::extract_card_and_job_type;
use crate::models::api_struct::{Job, Pipeline};
use crate::models::enums::ProjectId;
use crate::models::response::ByCardsResponse;
use chrono::{Days, Utc};
use gitlab::api::projects::pipelines::{PipelineJobs, Pipelines};
use gitlab::api::{paged, AsyncQuery, Pagination};
use gitlab::AsyncGitlab;

// pub fn get_pipelines_jobs_routine(
//     project_id: ProjectId,
//     client: &Gitlab,
// ) -> Result<Vec<Vec<Job>>, Box<dyn std::error::Error>> {
//     let mut jobs: Vec<Vec<Job>> = vec![];
//     let pipelines = get_project_pipelines(&project_id, client)?;

//     for pipeline in pipelines {
//         match get_pipeline_jobs(&project_id, pipeline.id, client) {
//             Ok(job) => jobs.push(job),
//             Err(_) => (),
//         }
//     }
//     Ok(jobs)
// }

pub async fn get_project_pipelines(
    project_id: &ProjectId,
    client: &AsyncGitlab,
    since_day: u64,
    pipeline_name: String
) -> Result<Vec<Pipeline>, Box<dyn std::error::Error>> {
    let endpoint = Pipelines::builder()
        .project(project_id.to_string())
        .ref_(pipeline_name)
        .updated_after(Utc::now().checked_sub_days(Days::new(since_day)).unwrap())
        .build()?;
    let pipelines: Vec<Pipeline> = paged(endpoint, Pagination::All).query_async(client).await?;
    Ok(pipelines)
}

pub async fn get_pipeline_jobs(
    project_id: &ProjectId,
    pipelines_id: u64,
    client: &AsyncGitlab,
) -> Result<Vec<Job>, Box<dyn std::error::Error>> {
    let endpoint = PipelineJobs::builder()
        .project(project_id.to_string())
        .pipeline(pipelines_id)
        .build()?;
    let jobs: Vec<Job> = paged(endpoint, Pagination::All).query_async(client).await?;
    Ok(jobs)
}

pub async fn build_front_response(
    pipelines: Vec<Pipeline>,
    client: &AsyncGitlab,
) -> Result<ByCardsResponse, Box<dyn std::error::Error>> {
    let mut response = ByCardsResponse::default();

    for pipeline in pipelines {
        match get_pipeline_jobs(&ProjectId::Ci, pipeline.id, client).await {
            Ok(jobs) => {
                for job in jobs {
                    if let Some((card_type, job_type)) = extract_card_and_job_type(&job) {
                        response.insert_job(&card_type, job_type, &pipeline, job);
                    }
                }
            }
            Err(_) => (),
        };
    }
    Ok(response)
}
