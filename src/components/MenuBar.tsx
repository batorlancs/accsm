import { Plus, RefreshCw, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRefreshFolderStructure } from "@/hooks/useBackend";

interface MenuBarProps {
    onSettingsClick: () => void;
    onAddClick: () => void;
}

export function MenuBar({ onSettingsClick, onAddClick }: MenuBarProps) {
    const refreshMutation = useRefreshFolderStructure();

    const handleRefresh = () => {
        refreshMutation.mutate({});
    };

    return (
        <div className="flex items-center justify-end h-[53px] px-4 py-2 border-b border-border/50 bg-muted/20 gap-2">
            <Button
                variant="default"
                size="sm"
                className="h-7 mt-px"
                onClick={onAddClick}
            >
                <Plus />
                Add Setup
            </Button>
            <Button
                variant="outline"
                size="icon-sm"
                className="size-7"
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
            >
                <RefreshCw />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-sm" className="size-7">
                        <Settings2 />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="mt-4">
                    <DropdownMenuItem onClick={onSettingsClick}>
                        Change Setup Folder Path
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
