import { Edit3, Wrench } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ValidationResult } from "@/types/backend";

interface SetupFilenameEditorProps {
    validResults: ValidationResult[];
    onFilenamesChange: (updatedFilenames: Record<number, string>) => void;
}

export function SetupFilenameEditor({
    validResults,
    onFilenamesChange,
}: SetupFilenameEditorProps) {
    const [customFilenames, setCustomFilenames] = useState<
        Record<number, string>
    >({});
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const getDisplayName = (result: ValidationResult, index: number) => {
        // Return custom filename if set, otherwise use original filename
        return (
            customFilenames[index] || result.filename || "imported_setup.json"
        );
    };

    const handleEdit = (index: number) => {
        const currentName = getDisplayName(validResults[index], index);
        // Remove .json extension for editing
        const nameWithoutExt = currentName.replace(/\.json$/, "");
        setCustomFilenames((prev) => ({ ...prev, [index]: nameWithoutExt }));
        setEditingIndex(index);
    };

    const handleSave = (index: number) => {
        const newName = customFilenames[index];
        if (newName && newName.trim()) {
            // Ensure .json extension
            const finalName = newName.trim().endsWith(".json")
                ? newName.trim()
                : `${newName.trim()}.json`;

            const updatedFilenames = { ...customFilenames, [index]: finalName };
            setCustomFilenames(updatedFilenames);
            onFilenamesChange(updatedFilenames);
        }
        setEditingIndex(null);
    };

    const handleCancel = (index: number) => {
        // Reset to original filename
        const originalName =
            validResults[index].filename || "imported_setup.json";
        setCustomFilenames((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });
        setEditingIndex(null);
        onFilenamesChange(customFilenames);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Enter") {
            handleSave(index);
        } else if (e.key === "Escape") {
            handleCancel(index);
        }
    };

    if (validResults.length === 0) return null;

    return (
        <div className="space-y-3">
            <div className="space-y-2 max-h-48 overflow-y-auto">
                {validResults.map((result, index) => (
                    <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: off
                        key={index}
                        className="flex items-center rounded bg-muted/30 border border-border/40 hover:bg-muted/50 hover:border-border/60"
                    >
                        <div className="p-2 bg-foreground/4 h-16 w-16 flex items-center justify-center rounded-l-lg">
                            <Wrench className="size-5 opacity-40" />
                        </div>
                        <div className="flex-1 min-w-0 px-3 py-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground font-mono">
                                    {result.car}
                                </span>
                            </div>

                            {editingIndex === index ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        value={customFilenames[index] || ""}
                                        onChange={(e) =>
                                            setCustomFilenames((prev) => ({
                                                ...prev,
                                                [index]: e.target.value,
                                            }))
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                        }
                                        placeholder="Enter filename (without .json)"
                                        className="h-7 text-sm flex-1"
                                        autoFocus
                                    />
                                    <Button
                                        size="sm"
                                        // variant="primary"
                                        onClick={() => handleSave(index)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCancel(index)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm font-medium truncate">
                                        {getDisplayName(result, index)}
                                    </span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleEdit(index)}
                                        className="h-6 w-6 p-0 opacity-40 hover:opacity-80 hover:bg-transparent!"
                                    >
                                        <Edit3 className="size-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
