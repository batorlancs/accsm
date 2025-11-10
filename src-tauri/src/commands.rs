use crate::data;
use crate::errors::AccError;
use crate::models::{Car, FolderStructure, SetupFile, Track};
use crate::state::AppStateManager;
use log::{error, info};
use serde_json::Value as JsonValue;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;
use tauri::State;

/// Get the complete folder structure
#[tauri::command]
pub async fn get_folder_structure(
    state: State<'_, Arc<AppStateManager>>,
) -> Result<FolderStructure, AccError> {
    info!("Getting folder structure");
    match state.get_folder_structure().await {
        Ok(structure) => {
            info!(
                "Retrieved folder structure with {} cars",
                structure.cars.len()
            );
            Ok(structure)
        }
        Err(e) => {
            error!("Failed to get folder structure: {}", e);
            Err(e)
        }
    }
}

/// Get a specific setup file
#[tauri::command]
pub async fn get_setup(
    car: String,
    track: String,
    filename: String,
    state: State<'_, Arc<AppStateManager>>,
) -> Result<SetupFile, AccError> {
    info!("Getting setup: {}/{}/{}", car, track, filename);
    match state.read_setup(&car, &track, &filename).await {
        Ok(setup) => {
            info!(
                "Successfully retrieved setup: {}/{}/{}",
                car, track, filename
            );
            Ok(setup)
        }
        Err(e) => {
            error!("Failed to get setup {}/{}/{}: {}", car, track, filename, e);
            Err(e)
        }
    }
}

/// Save a new setup file
#[tauri::command]
pub async fn save_setup(
    car: String,
    track: String,
    filename: String,
    content: JsonValue,
    state: State<'_, Arc<AppStateManager>>,
) -> Result<(), AccError> {
    info!("Saving setup: {}/{}/{}", car, track, filename);
    match state.save_setup(&car, &track, &filename, content).await {
        Ok(()) => {
            info!("Successfully saved setup: {}/{}/{}", car, track, filename);
            Ok(())
        }
        Err(e) => {
            error!("Failed to save setup {}/{}/{}: {}", car, track, filename, e);
            Err(e)
        }
    }
}

/// Edit an existing setup file
#[tauri::command]
pub async fn edit_setup(
    car: String,
    track: String,
    filename: String,
    content: JsonValue,
    state: State<'_, Arc<AppStateManager>>,
) -> Result<(), AccError> {
    info!("Editing setup: {}/{}/{}", car, track, filename);

    // For editing, we use the same save_setup function as it handles metadata updates
    match state.save_setup(&car, &track, &filename, content).await {
        Ok(()) => {
            info!("Successfully edited setup: {}/{}/{}", car, track, filename);
            Ok(())
        }
        Err(e) => {
            error!("Failed to edit setup {}/{}/{}: {}", car, track, filename, e);
            Err(e)
        }
    }
}

/// Delete a setup file
#[tauri::command]
pub async fn delete_setup(
    car: String,
    track: String,
    filename: String,
    state: State<'_, Arc<AppStateManager>>,
) -> Result<(), AccError> {
    info!("Deleting setup: {}/{}/{}", car, track, filename);
    match state.delete_setup(&car, &track, &filename).await {
        Ok(()) => {
            info!("Successfully deleted setup: {}/{}/{}", car, track, filename);
            Ok(())
        }
        Err(e) => {
            error!(
                "Failed to delete setup {}/{}/{}: {}",
                car, track, filename, e
            );
            Err(e)
        }
    }
}

/// Set the setups folder path
#[tauri::command]
pub async fn set_setups_path(
    path: String,
    state: State<'_, Arc<AppStateManager>>,
) -> Result<(), AccError> {
    info!("Setting setups path: {}", path);
    let path_buf = PathBuf::from(path);
    match state.set_setups_path(path_buf).await {
        Ok(()) => {
            info!("Successfully updated setups path");
            Ok(())
        }
        Err(e) => {
            error!("Failed to set setups path: {}", e);
            Err(e)
        }
    }
}

