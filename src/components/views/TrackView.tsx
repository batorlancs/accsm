import { MapPin } from "lucide-react";
import { useState } from "react";
import { useFolderStructure, useTracks } from "@/hooks/useBackend";

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
        <div className="h-full">
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
                            <MapPin className="h-4 w-4 shrink-0" />

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm truncate">
                                    {trackInfo?.pretty_name || trackId}
                                </h3>
                            </div>
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
    );
}

