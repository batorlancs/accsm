import { getCurrentWebview } from "@tauri-apps/api/webview";
import { Upload } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface GlobalDragDropOverlayProps {
    onFilesDropped: (paths: string[]) => void;
}

export function GlobalDragDropOverlay({ onFilesDropped }: GlobalDragDropOverlayProps) {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFilesDropped = useCallback((paths: string[]) => {
        onFilesDropped(paths);
    }, [onFilesDropped]);

    useEffect(() => {
        let unlisten: (() => void) | null = null;

        const setupDragDrop = async () => {
            try {
                const webview = getCurrentWebview();
                unlisten = await webview.onDragDropEvent((event) => {
                    console.log('Drag event:', event.payload.type);
                    
                    if (event.payload.type === 'enter') {
                        setIsDragOver(true);
                    } else if (event.payload.type === 'over') {
                        setIsDragOver(true);
                    } else if (event.payload.type === 'drop') {
                        console.log('Files dropped:', event.payload.paths);
                        setIsDragOver(false);
                        handleFilesDropped(event.payload.paths);
                    } else if (event.payload.type === 'cancelled' || event.payload.type === 'leave') {
                        setIsDragOver(false);
                    }
                });
            } catch (error) {
                console.error("Failed to setup global drag drop:", error);
            }
        };

        setupDragDrop();

        return () => {
            if (unlisten) {
                unlisten();
            }
        };
    }, [handleFilesDropped]);

    if (!isDragOver) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-card border-2 border-dashed border-primary rounded-lg p-12 text-center space-y-4 shadow-lg max-w-md mx-4">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-primary animate-pulse" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2 text-primary">Drop Files to Import</h2>
                    <p className="text-sm text-muted-foreground">
                        Release to import JSON setup files
                    </p>
                </div>
            </div>
        </div>
    );
}