import { Car, Wrench, MapPin } from "lucide-react";
import { useEffect } from "react";
import { useCars, useFolderStructure } from "@/hooks/useBackend";
import { getBrandSvg } from "@/lib/brandSvgs";
import { IconNumber } from "@/components/shared";

interface CarViewProps {
    selectedCar: string | null;
    onSelectCar: (carId: string) => void;
}

export function CarView({ selectedCar, onSelectCar }: CarViewProps) {
    const { data: folderStructure, isLoading: folderLoading } =
        useFolderStructure();
    const { data: carsData, isLoading: carsLoading } = useCars();

    const isLoading = folderLoading || carsLoading;

    // Get all available cars from folder structure
    const availableCars = folderStructure?.cars || [];

    // Calculate setup count for a specific car
    const getSetupCountForCar = (carId: string) => {
        const car = availableCars.find((c) => c.car_id === carId);
        return (
            car?.tracks.reduce(
                (total, track) => total + track.setups.length,
                0,
            ) || 0
        );
    };

    // Calculate track count for a specific car
    const getTrackCountForCar = (carId: string) => {
        const car = availableCars.find((c) => c.car_id === carId);
        return car?.tracks.length || 0;
    };

    // Get unique track count
    const uniqueTrackCount =
        folderStructure?.cars
            .flatMap((car) => car.tracks.map((track) => track.track_id))
            .filter((trackId, index, arr) => arr.indexOf(trackId) === index)
            .length || 0;

    // Auto-select first car when available
    useEffect(() => {
        if (!selectedCar && availableCars.length > 0 && !isLoading) {
            onSelectCar(availableCars[0].car_id);
        }
    }, [availableCars, selectedCar, onSelectCar, isLoading]);

    if (isLoading) {
        return (
            <div className="h-full">
                <div className="mb-4">
                    <h2 className="text-lg font-medium">Cars</h2>
                    <p className="text-sm text-muted-foreground">
                        Browse available cars
                    </p>
                </div>
                <div className="p-4 text-center text-muted-foreground">
                    Loading cars...
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-1">
                    {availableCars.map((car) => {
                        const carInfo = carsData?.[car.car_id];
                        const isSelected = selectedCar === car.car_id;

                        return (
                            // biome-ignore lint/a11y/noStaticElementInteractions: <off>
                            // biome-ignore lint/a11y/useKeyWithClickEvents: off
                            <div
                                key={car.car_id}
                                onClick={() => {
                                    if (!isSelected) {
                                        onSelectCar(car.car_id);
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
                                {(() => {
                                    const brandSvg = getBrandSvg(
                                        carInfo?.brand_name || "",
                                    );
                                    return brandSvg ? (
                                        <img
                                            src={brandSvg}
                                            alt={`${carInfo?.brand_name} logo`}
                                            className="h-4 w-4 shrink-0 object-contain"
                                        />
                                    ) : (
                                        <Car className="h-4 w-4 shrink-0" />
                                    );
                                })()}

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm truncate">
                                        {carInfo?.pretty_name || car.car_name}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2">
                                    <IconNumber 
                                        icon={Wrench} 
                                        number={getSetupCountForCar(car.car_id)} 
                                    />
                                    <IconNumber 
                                        icon={MapPin} 
                                        number={getTrackCountForCar(car.car_id)} 
                                    />
                                </div>
                            </div>
                        );
                    })}

                    {availableCars.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                            No cars found
                        </div>
                    )}
                </div>
            </div>
            <div className="p-2 mt-5">
                {folderStructure && (
                    <div className="text-xs text-muted-foreground opacity-80">
                        {folderStructure.total_setups} setups overall covering{" "}
                        {uniqueTrackCount} tracks
                    </div>
                )}
            </div>
        </div>
    );
}
