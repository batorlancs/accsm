import { useMutation } from "@tanstack/react-query";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";
import { toast } from "sonner";
import { SetupFilenameEditor } from "@/components/SetupFilenameEditor";
import { TrackCombobox } from "@/components/TrackCombobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    useCars,
    useFolderStructure,
    useRefreshFolderStructure,
    useTracks,
} from "@/hooks/useBackend";
import { store } from "@/lib/store-manager";
import { findCommonTrack } from "@/lib/track-simplify";
import { TauriAPI } from "@/services/api";
import type { SetupImportData, ValidationResult } from "@/types/backend";

interface ValidationResultsProps {
    results: ValidationResult[];
    onComplete: () => void;
    onTryAgain: () => void;
}

export function ValidationResults({
    results,
    onComplete,
    onTryAgain,
}: ValidationResultsProps) {
    const [selectedTrack, setSelectedTrack] = useState<string>("");
    const [applyLfm, setApplyLfm] = useState(false);
    const [hasDuplicateFilenames, setHasDuplicateFilenames] = useState(false);
    const [customFilenames, setCustomFilenames] = useState<
        Record<number, string>
    >({});
    const [existingFileConflicts, setExistingFileConflicts] = useState<
        Set<number>
    >(new Set());
    const refreshMutation = useRefreshFolderStructure();
    const { data: folderStructure } = useFolderStructure();

    const validResults = useMemo(
        () => results.filter((r) => r.success),
        [results],
    );
    const failedResults = useMemo(
        () => results.filter((r) => !r.success),
        [results],
    );

    const getFilename = (result: ValidationResult, index: number) => {
        return customFilenames[index] || result.filename || "";
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: off
    useEffect(() => {
        if (!folderStructure || !selectedTrack) {
            setExistingFileConflicts(new Set());
            return;
        }

        const conflicts = new Set<number>();
        validResults.forEach((result, index) => {
            const carId = result.car || "";
            const filename = getFilename(result, index);
            const carFolderData = folderStructure.cars.find(
                (f) => f.car_id === carId,
            );
            if (!carFolderData) return;
            const trackFolderData = carFolderData?.tracks.find(
                (t) => t.track_id === selectedTrack,
            );
            if (!trackFolderData) return;
            if (trackFolderData.setups.some((s) => s.filename === filename)) {
                conflicts.add(index);
            }
        });

        setExistingFileConflicts(conflicts);
    }, [customFilenames, validResults, selectedTrack, folderStructure]);

    // Load default applyLfm state on mount
    useEffect(() => {
        const loadDefault = async () => {
            const defaultValue = await store.get("applyLfmDefault");
            setApplyLfm(defaultValue ?? false);
        };
        loadDefault();
    }, []);

    // Automatically select a track if all valid setups are for the same one.
    useEffect(() => {
        if (validResults.length > 0) {
            const filenames = validResults.map((r) => r.filename || "");
            const commonTrack = findCommonTrack(filenames);
            if (commonTrack) {
                setSelectedTrack(commonTrack);
            }
        }
    }, [validResults]);

    // Save applyLfm state whenever it changes
    const handleApplyLfmChange = (checked: boolean) => {
        setApplyLfm(checked);
        store.set("applyLfmDefault", checked);
    };

    const { data: tracks } = useTracks();
    const { data: cars } = useCars();

    const carValidationErrors = useMemo(() => {
        if (!cars) return [];
        const errors = new Set<string>();
        for (const result of validResults) {
            if (!result.car || !cars[result.car]) {
                errors.add(
                    `Car "${result.car || "Unknown"}" is not recognized.`,
                );
            }
        }
        return Array.from(errors);
    }, [validResults, cars]);

    const importMutation = useMutation({
        mutationFn: TauriAPI.importValidatedSetups,
        onSuccess: async () => {
            await refreshMutation.mutateAsync({ silent: true });
            toast.success("Setups imported successfully!");
            onComplete();
        },
    });
    const checkboxId = useId();

    // no files found
    if (validResults.length === 0) {
        const noFilesFound = failedResults.length <= 0;

        return (
            <div className="space-y-4">
                <div className="text-center py-8">
                    <AlertCircle
                        className={`h-12 w-12 mx-auto mb-4 ${noFilesFound ? "text-amber-500 " : "text-red-500"}`}
                    />
                    <h3 className="font-semibold text-lg">
                        {noFilesFound ? "No Files Found" : "Invalid Files"}
                    </h3>
                    <p className="text-muted-foreground">
                        {noFilesFound
                            ? "The selected folder doesn't contain any files."
                            : "All files failed validation and cannot be imported."}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={onTryAgain}
                        className="flex-1"
                    >
                        Try Again
                    </Button>
                    <Button onClick={onComplete} className="flex-1">
                        Close
                    </Button>
                </div>
            </div>
        );
    }

    const handleImport = () => {
        if (!selectedTrack || validResults.length === 0) return;

        const setupsToImport: SetupImportData[] = validResults.map(
            (result, index) => ({
                json_content: result.json_content,
                car: result.car || "",
                track: selectedTrack,
                filename: customFilenames[index] || result.filename || "",
                apply_lfm: applyLfm,
            }),
        );

        importMutation.mutate(setupsToImport);
    };

    const canImport =
        selectedTrack &&
        validResults.length > 0 &&
        !importMutation.isPending &&
        !hasDuplicateFilenames &&
        carValidationErrors.length === 0 &&
        existingFileConflicts.size === 0;

    return (
        <div className="space-y-4">
            {/* Filename Editor */}
            {validResults.length > 0 && (
                <SetupFilenameEditor
                    validResults={validResults}
                    onFilenamesChange={setCustomFilenames}
                    onHasDuplicatesChange={setHasDuplicateFilenames}
                    existingFileConflicts={existingFileConflicts}
                />
            )}

            {/* Validation Errors */}
            {carValidationErrors.length > 0 && (
                <div className="p-3 my-2 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive-foreground/80">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="size-5 text-destructive" />
                        <div className="flex-1">
                            <h4 className="font-semibold text-destructive">
                                Invalid Setup
                            </h4>
                            <ul className="mt-1 space-y-1 text-xs list-disc list-inside">
                                {carValidationErrors.map((error) => (
                                    <li key={error}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Import settings */}
            {validResults.length > 0 && (
                <div className="flex items-center py-2 space-x-2">
                    <Checkbox
                        id={checkboxId}
                        checked={applyLfm}
                        onCheckedChange={(checked) =>
                            handleApplyLfmChange(checked === true)
                        }
                    />
                    <Label htmlFor={checkboxId} className="text-sm">
                        LFM: Set Telemetry to 99
                    </Label>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
                <TrackCombobox
                    tracks={tracks}
                    value={selectedTrack}
                    onValueChange={setSelectedTrack}
                    placeholder="Select a track"
                    className="flex-1"
                />
                {validResults.length > 0 ? (
                    <Button
                        onClick={handleImport}
                        disabled={!canImport}
                        className="flex-1"
                    >
                        {importMutation.isPending
                            ? "Importing..."
                            : "Import Setups"}
                    </Button>
                ) : (
                    <Button onClick={onComplete} className="flex-1">
                        Close
                    </Button>
                )}
            </div>
        </div>
    );
}
