import { useMutation } from "@tanstack/react-query";
import { open as openfile } from "@tauri-apps/plugin-dialog";
import { FileText, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ValidationResults } from "@/components/ValidationResults";
import { useDragDrop } from "@/hooks/useDragDrop";
import { TauriAPI } from "@/services/api";
import type { ValidationResult } from "@/types/backend";

interface FileDropModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFilesDropped: (paths: string[]) => void;
    globalDropFiles?: string[] | null;
}

type ModalState =
    | { type: "waiting" }
    | { type: "processing" }
    | { type: "results"; results: ValidationResult[] };

export function FileDropModal({
    open,
    onOpenChange,
    onFilesDropped,
    globalDropFiles,
}: FileDropModalProps) {
    const [modalState, setModalState] = useState<ModalState>({
        type: "waiting",
    });
    const validateMutation = useMutation({
        mutationFn: TauriAPI.validateJsonFiles,
        onSuccess: (results) => {
            setModalState({ type: "results", results });
        },
        onError: () => {
            setModalState({ type: "waiting" });
        },
    });

    const processFilesRef = useRef((paths: string[]) => {
        setModalState({ type: "processing" });
        validateMutation.mutate(paths);
    });

    // Update ref when mutation changes
    processFilesRef.current = (paths: string[]) => {
        setModalState({ type: "processing" });
        validateMutation.mutate(paths);
    };

    // Don't handle drag/drop in modal - let global handler do it
    const { dragState } = useDragDrop({
        onFileDrop: open ? onFilesDropped : () => {},
        enabled: !open,
    });

    // Process global files when modal opens with them
    useEffect(() => {
        if (open && globalDropFiles?.length) {
            processFilesRef.current(globalDropFiles);
        }
    }, [open, globalDropFiles]);

    // Reset state when modal closes
    useEffect(() => {
        if (!open) {
            setModalState({ type: "waiting" });
        }
    }, [open]);

    const handleBrowseFiles = async () => {
        try {
            const selected = await openfile({
                multiple: true,
                filters: [{ name: "JSON", extensions: ["json"] }],
            });

            if (selected && Array.isArray(selected)) {
                processFilesRef.current(selected);
            }
        } catch (error) {
            console.error("Failed to open file dialog:", error);
        }
    };

    const handleBrowseFolder = async () => {
        try {
            const selected = await openfile({ directory: true });

            if (selected && typeof selected === "string") {
                processFilesRef.current([selected]);
            }
        } catch (error) {
            console.error("Failed to open folder dialog:", error);
        }
    };

    const handleClose = () => onOpenChange(false);
    const handleTryAgain = () => setModalState({ type: "waiting" });

    const renderContent = () => {
        // Show drag-over state if dragging (only when not processing global files)
        if (dragState === "dragover" && !globalDropFiles) {
            return (
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
            );
        }

        switch (modalState.type) {
            case "waiting":
                return (
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
                                    Supported files: JSON setup files (.json)
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
                );

            case "processing":
                return (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center space-y-4">
                        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-muted-foreground animate-spin" />
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">
                                Processing files...
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Validating JSON files
                            </p>
                        </div>
                    </div>
                );

            case "results": {
                return (
                    <ValidationResults
                        results={modalState.results}
                        onComplete={handleClose}
                        onTryAgain={handleTryAgain}
                    />
                );
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Import Setup
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Drop JSON setup files or folders containing JSON files
                        to validate and import them into your setup collection.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">{renderContent()}</div>
            </DialogContent>
        </Dialog>
    );
}
