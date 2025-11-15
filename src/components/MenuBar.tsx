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
        refreshMutation.mutate();
    };

    return (
        <div className="flex items-center justify-end h-[53px] px-2 py-2 border-b border-border/50 bg-muted/20 gap-2">
            <Button variant="default" size="sm" onClick={onAddClick}>
                <Plus />
                Add
            </Button>
            <Button
                variant="outline"
                size="icon-sm"
                onClick={handleRefresh}
                disabled={refreshMutation.isPending}
            >
                <RefreshCw />
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon-sm">
                        <Settings2 />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onSettingsClick}>
                        Change Setup Folder Path
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
