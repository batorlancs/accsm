import { RefreshCw, Settings2, Plus } from "lucide-react";
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
        <div className="flex items-center justify-between px-4 py-1 border-b border-border/50 bg-muted/20">
            <h1 className="text-lg font-mono font-semibold text-foreground">
                ACCSM
            </h1>

            <div className="flex items-center gap-2">
                <Button
                    variant="default"
                    size="sm"
                    onClick={onAddClick}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add
                </Button>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshMutation.isPending}
                    className="gap-2"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${refreshMutation.isPending ? "animate-spin" : ""}`}
                    />
                    Refresh
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Settings2 className="h-4 w-4" />
                            Settings
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onSettingsClick}>
                            Change Setup Folder Path
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

