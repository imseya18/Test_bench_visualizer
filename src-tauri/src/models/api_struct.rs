use serde::{Deserialize, Serialize};
use ts_rs::TS;

#[derive(Debug, Deserialize, Serialize, Clone, TS)]
#[ts(export)]
pub struct Pipeline {
    pub id: u64,
    pub status: String,
    //Using this cause we have to get the ref field from the API response but ref is a keyword
    #[serde(rename = "ref")]
    pub pipeline_ref: String,
    pub project_id: u64,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Deserialize, Serialize, Clone, TS)]
#[ts(export)]
pub struct Job {
    pub commit: Commit,
    id: u64,
    pub name: String,
    stage: String,
    status: String,
    tag_list: Vec<String>,
    pub tests_report: Option<TestSuite>,
}

#[derive(Debug, Deserialize, Serialize, Clone, TS)]
#[ts(export)]
pub struct Commit {
    pub title: String,
}

#[derive(Debug, Deserialize, Serialize, Clone, TS)]
#[ts(export)]
pub struct TestReport {
    pub total: Total,
    pub test_suites: Vec<TestSuite>,
}

#[derive(Debug, Deserialize, Serialize, Clone, TS)]
#[ts(export)]
pub struct Total {
    pub time: f64,
    pub count: u64,
    pub success: u64,
    pub failed: u64,
    pub skipped: u64,
    pub error: u64,
    pub suite_error: Option<String>,
}

#[derive(Debug, Deserialize, Serialize, Clone, TS)]
#[ts(export)]
pub struct TestSuite {
    pub name: String,
    pub total_time: f64,
    pub total_count: u64,
    pub success_count: u64,
    pub failed_count: u64,
    pub skipped_count: u64,
    pub error_count: u64,
    pub build_ids: Vec<u64>,
    pub suite_error: Option<String>,
}