/// Get the current setups folder path
#[tauri::command]
pub async fn get_setups_path(state: State<'_, Arc<AppStateManager>>) -> Result<String, AccError> {
    let path = state.get_setups_path().await;
    let path_str = path.to_string_lossy().to_string();
    info!("Current setups path: {}", path_str);
    Ok(path_str)
}

/// Get the list of available cars
#[tauri::command]
pub async fn get_cars() -> Result<HashMap<String, Car>, AccError> {
    info!("Getting available cars");
    let cars = data::get_cars();
    info!("Retrieved {} cars", cars.len());
    Ok(cars)
}

/// Get the list of available tracks
#[tauri::command]
pub async fn get_tracks() -> Result<HashMap<String, Track>, AccError> {
    info!("Getting available tracks");
    let tracks = data::get_tracks();
    info!("Retrieved {} tracks", tracks.len());
    Ok(tracks)
}

/// Refresh the folder structure (force rescan)
#[tauri::command]
pub async fn refresh_folder_structure(
    state: State<'_, Arc<AppStateManager>>,
) -> Result<FolderStructure, AccError> {
    info!("Force refreshing folder structure");
    match state.refresh_folder_structure().await {
        Ok(()) => match state.get_folder_structure().await {
            Ok(structure) => {
                info!(
                    "Successfully refreshed folder structure with {} cars",
                    structure.cars.len()
                );
                Ok(structure)
            }
            Err(e) => {
                error!("Failed to get folder structure after refresh: {}", e);
                Err(e)
            }
        },
        Err(e) => {
            error!("Failed to refresh folder structure: {}", e);
            Err(e)
        }
    }
}

/// Check if a setup file exists
#[tauri::command]
pub async fn setup_exists(
    car: String,
    track: String,
    filename: String,
    state: State<'_, Arc<AppStateManager>>,
) -> Result<bool, AccError> {
    match state.read_setup(&car, &track, &filename).await {
        Ok(_) => Ok(true),
        Err(AccError::FileNotFound { .. }) => Ok(false),
        Err(e) => Err(e),
    }
}

/// Validate setup content without saving
#[tauri::command]
pub async fn validate_setup(car: String, content: JsonValue) -> Result<bool, AccError> {
    // Basic validation checks
    if !content.is_object() {
        return Err(AccError::SetupValidationFailed {
            reason: "Setup content must be a JSON object".to_string(),
        });
    }

    let obj = content.as_object().unwrap();

    // Check for required fields
    if !obj.contains_key("carName") {
        return Err(AccError::MissingRequiredField {
            field: "carName".to_string(),
        });
    }

    if !obj.contains_key("basicSetup") {
        return Err(AccError::MissingRequiredField {
            field: "basicSetup".to_string(),
        });
    }

    if !obj.contains_key("advancedSetup") {
        return Err(AccError::MissingRequiredField {
            field: "advancedSetup".to_string(),
        });
    }

    // Validate car name if provided
    let cars = data::get_cars();
    if let Some(car_data) = cars.get(&car) {
        if let Some(car_name) = obj.get("carName").and_then(|v| v.as_str()) {
            if car_name != car_data.id {
                return Err(AccError::CarNameMismatch {
                    json_car: car_name.to_string(),
                    folder_car: car_data.id.clone(),
                });
            }
        }
    }

    Ok(true)
}

/// Import JSON files from dropped paths
#[tauri::command]
pub async fn import_json_files(
    paths: Vec<String>,
    state: State<'_, Arc<AppStateManager>>,
) -> Result<Vec<ImportResult>, AccError> {
    info!("Importing JSON files from {} paths", paths.len());
    let mut results = Vec::new();

    for path_str in paths {
        let path = PathBuf::from(&path_str);

        if path.is_file() {
            // Handle single file
            if let Some(extension) = path.extension() {
                if extension.to_str() == Some("json") {
                    results.push(process_json_file(&path, &state).await);
                } else {
                    results.push(ImportResult {
                        path: path_str,
                        success: false,
                        error: Some("File is not a JSON file".to_string()),
                        car: None,
                        track: None,
                        filename: None,
                    });
                }
            }
        } else if path.is_dir() {
            // Scan directory for JSON files
            match scan_directory_for_json(&path, &state).await {
                Ok(mut dir_results) => results.append(&mut dir_results),
                Err(e) => results.push(ImportResult {
                    path: path_str,
                    success: false,
                    error: Some(format!("Failed to scan directory: {}", e)),
                    car: None,
                    track: None,
                    filename: None,
                }),
            }
        } else {
            results.push(ImportResult {
                path: path_str,
                success: false,
                error: Some("Path is neither a file nor a directory".to_string()),
                car: None,
                track: None,
                filename: None,
            });
        }
    }

    info!("Import completed with {} results", results.len());
    Ok(results)
}

