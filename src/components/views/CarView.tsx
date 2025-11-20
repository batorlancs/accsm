import { MapPin, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { IconNumber } from "@/components/shared";
import {
    SearchableDropdown,
    type SearchableDropdownOption,
} from "@/components/ui/searchable-dropdown";
import { useCars, useFolderStructure } from "@/hooks/useBackend";
import { store } from "@/lib/store-manager";
import { CarBrandIcon } from "../ui/car-brand-icon";

interface CarViewProps {
    selectedCar: string | null;
    onSelectCar: (carId: string) => void;
}

export function CarView({ selectedCar, onSelectCar }: CarViewProps) {
    const { data: folderStructure, isLoading: folderLoading } =
        useFolderStructure();
    const { data: carsData, isLoading: carsLoading } = useCars();

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    // Load persisted values
    useEffect(() => {
        const loadPersistedValues = async () => {
            const storedCategory = await store.get("carFilterCategory");
            const storedSearch = await store.get("carSearchQuery");

            if (storedCategory) {
                setSelectedCategory(storedCategory);
            }
            if (storedSearch) {
                setSearchQuery(storedSearch);
            }
        };
        loadPersistedValues();
    }, []);

    const isLoading = folderLoading || carsLoading;

    // Get all available cars from folder structure
    const availableCars = folderStructure?.cars || [];

    // Define category options with counts
    const categoryOptions: SearchableDropdownOption[] = useMemo(() => {
        const categories = [
            { value: "all", label: "All" },
            { value: "gt2", label: "GT2" },
            { value: "gt3", label: "GT3" },
            { value: "gt4", label: "GT4" },
            { value: "cup", label: "CUP" },
            { value: "st", label: "ST" },
            { value: "chl", label: "CHL" },
            { value: "tcx", label: "TCX" },
        ];

        return categories.map((category) => {
            if (category.value === "all") {
                return {
                    ...category,
                    count: availableCars.length,
                };
            }

            const count = availableCars.filter((car) => {
                const carInfo = carsData?.[car.car_id];
                return carInfo?.car_type === category.value;
            }).length;

            return {
                ...category,
                count,
            };
        });
    }, [availableCars, carsData]);

    // Filter and search cars
    const filteredCars = useMemo(() => {
        let filtered = availableCars;

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter((car) => {
                const carInfo = carsData?.[car.car_id];
                return carInfo?.car_type === selectedCategory;
            });
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((car) => {
                const carInfo = carsData?.[car.car_id];
                const searchableText =
                    `${carInfo?.pretty_name || car.car_name} ${carInfo?.brand_name || ""} ${carInfo?.full_name || ""} ${carInfo?.car_type || ""}`.toLowerCase();
                return searchableText.includes(query);
            });
        }

        return filtered;
    }, [availableCars, carsData, selectedCategory, searchQuery]);

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

    // Auto-select first car when available (from filtered cars)
    useEffect(() => {
        if (!selectedCar && filteredCars.length > 0 && !isLoading) {
            onSelectCar(filteredCars[0].car_id);
        }
    }, [filteredCars, selectedCar, onSelectCar, isLoading]);

    // Handle search input changes
    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        store.set("carSearchQuery", value);
    };

    // Handle category selection
    const handleCategorySelect = (option: SearchableDropdownOption) => {
        setSelectedCategory(option.value);
        store.set("carFilterCategory", option.value);
    };

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
        <div className="h-full flex flex-col">
            {/* Search and Filter Controls */}
            <div className="p-2">
                <SearchableDropdown
                    options={categoryOptions}
                    defaultOptionValue={selectedCategory}
                    placeholder="Search..."
                    dropdownLabel="Category"
                    className="opacity-80 hover:opacity-100 transition-opacity duration-200"
                    defaultValue={searchQuery}
                    onChange={handleSearchChange}
                    onSelect={handleCategorySelect}
                    showSearchIcon
                />
            </div>

            <div className="flex-1 overflow-y-auto p-2 pt-0">
                <div className="space-y-1">
                    {filteredCars.map((car) => {
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
                                <CarBrandIcon
                                    name={carInfo?.brand_name || ""}
                                />

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm truncate">
                                        {carInfo?.pretty_name || car.car_name}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-2 opacity-60">
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

                    {filteredCars.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground text-xs">
                            {searchQuery || selectedCategory !== "all"
                                ? "No cars match your search criteria"
                                : "No cars found"}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats Footer */}
            <div className="p-4">
                {folderStructure && (
                    <div className="text-xs text-muted-foreground opacity-80">
                        {searchQuery || selectedCategory !== "all" ? (
                            <>
                                Showing {filteredCars.length} of{" "}
                                {availableCars.length} cars
                                {selectedCategory !== "all" &&
                                    ` (${selectedCategory.toUpperCase()})`}
                            </>
                        ) : (
                            <>
                                {folderStructure.total_setups} setups overall
                                covering {uniqueTrackCount} tracks
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
