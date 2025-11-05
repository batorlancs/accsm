use crate::errors::{AccError, AccResult};
use crate::state::AppStateManager;
use log::{error, info, warn};
use notify::{Config, Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::Path;
use std::sync::Arc;
use tauri::{AppHandle, Emitter};
use tokio::sync::mpsc;

/// File system watcher for monitoring setups folder changes
pub struct FileWatcher {
    _watcher: RecommendedWatcher,
}

impl FileWatcher {
    /// Create and start a new file watcher
    pub fn new(
        setups_path: &Path,
        state_manager: Arc<AppStateManager>,
        app_handle: AppHandle,
    ) -> AccResult<Self> {
        let (tx, mut rx) = mpsc::unbounded_channel();
        let setups_path = setups_path.to_path_buf();

        // Create the watcher
        let mut watcher = RecommendedWatcher::new(
            move |res: Result<Event, notify::Error>| {
                if let Err(e) = tx.send(res) {
                    error!("Failed to send file watcher event: {}", e);
                }
            },
            Config::default(),
        )
        .map_err(|e| AccError::IoError {
            message: format!("Failed to create file watcher: {}", e),
        })?;

        // Start watching the setups directory
        if setups_path.exists() {
            watcher
                .watch(&setups_path, RecursiveMode::Recursive)
                .map_err(|e| AccError::IoError {
                    message: format!("Failed to start watching directory: {}", e),
                })?;
            info!("Started watching setups directory: {:?}", setups_path);
        } else {
            warn!("Setups directory does not exist: {:?}", setups_path);
        }

        // Spawn the event handler task
        let state_manager_clone = Arc::clone(&state_manager);
        tokio::spawn(async move {
            while let Some(result) = rx.recv().await {
                match result {
                    Ok(event) => {
                        if let Err(e) = Self::handle_file_event(
                            event,
                            &state_manager_clone,
                            &app_handle,
                            &setups_path,
                        )
                        .await
                        {
                            error!("Error handling file event: {}", e);
                        }
                    }
                    Err(e) => {
                        error!("File watcher error: {}", e);
                    }
                }
            }
        });

        Ok(Self { _watcher: watcher })
    }

    /// Handle individual file system events
    async fn handle_file_event(
        event: Event,
        state_manager: &AppStateManager,
        app_handle: &AppHandle,
        setups_path: &Path,
    ) -> AccResult<()> {
        // Only handle events that affect the folder structure
        match &event.kind {
            EventKind::Create(_) | EventKind::Remove(_) | EventKind::Modify(_) => {
                // Check if the event affects .json files or directories
                let should_update = event.paths.iter().any(|path| {
                    // Check if it's a .json file or a directory change within setups_path
                    if let Ok(relative_path) = path.strip_prefix(setups_path) {
                        // Update if it's a JSON file, or if it's a directory change
                        path.extension().map_or(false, |ext| ext == "json")
                            || path.is_dir()
                            || relative_path.components().count() <= 3 // Only car/track/setup levels
                    } else {
                        false
                    }
                });

                if should_update {
                    info!("File system change detected, updating structure");
                    
                    // Update the cached folder structure
                    if let Err(e) = state_manager.refresh_folder_structure().await {
                        error!("Failed to refresh folder structure: {}", e);
                        return Ok(());
                    }

                    // Get the updated structure and emit event
                    match state_manager.get_folder_structure().await {
                        Ok(structure) => {
                            if let Err(e) = app_handle.emit("setups-changed", &structure) {
                                error!("Failed to emit setups-changed event: {}", e);
                            } else {
                                info!("Emitted setups-changed event with {} cars", structure.cars.len());
                            }
                        }
                        Err(e) => {
                            error!("Failed to get folder structure for event emission: {}", e);
                        }
                    }
                }
            }
            _ => {
                // Ignore other event types (access, metadata changes, etc.)
            }
        }

        Ok(())
    }

    /// Update the watched directory (call this when setups path changes)
    pub fn update_watch_path(&mut self, _new_path: &Path) -> AccResult<()> {
        // The watcher is recreated when the path changes in the state manager
        // This method is kept for future extensibility
        Ok(())
    }
}