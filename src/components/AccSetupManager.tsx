import { useCallback, useState } from "react";
import {
    Tabs,
    TabsList,
    TabsPanel,
    TabsPanels,
    TabsTab,
} from "@/components/animate-ui/components/base/tabs";
import { FileDropModal } from "@/components/FileDropModal";
import { GlobalDragDropOverlay } from "@/components/GlobalDragDropOverlay";
import { ImprovedChangePathDialog } from "@/components/ImprovedChangePathDialog";
import { MenuBar } from "@/components/MenuBar";
import { CarViewer, ExplorerViewer, TrackViewer } from "@/components/viewers";
import { CarView } from "@/components/views/CarView";
import { SetupView } from "@/components/views/SetupView";
import { TrackView } from "@/components/views/TrackView";
import { useSetupsEvents } from "@/hooks/useSetupsEvents";

type ExplorerViewState =
    | { type: "empty" }
    | { type: "viewing"; car: string; track: string; filename: string };

type TabType = "explorer" | "tracks" | "cars";

export function AccSetupManager() {
    // Initialize real-time event listening
    useSetupsEvents();

    // Current active tab
    const [activeTab, setActiveTab] = useState<TabType>("explorer");

    // Explorer tab state
    const [explorerViewState, setExplorerViewState] =
        useState<ExplorerViewState>({
            type: "empty",
        });

    // Explorer folder expansion state
    const [openFolders, setOpenFolders] = useState<string[]>([]);

    // Tracks tab state
    const [selectedTrack, setSelectedTrack] = useState<string | null>(null);

    // Cars tab state
    const [selectedCar, setSelectedCar] = useState<string | null>(null);

    // Global state
    const [isPathDialogOpen, setIsPathDialogOpen] = useState(false);
    const [isFileDropModalOpen, setIsFileDropModalOpen] = useState(false);

    // Explorer tab handlers
    const handleSelectSetup = (
        car: string,
        track: string,
        filename: string,
    ) => {
        setExplorerViewState({ type: "viewing", car, track, filename });
    };

    const handleDeleteSetup = () => {
        setExplorerViewState({ type: "empty" });
    };

    // Tracks tab handlers
    const handleSelectTrack = (trackId: string) => {
        setSelectedTrack(trackId === selectedTrack ? null : trackId);
    };

    // Cars tab handlers
    const handleSelectCar = (carId: string) => {
        setSelectedCar(carId === selectedCar ? null : carId);
    };

    const [globalDropFiles, setGlobalDropFiles] = useState<string[] | null>(
        null,
    );

    const handleFilesDropped = useCallback((paths: string[]) => {
        setGlobalDropFiles(paths);
        setIsFileDropModalOpen(true);
    }, []);

    const selectedSetup =
        explorerViewState.type === "viewing"
            ? {
                  car: explorerViewState.car,
                  track: explorerViewState.track,
                  filename: explorerViewState.filename,
              }
            : null;

    return (
        <div className="h-screen max-h-screen min-h-screen flex flex-col bg-background border-t border-border/50">
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Tabbed Explorer */}
                <div className="w-80 border-r border-border/50 bg-muted/50">
                    <Tabs
                        value={activeTab}
                        onValueChange={(value) =>
                            setActiveTab(value as TabType)
                        }
                        className="h-full"
                    >
                        <div className="p-2 h-11">
                            <TabsList className="w-full">
                                <TabsTab value="explorer">Explorer</TabsTab>
                                <TabsTab value="tracks">Tracks</TabsTab>
                                <TabsTab value="cars">Cars</TabsTab>
                            </TabsList>
                        </div>
                        <TabsPanels
                            mode="layout"
                            className="overflow-hidden flex-1 h-full border-t border-border/50"
                        >
                            <TabsPanel
                                value="explorer"
                                className="h-full min-h-full flex-1 flex"
                            >
                                <SetupView
                                    selectedSetup={selectedSetup}
                                    onSelectSetup={handleSelectSetup}
                                    onChangePathClick={() =>
                                        setIsPathDialogOpen(true)
                                    }
                                    openFolders={openFolders}
                                    onOpenFoldersChange={setOpenFolders}
                                />
                            </TabsPanel>
                            <TabsPanel
                                value="tracks"
                                className="h-full overflow-y-auto p-2"
                            >
                                <TrackView
                                    selectedTrack={selectedTrack}
                                    onSelectTrack={handleSelectTrack}
                                />
                            </TabsPanel>
                            <TabsPanel
                                value="cars"
                                className="h-full overflow-y-auto p-2"
                            >
                                <CarView
                                    selectedCar={selectedCar}
                                    onSelectCar={handleSelectCar}
                                />
                            </TabsPanel>
                        </TabsPanels>
                    </Tabs>
                </div>

                {/* Main Area - Viewers */}
                <div className="flex-1 overflow-hidden max-w-full flex flex-col">
                    {/* Menu Bar */}
                    <MenuBar
                        onSettingsClick={() => setIsPathDialogOpen(true)}
                        onAddClick={() => setIsFileDropModalOpen(true)}
                    />
                    <div className="flex-1 overflow-y-auto">
                        {activeTab === "explorer" && (
                            <ExplorerViewer
                                viewState={explorerViewState}
                                onDeleteSetup={handleDeleteSetup}
                            />
                        )}

                        {activeTab === "tracks" && (
                            <TrackViewer trackId={selectedTrack || ""} />
                        )}

                        {activeTab === "cars" && (
                            <CarViewer carId={selectedCar || ""} />
                        )}
                    </div>
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
            {!isFileDropModalOpen ? (
                <GlobalDragDropOverlay
                    onFilesDropped={handleFilesDropped}
                    enabled={!isFileDropModalOpen}
                />
            ) : null}
        </div>
    );
}
