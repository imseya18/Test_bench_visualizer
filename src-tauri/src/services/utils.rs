use crate::models::enums::{JobType, get_job_type};
use crate::models::api_struct::Job;

pub fn extract_card_and_job_type(job: &Job) -> Option<(String, JobType)>  {
    let name_split: Vec<&str> = job.name.split(":").collect();
    let Some(card_type) = name_split.get(1) else {
        return None;
    };
    let Some(job_type_str) = name_split.get(0) else {
        return None;
    };
    let job_type = get_job_type(job_type_str);
    Some((card_type.to_string(), job_type))
}