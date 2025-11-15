import { useEffect } from "react";
import { useFolderStructure, useTracks } from "@/hooks/useBackend";
import { getCountryFlag } from "@/lib/countryFlags";

interface TrackViewProps {
    selectedTrack: string | null;
    onSelectTrack: (trackId: string) => void;
}

export function TrackView({ selectedTrack, onSelectTrack }: TrackViewProps) {
    const { data: folderStructure, isLoading: folderLoading } =
        useFolderStructure();
    const { data: tracksData, isLoading: tracksLoading } = useTracks();

    const isLoading = folderLoading || tracksLoading;

    // Get all unique tracks from folder structure
    const availableTracks =
        folderStructure?.cars
            .flatMap((car) => car.tracks.map((track) => track.track_id))
            .filter((trackId, index, arr) => arr.indexOf(trackId) === index) ||
        [];

    // Calculate setup count for a specific track
    const getSetupCountForTrack = (trackId: string) => {
        return (
            folderStructure?.cars
                .flatMap((car) => car.tracks)
                .filter((track) => track.track_id === trackId)
                .reduce((total, track) => total + track.setups.length, 0) || 0
        );
    };

    // Auto-select first track when available
    useEffect(() => {
        if (!selectedTrack && availableTracks.length > 0 && !isLoading) {
            onSelectTrack(availableTracks[0]);
        }
    }, [availableTracks, selectedTrack, onSelectTrack, isLoading]);

    if (isLoading) {
        return (
            <div className="h-full">
                <div className="mb-4">
                    <h2 className="text-lg font-medium">Tracks</h2>
                    <p className="text-sm text-muted-foreground">
                        Browse available tracks
                    </p>
                </div>
                <div className="p-4 text-center text-muted-foreground">
                    Loading tracks...
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-1">
                    {availableTracks.map((trackId) => {
                        const trackInfo = tracksData?.[trackId];
                        const isSelected = selectedTrack === trackId;

                        return (
                            // biome-ignore lint/a11y/noStaticElementInteractions: <off>
                            // biome-ignore lint/a11y/useKeyWithClickEvents: off
                            <div
                                key={trackId}
                                onClick={() => onSelectTrack(trackId)}
                                className={`
                                    flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-all
                                    ${
                                        isSelected
                                            ? "bg-primary/10 hover:bg-primary/15 opacity-100 text-primary"
                                            : "opacity-60 hover:opacity-80"
                                    }
                                `}
                            >
                                <span className="text-sm shrink-0">
                                    {getCountryFlag(trackInfo?.country || "")}
                                </span>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm truncate">
                                        {trackInfo?.pretty_name || trackId}
                                    </h3>
                                </div>

                                <span
                                    className={`text-xs opacity-80 shrink-0 ${isSelected ? "text-primary" : ""}`}
                                >
                                    {getSetupCountForTrack(trackId)}
                                </span>
                            </div>
                        );
                    })}

                    {availableTracks.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                            No tracks found
                        </div>
                    )}
                </div>
            </div>
            <div className="p-2 mt-5">
                {folderStructure && (
                    <div className="text-xs text-muted-foreground opacity-80">
                        {folderStructure.total_setups} setups overall for{" "}
                        {folderStructure.cars.length} cars
                    </div>
                )}
            </div>
        </div>
    );
}
