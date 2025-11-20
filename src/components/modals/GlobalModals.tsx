import { DeleteSetupModal } from "./DeleteSetupModal";
import { RenameSetupModal } from "./RenameSetupModal";
import { useGlobalModals } from "./useGlobalModals";

export function GlobalModals() {
    const {
        deleteSetup,
        renameSetup,
        closeDeleteSetupModal,
        closeRenameSetupModal,
    } = useGlobalModals();

    return (
        <>
            <DeleteSetupModal
                isOpen={deleteSetup.isOpen}
                data={deleteSetup.data}
                onClose={closeDeleteSetupModal}
            />
            <RenameSetupModal
                isOpen={renameSetup.isOpen}
                data={renameSetup.data}
                onClose={closeRenameSetupModal}
            />
        </>
    );
}