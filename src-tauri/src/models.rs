use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Car metadata structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Car {
    pub id: String,
    pub pretty_name: String,
}

/// Track metadata structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Track {
    pub id: String,
    pub pretty_name: String,
}

/// Custom metadata added to setup files
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AccsmData {
    pub last_modified: DateTime<Utc>,
    pub tags: Vec<String>,
    pub setup_type: String,
}

impl Default for AccsmData {
    fn default() -> Self {
        Self {
            last_modified: Utc::now(),
            tags: Vec::new(),
            setup_type: "race".to_string(),
        }
    }
}

/// Complete setup file structure
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SetupFile {
    pub car_name: String,
    pub basic_setup: serde_json::Value,
    pub advanced_setup: serde_json::Value,
    pub track_bop_type: Option<i32>,
    #[serde(rename = "ACCSMData")]
    pub accsm_data: AccsmData,
    #[serde(flatten)]
    pub other_fields: HashMap<String, serde_json::Value>,
}

/// Represents a setup in the folder structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SetupInfo {
    pub filename: String,
    pub display_name: String,
    pub last_modified: DateTime<Utc>,
    pub tags: Vec<String>,
    pub setup_type: String,
}

/// Represents a track folder with its setups
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TrackFolder {
    pub track_id: String,
    pub track_name: String,
    pub setups: Vec<SetupInfo>,
}

/// Represents a car folder with its tracks
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CarFolder {
    pub car_id: String,
    pub car_name: String,
    pub tracks: Vec<TrackFolder>,
}

/// Complete folder structure
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FolderStructure {
    pub cars: Vec<CarFolder>,
    pub total_setups: usize,
    pub last_scan: DateTime<Utc>,
}

/// Request/Response types for Tauri commands
#[derive(Debug, Serialize, Deserialize)]
pub struct GetSetupRequest {
    pub car: String,
    pub track: String,
    pub filename: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SaveSetupRequest {
    pub car: String,
    pub track: String,
    pub filename: String,
    pub content: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeleteSetupRequest {
    pub car: String,
    pub track: String,
    pub filename: String,
}
