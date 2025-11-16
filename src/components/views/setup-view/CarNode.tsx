import { FolderIcon, FolderOpenIcon } from "lucide-react";
import {
    FolderContent,
    FolderItem,
} from "@/components/animate-ui/components/radix/files";
import {
    FileLabel as FileLabelPrimitive,
    FolderHeader as FolderHeaderPrimitive,
    FolderIcon as FolderIconPrimitive,
    Folder as FolderPrimitive,
    FolderTrigger as FolderTriggerPrimitive,
} from "@/components/animate-ui/primitives/radix/files";
import type { CarFolder } from "@/types/backend";
import { TrackNode } from "./TrackNode";

interface CarNodeProps {
    car: CarFolder;
    onSelectSetup: (car: string, track: string, filename: string) => void;
    isSetupSelected: (car: string, track: string, filename: string) => boolean;
}

export function CarNode({ car, onSelectSetup, isSetupSelected }: CarNodeProps) {
    return (
        <FolderItem value={car.car_id}>
            <FolderHeaderPrimitive>
                <FolderTriggerPrimitive className="w-full text-start">
                    <div className="opacity-60 hover:opacity-80 transition-opacity duration-75">
                        <FolderPrimitive className="flex items-center justify-between gap-2 p-1 pointer-events-none">
                            <div className="flex items-center gap-2">
                                <FolderIconPrimitive
                                    closeIcon={
                                        <FolderIcon className="size-4 opacity-60" />
                                    }
                                    openIcon={
                                        <FolderOpenIcon className="size-4 opacity-60" />
                                    }
                                />
                                <FileLabelPrimitive className="text-sm">
                                    {car.car_name}
                                </FileLabelPrimitive>
                            </div>
                            <span className="text-xs text-muted-foreground pl-2">
                                (
                                {car.tracks.reduce(
                                    (acc, track) => acc + track.setups.length,
                                    0,
                                )}
                                )
                            </span>
                        </FolderPrimitive>
                    </div>
                </FolderTriggerPrimitive>
            </FolderHeaderPrimitive>

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

