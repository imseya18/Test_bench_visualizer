// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod models;
mod services;
use models::{enums::ProjectId, response::ByCardsResponse};
use services::gitlab_services::{get_project_pipelines, build_front_response_concurrency};

#[tauri::command(rename_all = "snake_case")]
async fn test_api_call_test(
    branch_name: String,
    since_days: u64,
) -> Result<ByCardsResponse, String> {
    let token: String = String::from("");

    let client = gitlab::GitlabBuilder::new("gitlab.com", token)
        .build_async()
        .await
        .map_err(|e| e.to_string())?;
    let pipelines = get_project_pipelines(&ProjectId::Ci, &client, since_days, branch_name)
        .await
        .map_err(|e| e.to_string())?;
    let result = build_front_response_concurrency(pipelines, &client).await;
    match result {
        Ok(result) => Ok(result),
        Err(e) => Err(e.to_string()),
    }
}
#[tokio::main]
async fn main() -> Result<(), String> {
    let api_result = test_api_call_test("config/projects-kirkstone".to_string() , 7).await?;
    println!("{:?}", api_result);
    Ok(())
}