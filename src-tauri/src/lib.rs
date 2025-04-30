// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_store::StoreExt;
#[tauri::command(rename_all = "snake_case")]
fn set_api_key(token: &str, app: tauri::AppHandle) -> Result<(), String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;
    store.set("GITLAB_TOKEN", token);
    println!("{:?}", token);
    Ok(())
}

#[tauri::command(rename_all = "snake_case")]
fn get_api_key(app: tauri::AppHandle) -> Result<String, String> {
    let store = app.store("store.json").map_err(|e| e.to_string())?;
    let token = store.get("GITLAB_TOKEN");
    match token {
        Some(token) => Ok(token.to_string()),
        None => Err(String::from("Error GITLAB_TOKEN: not found")),
    }
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![set_api_key, get_api_key])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
