
use crate::models::enums::ProjectId;
use crate::models::api_struct::{Pipeline, Job};
use crate::models::response::ByCardsResponse;
use super::utils::extract_card_and_job_type;
use gitlab::Gitlab;
use gitlab::api::Query;
use gitlab::api::projects::pipelines::{PipelineJobs, Pipelines};


pub fn get_pipelines_jobs_routine(
    project_id: ProjectId,
    client: &Gitlab
) -> Result<Vec<Vec<Job>>, Box<dyn std::error::Error>> {
    let mut jobs: Vec<Vec<Job>> = vec![];
    let pipelines = get_project_pipelines(&project_id, client)?;

    for pipeline in pipelines {
        match get_pipeline_jobs(&project_id, pipeline.id, client) {
            Ok(job) => jobs.push(job),
            Err(_) => (),
        }
    }
    Ok(jobs)
}

pub fn get_project_pipelines(
    project_id: &ProjectId,
    client: &Gitlab
) -> Result<Vec<Pipeline>, Box<dyn std::error::Error>> {
    
    let endpoint = Pipelines::builder()
        .project(project_id.to_string())
        .build()?;
    let pipelines: Vec<Pipeline> = endpoint.query(client).unwrap();

    Ok(pipelines)
}

pub fn get_pipeline_jobs(
    project_id: &ProjectId,
    pipelines_id: u64,
    client: &Gitlab
) -> Result<Vec<Job>, Box<dyn std::error::Error>> {
    
    let endpoint = PipelineJobs::builder()
        .project(project_id.to_string())
        .pipeline(pipelines_id)
        .build()?;
    let jobs: Vec<Job> = endpoint.query(client).unwrap();
    Ok(jobs)
}

pub fn build_front_response(pipelines: Vec<Pipeline>, client: &Gitlab) -> ByCardsResponse {

    let mut response = ByCardsResponse::default();

    for pipeline in pipelines {
        match get_pipeline_jobs(&ProjectId::Ci, pipeline.id, client) {
            Ok(jobs) => {
                for job in jobs {
                    if let Some((card_type, job_type)) = extract_card_and_job_type(&job){
                        response.insert_job(&card_type, job_type, &pipeline, job);
                    }
                }
            },
            Err(_) => (),
        };

    }
    response
}