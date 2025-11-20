import { create } from 'zustand'
import type { Car, Track } from '@/types/backend'

export interface SetupModalData {
  car: string
  track: string
  filename: string
  carData: Car
  trackData: Track
  onAfterDelete?: () => void
  onAfterRename?: (newFilename: string) => void
}

export interface DeleteSetupModalState {
  isOpen: boolean
  data: SetupModalData | null
}

export interface RenameSetupModalState {
  isOpen: boolean
  data: SetupModalData | null
}

export interface ModalStore {
  deleteSetup: DeleteSetupModalState
  renameSetup: RenameSetupModalState
  openDeleteSetupModal: (data: SetupModalData) => void
  closeDeleteSetupModal: () => void
  openRenameSetupModal: (data: SetupModalData) => void
  closeRenameSetupModal: () => void
}

export const useGlobalModals = create<ModalStore>((set) => ({
  deleteSetup: {
    isOpen: false,
    data: null,
  },
  renameSetup: {
    isOpen: false,
    data: null,
  },
  openDeleteSetupModal: (data) => set({ deleteSetup: { isOpen: true, data } }),
  closeDeleteSetupModal: () => set({ deleteSetup: { isOpen: false, data: null } }),
  openRenameSetupModal: (data) => set({ renameSetup: { isOpen: true, data } }),
  closeRenameSetupModal: () => set({ renameSetup: { isOpen: false, data: null } }),
}))