import {
    FolderContent,
    FolderItem,
    FolderTrigger,
} from "@/components/animate-ui/components/radix/files";
import type { CarFolder, TrackFolder } from "@/types/backend";
import { SetupNode } from "./SetupNode";

interface TrackNodeProps {
    car: CarFolder;
    track: TrackFolder;
    onSelectSetup: (car: string, track: string, filename: string) => void;
    isSetupSelected: (car: string, track: string, filename: string) => boolean;
}

export function TrackNode({
    car,
    track,
    onSelectSetup,
    isSetupSelected,
}: TrackNodeProps) {
    return (
        <FolderItem value={`${car.car_id}/${track.track_id}`}>
            <FolderTrigger className="w-full flex items-center justify-between">
                <span className="truncate text-sm">{track.track_name}</span>
                <span className="text-xs text-muted-foreground pl-2">
                    ({track.setups.length})
                </span>
            </FolderTrigger>

            <FolderContent>
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
            </FolderContent>
        </FolderItem>
    );
}