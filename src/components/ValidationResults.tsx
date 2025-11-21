import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TrackCombobox } from "@/components/TrackCombobox";
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

    const { data: tracks } = useQuery({
        queryKey: ["tracks"],
        queryFn: TauriAPI.getTracks,
    });

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
            (result) => ({
                json_content: result.json_content,
                car: result.car!,
                track: selectedTrack,
                filename: result.filename!,
                apply_lfm: applyLfm,
            }),
        );

        importMutation.mutate(setupsToImport);
    };

    const canImport =
        selectedTrack && validResults.length > 0 && !importMutation.isPending;

    return (
        <div className="space-y-2">
            {/* Results list */}
            <div className="max-h-48 overflow-y-auto space-y-2 border rounded-lg p-3">
                {results.map((result, index) => (
                    <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: off
                        key={index}
                        className={`flex items-start gap-3 p-2 rounded ${
                            result.success
                                ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                                : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                        }`}
                    >
                        {result.success ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p
                                className="text-sm font-medium truncate"
                                title={result.path}
                            >
                                {result.path.split("/").pop() || result.path}
                            </p>
                            {result.success ? (
                                <p className="text-xs text-green-700 dark:text-green-300">
                                    Valid setup for {result.car}
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
