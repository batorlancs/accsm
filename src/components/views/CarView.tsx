import { Car } from "lucide-react";
import { useCars, useFolderStructure } from "@/hooks/useBackend";

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
        <div className="h-full">
            <div className="space-y-1">
                {availableCars.map((car) => {
                    const carInfo = carsData?.[car.car_id];
                    const isSelected = selectedCar === car.car_id;

                    return (
                        // biome-ignore lint/a11y/noStaticElementInteractions: <off>
                        // biome-ignore lint/a11y/useKeyWithClickEvents: off
                        <div
                            key={car.car_id}
                            onClick={() => onSelectCar(car.car_id)}
                            className={`
                                flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition-all
                                ${
                                    isSelected
                                        ? "bg-primary/10 hover:bg-primary/15 opacity-100 text-primary"
                                        : "opacity-60 hover:opacity-80"
                                }
                            `}
                        >
                            <Car className="h-4 w-4 shrink-0" />

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm truncate">
                                    {carInfo?.pretty_name || car.car_name}
                                </h3>
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
    );
}

