import { Car, FileText } from "lucide-react";
import { useCars, useSetup, useTracks } from "@/hooks/useBackend";

interface SetupViewerProps {
    car: string;
    track: string;
    filename: string;
    onDelete?: () => void;
}

export function SetupViewer({ car, track, filename }: SetupViewerProps) {
    const { data: setup, isLoading, error } = useSetup(car, track, filename);
    const {
        data: cars,
        isLoading: isCarsLoading,
        error: carsError,
    } = useCars();

    const {
        data: tracks,
        isLoading: isTracksLoading,
        error: tracksError,
    } = useTracks();

    if (isLoading || isCarsLoading || isTracksLoading) {
        return <div className="text-muted-foreground">Loading setup...</div>;
    }

    if (error || carsError || tracksError) {
        return (
            <div>
                <h2 className="text-red-500">Error</h2>
                <p className="text-sm text-red-500">
                    Failed to load setup:{" "}
                    {String(error || carsError || tracksError)}
                </p>
            </div>
        );
    }

    if (!setup || !cars || !tracks) {
        return <div className="text-muted-foreground">Setup not found</div>;
    }

    const carData = cars[car];
    const trackData = tracks[track];

    return (
        <div className="space-y-4 p-4">
            <div>
                <h2 className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {filename}
                </h2>
            </div>

            <div className="text-sm text-muted-foreground space-y-2">
                <div>
                    <span className="font-medium">Track:</span>{" "}
                    {trackData.pretty_name}
                </div>
                <div className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    <span className="font-medium">Car:</span>{" "}
                    {carData.pretty_name}
                </div>
            </div>
        </div>
    );
}
