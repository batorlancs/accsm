import { CarFront, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { IconNumber } from "@/components/shared";
import { useFolderStructure, useTracks } from "@/hooks/useBackend";
import { getCountryFlag } from "@/lib/countryFlags";
import { store } from "@/lib/store-manager";
import { SearchableDropdown } from "../ui/searchable-dropdown";

interface TrackViewProps {
    selectedTrack: string | null;
    onSelectTrack: (trackId: string) => void;
}

export function TrackView({ selectedTrack, onSelectTrack }: TrackViewProps) {
    const { data: folderStructure, isLoading: folderLoading } =
        useFolderStructure();
    const { data: tracksData, isLoading: tracksLoading } = useTracks();

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Load persisted search query
    useEffect(() => {
        const loadSearchQuery = async () => {
            const stored = await store.get("trackSearchQuery");
            if (stored) {
                setSearchQuery(stored);
            }
        };
        loadSearchQuery();
    }, []);

    const isLoading = folderLoading || tracksLoading;

    // Get all unique tracks from folder structure
    const availableTracks =
        folderStructure?.cars
            .flatMap((car) => car.tracks.map((track) => track.track_id))
            .filter((trackId, index, arr) => arr.indexOf(trackId) === index) ||
        [];

    // Filter and search tracks
    const filteredTracks = useMemo(() => {
        let filtered = availableTracks;

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((trackId) => {
                const trackInfo = tracksData?.[trackId];
                const searchableText =
                    `${trackInfo?.pretty_name || trackId} ${trackInfo?.full_name || ""} ${trackInfo?.country || ""}`.toLowerCase();
                return searchableText.includes(query);
            });
        }

        return filtered;
    }, [availableTracks, tracksData, searchQuery]);

    // Calculate setup count for a specific track
    const getSetupCountForTrack = (trackId: string) => {
        return (
            folderStructure?.cars
                .flatMap((car) => car.tracks)
                .filter((track) => track.track_id === trackId)
                .reduce((total, track) => total + track.setups.length, 0) || 0
        );
    };

    // Calculate car count for a specific track
    const getCarCountForTrack = (trackId: string) => {
        return (
            folderStructure?.cars.filter((car) =>
                car.tracks.some((track) => track.track_id === trackId),
            ).length || 0
        );
    };

    // Auto-select first track when available (from filtered tracks)
    useEffect(() => {
        if (!selectedTrack && filteredTracks.length > 0 && !isLoading) {
            onSelectTrack(filteredTracks[0]);
        }
    }, [filteredTracks, selectedTrack, onSelectTrack, isLoading]);

    // Handle search input changes
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        store.set("trackSearchQuery", value);
    };

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
            <div className="p-2">
                <SearchableDropdown
                    placeholder="Search..."
                    className="opacity-80 hover:opacity-100 transition-opacity duration-200"
                    defaultValue={searchQuery}
                    onChange={handleSearchChange}
                    showSearchIcon
                />
            </div>
            <div className="flex-1 overflow-y-auto p-2 pt-0">
                <div className="space-y-1">
                    {filteredTracks.map((trackId) => {
                        const trackInfo = tracksData?.[trackId];
                        const isSelected = selectedTrack === trackId;

                        return (
                            // biome-ignore lint/a11y/noStaticElementInteractions: <off>
                            // biome-ignore lint/a11y/useKeyWithClickEvents: off
                            <div
                                key={trackId}
                                onClick={() => {
                                    if (!isSelected) {
                                        onSelectTrack(trackId);
                                    }
                                }}
                                className={`
                                    flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-all
                                    ${
                                        isSelected
                                            ? "bg-foreground/5 opacity-100"
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

                                <div className="flex items-center gap-2 opacity-60">
                                    <IconNumber
                                        icon={Wrench}
                                        number={getSetupCountForTrack(trackId)}
                                    />
                                    <IconNumber
                                        icon={CarFront}
                                        number={getCarCountForTrack(trackId)}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {filteredTracks.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground text-xs">
                            {searchQuery
                                ? "No tracks match your search criteria"
                                : "No tracks found"}
                        </div>
                    )}
                </div>
            </div>
            {/* Stats Footer */}
            <div className="p-4">
                {folderStructure && (
                    <div className="text-xs text-muted-foreground opacity-80">
                        {searchQuery ? (
                            <>
                                Showing {filteredTracks.length} of{" "}
                                {availableTracks.length} tracks
                            </>
                        ) : (
                            <>
                                {folderStructure.total_setups} setups overall
                                for {folderStructure.cars.length} cars
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
