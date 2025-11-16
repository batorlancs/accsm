pub mod commands;
pub mod data;
pub mod errors;
pub mod models;
pub mod state;
pub mod watcher;

use commands::*;
use log::{error, info};
use state::{create_state_manager, AppStateManager};
use std::sync::Arc;
use tauri::{Emitter, Manager};
use watcher::FileWatcher;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // Setup logging
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            info!("Starting ACC Setup Manager");

            // Create the state manager
            let state_manager = create_state_manager();
            app.manage(Arc::clone(&state_manager));

            // Initial folder structure scan
            let state_clone: Arc<AppStateManager> = Arc::clone(&state_manager);
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                match state_clone.refresh_folder_structure().await {
                    Ok(()) => {
                        info!("Initial folder structure scan completed");

                        // Emit initial setups-changed event
                        match state_clone.get_folder_structure().await {
                            Ok(structure) => {
                                if let Err(e) = app_handle.emit("setups-changed", &structure) {
                                    error!("Failed to emit initial setups-changed event: {}", e);
                                } else {
                                    info!("Emitted initial setups-changed event");
                                }
                            }
                            Err(e) => {
                                error!("Failed to get folder structure for initial event: {}", e);
                            }
                        }
                    }
                    Err(e) => {
                        error!("Initial folder structure scan failed: {}", e);
                        // This is not a critical error - the user can set the path later
                    }
                }
            });

            // Setup file watcher
            let state_clone: Arc<AppStateManager> = Arc::clone(&state_manager);
            let app_handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                let setups_path = state_clone.get_setups_path().await;
                match FileWatcher::new(&setups_path, state_clone, app_handle) {
                    Ok(_watcher) => {
                        info!("File watcher started successfully");
                        // Keep the watcher alive by not dropping it
                        // In a real application, you might want to store this in the app state
                        tokio::signal::ctrl_c().await.ok();
                    }
                    Err(e) => {
                        error!("Failed to start file watcher: {}", e);
                    }
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_folder_structure,
            get_setup,
            save_setup,
            edit_setup,
            delete_setup,
            set_setups_path,
            get_setups_path,
            get_cars,
            get_tracks,
            refresh_folder_structure,
            setup_exists,
            validate_setup,
            import_json_files,
            validate_json_files,
            import_validated_setups
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
