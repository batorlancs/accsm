import {
    FolderContent,
    FolderItem,
} from "@/components/animate-ui/components/radix/files";
import {
    FolderHeader as FolderHeaderPrimitive,
    FolderTrigger as FolderTriggerPrimitive,
    FolderIcon as FolderIconPrimitive,
    FileLabel as FileLabelPrimitive,
    Folder as FolderPrimitive,
} from "@/components/animate-ui/primitives/radix/files";
import type { CarFolder, TrackFolder } from "@/types/backend";
import { SetupNode } from "./SetupNode";
import { getCountryFlag } from "@/lib/countryFlags";

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
            <FolderHeaderPrimitive>
                <FolderTriggerPrimitive className="w-full text-start">
                    <div className="opacity-60 hover:opacity-80 transition-opacity duration-75">
                        <FolderPrimitive className="flex items-center justify-between gap-2 p-1 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <FolderIconPrimitive
                                    closeIcon={
                                        track.country ? (
                                            <span className="text-sm">{getCountryFlag(track.country)}</span>
                                        ) : (
                                            <div className="size-4" />
                                        )
                                    }
                                    openIcon={
                                        track.country ? (
                                            <span className="text-sm">{getCountryFlag(track.country)}</span>
                                        ) : (
                                            <div className="size-4" />
                                        )
                                    }
                                />
                                <FileLabelPrimitive className="text-sm">
                                    {track.track_name}
                                </FileLabelPrimitive>
                            </div>
                            <span className="text-xs text-muted-foreground pl-2">
                                ({track.setups.length})
                            </span>
                        </FolderPrimitive>
                    </div>
                </FolderTriggerPrimitive>
            </FolderHeaderPrimitive>

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