import { Car, FileText, MapPin } from "lucide-react";
import { useState, useCallback } from "react";
import {
    Tabs,
    TabsList,
    TabsPanel,
    TabsPanels,
    TabsTab,
} from "@/components/animate-ui/components/base/tabs";
import { EmptyState } from "@/components/EmptyState";
import { FileDropModal } from "@/components/FileDropModal";
import { GlobalDragDropOverlay } from "@/components/GlobalDragDropOverlay";
import { ImprovedChangePathDialog } from "@/components/ImprovedChangePathDialog";
import { MenuBar } from "@/components/MenuBar";
import { NewSetupForm } from "@/components/NewSetupForm";
import { SetupViewer } from "@/components/SetupViewer";
import { CarView } from "@/components/views/CarView";
import { SetupView } from "@/components/views/SetupView";
import { TrackView } from "@/components/views/TrackView";
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
    const [isFileDropModalOpen, setIsFileDropModalOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
    const [selectedCar, setSelectedCar] = useState<string | null>(null);

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

    const handleSelectTrack = (trackId: string) => {
        setSelectedTrack(trackId === selectedTrack ? null : trackId);
    };

    const handleSelectCar = (carId: string) => {
        setSelectedCar(carId === selectedCar ? null : carId);
    };

    const [globalDropFiles, setGlobalDropFiles] = useState<string[] | null>(null);

    const handleFilesDropped = useCallback((paths: string[]) => {
        setGlobalDropFiles(paths);
        setIsFileDropModalOpen(true);
    }, []);

    const selectedSetup =
        viewState.type === "viewing"
            ? {
                  car: viewState.car,
                  track: viewState.track,
                  filename: viewState.filename,
              }
            : null;

    return (
        <div className="h-screen flex flex-col bg-background border-t border-border/50">
            {/* Menu Bar */}
            <MenuBar 
                onSettingsClick={() => setIsPathDialogOpen(true)}
                onAddClick={() => setIsFileDropModalOpen(true)}
            />

            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Tabbed Explorer */}
                <div className="w-80 border-r border-border/50 bg-muted/50 p-2">
                    <Tabs defaultValue="setups" className="h-full">
                        <TabsList className="w-full">
                            <TabsTab value="setups">
                                {/* <FileText className="" /> */}
                                Explorer
                            </TabsTab>
                            <TabsTab value="tracks">
                                {/* <MapPin className="" /> */}
                                Tracks
                            </TabsTab>
                            <TabsTab value="cars">
                                {/* <Car className="" /> */}
                                Cars
                            </TabsTab>
                        </TabsList>

                        <TabsPanels
                            mode="layout"
                            className="overflow-hidden flex-1 h-full"
                        >
                            <TabsPanel
                                value="setups"
                                className="h-full min-h-full flex-1 flex"
                            >
                                <SetupView
                                    selectedSetup={selectedSetup}
                                    onSelectSetup={handleSelectSetup}
                                    onChangePathClick={() =>
                                        setIsPathDialogOpen(true)
                                    }
                                />
                            </TabsPanel>
                            <TabsPanel
                                value="tracks"
                                className="h-full overflow-y-auto"
                            >
                                <TrackView
                                    selectedTrack={selectedTrack}
                                    onSelectTrack={handleSelectTrack}
                                />
                            </TabsPanel>
                            <TabsPanel
                                value="cars"
                                className="h-full overflow-y-auto"
                            >
                                <CarView
                                    selectedCar={selectedCar}
                                    onSelectCar={handleSelectCar}
                                />
                            </TabsPanel>
                        </TabsPanels>
                    </Tabs>
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
            <ImprovedChangePathDialog
                open={isPathDialogOpen}
                onOpenChange={setIsPathDialogOpen}
            />
            <FileDropModal
                open={isFileDropModalOpen}
                onOpenChange={(open) => {
                    setIsFileDropModalOpen(open);
                    if (!open) {
                        setGlobalDropFiles(null);
                    }
                }}
                globalDropFiles={globalDropFiles}
            />
            {!isFileDropModalOpen && (
                <GlobalDragDropOverlay onFilesDropped={handleFilesDropped} />
            )}
        </div>
    );
}
