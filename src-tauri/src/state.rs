use crate::data::{find_car_by_folder, find_track_by_folder};
use crate::errors::{AccError, AccResult};
use crate::models::{CarFolder, FolderStructure, SetupFile, SetupInfo, TrackFolder};
use chrono::Utc;
use log::{debug, info, warn};
use std::fs;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use tokio::sync::RwLock;

/// Application state manager that handles setup files and caching
pub struct AppStateManager {
    setups_path: RwLock<PathBuf>,
    folder_structure: RwLock<Option<FolderStructure>>,
}

impl AppStateManager {
    /// Create a new state manager with the given setups path
    pub fn new(setups_path: PathBuf) -> Self {
        Self {
            setups_path: RwLock::new(setups_path),
            folder_structure: RwLock::new(None),
        }
    }

    /// Get the current setups path
    pub async fn get_setups_path(&self) -> PathBuf {
        self.setups_path.read().await.clone()
    }

    /// Set a new setups path and refresh the structure
    pub async fn set_setups_path(&self, new_path: PathBuf) -> AccResult<()> {
        if !new_path.exists() {
            return Err(AccError::SetupsFolderNotFound {
                path: new_path.to_string_lossy().to_string(),
            });
        }

        *self.setups_path.write().await = new_path;
        self.refresh_folder_structure().await?;
        info!("Updated setups path and refreshed structure");
        Ok(())
    }

    /// Get the cached folder structure, scanning if necessary
    pub async fn get_folder_structure(&self) -> AccResult<FolderStructure> {
        let structure = self.folder_structure.read().await;

        if let Some(ref cached) = *structure {
            Ok(cached.clone())
        } else {
            drop(structure); // Release the read lock
            self.refresh_folder_structure().await?;
            let structure = self.folder_structure.read().await;
            Ok(structure.as_ref().unwrap().clone())
        }
    }

    /// Force refresh the folder structure from disk
    pub async fn refresh_folder_structure(&self) -> AccResult<()> {
        let setups_path = self.get_setups_path().await;

        if !setups_path.exists() {
            warn!("Setups path does not exist: {:?}", setups_path);
            return Err(AccError::SetupsFolderNotFound {
                path: setups_path.to_string_lossy().to_string(),
            });
        }

        let structure = self.scan_folder_structure(&setups_path).await?;
        *self.folder_structure.write().await = Some(structure);
        info!("Refreshed folder structure from disk");
        Ok(())
    }

    /// Scan the setups directory and build the folder structure
    async fn scan_folder_structure(&self, setups_path: &Path) -> AccResult<FolderStructure> {
        let mut cars = Vec::new();
        let mut total_setups = 0;

        // Read car directories
        let entries = fs::read_dir(setups_path).map_err(|e| AccError::IoError {
            message: format!("Failed to read setups directory: {}", e),
        })?;

        for entry in entries {
            let entry = entry.map_err(|e| AccError::IoError {
                message: format!("Failed to read directory entry: {}", e),
            })?;

            let path = entry.path();
            if !path.is_dir() {
                continue;
            }

            let folder_name = path
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or("")
                .to_string();

            // Skip hidden directories
            if folder_name.starts_with('.') {
                continue;
            }

            if let Some(car) = find_car_by_folder(&folder_name) {
                match self.scan_car_folder(&path, &car.id).await {
                    Ok(car_folder) => {
                        total_setups += car_folder
                            .tracks
                            .iter()
                            .map(|t| t.setups.len())
                            .sum::<usize>();
                        cars.push(car_folder);
                    }
                    Err(e) => {
                        warn!("Error scanning car folder {}: {}", folder_name, e);
                    }
                }
            } else {
                debug!("Unknown car folder: {}", folder_name);
            }
        }

        // Sort cars by name
        cars.sort_by(|a, b| a.car_name.cmp(&b.car_name));

        Ok(FolderStructure {
            cars,
            total_setups,
            last_scan: Utc::now(),
        })
    }

