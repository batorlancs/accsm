import { open as openfile } from "@tauri-apps/plugin-dialog";
import { AlertCircle, FolderOpen, Save, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSetSetupsPath, useSetupsPath } from "@/hooks/useBackend";

interface ImprovedChangePathDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ImprovedChangePathDialog({
    open,
    onOpenChange,
}: ImprovedChangePathDialogProps) {
    const { data: currentPath, isLoading: isLoadingPath } = useSetupsPath();
    const setPathMutation = useSetSetupsPath();
    const [newPath, setNewPath] = useState("");
    const [localError, setLocalError] = useState<string | null>(null);

    React.useEffect(() => {
        if (open && currentPath) {
            setNewPath(currentPath);
            setLocalError(null);
        }
    }, [open, currentPath]);

    const validatePath = (path: string): string | null => {
        const trimmedPath = path.trim();

        if (!trimmedPath) {
            return "Path cannot be empty";
        }

        if (trimmedPath.length < 3) {
            return "Path is too short";
        }

        // Basic path validation (could be expanded based on OS)
        const invalidChars = /[<>:"|?*]/;
        if (invalidChars.test(trimmedPath)) {
            return "Path contains invalid characters";
        }

        return null;
    };

    const handlePathChange = (value: string) => {
        setNewPath(value);
        if (localError) {
            const error = validatePath(value);
            if (!error) {
                setLocalError(null);
            }
        }
    };

    const handleBrowseFolder = async () => {
        try {
            const selectedPath = await openfile({
                multiple: false,
                directory: true,
                title: "Select ACC Setups Folder",
                defaultPath: currentPath || undefined,
            });

            if (selectedPath && typeof selectedPath === "string") {
                setNewPath(selectedPath);
                setLocalError(null);
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            setLocalError(`Failed to open folder dialog: ${errorMessage}`);
        }
    };

    const handleSave = async () => {
        const trimmedPath = newPath.trim();
        const validationError = validatePath(trimmedPath);

        if (validationError) {
            setLocalError(validationError);
            return;
        }

        if (trimmedPath === currentPath) {
            onOpenChange(false);
            return;
        }

        setLocalError(null);

        try {
            await setPathMutation.mutateAsync(trimmedPath);
            onOpenChange(false);
        } catch (error) {
            // The mutation hook will show the toast error
            // We can also set a local error for additional context
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            setLocalError(`Failed to update path: ${errorMessage}`);
        }
    };

    const handleCancel = () => {
        setNewPath(currentPath || "");
        setLocalError(null);
        onOpenChange(false);
    };

    const hasError = localError || setPathMutation.isError;
    const isValid =
        newPath.trim() && !validatePath(newPath) && newPath !== currentPath;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5" />
                        Change Setups Path
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">
                            Current Path
                        </label>
                        <div className="text-sm text-muted-foreground bg-muted p-2 rounded mt-1 break-all">
                            {isLoadingPath
                                ? "Loading..."
                                : currentPath || "No path set"}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">New Path</label>
                        <div className="flex gap-2 mt-1">
                            <Input
                                value={newPath}
                                onChange={(e) =>
                                    handlePathChange(e.target.value)
                                }
                                placeholder="Enter the path to your ACC setups folder"
                                className={`flex-1 ${hasError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                                disabled={setPathMutation.isPending}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleBrowseFolder}
                                disabled={setPathMutation.isPending}
                                className="px-3"
                            >
                                <FolderOpen className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                            This should be the folder containing all of your
                            setups
                        </div>

                        {hasError && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                {localError ||
                                    "An error occurred while updating the path"}
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        onClick={handleSave}
                        disabled={setPathMutation.isPending || !isValid}
                        className="min-w-[80px]"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {setPathMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        disabled={setPathMutation.isPending}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

