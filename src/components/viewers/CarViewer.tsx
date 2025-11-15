import { Car } from "lucide-react";

interface CarViewerProps {
    carId: string | null;
}

export function CarViewer({ carId }: CarViewerProps) {
    if (!carId) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a car to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full p-6">
            <div className="text-center">
                <Car className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h2 className="text-2xl font-semibold mb-2">Car View</h2>
                <p className="text-muted-foreground mb-4">
                    Viewing car: <strong>{carId}</strong>
                </p>
                <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground">
                        Car viewer implementation coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
}