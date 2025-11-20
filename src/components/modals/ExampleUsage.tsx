/**
 * EXAMPLE: How to use the global setup modals
 * 
 * This file demonstrates how to use the delete and rename setup modals
 * from anywhere in your application.
 */

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSetupModals } from "./useSetupModals";

// Example component showing how to use the modals
export function ExampleUsage() {
    const { openDeleteSetup, openRenameSetup, isReady } = useSetupModals();

    // Example setup data
    const exampleSetup = {
        car: "bmw_m4_gt3",
        track: "monza",
        filename: "my-setup.json",
    };

    const handleDelete = () => {
        openDeleteSetup(
            exampleSetup.car,
            exampleSetup.track,
            exampleSetup.filename
        );
    };

    const handleRename = () => {
        openRenameSetup(
            exampleSetup.car,
            exampleSetup.track,
            exampleSetup.filename
        );
    };

    if (!isReady) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Setup Actions</h2>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRename}
                    className="gap-2"
                >
                    <Edit className="h-4 w-4" />
                    Rename Setup
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="gap-2"
                >
                    <Trash2 className="h-4 w-4" />
                    Delete Setup
                </Button>
            </div>
        </div>
    );
}

/*
USAGE INSTRUCTIONS:

1. Import the hook:
   import { useSetupModals } from "@/components/modals";

2. Use the hook in your component:
   const { openDeleteSetup, openRenameSetup, isReady } = useSetupModals();

3. Call the functions with setup parameters:
   
   // To open delete modal:
   openDeleteSetup(car, track, filename);
   
   // To open rename modal:
   openRenameSetup(car, track, filename);

4. Make sure to check isReady before using the functions:
   if (!isReady) return <div>Loading...</div>;

ALTERNATIVE USAGE (Direct access to store):

If you need more control, you can use the store directly:

import { useGlobalModals } from "@/components/modals";
import { useCars, useTracks } from "@/hooks/useBackend";

const { openDeleteSetupModal } = useGlobalModals();
const { data: cars } = useCars();
const { data: tracks } = useTracks();

// Then manually prepare the data:
openDeleteSetupModal({
    car,
    track,
    filename,
    carData: cars[car],
    trackData: tracks[track],
});

*/