import { Edit, Trash2 } from "lucide-react";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useSetupModals } from "../modals";

interface SetupContextMenuProps {
    children: React.ReactNode;
    carName: string;
    trackName: string;
    setupName: string;
}

export function SetupContextMenu({
    children,
    carName,
    trackName,
    setupName,
}: SetupContextMenuProps) {
    const { openRenameSetup, openDeleteSetup } = useSetupModals();

    const handleRename = () => {
        openRenameSetup(carName, trackName, setupName);
    };

    const handleDelete = () => {
        openDeleteSetup(carName, trackName, setupName);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>{children}</ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    onClick={handleRename}
                    className="cursor-pointer text-xs!"
                >
                    <Edit className="" />
                    Rename
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-xs! text-destructive focus:text-destructive hover:bg-destructive/15!"
                >
                    <Trash2 className="text-destructive" />
                    Delete
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
