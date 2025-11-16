// Backend data structure types that match the Rust models

export interface Car {
    id: string;
    pretty_name: string;
    brand_name: string;
    brand_country: string;
}

export interface Track {
    id: string;
    pretty_name: string;
    country: string;
}

export interface SetupFile {
    carName: string;
    basicSetup: any; // JSON value
    advancedSetup: any; // JSON value
    trackBopType?: number;
    [key: string]: any; // For other_fields
}

export interface SetupInfo {
    filename: string;
    display_name: string;
    last_modified: string; // ISO string
}

export interface TrackFolder {
    track_id: string;
    track_name: string;
    setups: SetupInfo[];
}

export interface CarFolder {
    car_id: string;
    car_name: string;
    tracks: TrackFolder[];
}

export interface FolderStructure {
    cars: CarFolder[];
    total_setups: number;
    last_scan: string; // ISO string
}

// Tauri command parameter types
export interface GetSetupParams {
    car: string;
    track: string;
    filename: string;
    [key: string]: unknown;
}

export interface SaveSetupParams {
    car: string;
    track: string;
    filename: string;
    content: any;
    [key: string]: unknown;
}

export interface DeleteSetupParams {
    car: string;
    track: string;
    filename: string;
    [key: string]: unknown;
}

export interface ValidateSetupParams {
    car: string;
    content: any;
    [key: string]: unknown;
}

// Event payload types
export interface SetupsChangedEvent {
    payload: FolderStructure;
}

// Import types
export interface ImportResult {
    path: string;
    success: boolean;
    error?: string;
    car?: string;
    track?: string;
    filename?: string;
}

export interface ImportJsonFilesParams {
    paths: string[];
}

// Validation types
export interface ValidationResult {
    path: string;
    success: boolean;
    error?: string;
    json_content?: any;
    car?: string;
    filename?: string;
}

export interface ValidateJsonFilesParams {
    paths: string[];
}

// Setup import types
export interface SetupImportData {
    json_content: any;
    car: string;
    track: string;
    filename: string;
    apply_lfm: boolean;
}
