// Backend data structure types that match the Rust models

export interface Car {
  id: string;
  folder_name: string;
  pretty_name: string;
}

export interface Track {
  id: string;
  folder_name: string;
  pretty_name: string;
}

export interface AccsmData {
  lastModified: string; // ISO string from DateTime<Utc>
  tags: string[];
  setupType: string;
}

export interface SetupFile {
  carName: string;
  basicSetup: any; // JSON value
  advancedSetup: any; // JSON value
  trackBopType?: number;
  ACCSMData: AccsmData;
  [key: string]: any; // For other_fields
}

export interface SetupInfo {
  filename: string;
  display_name: string;
  last_modified: string; // ISO string
  tags: string[];
  setup_type: string;
}

export interface TrackFolder {
  track_id: string;
  track_name: string;
  folder_name: string;
  setups: SetupInfo[];
}

export interface CarFolder {
  car_id: string;
  car_name: string;
  folder_name: string;
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
}

export interface SaveSetupParams {
  car: string;
  track: string;
  filename: string;
  content: any;
}

export interface DeleteSetupParams {
  car: string;
  track: string;
  filename: string;
}

export interface ValidateSetupParams {
  car: string;
  content: any;
}

// Event payload types
export interface SetupsChangedEvent {
  payload: FolderStructure;
}