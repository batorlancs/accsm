import { SetupViewer } from "@/components/SetupViewer";
import { useCars, useFolderStructure, useTracks } from "@/hooks/useBackend";
import { getCountryFlag } from "@/lib/countryFlags";
import type { SetupInfo } from "@/types/backend";
import { CarBrandIcon } from "../ui/car-brand-icon";
import { EmptyState } from "./shared/EmptyState";
import { SetupGroup } from "./shared/SetupGroup";
import { useSetupSelection } from "./shared/useSetupSelection";
import { ViewerHeader } from "./shared/ViewerHeader";

interface TrackViewerProps {
    trackId: string;
}

export function TrackViewer({ trackId }: TrackViewerProps) {
    const { selectedSetup, selectSetup, clearSelection } =
        useSetupSelection(trackId);
    const { data: folderStructure, isLoading } = useFolderStructure();
    const { data: cars } = useCars();
    const { data: tracks } = useTracks();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!folderStructure || !cars || !tracks) {
        return <div>No data available</div>;
    }

    // Find the track name
    const trackData = tracks[trackId];

    // Group setups by car for this track
    const carGroups: {
        carId: string;
        carName: string;
        brandName: string;
        setups: SetupInfo[];
    }[] = [];

    folderStructure.cars.forEach((carFolder) => {
        const trackFolder = carFolder.tracks.find(
            (t) => t.track_id === trackId,
        );
        if (trackFolder && trackFolder.setups.length > 0) {
            const carData = cars[carFolder.car_id];
            carGroups.push({
                carId: carFolder.car_id,
                carName: carData?.pretty_name || carFolder.car_name,
                brandName: carData?.brand_name || "",
                setups: trackFolder.setups,
            });
        }
    });

    const handleSetupClick = (carId: string, setup: SetupInfo) => {
        selectSetup(carId, trackId, setup);
    };

    const handleAfterDelete = () => {
        // Return to the default view but keep the selected track
        clearSelection();
    };

    const handleAfterRename = (newFilename: string) => {
        // Update the selected setup to use the new filename
        if (selectedSetup) {
            selectSetup(selectedSetup.car, selectedSetup.track, {
                filename: newFilename,
                display_name: newFilename,
                last_modified: new Date().toISOString(),
            });
        }
    };

    if (selectedSetup) {
        return (
            <SetupViewer
                car={selectedSetup.car}
                track={selectedSetup.track}
                filename={selectedSetup.filename}
                onClose={clearSelection}
                onAfterDelete={handleAfterDelete}
                onAfterRename={handleAfterRename}
            />
        );
    }

    return (
        <div>
            <ViewerHeader
                title={trackData?.full_name}
                subtitles={[
                    {
                        title: trackData?.country,
                        icon: (
                            <span>
                                {getCountryFlag(trackData?.country || "")}
                            </span>
                        ),
                    },
                ]}
            />
            <div className="grid grid-cols-2 gap-4 p-4">
                {carGroups.map((group, index) => {
                    return (
                        <div
                            key={group.carId}
                            className={
                                "bg-muted/50 border border-border/50 rounded p-2 pb-3"
                            }
                        >
                            <SetupGroup
                                title={group.carName}
                                icon={<CarBrandIcon name={group.brandName} />}
                                setups={group.setups}
                                onSetupClick={(setup) =>
                                    handleSetupClick(group.carId, setup)
                                }
                            />
                        </div>
                    );
                })}
                {carGroups.length === 0 && (
                    <EmptyState message="No setups found for this track" />
                )}
            </div>
        </div>
    );
}
