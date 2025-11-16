import { useState, useEffect } from "react";
import type { SetupInfo } from "@/types/backend";

interface SelectedSetup {
    car: string;
    track: string;
    filename: string;
}

export function useSetupSelection(dependencyId: string) {
    const [selectedSetup, setSelectedSetup] = useState<SelectedSetup | null>(null);

    // Reset selected setup when dependency changes
    useEffect(() => {
        setSelectedSetup(null);
    }, [dependencyId]);

    const selectSetup = (car: string, track: string, setup: SetupInfo) => {
        setSelectedSetup({
            car,
            track,
            filename: setup.filename,
        });
    };

    const clearSelection = () => {
        setSelectedSetup(null);
    };

    return {
        selectedSetup,
        selectSetup,
        clearSelection,
    };
}