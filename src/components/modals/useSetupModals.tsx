import { useCars, useTracks } from "@/hooks/useBackend";
import { useGlobalModals } from "./useGlobalModals";

/**
 * Hook that provides easy access to setup modals with automatic data fetching
 */
export function useSetupModals() {
    const { openDeleteSetupModal, openRenameSetupModal } = useGlobalModals();
    const { data: cars } = useCars();
    const { data: tracks } = useTracks();

    const openDeleteSetup = (car: string, track: string, filename: string) => {
        if (!cars || !tracks) {
            console.warn("Cars or tracks data not available");
            return;
        }

        const carData = cars[car];
        const trackData = tracks[track];

        if (!carData || !trackData) {
            console.warn("Car or track data not found", { car, track });
            return;
        }

        openDeleteSetupModal({
            car,
            track,
            filename,
            carData,
            trackData,
        });
    };

    const openRenameSetup = (car: string, track: string, filename: string) => {
        if (!cars || !tracks) {
            console.warn("Cars or tracks data not available");
            return;
        }

        const carData = cars[car];
        const trackData = tracks[track];

        if (!carData || !trackData) {
            console.warn("Car or track data not found", { car, track });
            return;
        }

        openRenameSetupModal({
            car,
            track,
            filename,
            carData,
            trackData,
        });
    };

    return {
        openDeleteSetup,
        openRenameSetup,
        isReady: !!(cars && tracks),
    };
}