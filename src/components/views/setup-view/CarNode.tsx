import {
    FolderContent,
    FolderItem,
    FolderTrigger,
} from "@/components/animate-ui/components/radix/files";
import type { CarFolder } from "@/types/backend";
import { TrackNode } from "./TrackNode";

interface CarNodeProps {
    car: CarFolder;
    onSelectSetup: (car: string, track: string, filename: string) => void;
    isSetupSelected: (car: string, track: string, filename: string) => boolean;
}

export function CarNode({
    car,
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
                {car.tracks.map((track) => (
                    <TrackNode
                        key={track.track_id}
                        car={car}
                        track={track}
                        onSelectSetup={onSelectSetup}
                        isSetupSelected={isSetupSelected}
                    />
                ))}
            </FolderContent>
        </FolderItem>
    );
}