import { getCurrentWebview } from "@tauri-apps/api/webview";
import { useCallback, useEffect, useState } from "react";

export type DragState = "idle" | "dragover" | "processing";

interface UseDragDropOptions {
    onFileDrop: (paths: string[]) => void;
    enabled?: boolean;
}

export function useDragDrop({
    onFileDrop,
    enabled = true,
}: UseDragDropOptions) {
    const [dragState, setDragState] = useState<DragState>("idle");

    useEffect(() => {
        if (!enabled) return;

        let unlisten: (() => void) | null = null;

        const setupDragDrop = async () => {
            try {
                const webview = getCurrentWebview();
                unlisten = await webview.onDragDropEvent((event) => {
                    switch (event.payload.type) {
                        case "enter":
                        case "over":
                            setDragState("dragover");
                            break;
                        case "drop":
                            setDragState("processing");
                            onFileDrop(event.payload.paths);
                            break;
                        default:
                            setDragState("idle");
                            break;
                    }
                });
            } catch (error) {
                console.error("Failed to setup drag drop:", error);
            }
        };

        setupDragDrop();

        return () => {
            unlisten?.();
            setDragState("idle");
        };
    }, [enabled, onFileDrop]);

    const resetDragState = useCallback(() => {
        setDragState("idle");
    }, []);

    return { dragState, resetDragState };
}
