import { SetupExplorer } from "@/components/SetupExplorer";

interface SetupViewProps {
    selectedSetup: {
        car: string;
        track: string;
        filename: string;
    } | null;
    onSelectSetup: (car: string, track: string, filename: string) => void;
    onChangePathClick: () => void;
}

export function SetupView({
    selectedSetup,
    onSelectSetup,
    onChangePathClick,
}: SetupViewProps) {
    return (
        <SetupExplorer
            selectedSetup={selectedSetup}
            onSelectSetup={onSelectSetup}
            onChangePathClick={onChangePathClick}
        />
    );
}