#[derive(serde::Serialize)]
pub struct ImportResult {
    pub path: String,
    pub success: bool,
    pub error: Option<String>,
    pub car: Option<String>,
    pub track: Option<String>,
    pub filename: Option<String>,
}

async fn process_json_file(
    path: &PathBuf,
    state: &State<'_, Arc<AppStateManager>>,
) -> ImportResult {
    let path_str = path.to_string_lossy().to_string();

    // Read and parse JSON file
    let content = match std::fs::read_to_string(path) {
        Ok(content) => content,
        Err(e) => {
            return ImportResult {
                path: path_str,
                success: false,
                error: Some(format!("Failed to read file: {}", e)),
                car: None,
                track: None,
                filename: None,
            }
        }
    };

    let json_content: JsonValue = match serde_json::from_str(&content) {
        Ok(json) => json,
        Err(e) => {
            return ImportResult {
                path: path_str,
                success: false,
                error: Some(format!("Invalid JSON format: {}", e)),
                car: None,
                track: None,
                filename: None,
            }
        }
    };

    // Extract car name from JSON
    let car_name = match json_content.get("carName").and_then(|v| v.as_str()) {
        Some(name) => name.to_string(),
        None => {
            return ImportResult {
                path: path_str,
                success: false,
                error: Some("JSON file missing 'carName' field".to_string()),
                car: None,
                track: None,
                filename: None,
            }
        }
    };

    // Try to match with available cars
    let cars = data::get_cars();
    let car_key = match cars.iter().find(|(_, car)| car.id == car_name) {
        Some((key, _)) => key.clone(),
        None => {
            return ImportResult {
                path: path_str,
                success: false,
                error: Some(format!("Unknown car: {}", car_name)),
                car: None,
                track: None,
                filename: None,
            }
        }
    };

    // Use the original filename or generate one
    let filename = path
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("imported_setup")
        .to_string()
        + ".json";

    // For now, use a default track (users can move it later)
    let default_track = "default";

    // Validate the setup content
    match validate_setup(car_key.clone(), json_content.clone()).await {
        Ok(_) => {}
        Err(e) => {
            return ImportResult {
                path: path_str,
                success: false,
                error: Some(format!("Setup validation failed: {}", e)),
                car: None,
                track: None,
                filename: None,
            }
        }
    }

    // Save the setup
    match state
        .save_setup(&car_key, default_track, &filename, json_content)
        .await
    {
        Ok(_) => ImportResult {
            path: path_str,
            success: true,
            error: None,
            car: Some(car_key),
            track: Some(default_track.to_string()),
            filename: Some(filename),
        },
        Err(e) => ImportResult {
            path: path_str,
            success: false,
            error: Some(format!("Failed to save setup: {}", e)),
            car: None,
            track: None,
            filename: None,
        },
    }
}

async fn scan_directory_for_json(
    dir_path: &PathBuf,
    state: &State<'_, Arc<AppStateManager>>,
) -> Result<Vec<ImportResult>, AccError> {
    // Scan the directory only one level deep for JSON files
    let mut results = Vec::new();
    let entries = std::fs::read_dir(dir_path).map_err(|e| AccError::IoError {
        message: format!("Failed to read directory {}: {}", dir_path.display(), e),
    })?;

    for entry in entries {
        let entry = entry.map_err(|e| AccError::IoError {
            message: format!(
                "Failed to read directory entry in {}: {}",
                dir_path.display(),
                e
            ),
        })?;

        let path = entry.path();
        if path.is_file() {
            if let Some(extension) = path.extension() {
                if extension.to_str() == Some("json") {
                    results.push(process_json_file(&path, state).await);
                }
            }
        }
    }

    Ok(results)
}
