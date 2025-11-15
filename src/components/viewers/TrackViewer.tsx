import { Car } from "lucide-react";
import { useState } from "react";
import { SetupViewer } from "@/components/SetupViewer";
import { useCars, useFolderStructure, useTracks } from "@/hooks/useBackend";
import { getBrandSvg } from "@/lib/brandSvgs";
import { getCountryFlag } from "@/lib/countryFlags";
import type { SetupInfo } from "@/types/backend";
import { GroupHeader } from "./shared/GroupHeader";
import { SetupList } from "./shared/SetupList";
import { ViewerContainer } from "./shared/ViewerContainer";

interface TrackViewerProps {
    trackId: string;
}

export function TrackViewer({ trackId }: TrackViewerProps) {
    const [selectedSetup, setSelectedSetup] = useState<{
        car: string;
        track: string;
        filename: string;
    } | null>(null);

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
            <ViewerContainer title="Setup Details" onBack={handleBack}>
                <SetupViewer
                    car={selectedSetup.car}
                    track={selectedSetup.track}
                    filename={selectedSetup.filename}
                />
            </ViewerContainer>
        );
    }

    return (
        <ViewerContainer
            title={trackName}
            subtitle={trackData?.country}
            icon={<span>{getCountryFlag(trackData?.country || "")}</span>}
        >
            <div className="space-y-4 mt-6">
                {carGroups.map((group) => {
                    const brandSvg = getBrandSvg(group.brandName);
                    return (
                        <div
                            key={group.carId}
                            className="border border-border/50 rounded-md overflow-hidden"
                        >
                            <GroupHeader
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
                            />
                            <SetupList
                                setups={group.setups}
                                onSetupClick={(setup) =>
                                    handleSetupClick(group.carId, setup)
                                }
                            />
                        </div>
                    );
                })}
                {carGroups.length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        No setups found for this track
                    </div>
                )}
            </div>
        </ViewerContainer>
    );
}

