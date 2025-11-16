import { SetupViewer } from "@/components/SetupViewer";
import { useCars, useFolderStructure, useTracks } from "@/hooks/useBackend";
import { getCountryFlag } from "@/lib/countryFlags";
import type { SetupInfo } from "@/types/backend";
import { CarBrandIcon } from "../ui/car-brand-icon";
import { EmptyState } from "./shared/EmptyState";
import { SetupGroup } from "./shared/SetupGroup";
import { useSetupSelection } from "./shared/useSetupSelection";
import { ViewerHeader } from "./shared/ViewerHeader";

interface CarViewerProps {
    carId: string;
}

export function CarViewer({ carId }: CarViewerProps) {
    const { selectedSetup, selectSetup, clearSelection } =
        useSetupSelection(carId);
    const { data: folderStructure, isLoading } = useFolderStructure();
    const { data: cars } = useCars();
    const { data: tracks } = useTracks();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!folderStructure || !cars || !tracks) {
        return <div>No data available</div>;
    }

    const carData = cars[carId];

    // Find the car folder
    const carFolder = folderStructure.cars.find((c) => c.car_id === carId);

    if (!carFolder) {
        return null;
    }

    // Group setups by track
    const trackGroups = carFolder.tracks
        .filter((trackFolder) => trackFolder.setups.length > 0)
        .map((trackFolder) => {
            const trackData = tracks[trackFolder.track_id];
            return {
                trackId: trackFolder.track_id,
                trackName: trackData?.pretty_name || trackFolder.track_name,
                country: trackData?.country,
                setups: trackFolder.setups,
            };
        });

    const handleSetupClick = (trackId: string, setup: SetupInfo) => {
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
                title={
                    <>
                        {carData?.full_name}
                        <span className="opacity-50 font-normal pl-2">
                            ({carData?.year})
                        </span>
                    </>
                }
                subtitles={[
                    {
                        title: carData?.brand_name,
                        icon: <CarBrandIcon name={carData?.brand_name} />,
                    },
                ]}
                corner={
                    <span className="text-sm opacity-50">
                        {carData?.car_type.toUpperCase()}
                    </span>
                }
            />
            <div className="p-4 grid grid-cols-2 gap-x-4 gap-y-6">
                {trackGroups.map((group) => (
                    <SetupGroup
                        key={group.trackId}
                        title={group.trackName}
                        icon={
                            <span>{getCountryFlag(group.country || "")}</span>
                        }
                        setups={group.setups}
                        onSetupClick={(setup) =>
                            handleSetupClick(group.trackId, setup)
                        }
                    />
                ))}
                {trackGroups.length === 0 && (
                    <EmptyState message="No setups found for this car" />
                )}
            </div>
        </div>
    );
}
