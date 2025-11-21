import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { SetupContextMenu } from "@/components/common/SetupContextMenu";
import type { SetupInfo } from "@/types/backend";

interface SetupGroupProps {
    title: string;
    icon?: ReactNode;
    setups: SetupInfo[];
    onSetupClick: (setup: SetupInfo) => void;
    carName: string;
    trackName: string;
    onAfterDelete?: () => void;
    onAfterRename?: (newFilename: string) => void;
}

export function SetupGroup({
    title,
    icon,
    setups,
    onSetupClick,
    carName,
    trackName,
    onAfterDelete,
    onAfterRename,
}: SetupGroupProps) {
    return (
        <div className="bg-muted/50 border border-border/50 rounded">
            <div className="px-4 py-1 border-b border-b-border/50">
                <div className="flex items-center gap-2 text-sm py-1">
                    {icon}
                    <h3>
                        {title}
                        <span className="opacity-60 pl-1">
                            ({setups.length})
                        </span>
                    </h3>
                </div>
            </div>
            <div className="p-2">
                {setups.map((setup) => (
                    <SetupContextMenu
                        key={setup.filename}
                        carName={carName}
                        trackName={trackName}
                        setupName={setup.filename}
                        onAfterDelete={onAfterDelete}
                        onAfterRename={onAfterRename}
                    >
                        <button
                            type="button"
                            className="w-full justify-start text-sm h-auto text-left cursor-pointer opacity-60 hover:opacity-100 hover:translate-x-2 transition-all duration-200 ease-out flex items-center gap-2 group"
                            onClick={() => onSetupClick(setup)}
                        >
                            <ChevronRightIcon className="size-4 opacity-40 group-hover:opacity-100 transition-opacity duration-200" />
                            {setup.display_name}
                        </button>
                    </SetupContextMenu>
                ))}
            </div>
        </div>
    );
}
