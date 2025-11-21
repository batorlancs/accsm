import { ChevronRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { SetupInfo } from "@/types/backend";
import { SetupContextMenu } from "@/components/common/SetupContextMenu";

interface SetupGroupProps {
    title: string;
    icon?: ReactNode;
    setups: SetupInfo[];
    onSetupClick: (setup: SetupInfo) => void;
    carName: string;
    trackName: string;
}

export function SetupGroup({
    title,
    icon,
    setups,
    onSetupClick,
    carName,
    trackName,
}: SetupGroupProps) {
    return (
        <div>
            <div className="px-2">
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
            <div className="ml-4">
                {setups.map((setup) => (
                    <SetupContextMenu
                        key={setup.filename}
                        carName={carName}
                        trackName={trackName}
                        setupName={setup.filename}
                    >
                        <button
                            type="button"
                            className="w-full justify-start text-sm h-auto px-2 text-left cursor-pointer opacity-60 hover:opacity-100 hover:translate-x-2 transition-all duration-200 ease-out flex items-center gap-2 group"
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
