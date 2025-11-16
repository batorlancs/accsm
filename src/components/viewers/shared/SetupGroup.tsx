import type { ReactNode } from "react";
import type { SetupInfo } from "@/types/backend";
import { GroupHeader } from "./GroupHeader";
import { SetupList } from "./SetupList";

interface SetupGroupProps {
    title: string;
    icon?: ReactNode;
    setups: SetupInfo[];
    onSetupClick: (setup: SetupInfo) => void;
}

export function SetupGroup({ title, icon, setups, onSetupClick }: SetupGroupProps) {
    return (
        <div className="border border-border/50 rounded-md overflow-hidden">
            <GroupHeader title={title} icon={icon} />
            <SetupList setups={setups} onSetupClick={onSetupClick} />
        </div>
    );
}