    /// Scan a car folder for track directories
    async fn scan_car_folder(&self, car_path: &Path, car_id: &str) -> AccResult<CarFolder> {
        let cars_data = crate::data::get_cars();
        let car = cars_data
            .get(car_id)
            .cloned()
            .ok_or_else(|| AccError::InvalidCarId {
                car_id: car_id.to_string(),
            })?;

        let mut tracks = Vec::new();

        let entries = fs::read_dir(car_path).map_err(|e| AccError::IoError {
            message: format!("Failed to read car directory: {}", e),
        })?;

        for entry in entries {
            let entry = entry.map_err(|e| AccError::IoError {
                message: format!("Failed to read track directory entry: {}", e),
            })?;

            let path = entry.path();
            if !path.is_dir() {
                continue;
            }

            let folder_name = path
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or("")
                .to_string();

            // Skip hidden directories
            if folder_name.starts_with('.') {
                continue;
            }

            if let Some(track) = find_track_by_folder(&folder_name) {
                match self.scan_track_folder(&path, &track.id).await {
                    Ok(track_folder) => {
                        if !track_folder.setups.is_empty() {
                            tracks.push(track_folder);
                        }
                    }
                    Err(e) => {
                        warn!("Error scanning track folder {}: {}", folder_name, e);
                    }
                }
            } else {
                debug!(
                    "Unknown track folder in {}: {}",
                    car.pretty_name, folder_name
                );
            }
        }

        // Sort tracks by name
        tracks.sort_by(|a, b| a.track_name.cmp(&b.track_name));

        Ok(CarFolder {
            car_id: car.id.clone(),
            car_name: car.pretty_name.clone(),
            brand_name: Some(car.brand_name.clone()),
            tracks,
        })
    }

    /// Scan a track folder for setup files
    async fn scan_track_folder(&self, track_path: &Path, track_id: &str) -> AccResult<TrackFolder> {
        let tracks_data = crate::data::get_tracks();
        let track = tracks_data
            .get(track_id)
            .cloned()
            .ok_or_else(|| AccError::InvalidTrackId {
                track_id: track_id.to_string(),
            })?;

        let mut setups = Vec::new();

        let entries = fs::read_dir(track_path).map_err(|e| AccError::IoError {
            message: format!("Failed to read track directory: {}", e),
        })?;

        for entry in entries {
            let entry = entry.map_err(|e| AccError::IoError {
                message: format!("Failed to read setup file entry: {}", e),
            })?;

            let path = entry.path();
            if !path.is_file() || path.extension().map_or(true, |ext| ext != "json") {
                continue;
            }

            let filename = path
                .file_name()
                .and_then(|name| name.to_str())
                .unwrap_or("")
                .to_string();

            // Skip hidden files
            if filename.starts_with('.') {
                continue;
            }

            match self.get_setup_info(&path, &filename).await {
                Ok(setup_info) => setups.push(setup_info),
                Err(e) => {
                    warn!("Error reading setup file {}: {}", filename, e);
                }
            }
        }

        // Sort setups by name
        setups.sort_by(|a, b| a.display_name.cmp(&b.display_name));

        Ok(TrackFolder {
            track_id: track.id.clone(),
            track_name: track.pretty_name.clone(),
            country: Some(track.country.clone()),
            setups,
        })
    }

    /// Get setup info from a setup file
    async fn get_setup_info(&self, file_path: &Path, filename: &str) -> AccResult<SetupInfo> {
        let content = fs::read_to_string(file_path).map_err(|e| AccError::IoError {
            message: format!("Failed to read setup file: {}", e),
        })?;

        // Parse as raw JSON to validate structure
        let _json_content: serde_json::Value = 
            serde_json::from_str(&content).map_err(|e| AccError::InvalidSetupJson {
                file_path: file_path.to_string_lossy().to_string(),
                error: e.to_string(),
            })?;

        // Get file metadata for last modified
        let metadata = fs::metadata(file_path).map_err(|e| AccError::IoError {
            message: format!("Failed to read file metadata: {}", e),
        })?;

        let last_modified = metadata
            .modified()
            .map_err(|e| AccError::IoError {
                message: format!("Failed to get file modification time: {}", e),
            })?
            .into();

        let display_name = filename
            .strip_suffix(".json")
            .unwrap_or(filename)
            .replace('_', " ");

        Ok(SetupInfo {
            filename: filename.to_string(),
            display_name,
            last_modified,
        })
    }

