import { FileText, RefreshCw, Settings } from "lucide-react";
import {
    FileItem,
    Files,
    FolderContent,
    FolderItem,
    FolderTrigger,
    SubFiles,
} from "@/components/animate-ui/components/radix/files";
import { Button } from "@/components/ui/button";
import {
    useFolderStructure,
    useRefreshFolderStructure,
    useSetupsPath,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { CarFolder, SetupInfo, TrackFolder } from "@/types/backend";

interface SetupExplorerProps {
    selectedSetup: {
        car: string;
        track: string;
        filename: string;
    } | null;
    onSelectSetup: (car: string, track: string, filename: string) => void;
    onChangePathClick: () => void;
}

export function SetupExplorer({
    selectedSetup,
    onSelectSetup,
    onChangePathClick,
}: SetupExplorerProps) {
    const { data: folderStructure, isLoading, error } = useFolderStructure();
    const { data: setupsPath } = useSetupsPath();
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
        <div className="h-full">
            <div>
                <div className="flex items-center justify-between">
                    <h2 className="text-lg">Setup Explorer</h2>
                    <div className="flex gap-1">
                        <Button
                            onClick={handleRefresh}
                            variant="ghost"
                            size="sm"
                            disabled={refreshMutation.isPending}
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${refreshMutation.isPending ? "animate-spin" : ""}`}
                            />
                        </Button>
                        <Button
                            onClick={onChangePathClick}
                            variant="ghost"
                            size="sm"
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Current path */}
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    <div className="font-medium mb-1">Current Path:</div>
                    <div className="break-all">
                        {setupsPath || "Loading..."}
                    </div>
                </div>

                {/* Stats */}
                {folderStructure && (
                    <div className="text-xs text-muted-foreground">
                        {folderStructure.total_setups} setups across{" "}
                        {folderStructure.cars.length} cars
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
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
                                selectedSetup={selectedSetup}
                                onSelectSetup={onSelectSetup}
                                isSetupSelected={isSetupSelected}
                            />
                        ))}
                    </Files>
                )}
            </div>
        </div>
    );
}

interface CarNodeProps {
    car: CarFolder;
    selectedSetup: SetupExplorerProps["selectedSetup"];
    onSelectSetup: SetupExplorerProps["onSelectSetup"];
    isSetupSelected: (car: string, track: string, filename: string) => boolean;
}

function CarNode({
    car,
    selectedSetup,
    onSelectSetup,
    isSetupSelected,
}: CarNodeProps) {
    return (
        <FolderItem value={car.car_id}>
            <FolderTrigger className="w-full flex items-center justify-between">
                <span className="tex-xs truncate">{car.car_name}</span>
                <span className="text-xs text-muted-foreground pl-2">
                    (
                    {car.tracks.reduce(
                        (acc, track) => acc + track.setups.length,
                        0,
                    )}
                    )
                </span>
            </FolderTrigger>

            <FolderContent>
                <SubFiles>
                    {car.tracks.map((track) => (
                        <TrackNode
                            key={track.track_id}
                            car={car}
                            track={track}
                            selectedSetup={selectedSetup}
                            onSelectSetup={onSelectSetup}
                            isSetupSelected={isSetupSelected}
                        />
                    ))}
                </SubFiles>
            </FolderContent>
        </FolderItem>
    );
}

interface TrackNodeProps {
    car: CarFolder;
    track: TrackFolder;
    selectedSetup: SetupExplorerProps["selectedSetup"];
    onSelectSetup: SetupExplorerProps["onSelectSetup"];
    isSetupSelected: (car: string, track: string, filename: string) => boolean;
}

function TrackNode({
    car,
    track,
    selectedSetup,
    onSelectSetup,
    isSetupSelected,
}: TrackNodeProps) {
    return (
        <FolderItem value={track.track_id}>
            <FolderTrigger className="w-full flex items-center justify-between">
                <span className="truncate text-sm">{track.track_name}</span>
                <span className="text-xs text-muted-foreground pl-2">
                    ({track.setups.length})
                </span>
            </FolderTrigger>

            <FolderContent>
                <SubFiles>
                    {track.setups.map((setup) => (
                        <SetupNode
                            key={setup.filename}
                            car={car}
                            track={track}
                            setup={setup}
                            isSelected={isSetupSelected(
                                car.car_id,
                                track.track_id,
                                setup.filename,
                            )}
                            onSelect={() =>
                                onSelectSetup(
                                    car.car_id,
                                    track.track_id,
                                    setup.filename,
                                )
                            }
                        />
                    ))}
                </SubFiles>
            </FolderContent>
        </FolderItem>
    );
}

interface SetupNodeProps {
    car: CarFolder;
    track: TrackFolder;
    setup: SetupInfo;
    isSelected: boolean;
    onSelect: () => void;
}

function SetupNode({ setup, isSelected, onSelect }: SetupNodeProps) {
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: off
        // biome-ignore lint/a11y/useKeyWithClickEvents: off
        <div
            className={cn(
                isSelected ? "bg-foreground/10" : "",
                "cusror-pointer rounded",
            )}
            onClick={onSelect}
        >
            <FileItem icon={FileText} onClick={onSelect}>
                {setup.display_name}{" "}
                <span className="opacity-50 pl-2 text-xs capitalize font-mono">
                    {setup.setup_type}
                </span>
            </FileItem>
        </div>
    );
}
