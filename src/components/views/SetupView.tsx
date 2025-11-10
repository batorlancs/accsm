import { RefreshCw } from "lucide-react";
import { Files } from "@/components/animate-ui/components/radix/files";
import { Button } from "@/components/ui/button";
import {
    useFolderStructure,
    useRefreshFolderStructure,
} from "@/hooks/useBackend";
import { CarNode } from "./setup-view/CarNode";

interface SetupViewProps {
    selectedSetup: {
        car: string;
        track: string;
        filename: string;
    } | null;
    onSelectSetup: (car: string, track: string, filename: string) => void;
    onChangePathClick?: () => void;
}

export function SetupView({ selectedSetup, onSelectSetup }: SetupViewProps) {
    const { data: folderStructure, isLoading, error } = useFolderStructure();
    const refreshMutation = useRefreshFolderStructure();

    const handleRefresh = () => {
        refreshMutation.mutate();
    };

    const isSetupSelected = (car: string, track: string, filename: string) => {
        return (
            selectedSetup?.car === car &&
            selectedSetup?.track === track &&
            selectedSetup?.filename === filename
        );
    };

    if (error) {
        return (
            <div className="h-full">
                <div>
                    <h2 className="text-red-500">Error</h2>
                </div>
                <div>
                    <p className="text-sm text-red-500 mb-4">
                        Failed to load folder structure
                    </p>
                    <Button onClick={handleRefresh} variant="outline" size="sm">
                        <RefreshCw />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col justify-between">
            <div className="flex-1 overflow-y-auto h-full">
                {isLoading ? (
                    <div className="p-4 text-center text-muted-foreground">
                        Loading folder structure...
                    </div>
                ) : folderStructure?.cars.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No cars found in the setups folder
                    </div>
                ) : (
                    <Files className="w-full">
                        {folderStructure?.cars.map((car) => (
                            <CarNode
                                key={car.car_id}
                                car={car}
                                onSelectSetup={onSelectSetup}
                                isSetupSelected={isSetupSelected}
                            />
                        ))}
                    </Files>
                )}
            </div>
            <div className="p-2 mt-5">
                {folderStructure && (
                    <div className="text-xs text-muted-foreground opacity-80">
                        {folderStructure.total_setups} setups across{" "}
                        {folderStructure.cars.length} cars and{" "}
                        {folderStructure.cars
                            .flatMap((car) => car.tracks.map((track) => track.track_id))
                            .filter((trackId, index, arr) => arr.indexOf(trackId) === index)
                            .length} tracks
                    </div>
                )}
            </div>
        </div>
    );
}
