import { Car, CarFront, FileText, Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCars, useSetup, useTracks } from "@/hooks/useBackend";
import { getBrandSvg } from "@/lib/brandSvgs";
import { getCountryFlag } from "@/lib/countryFlags";

interface SetupViewerProps {
    car: string;
    track: string;
    filename: string;
    onDelete?: () => void;
    onClose?: () => void;
}

export function SetupViewer({
    car,
    track,
    filename,
    onClose,
}: SetupViewerProps) {
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
        return null;
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
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-8 bg-muted rounded">
                            <Wrench className="text-muted-foreground" />
                        </div>
                        <div className="">
                            <h2 className="text-md font-medium">{filename}</h2>

                            <div className="flex items-center gap-2 mt-2 opacity-60">
                                <span className="text-sm shrink-0 w-4 flex items-center justify-center">
                                    {getCountryFlag(trackData?.country || "")}
                                </span>
                                <span className="text-xs">
                                    {trackData.pretty_name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 opacity-60">
                                <span className="text-sm shrink-0 w-4 flex items-center justify-center">
                                    {" "}
                                    {(() => {
                                        const brandSvg = getBrandSvg(
                                            carData?.brand_name || "",
                                        );
                                        return brandSvg ? (
                                            <img
                                                src={brandSvg}
                                                alt={`${carData?.brand_name} logo`}
                                                className="size-4 shrink-0 object-contain"
                                            />
                                        ) : (
                                            <CarFront className="size-4 shrink-0" />
                                        );
                                    })()}
                                </span>
                                <span className="text-xs">
                                    {carData.pretty_name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
