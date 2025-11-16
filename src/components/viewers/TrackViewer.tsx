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

    if (selectedSetup) {
        return (
            <SetupViewer
                car={selectedSetup.car}
                track={selectedSetup.track}
                filename={selectedSetup.filename}
                onClose={clearSelection}
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
            <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-6">
                {carGroups.map((group) => {
                    return (
                        <SetupGroup
                            key={group.carId}
                            title={group.carName}
                            icon={<CarBrandIcon name={group.brandName} />}
                            setups={group.setups}
                            onSetupClick={(setup) =>
                                handleSetupClick(group.carId, setup)
                            }
                        />
                    );
                })}
                {carGroups.length === 0 && (
                    <EmptyState message="No setups found for this track" />
                )}
            </div>
        </div>
    );
}
