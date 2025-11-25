import { Upload } from "lucide-react";
import type { DragState } from "@/hooks/useDragDrop";

interface GlobalDragDropOverlayProps {
    enabled: boolean;
    dragState: DragState;
}

export function GlobalDragDropOverlay({
    enabled,
    dragState,
}: GlobalDragDropOverlayProps) {
    if (dragState !== "dragover") {
        return null;
    }

    if (!enabled) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-card border-2 border-dashed border-primary rounded-lg p-12 text-center space-y-4 shadow-lg max-w-md mx-4">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2 text-primary">
                        Drop Files to Import
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Release to import JSON setup files
                    </p>
                </div>
            </div>
        </div>
    );
}
