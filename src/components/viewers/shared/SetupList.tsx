import type { SetupInfo } from "@/types/backend";

interface SetupListProps {
    setups: SetupInfo[];
    onSetupClick: (setup: SetupInfo) => void;
}

export function SetupList({ setups, onSetupClick }: SetupListProps) {
    return (
        <div className="">
            {setups.map((setup) => (
                <button
                    type="button"
                    key={setup.filename}
                    className="w-full justify-start text-sm h-auto py-1 px-2 text-left cursor-pointer opacity-60 hover:opacity-100 hover:bg-foreground/4"
                    onClick={() => onSetupClick(setup)}
                >
                    {setup.display_name}
                </button>
            ))}
        </div>
    );
}
