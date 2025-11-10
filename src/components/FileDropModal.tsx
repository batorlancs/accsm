import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { open as openfile } from "@tauri-apps/plugin-dialog";
import { AlertCircle, CheckCircle2, FileText, Upload, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TauriAPI } from "@/services/api";
import type { ImportResult } from "@/types/backend";

interface FileDropModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    globalDropFiles?: string[] | null;
}

type DropState =
    | { type: "waiting" }
    | { type: "dragover" }
    | { type: "processing" }
    | { type: "results"; results: ImportResult[] };

export function FileDropModal({
    open,
    onOpenChange,
    globalDropFiles,
}: FileDropModalProps) {
    const [dropState, setDropState] = useState<DropState>({ type: "waiting" });
    const queryClient = useQueryClient();
    const processedGlobalFiles = useRef<string | null>(null);

    const onSuccess = useCallback(
        (results: any) => {
            setDropState({ type: "results", results });
            // Refresh the folder structure if any imports were successful
            if (results.some((r: any) => r.success)) {
                queryClient.invalidateQueries({
                    queryKey: ["folderStructure"],
                });
            }
        },
        [queryClient],
    );

    const onError = useCallback(() => {
        setDropState({ type: "waiting" });
    }, []);

    const importMutation = useMutation({
        mutationFn: TauriAPI.importJsonFiles,
        onSuccess,
        onError,
    });

    useEffect(() => {
        if (!open) return;

        // Don't set up local drag-drop if we have global files (prevents duplicate listeners)
        if (globalDropFiles && globalDropFiles.length > 0) return;

        let unlisten: (() => void) | null = null;

        const setupDragDrop = async () => {
            try {
                const webview = getCurrentWebview();
                unlisten = await webview.onDragDropEvent((event) => {
                    if (event.payload.type === "over") {
                        setDropState({ type: "dragover" });
                    } else if (event.payload.type === "drop") {
                        setDropState({ type: "processing" });
                        importMutation.mutate(event.payload.paths);
                    } else {
                        setDropState({ type: "waiting" });
                    }
                });
            } catch (error) {
                console.error("Failed to setup drag drop:", error);
            }
        };

        setupDragDrop();

        return () => {
            if (unlisten) {
                unlisten();
            }
        };
    }, [open, globalDropFiles, importMutation.mutate]);

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setDropState({ type: "waiting" });
        }
    }, [open]);

    // Process global drop files when modal opens
    useEffect(() => {
        if (open && globalDropFiles && globalDropFiles.length > 0) {
            const filesKey = globalDropFiles.join("|");

            // Only process if we haven't processed these exact files
            if (processedGlobalFiles.current !== filesKey) {
                processedGlobalFiles.current = filesKey;
                setDropState({ type: "processing" });
                importMutation.mutate(globalDropFiles);
            }
        }
    }, [open, globalDropFiles, importMutation]);

    // Reset processed files when modal closes
    useEffect(() => {
        if (!open) {
            processedGlobalFiles.current = null;
        }
    }, [open]);

    const handleBrowseFiles = async () => {
        try {
            const selected = await openfile({
                multiple: true,
                filters: [
                    {
                        name: "JSON",
                        extensions: ["json"],
                    },
                ],
            });

            if (selected && Array.isArray(selected)) {
                setDropState({ type: "processing" });
                importMutation.mutate(selected);
            }
        } catch (error) {
            console.error("Failed to open file dialog:", error);
        }
    };

    const handleBrowseFolder = async () => {
        try {
            const selected = await openfile({
                directory: true,
            });

            if (selected && typeof selected === "string") {
                setDropState({ type: "processing" });
                importMutation.mutate([selected]);
            }
        } catch (error) {
            console.error("Failed to open folder dialog:", error);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };

    const handleTryAgain = () => {
        setDropState({ type: "waiting" });
    };

    const getSuccessCount = (results: ImportResult[]) => {
        return results.filter((r) => r.success).length;
    };

    const getFailureCount = (results: ImportResult[]) => {
        return results.filter((r) => !r.success).length;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Upload className="h-5 w-5" />
                        Import JSON Setup Files
                    </DialogTitle>
                    <DialogDescription>
                        Drop JSON setup files or folders containing JSON files
                        to import them into your setup collection.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {dropState.type === "waiting" && (
                        <>
                            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Drop files or folders here
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Supported files: JSON setup files
                                        (.json)
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex-1 border-t border-muted" />
                                <span className="text-xs text-muted-foreground px-2">
                                    OR
                                </span>
                                <div className="flex-1 border-t border-muted" />
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleBrowseFiles}
                                >
                                    Browse Files
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleBrowseFolder}
                                >
                                    Browse Folder
                                </Button>
                            </div>
                        </>
                    )}

                    {dropState.type === "dragover" && (
                        <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center space-y-4 bg-primary/5">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                                <Upload className="h-8 w-8 text-primary animate-pulse" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-primary">
                                    Release to import
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Drop your JSON files now
                                </p>
                            </div>
                        </div>
                    )}

                    {dropState.type === "processing" && (
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                                <Upload className="h-8 w-8 text-muted-foreground animate-spin" />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">
                                    Processing files...
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Importing and validating JSON files
                                </p>
                            </div>
                        </div>
                    )}

                    {dropState.type === "results" && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold">
                                    Import Results
                                </h3>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1 text-green-600">
                                        <CheckCircle2 className="h-4 w-4" />
                                        {getSuccessCount(dropState.results)}{" "}
                                        successful
                                    </span>
                                    {getFailureCount(dropState.results) > 0 && (
                                        <span className="flex items-center gap-1 text-red-600">
                                            <AlertCircle className="h-4 w-4" />
                                            {getFailureCount(dropState.results)}{" "}
                                            failed
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
                                {dropState.results.map((result, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-3 p-2 rounded ${
                                            result.success
                                                ? "bg-green-50 dark:bg-green-950/20"
                                                : "bg-red-50 dark:bg-red-950/20"
                                        }`}
                                    >
                                        {result.success ? (
                                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                        ) : (
                                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p
                                                className="text-sm font-medium truncate"
                                                title={result.path}
                                            >
                                                {result.path.split("/").pop() ||
                                                    result.path}
                                            </p>
                                            {result.success ? (
                                                <p className="text-xs text-green-700 dark:text-green-300">
                                                    Imported as {result.car}/
                                                    {result.track}/
                                                    {result.filename}
                                                </p>
                                            ) : (
                                                <p className="text-xs text-red-700 dark:text-red-300">
                                                    {result.error}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={handleTryAgain}
                                    className="flex-1"
                                >
                                    Import More
                                </Button>
                                <Button
                                    onClick={handleClose}
                                    className="flex-1"
                                >
                                    Done
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {dropState.type !== "results" && (
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={handleClose}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

