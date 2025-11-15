import { EmptyState } from "@/components/EmptyState";
import { SetupViewer } from "@/components/SetupViewer";

type ExplorerViewState =
    | { type: "empty" }
    | { type: "viewing"; car: string; track: string; filename: string };

interface ExplorerViewerProps {
    viewState: ExplorerViewState;
    onDeleteSetup: () => void;
}

export function ExplorerViewer({
    viewState,
    onDeleteSetup,
}: ExplorerViewerProps) {
    if (viewState.type === "empty") {
        return <EmptyState />;
    }

    if (viewState.type === "viewing") {
        return (
            <SetupViewer
                car={viewState.car}
                track={viewState.track}
                filename={viewState.filename}
                onDelete={onDeleteSetup}
            />
        );
    }

    return null;
}