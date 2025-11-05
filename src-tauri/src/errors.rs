use serde::{Deserialize, Serialize};
use thiserror::Error;

/// Custom error types for the ACC Setup Manager
#[derive(Error, Debug, Serialize, Deserialize)]
#[serde(tag = "type", content = "message")]
pub enum AccError {
    #[error("Setups folder not found at path: {path}. Please set a valid setups path.")]
    SetupsFolderNotFound { path: String },

    #[error("Invalid JSON in setup file: {file_path}. Error: {error}")]
    InvalidSetupJson { file_path: String, error: String },

    #[error("File system permission denied: {path}")]
    PermissionDenied { path: String },

    #[error("Car name mismatch: JSON contains '{json_car}' but file is in folder '{folder_car}'")]
    CarNameMismatch { json_car: String, folder_car: String },

    #[error("Missing required field in setup JSON: {field}")]
    MissingRequiredField { field: String },

    #[error("File not found: {path}")]
    FileNotFound { path: String },

    #[error("Directory creation failed: {path}. Error: {error}")]
    DirectoryCreationFailed { path: String, error: String },

    #[error("File write failed: {path}. Error: {error}")]
    FileWriteFailed { path: String, error: String },

    #[error("Invalid car ID: {car_id}")]
    InvalidCarId { car_id: String },

    #[error("Invalid track ID: {track_id}")]
    InvalidTrackId { track_id: String },

    #[error("Setup validation failed: {reason}")]
    SetupValidationFailed { reason: String },

    #[error("IO Error: {message}")]
    IoError { message: String },

    #[error("JSON serialization error: {message}")]
    SerializationError { message: String },
}

impl From<std::io::Error> for AccError {
    fn from(err: std::io::Error) -> Self {
        match err.kind() {
            std::io::ErrorKind::NotFound => AccError::IoError {
                message: format!("File or directory not found: {}", err),
            },
            std::io::ErrorKind::PermissionDenied => AccError::IoError {
                message: format!("Permission denied: {}", err),
            },
            _ => AccError::IoError {
                message: err.to_string(),
            },
        }
    }
}

impl From<serde_json::Error> for AccError {
    fn from(err: serde_json::Error) -> Self {
        AccError::SerializationError {
            message: err.to_string(),
        }
    }
}

pub type AccResult<T> = Result<T, AccError>;