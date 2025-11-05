import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TauriAPI } from '@/services/api';
import { queryKeys } from '@/hooks/useBackend';
import { toast } from 'sonner';
import type { FolderStructure } from '@/types/backend';

export function useSetupsEvents() {
  const queryClient = useQueryClient();

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      try {
        unlisten = await TauriAPI.onSetupsChanged((structure: FolderStructure) => {
          // Update the cached folder structure
          queryClient.setQueryData(queryKeys.folderStructure, structure);
          
          // Show a toast notification
          toast.info('Setups folder updated', {
            description: `Found ${structure.total_setups} setups across ${structure.cars.length} cars`,
          });
        });
      } catch (error) {
        console.error('Failed to setup event listener:', error);
      }
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [queryClient]);
}