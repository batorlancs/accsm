import { Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CarBrandIcon } from "@/components/ui/car-brand-icon";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRefreshFolderStructure, useRenameSetup } from "@/hooks/useBackend";
import { getCountryFlag } from "@/lib/countryFlags";
import type { SetupModalData } from "./useGlobalModals";

interface RenameSetupModalProps {
    isOpen: boolean;
    data: SetupModalData | null;
    onClose: () => void;
}

export function RenameSetupModal({
    isOpen,
    data,
    onClose,
}: RenameSetupModalProps) {
    const [newName, setNewName] = useState("");
    const [isRenaming, setIsRenaming] = useState(false);

    const renameSetup = useRenameSetup();
    const refreshMutation = useRefreshFolderStructure();

    const handleRefresh = async () => {
        await refreshMutation.mutateAsync({ silent: true });
    };

    // Initialize newName when modal opens or data changes
    useEffect(() => {
        if (isOpen && data) {
            const fileNameWithoutExtension = data.filename.replace(
                /\.[^/.]+$/,
                "",
            );
            setNewName(fileNameWithoutExtension);
        }
    }, [isOpen, data]);

    if (!data) return null;

    const { car, track, filename, carData, trackData } = data;
    const fileNameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
    const fileExtension = filename.split(".").pop() || "json";

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setNewName("");
            onClose();
        }
    };

    const isNameChanged = newName !== fileNameWithoutExtension;
    const isValidName = newName.trim().length > 0;

    const handleConfirm = async () => {
        if (!isNameChanged || !isValidName) return;

        const newFilename = `${newName.trim()}.${fileExtension}`;

        setIsRenaming(true);
        try {
            await renameSetup.mutateAsync({
                car,
                track,
                oldFilename: filename,
                newFilename: newFilename,
                customToastMessage: `Setup renamed from "${fileNameWithoutExtension}" to "${newName.trim()}"`,
            });

            await handleRefresh();
            data.onAfterRename?.(newFilename);
            onClose();
        } catch (error) {
            // Error is already shown by the hook
        } finally {
            setIsRenaming(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Rename Setup
                    </DialogTitle>
                    <DialogDescription>
                        Enter a new name for this setup.
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full overflow-hidden flex items-center gap-3 bg-muted/50 rounded-lg border border-dashed border-border/50">
                    <div className="bg-foreground/2 flex flex-col items-center justify-center p-2 gap-1 size-16 h-full w-20 shrink-0">
                        <Wrench className="text-muted-foreground size-4" />
                        <p className="text-xs text-muted-foreground font-bold opacity-50">
                            SETUP
                        </p>
                    </div>
                    <div className="flex-1 py-2 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                            {fileNameWithoutExtension}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 opacity-40 min-w-0">
                            <span className="text-sm shrink-0 w-4 flex items-center justify-center">
                                {getCountryFlag(trackData?.country || "")}
                            </span>
                            <span className="text-xs truncate">
                                {trackData.pretty_name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 opacity-40 min-w-0">
                            <span className="text-sm shrink-0 w-4 flex items-center justify-center">
                                <CarBrandIcon name={carData.brand_name || ""} />
                            </span>
                            <span className="text-xs truncate">
                                {carData.pretty_name}
                            </span>
                        </div>
                    </div>
                </div>
                {/** biome-ignore lint/correctness/useUniqueElementIds: off */}
                <Input
                    id="setup-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Enter setup name"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && isNameChanged && isValidName) {
                            handleConfirm();
                        }
                    }}
                />

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => handleOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={!isNameChanged || !isValidName || isRenaming}
                    >
                        {isRenaming ? "Renaming..." : "Rename"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
