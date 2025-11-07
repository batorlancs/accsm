import {
    Calendar,
    Car,
    Edit,
    FileText,
    Save,
    Tag,
    Trash2,
    X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    useDeleteSetup,
    useEditSetup,
    useSetup,
    useValidateSetup,
} from "@/hooks/useBackend";
import type { SetupFile } from "@/types/backend";

interface SetupViewerProps {
    car: string;
    track: string;
    filename: string;
    onDelete?: () => void;
}

const SETUP_TYPES = ["race", "qualifying", "wet", "custom"];

export function SetupViewer({
    car,
    track,
    filename,
    onDelete,
}: SetupViewerProps) {
    const { data: setup, isLoading, error } = useSetup(car, track, filename);
    const editMutation = useEditSetup();
    const deleteMutation = useDeleteSetup();
    const validateMutation = useValidateSetup();

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState("");
    const [editedTags, setEditedTags] = useState("");
    const [editedSetupType, setEditedSetupType] = useState("race");
    const [validationError, setValidationError] = useState<string | null>(null);

    // Update edited values when setup loads
    useEffect(() => {
        if (setup) {
            setEditedContent(JSON.stringify(setup, null, 2));
            setEditedTags(setup.ACCSMData.tags.join(", "));
            setEditedSetupType(setup.ACCSMData.setupType);
        }
    }, [setup]);

    const handleEdit = () => {
        setIsEditing(true);
        setValidationError(null);
    };

    const handleCancel = () => {
        if (setup) {
            setEditedContent(JSON.stringify(setup, null, 2));
            setEditedTags(setup.ACCSMData.tags.join(", "));
            setEditedSetupType(setup.ACCSMData.setupType);
        }
        setIsEditing(false);
        setValidationError(null);
    };

    const validateAndSave = async () => {
        try {
            // Parse the JSON content
            const parsedContent = JSON.parse(editedContent);

            // Update the ACCSMData
            parsedContent.ACCSMData = {
                ...parsedContent.ACCSMData,
                tags: editedTags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0),
                setupType: editedSetupType,
                lastModified: new Date().toISOString(),
            };

            // Validate the setup
            await validateMutation.mutateAsync({
                car,
                content: parsedContent,
            });

            // Save the setup
            await editMutation.mutateAsync({
                car,
                track,
                filename,
                content: parsedContent,
            });

            setIsEditing(false);
            setValidationError(null);
        } catch (error) {
            if (error instanceof SyntaxError) {
                setValidationError("Invalid JSON format");
            } else {
                setValidationError(String(error));
            }
            toast.error(`Validation failed: ${error}`);
        }
    };

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete ${filename}?`)) {
            return;
        }

        try {
            await deleteMutation.mutateAsync({ car, track, filename });
            onDelete?.();
        } catch (error) {
            toast.error(`Failed to delete setup: ${error}`);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full">
                <div className="flex items-center justify-center h-full">
                    <div className="text-muted-foreground">
                        Loading setup...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-full">
                <div>
                    <h2 className="text-red-500">Error</h2>
                </div>
                <div>
                    <p className="text-sm text-red-500">
                        Failed to load setup: {String(error)}
                    </p>
                </div>
            </div>
        );
    }

    if (!setup) {
        return (
            <div className="h-full">
                <div className="flex items-center justify-center h-full">
                    <div className="text-muted-foreground">Setup not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            {filename}
                        </h2>
                        <div className="text-sm text-muted-foreground mt-1 space-y-1">
                            <div className="flex items-center gap-2">
                                <Car className="h-3 w-3" />
                                <span>{setup.carName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-3 w-3" />
                                <span>
                                    Modified:{" "}
                                    {new Date(
                                        setup.ACCSMData.lastModified,
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Tag className="h-3 w-3" />
                                <span className="capitalize">
                                    {setup.ACCSMData.setupType}
                                </span>
                                {setup.ACCSMData.tags.length > 0 && (
                                    <span>
                                        • {setup.ACCSMData.tags.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    onClick={validateAndSave}
                                    disabled={
                                        editMutation.isPending ||
                                        validateMutation.isPending
                                    }
                                    size="sm"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save
                                </Button>
                                <Button
                                    onClick={handleCancel}
                                    variant="outline"
                                    size="sm"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    onClick={handleEdit}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                </Button>
                                <Button
                                    onClick={handleDelete}
                                    variant="destructive"
                                    size="sm"
                                    disabled={deleteMutation.isPending}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {isEditing ? (
                    <>
                        {/* Edit form */}
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium">
                                    Tags (comma-separated)
                                </label>
                                <Input
                                    value={editedTags}
                                    onChange={(e) =>
                                        setEditedTags(e.target.value)
                                    }
                                    placeholder="e.g., wet, aggressive, stable"
                                />
                            </div>
                            <div className="w-40">
                                <label className="text-sm font-medium">
                                    Setup Type
                                </label>
                                <Select
                                    value={editedSetupType}
                                    onValueChange={setEditedSetupType}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {SETUP_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                <span className="capitalize">
                                                    {type}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {validationError && (
                            <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                                {validationError}
                            </div>
                        )}

                        <div className="flex-1 flex flex-col">
                            <label className="text-sm font-medium mb-2">
                                Setup JSON
                            </label>
                            <Textarea
                                value={editedContent}
                                onChange={(e) =>
                                    setEditedContent(e.target.value)
                                }
                                className="flex-1 font-mono text-xs"
                                placeholder="Enter setup JSON content..."
                            />
                        </div>
                    </>
                ) : (
                    // View mode
                    <div className="flex-1 flex flex-col">
                        <label className="text-sm font-medium mb-2">
                            Setup JSON
                        </label>
                        <Textarea
                            value={JSON.stringify(setup, null, 2)}
                            readOnly
                            className="flex-1 font-mono text-xs bg-muted"
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
