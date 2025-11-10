/** biome-ignore-all lint/complexity/noStaticOnlyClass: off */
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type {
    Car,
    DeleteSetupParams,
    FolderStructure,
    GetSetupParams,
    ImportResult,
    SaveSetupParams,
    SetupFile,
    SetupsChangedEvent,
    Track,
    ValidateSetupParams,
} from "@/types/backend";

export class TauriAPI {
    // Folder structure operations
    static async getFolderStructure(): Promise<FolderStructure> {
        return invoke<FolderStructure>("get_folder_structure");
    }

    static async refreshFolderStructure(): Promise<FolderStructure> {
        return invoke<FolderStructure>("refresh_folder_structure");
    }

    // Setup operations
    static async getSetup(params: GetSetupParams): Promise<SetupFile> {
        return invoke<SetupFile>("get_setup", params);
    }

    static async saveSetup(params: SaveSetupParams): Promise<void> {
        return invoke<void>("save_setup", params);
    }

    static async editSetup(params: SaveSetupParams): Promise<void> {
        return invoke<void>("edit_setup", params);
    }

    static async deleteSetup(params: DeleteSetupParams): Promise<void> {
        return invoke<void>("delete_setup", params);
    }

    static async setupExists(params: GetSetupParams): Promise<boolean> {
        return invoke<boolean>("setup_exists", params);
    }

    static async validateSetup(params: ValidateSetupParams): Promise<boolean> {
        return invoke<boolean>("validate_setup", params);
    }

    // Path operations
    static async getSetupsPath(): Promise<string> {
        return invoke<string>("get_setups_path");
    }

    static async setSetupsPath(path: string): Promise<void> {
        return invoke<void>("set_setups_path", { path });
    }

    // Data operations
    static async getCars(): Promise<Record<string, Car>> {
        return invoke<Record<string, Car>>("get_cars");
    }

    static async getTracks(): Promise<Record<string, Track>> {
        return invoke<Record<string, Track>>("get_tracks");
    }

    // Import operations
    static async importJsonFiles(paths: string[]): Promise<ImportResult[]> {
        return invoke<ImportResult[]>("import_json_files", { paths });
    }

    // Event listeners
    static async onSetupsChanged(
        callback: (structure: FolderStructure) => void,
    ) {
        return listen<FolderStructure>("setups-changed", (event) => {
            callback(event.payload);
        });
    }
}
