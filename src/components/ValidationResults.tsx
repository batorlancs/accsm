import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useId, useState } from "react";
import { SetupFilenameEditor } from "@/components/SetupFilenameEditor";
import { TrackCombobox } from "@/components/TrackCombobox";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCars } from "@/hooks/useBackend";
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
    const queryClient = useQueryClient();
    const [selectedTrack, setSelectedTrack] = useState<string>("");
    const [applyLfm, setApplyLfm] = useState(false);
    const [customFilenames, setCustomFilenames] = useState<
        Record<number, string>
    >({});

    const { data: tracks } = useQuery({
        queryKey: ["tracks"],
        queryFn: TauriAPI.getTracks,
    });

    const { data: cars } = useCars();

    const importMutation = useMutation({
        mutationFn: TauriAPI.importValidatedSetups,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["folderStructure"] });
            onComplete();
        },
    });
    const checkboxId = useId();

    const validResults = results.filter((r) => r.success);
    const failedResults = results.filter((r) => !r.success);

    if (validResults.length === 0 && failedResults.length === 0) {
        return (
            <div className="space-y-4">
                <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                    <h3 className="font-semibold text-lg">
                        No JSON Files Found
                    </h3>
                    <p className="text-muted-foreground">
                        The selected folder doesn't contain any valid JSON setup
                        files.
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
                car: result.car!,
                track: selectedTrack,
                filename: customFilenames[index] || result.filename!,
                apply_lfm: applyLfm,
            }),
        );

        importMutation.mutate(setupsToImport);
    };

    const canImport =
        selectedTrack && validResults.length > 0 && !importMutation.isPending;

    return (
        <div className="space-y-2">
            {/* Filename Editor */}
            {validResults.length > 0 && (
                <SetupFilenameEditor
                    validResults={validResults}
                    onFilenamesChange={setCustomFilenames}
                />
            )}

            {/* Import settings */}
            {validResults.length > 0 && (
                <div className="flex items-center py-2 space-x-2">
                    <Checkbox
                        id={checkboxId}
                        checked={applyLfm}
                        onCheckedChange={(checked) =>
                            setApplyLfm(checked === true)
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
