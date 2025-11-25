import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useCallback, useEffect, useState } from "react";

export type DragState = "idle" | "dragover" | "processing";

interface UseDragDropOptions {
    onFileDrop: (paths: string[]) => void;
    enabled?: boolean;
}

export function useDragDrop({ onFileDrop }: UseDragDropOptions) {
    const [dragState, setDragState] = useState<DragState>("idle");

    useEffect(() => {
        let unlisten: (() => void) | null = null;

        const setupDragDrop = async () => {
            try {
                const webview = getCurrentWebview();
                unlisten = await webview.onDragDropEvent((event) => {
                    if (event.payload.type === "over") {
                        setDragState("dragover");
                    } else if (event.payload.type === "drop") {
                        setDragState("processing");
                        onFileDrop(event.payload.paths);
                    } else {
                        setDragState("idle");
                    }
                });
            } catch (error) {
                console.error("Failed to setup drag drop:", error);
            }
        };

        setupDragDrop();

        return () => {
            unlisten?.();
        };
    }, [onFileDrop]);

    const resetDragState = useCallback(() => {
        setDragState("idle");
    }, []);

    return { dragState, resetDragState };
}
