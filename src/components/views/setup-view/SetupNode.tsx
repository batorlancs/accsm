import { WrenchIcon } from "lucide-react";
import { FileItem } from "@/components/animate-ui/components/radix/files";
import { cn } from "@/lib/utils";
import type { CarFolder, SetupInfo, TrackFolder } from "@/types/backend";

interface SetupNodeProps {
    car: CarFolder;
    track: TrackFolder;
    setup: SetupInfo;
    isSelected: boolean;
    onSelect: () => void;
}

export function SetupNode({ setup, isSelected, onSelect }: SetupNodeProps) {
    return (
        // biome-ignore lint/a11y/noStaticElementInteractions: off
        // biome-ignore lint/a11y/useKeyWithClickEvents: off
        <div
            className={cn(
                isSelected ? "bg-foreground/5" : "",
                "cursor-pointer rounded transition duration-75",
            )}
            onClick={onSelect}
        >
            <FileItem
                icon={WrenchIcon}
                onClick={onSelect}
                outerClassName={
                    isSelected ? "opacity-100! hover:opacity-100!" : ""
                }
            >
                {setup.display_name}
            </FileItem>
        </div>
    );
}
