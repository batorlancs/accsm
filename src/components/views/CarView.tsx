import { Car } from "lucide-react";

// Mock data for cars - replace with actual data from backend
const cars = [
    {
        id: "porsche_991ii_gt3_r",
        name: "Porsche 911 GT3 R",
        manufacturer: "Porsche",
        year: 2019,
        category: "GT3",
        drivetrain: "RWD",
        engine: "Naturally Aspirated",
    },
    {
        id: "ferrari_488_gt3_evo",
        name: "Ferrari 488 GT3 Evo",
        manufacturer: "Ferrari", 
        year: 2020,
        category: "GT3",
        drivetrain: "RWD",
        engine: "Twin Turbo",
    },
    {
        id: "mercedes_amg_gt3",
        name: "Mercedes-AMG GT3",
        manufacturer: "Mercedes-AMG",
        year: 2020,
        category: "GT3", 
        drivetrain: "RWD",
        engine: "Twin Turbo",
    },
    {
        id: "audi_r8_lms_evo",
        name: "Audi R8 LMS Evo",
        manufacturer: "Audi",
        year: 2019,
        category: "GT3",
        drivetrain: "RWD", 
        engine: "Naturally Aspirated",
    },
    {
        id: "bmw_m6_gt3",
        name: "BMW M6 GT3",
        manufacturer: "BMW",
        year: 2017,
        category: "GT3",
        drivetrain: "RWD",
        engine: "Twin Turbo",
    },
    {
        id: "lamborghini_huracan_gt3_evo",
        name: "Lamborghini Huracán GT3 Evo",
        manufacturer: "Lamborghini",
        year: 2019,
        category: "GT3",
        drivetrain: "RWD",
        engine: "Naturally Aspirated",
    }
];

export function CarView() {
    return (
        <div className="h-full">
            <div className="mb-4">
                <h2 className="text-lg font-medium">Cars</h2>
                <p className="text-sm text-muted-foreground">
                    Browse available cars
                </p>
            </div>

            <div className="space-y-2">
                {cars.map((car) => (
                    <div
                        key={car.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <Car className="h-4 w-4 text-muted-foreground shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">{car.name}</h3>
                                <span className="text-xs text-muted-foreground">
                                    {car.year}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{car.manufacturer}</span>
                                <span>{car.category}</span>
                                <span>{car.drivetrain}</span>
                                <span>{car.engine}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}