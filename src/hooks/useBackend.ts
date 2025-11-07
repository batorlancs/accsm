import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TauriAPI } from "@/services/api";
import type {
    DeleteSetupParams,
    GetSetupParams,
    SaveSetupParams,
    ValidateSetupParams,
} from "@/types/backend";

// Query keys
export const queryKeys = {
    folderStructure: ["folder-structure"] as const,
    setup: (car: string, track: string, filename: string) =>
        ["setup", car, track, filename] as const,
    cars: ["cars"] as const,
    tracks: ["tracks"] as const,
    setupsPath: ["setups-path"] as const,
};

// Folder structure queries
export function useFolderStructure() {
    return useQuery({
        queryKey: queryKeys.folderStructure,
        queryFn: TauriAPI.getFolderStructure,
        staleTime: 30000, // 30 seconds
    });
}

export function useRefreshFolderStructure() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: TauriAPI.refreshFolderStructure,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.folderStructure, data);
            toast.success("Folder structure refreshed");
        },
        onError: (error) => {
            toast.error(`Failed to refresh: ${error}`);
        },
    });
}

// Setup queries
export function useSetup(
    car: string,
    track: string,
    filename: string,
    enabled = true,
) {
    return useQuery({
        queryKey: queryKeys.setup(car, track, filename),
        queryFn: () => TauriAPI.getSetup({ car, track, filename }),
        enabled: enabled && !!car && !!track && !!filename,
    });
}

export function useSaveSetup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: SaveSetupParams) => TauriAPI.saveSetup(params),
        onSuccess: (_, variables) => {
            // Invalidate the specific setup and folder structure
            queryClient.invalidateQueries({
                queryKey: queryKeys.setup(
                    variables.car,
                    variables.track,
                    variables.filename,
                ),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.folderStructure,
            });
            toast.success("Setup saved successfully");
        },
        onError: (error) => {
            toast.error(`Failed to save setup: ${error}`);
        },
    });
}

export function useEditSetup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: SaveSetupParams) => TauriAPI.editSetup(params),
        onSuccess: (_, variables) => {
            // Invalidate the specific setup and folder structure
            queryClient.invalidateQueries({
                queryKey: queryKeys.setup(
                    variables.car,
                    variables.track,
                    variables.filename,
                ),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.folderStructure,
            });
            toast.success("Setup updated successfully");
        },
        onError: (error) => {
            toast.error(`Failed to update setup: ${error}`);
        },
    });
}

export function useDeleteSetup() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (params: DeleteSetupParams) => TauriAPI.deleteSetup(params),
        onSuccess: (_, variables) => {
            // Remove the specific setup from cache and invalidate folder structure
            queryClient.removeQueries({
                queryKey: queryKeys.setup(
                    variables.car,
                    variables.track,
                    variables.filename,
                ),
            });
            queryClient.invalidateQueries({
                queryKey: queryKeys.folderStructure,
            });
            toast.success("Setup deleted successfully");
        },
        onError: (error) => {
            toast.error(`Failed to delete setup: ${error}`);
        },
    });
}

// Path queries
export function useSetupsPath() {
    return useQuery({
        queryKey: queryKeys.setupsPath,
        queryFn: TauriAPI.getSetupsPath,
    });
}

export function useSetSetupsPath() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (path: string) => TauriAPI.setSetupsPath(path),
        onSuccess: (_, newPath) => {
            queryClient.setQueryData(queryKeys.setupsPath, newPath);
            queryClient.invalidateQueries({
                queryKey: queryKeys.folderStructure,
            });
            toast.success("Setups path updated");
        },
        onError: (error) => {
            toast.error(`Failed to update path: ${error}`);
        },
    });
}

// Data queries
export function useCars() {
    return useQuery({
        queryKey: queryKeys.cars,
        queryFn: TauriAPI.getCars,
        staleTime: Infinity, // Cars don't change often
    });
}

export function useTracks() {
    return useQuery({
        queryKey: queryKeys.tracks,
        queryFn: TauriAPI.getTracks,
        staleTime: Infinity, // Tracks don't change often
    });
}

// Validation mutation
export function useValidateSetup() {
    return useMutation({
        mutationFn: (params: ValidateSetupParams) =>
            TauriAPI.validateSetup(params),
        onError: (error) => {
            toast.error(`Validation failed: ${error}`);
        },
    });
}

