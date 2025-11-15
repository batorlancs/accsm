import { EmptyState } from "@/components/EmptyState";
import { NewSetupForm } from "@/components/NewSetupForm";
import { SetupViewer } from "@/components/SetupViewer";

type ExplorerViewState =
    | { type: "empty" }
    | { type: "viewing"; car: string; track: string; filename: string }
    | { type: "creating" };

interface ExplorerViewerProps {
    viewState: ExplorerViewState;
    onCreateNew: () => void;
    onCancelCreate: () => void;
    onSuccessCreate: () => void;
    onDeleteSetup: () => void;
}

export function ExplorerViewer({
    viewState,
    onCreateNew,
    onCancelCreate,
    onSuccessCreate,
    onDeleteSetup,
}: ExplorerViewerProps) {
    if (viewState.type === "empty") {
        return <EmptyState onCreateNew={onCreateNew} />;
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

    if (viewState.type === "creating") {
        return (
            <NewSetupForm
                onCancel={onCancelCreate}
                onSuccess={onSuccessCreate}
            />
        );
    }

    return null;
}