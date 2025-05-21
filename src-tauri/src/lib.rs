use std::sync::RwLock;
use tauri::path::BaseDirectory;
use tauri::Manager;
use tauri_plugin_store::StoreExt;
mod models;
mod services;
use models::{enums::ProjectId, response::ByCardsResponse};
use services::gitlab_services::{build_front_response, get_project_pipelines};

#[derive(Default)]
struct AppState {
    gitlab_token: String,
}

#[tauri::command(rename_all = "snake_case")]
fn set_api_key(
    token: &str,
    state: tauri::State<'_, RwLock<AppState>>,
    app: tauri::AppHandle,
) -> Result<(), String> {
    let mut state_guard = state.write().map_err(|e| e.to_string())?;
    state_guard.gitlab_token = token.to_string();
    let resource_path = app
        .path()
        .resolve("json/store.json", BaseDirectory::Resource)
        .map_err(|e| e.to_string())?;
    let store = app.store(resource_path).map_err(|e| e.to_string())?;
    store.set("GITLAB_TOKEN", token);
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn get_api_key(state: tauri::State<'_, RwLock<AppState>>) -> Result<String, String> {
    let token_guard = state.read().unwrap();
    let gitlab_token = token_guard.gitlab_token.clone();
    dbg!(&gitlab_token);
    Ok(gitlab_token)
}

#[tauri::command(rename_all = "snake_case")]
async fn test_api_call(
    state: tauri::State<'_, RwLock<AppState>>,
) -> Result<ByCardsResponse, String> {
    /* I use a closur to drop the RwLock before the .await cause Rwlock isn't send*/
    let token: String = {
        let token_guard = state.read().unwrap();
        token_guard.gitlab_token.clone()
    };

    let client = gitlab::GitlabBuilder::new("gitlab.com", token)
        .build_async()
        .await
        .map_err(|e| e.to_string())?;
    //todo Add Number of days variable calls and pipeline name. Actually hard coded
    let pipelines = get_project_pipelines(&ProjectId::Ci, &client, 7, "".to_string())
        .await
        .map_err(|e| e.to_string())?;
    let result = build_front_response(pipelines, &client).await;
    match result {
        Ok(result) => Ok(result),
        Err(e) => Err(e.to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_persisted_scope::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            set_api_key,
            get_api_key,
            test_api_call
        ])
        .setup(|app| {
            let resource_path = app
                .path()
                .resolve("json/store.json", BaseDirectory::Resource)?;
            let store = app.store(resource_path).map_err(|e| e.to_string())?;
            app.manage(RwLock::new(AppState::default()));
            if let Some(token) = store.get("GITLAB_TOKEN") {
                let state = app.state::<RwLock<AppState>>();
                let mut state: std::sync::RwLockWriteGuard<'_, AppState> = state.write().unwrap();
                state.gitlab_token = token.as_str().ok_or("not a valide token")?.to_string();
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