    /// Read a complete setup file
    pub async fn read_setup(&self, car: &str, track: &str, filename: &str) -> AccResult<SetupFile> {
        let setups_path = self.get_setups_path().await;
        let cars_data = crate::data::get_cars();
        let tracks_data = crate::data::get_tracks();

        let car_data = cars_data.get(car).ok_or_else(|| AccError::InvalidCarId {
            car_id: car.to_string(),
        })?;
        let track_data = tracks_data
            .get(track)
            .ok_or_else(|| AccError::InvalidTrackId {
                track_id: track.to_string(),
            })?;

        let file_path = setups_path
            .join(&car_data.id)
            .join(&track_data.id)
            .join(filename);

        if !file_path.exists() {
            return Err(AccError::FileNotFound {
                path: file_path.to_string_lossy().to_string(),
            });
        }

        let content = fs::read_to_string(&file_path).map_err(|e| AccError::IoError {
            message: format!("Failed to read setup file: {}", e),
        })?;

        // Parse as SetupFile
        let setup: SetupFile = serde_json::from_str(&content).map_err(|e| AccError::InvalidSetupJson {
            file_path: file_path.to_string_lossy().to_string(),
            error: e.to_string(),
        })?;

        // Validate car name matches
        if setup.car_name != car_data.id {
            return Err(AccError::CarNameMismatch {
                json_car: setup.car_name,
                folder_car: car_data.id.clone(),
            });
        }

        Ok(setup)
    }

    /// Save a setup file
    pub async fn save_setup(
        &self,
        car: &str,
        track: &str,
        filename: &str,
        mut content: serde_json::Value,
    ) -> AccResult<()> {
        let setups_path = self.get_setups_path().await;
        let cars_data = crate::data::get_cars();
        let tracks_data = crate::data::get_tracks();

        let car_data = cars_data.get(car).ok_or_else(|| AccError::InvalidCarId {
            car_id: car.to_string(),
        })?;
        let track_data = tracks_data
            .get(track)
            .ok_or_else(|| AccError::InvalidTrackId {
                track_id: track.to_string(),
            })?;

        // Ensure the content has the required structure
        if !content.is_object() {
            return Err(AccError::SetupValidationFailed {
                reason: "Setup content must be a JSON object".to_string(),
            });
        }

        let obj = content.as_object_mut().unwrap();

        // Ensure carName field matches the car folder
        obj.insert(
            "carName".to_string(),
            serde_json::Value::String(car_data.id.clone()),
        );

        // Ensure the directory structure exists
        let dir_path = setups_path.join(&car_data.id).join(&track_data.id);

        if !dir_path.exists() {
            fs::create_dir_all(&dir_path).map_err(|e| AccError::DirectoryCreationFailed {
                path: dir_path.to_string_lossy().to_string(),
                error: e.to_string(),
            })?;
        }

        // Write the file
        let file_path = dir_path.join(filename);
        let json_string = serde_json::to_string_pretty(&content)?;

        fs::write(&file_path, json_string).map_err(|e| AccError::FileWriteFailed {
            path: file_path.to_string_lossy().to_string(),
            error: e.to_string(),
        })?;

        info!("Saved setup: {}/{}/{}", car, track, filename);
        Ok(())
    }

    /// Delete a setup file
    pub async fn delete_setup(&self, car: &str, track: &str, filename: &str) -> AccResult<()> {
        let setups_path = self.get_setups_path().await;
        let cars_data = crate::data::get_cars();
        let tracks_data = crate::data::get_tracks();

        let car_data = cars_data.get(car).ok_or_else(|| AccError::InvalidCarId {
            car_id: car.to_string(),
        })?;
        let track_data = tracks_data
            .get(track)
            .ok_or_else(|| AccError::InvalidTrackId {
                track_id: track.to_string(),
            })?;

        let file_path = setups_path
            .join(&car_data.id)
            .join(&track_data.id)
            .join(filename);

        if !file_path.exists() {
            return Err(AccError::FileNotFound {
                path: file_path.to_string_lossy().to_string(),
            });
        }

        fs::remove_file(&file_path).map_err(|e| AccError::IoError {
            message: format!("Failed to delete setup file: {}", e),
        })?;

        info!("Deleted setup: {}/{}/{}", car, track, filename);
        Ok(())
    }
}

/// Create the global state manager instance
pub fn create_state_manager() -> Arc<AppStateManager> {
    let default_path = get_default_setups_path();
    Arc::new(AppStateManager::new(default_path))
}

/// Get the default setups path based on the platform
fn get_default_setups_path() -> PathBuf {
    if cfg!(target_os = "windows") {
        // Windows: %USERPROFILE%\Documents\Assetto Corsa Competizione\Setups
        dirs::document_dir()
            .map(|dir| dir.join("Assetto Corsa Competizione").join("Setups"))
            .unwrap_or_else(|| {
                PathBuf::from("C:\\Users\\Public\\Documents\\Assetto Corsa Competizione\\Setups")
            })
    } else {
        // macOS/Linux: ~/acc_setups_test for development
        dirs::home_dir()
            .map(|dir| dir.join("acc_setups_test"))
            .unwrap_or_else(|| PathBuf::from("./acc_setups_test"))
    }
}
