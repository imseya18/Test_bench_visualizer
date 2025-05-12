use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, Clone, TS)]
#[ts(export)]
pub struct Pipeline {
    pub id: u64,
    pub status: String,
    pub project_id: u64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize, Serialize, Clone, TS)]
#[ts(export)]
pub struct Job {
    id: u64,
    pub name: String,
    tag_list: Vec<String>,
    stage: String,
    status: String,
}
