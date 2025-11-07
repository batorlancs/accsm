import { Plus } from "lucide-react";
import React, { useState } from "react";
import { ChangePathDialog } from "@/components/ChangePathDialog";
import { EmptyState } from "@/components/EmptyState";
import { NewSetupForm } from "@/components/NewSetupForm";
import { SetupExplorer } from "@/components/SetupExplorer";
import { SetupViewer } from "@/components/SetupViewer";
import { Button } from "@/components/ui/button";
import { useSetupsEvents } from "@/hooks/useSetupsEvents";

type MainViewState =
    | { type: "empty" }
    | { type: "viewing"; car: string; track: string; filename: string }
    | { type: "creating" };

export function AccSetupManager() {
    // Initialize real-time event listening
    useSetupsEvents();

    const [viewState, setViewState] = useState<MainViewState>({
        type: "empty",
    });
    const [isPathDialogOpen, setIsPathDialogOpen] = useState(false);

    const handleSelectSetup = (
        car: string,
        track: string,
        filename: string,
    ) => {
        setViewState({ type: "viewing", car, track, filename });
    };

    const handleCreateNew = () => {
        setViewState({ type: "creating" });
    };

    const handleCancelCreate = () => {
        setViewState({ type: "empty" });
    };

    const handleSuccessCreate = () => {
        setViewState({ type: "empty" });
    };

    const handleDeleteSetup = () => {
        setViewState({ type: "empty" });
    };

    const selectedSetup =
        viewState.type === "viewing"
            ? {
                  car: viewState.car,
                  track: viewState.track,
                  filename: viewState.filename,
              }
            : null;

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <div
                data-tauri-drag-region
                className="h-12 w-full bg-primary text-primary-foreground flex items-center px-4 justify-between"
            >
                <h1 className="text-lg font-semibold">ACC Setup Manager</h1>
                <Button
                    onClick={handleCreateNew}
                    variant="secondary"
                    size="sm"
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New Setup
                </Button>
            </div>

            {/* Main content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Setup Explorer */}
                <div className="w-96 border-r bg-muted/50 p-4">
                    <SetupExplorer
                        selectedSetup={selectedSetup}
                        onSelectSetup={handleSelectSetup}
                        onChangePathClick={() => setIsPathDialogOpen(true)}
                    />
                </div>

                {/* Main Area */}
                <div className="flex-1 p-4">
                    {viewState.type === "empty" && (
                        <EmptyState onCreateNew={handleCreateNew} />
                    )}

                    {viewState.type === "viewing" && (
                        <SetupViewer
                            car={viewState.car}
                            track={viewState.track}
                            filename={viewState.filename}
                            onDelete={handleDeleteSetup}
                        />
                    )}

                    {viewState.type === "creating" && (
                        <NewSetupForm
                            onCancel={handleCancelCreate}
                            onSuccess={handleSuccessCreate}
                        />
                    )}
                </div>
            </div>

            {/* Dialogs */}
            <ChangePathDialog
                open={isPathDialogOpen}
                onOpenChange={setIsPathDialogOpen}
            />
        </div>
    );
}
