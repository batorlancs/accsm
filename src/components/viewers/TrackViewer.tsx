import { Car } from "lucide-react";
import { SetupViewer } from "@/components/SetupViewer";
import { useCars, useFolderStructure, useTracks } from "@/hooks/useBackend";
import { getBrandSvg } from "@/lib/brandSvgs";
import { getCountryFlag } from "@/lib/countryFlags";
import type { SetupInfo } from "@/types/backend";
import { ViewerHeader } from "./shared/ViewerHeader";
import { SetupGroup } from "./shared/SetupGroup";
import { EmptyState } from "./shared/EmptyState";
import { useSetupSelection } from "./shared/useSetupSelection";

interface TrackViewerProps {
    trackId: string;
}

export function TrackViewer({ trackId }: TrackViewerProps) {
    const { selectedSetup, selectSetup, clearSelection } = useSetupSelection(trackId);
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
    const trackName = trackData?.pretty_name || trackId;

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
                title={trackName}
                subtitle={trackData?.country}
                icon={<span>{getCountryFlag(trackData?.country || "")}</span>}
            />
            <div className="p-4 space-y-4">
                {carGroups.map((group) => {
                    const brandSvg = getBrandSvg(group.brandName);
                    return (
                        <SetupGroup
                            key={group.carId}
                            title={group.carName}
                            icon={
                                brandSvg ? (
                                    <img
                                        src={brandSvg}
                                        alt={`${group.brandName} logo`}
                                        className="size-4 object-contain"
                                    />
                                ) : (
                                    <Car className="size-4" />
                                )
                            }
                            setups={group.setups}
                            onSetupClick={(setup) => handleSetupClick(group.carId, setup)}
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

