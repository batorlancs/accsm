import { WrenchIcon } from "lucide-react";
import { FileItem } from "@/components/animate-ui/components/radix/files";
import { SetupContextMenu } from "@/components/common/SetupContextMenu";
import { cn } from "@/lib/utils";
import type { CarFolder, SetupInfo, TrackFolder } from "@/types/backend";

interface SetupNodeProps {
    car: CarFolder;
    track: TrackFolder;
    setup: SetupInfo;
    isSelected: boolean;
    onSelect: () => void;
}

export function SetupNode({
    car,
    track,
    setup,
    isSelected,
    onSelect,
}: SetupNodeProps) {
    return (
        <SetupContextMenu
            carName={car.car_id}
            trackName={track.track_id}
            setupName={setup.filename}
        >
            {/* biome-ignore lint/a11y/noStaticElementInteractions: off */}
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: off */}
            <div
                className={cn(
                    isSelected ? "bg-foreground/5" : "",
                    "cursor-pointer rounded transition duration-75 pl-1",
                )}
                onClick={onSelect}
            >
                <FileItem
                    icon={WrenchIcon}
                    onClick={onSelect}
                    outerClassName={
                        isSelected
                            ? "opacity-80! hover:opacity-100!"
                            : "opacity-40! hover:opacity-60!"
                    }
                >
                    {setup.display_name}
                </FileItem>
            </div>
        </SetupContextMenu>
    );
}
