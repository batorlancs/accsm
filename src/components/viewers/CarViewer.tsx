import { useState, useEffect } from "react";
import { SetupViewer } from "@/components/SetupViewer";
import { useCars, useFolderStructure, useTracks } from "@/hooks/useBackend";
import { getBrandSvg } from "@/lib/brandSvgs";
import { getCountryFlag } from "@/lib/countryFlags";
import type { SetupInfo } from "@/types/backend";
import { GroupHeader } from "./shared/GroupHeader";
import { SetupList } from "./shared/SetupList";
import { ViewerContainer } from "./shared/ViewerContainer";

interface CarViewerProps {
    carId: string;
}

export function CarViewer({ carId }: CarViewerProps) {
    const [selectedSetup, setSelectedSetup] = useState<{
        car: string;
        track: string;
        filename: string;
    } | null>(null);

    const { data: folderStructure, isLoading } = useFolderStructure();
    const { data: cars } = useCars();
    const { data: tracks } = useTracks();

    // Reset selected setup when car changes
    useEffect(() => {
        setSelectedSetup(null);
    }, [carId]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!folderStructure || !cars || !tracks) {
        return <div>No data available</div>;
    }

    const carData = cars[carId];
    const carName = carData?.pretty_name || carId;

    // Find the car folder
    const carFolder = folderStructure.cars.find((c) => c.car_id === carId);

    if (!carFolder) {
        return (
            <ViewerContainer title={`Car: ${carName}`}>
                <div className="p-4 text-center text-gray-500">
                    No setups found for this car
                </div>
            </ViewerContainer>
        );
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
        setSelectedSetup({
            car: carId,
            track: trackId,
            filename: setup.filename,
        });
    };

    const handleBack = () => {
        setSelectedSetup(null);
    };

    if (selectedSetup) {
        return (
            <SetupViewer
                car={selectedSetup.car}
                track={selectedSetup.track}
                filename={selectedSetup.filename}
                onClose={handleBack}
            />
        );
    }

    return (
        <ViewerContainer
            title={carName}
            subtitle={carData?.brand_name}
            icon={(() => {
                const brandSvg = getBrandSvg(carData?.brand_name || "");
                return brandSvg ? (
                    <img
                        src={brandSvg}
                        alt={`${carData?.brand_name} logo`}
                        className="h-4 w-4 object-contain"
                    />
                ) : null;
            })()}
        >
            <div className="space-y-4 mt-6">
                {trackGroups.map((group) => (
                    <div
                        key={group.trackId}
                        className="border border-border/50 rounded-md overflow-hidden"
                    >
                        <GroupHeader
                            title={group.trackName}
                            icon={
                                <span className="">
                                    {getCountryFlag(group.country || "")}
                                </span>
                            }
                        />
                        <SetupList
                            setups={group.setups}
                            onSetupClick={(setup) =>
                                handleSetupClick(group.trackId, setup)
                            }
                        />
                    </div>
                ))}
                {trackGroups.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No setups found for this car
                    </div>
                )}
            </div>
        </ViewerContainer>
    );
}
