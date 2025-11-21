import { ChevronsDownUp, RefreshCw } from "lucide-react";
import { Files } from "@/components/animate-ui/components/radix/files";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
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
    openFolders?: string[];
    onOpenFoldersChange?: (openFolders: string[]) => void;
}

export function SetupView({
    selectedSetup,
    onSelectSetup,
    openFolders = [],
    onOpenFoldersChange,
}: SetupViewProps) {
    const { data: folderStructure, isLoading, error } = useFolderStructure();
    const refreshMutation = useRefreshFolderStructure();

    const handleRefresh = () => {
        refreshMutation.mutate();
    };

    const handleCollapseAll = () => {
        onOpenFoldersChange?.([]);
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
        <div className="w-full h-full flex flex-col justify-between overflow-x-hidden">
            <div className="flex-1 overflow-y-auto p-2 h-full pb-6">
                {isLoading ? (
                    <div className="p-4 text-center text-muted-foreground">
                        Loading folder structure...
                    </div>
                ) : folderStructure?.cars.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No cars found in the setups folder
                    </div>
                ) : (
                    <Files
                        className="w-full"
                        open={openFolders}
                        onOpenChange={onOpenFoldersChange}
                    >
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
            <div className="px-4 py-2 h-11 flex justify-between items-center border-t border-border/50">
                {folderStructure && (
                    <div className="text-xs text-muted-foreground opacity-80">
                        {folderStructure.total_setups} setups across{" "}
                        {folderStructure.cars.length} cars and{" "}
                        {
                            folderStructure.cars
                                .flatMap((car) =>
                                    car.tracks.map((track) => track.track_id),
                                )
                                .filter(
                                    (trackId, index, arr) =>
                                        arr.indexOf(trackId) === index,
                                ).length
                        }{" "}
                        tracks
                    </div>
                )}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={handleCollapseAll}
                                className="opacity-70 hover:opacity-100 transition duration-200"
                            >
                                <ChevronsDownUp />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Collapse all</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}
