use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Pipeline {
    pub id: u64,
    pub status: String,
    pub project_id: u64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Job {
    id: u64,
    pub name: String,
    tag_list: Vec<String>,
    stage: String,
    status: String,
}
