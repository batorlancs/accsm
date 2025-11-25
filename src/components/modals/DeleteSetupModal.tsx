import { Wrench } from "lucide-react";
import { toast } from "sonner";
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
import { useDeleteSetup, useRefreshFolderStructure } from "@/hooks/useBackend";
import { getCountryFlag } from "@/lib/countryFlags";
import type { SetupModalData } from "./useGlobalModals";

interface DeleteSetupModalProps {
    isOpen: boolean;
    data: SetupModalData | null;
    onClose: () => void;
}

export function DeleteSetupModal({
    isOpen,
    data,
    onClose,
}: DeleteSetupModalProps) {
    const deleteSetup = useDeleteSetup();
    const refreshMutation = useRefreshFolderStructure();

    async function handleRefresh() {
        await refreshMutation.mutateAsync({ silent: true });
    }

    if (!data) return null;

    const { car, track, filename, carData, trackData } = data;
    const fileNameWithoutExtension = filename.replace(/\.[^/.]+$/, "");

    const handleConfirm = async () => {
        try {
            await deleteSetup.mutateAsync({
                car,
                track,
                filename,
                silent: true,
            });
            toast.success(
                `Setup "${fileNameWithoutExtension}" has been deleted`,
            );
            await handleRefresh();
            data.onAfterDelete?.();
            onClose();
        } catch (error) {
            toast.error(`Failed to delete setup: ${error}`);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        Delete Setup
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this setup? This action
                        cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                <div className="w-full overflow-hidden flex items-center gap-3 bg-muted/50 rounded-lg border border-dashed border-border/50">
                    <div className="bg-foreground/2 flex flex-col items-center justify-center p-2 gap-1 size-16 h-full w-20">
                        <Wrench className="text-muted-foreground size-4" />
                        <p className="text-xs text-muted-foreground font-bold opacity-50">
                            SETUP
                        </p>
                    </div>
                    <div className="flex-1 py-2 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                            {fileNameWithoutExtension}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 opacity-40">
                            <span className="text-sm shrink-0 w-4 flex items-center justify-center">
                                {getCountryFlag(trackData?.country || "")}
                            </span>
                            <span className="text-xs">
                                {trackData.pretty_name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 opacity-40">
                            <span className="text-sm shrink-0 w-4 flex items-center justify-center">
                                <CarBrandIcon name={carData.brand_name || ""} />
                            </span>
                            <span className="text-xs">
                                {carData.pretty_name}
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={deleteSetup.isPending}
                    >
                        {deleteSetup.isPending ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
