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
            info!("Retrieved folder structure with {} cars", structure.cars.len());
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
            info!("Successfully retrieved setup: {}/{}/{}", car, track, filename);
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
            error!("Failed to delete setup {}/{}/{}: {}", car, track, filename, e);
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
pub async fn get_setups_path(
    state: State<'_, Arc<AppStateManager>>,
) -> Result<String, AccError> {
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
        Ok(()) => {
            match state.get_folder_structure().await {
                Ok(structure) => {
                    info!("Successfully refreshed folder structure with {} cars", structure.cars.len());
                    Ok(structure)
                }
                Err(e) => {
                    error!("Failed to get folder structure after refresh: {}", e);
                    Err(e)
                }
            }
        }
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
pub async fn validate_setup(
    car: String,
    content: JsonValue,
) -> Result<bool, AccError> {
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