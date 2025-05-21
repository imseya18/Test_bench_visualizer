use crate::models::enums::JobType;

pub fn extract_card_and_job_type(job_name: &String) -> Option<(String, JobType)> {
    let name_split: Vec<&str> = job_name.split(":").collect();
    let card_type = name_split.get(1)?;
    let job_type_str = name_split.first()?;
    let job_type = job_type_str.parse().unwrap();
    Some((card_type.to_string(), job_type))
}
