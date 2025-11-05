import React, { useState } from 'react';
import { useSetupsPath, useSetSetupsPath } from '@/hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FolderOpen, Save, X } from 'lucide-react';

interface ChangePathDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangePathDialog({ open, onOpenChange }: ChangePathDialogProps) {
  const { data: currentPath } = useSetupsPath();
  const setPathMutation = useSetSetupsPath();
  const [newPath, setNewPath] = useState('');

  React.useEffect(() => {
    if (open && currentPath) {
      setNewPath(currentPath);
    }
  }, [open, currentPath]);

  const handleSave = async () => {
    if (!newPath.trim()) {
      return;
    }

    try {
      await setPathMutation.mutateAsync(newPath.trim());
      onOpenChange(false);
    } catch (error) {
      // Error is handled by the mutation hook
    }
  };

  const handleCancel = () => {
    setNewPath(currentPath || '');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Change Setups Path
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Current Path</label>
            <div className="text-sm text-muted-foreground bg-muted p-2 rounded mt-1 break-all">
              {currentPath || 'Loading...'}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">New Path</label>
            <Input
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="Enter the path to your ACC setups folder"
              className="mt-1"
            />
            <div className="text-xs text-muted-foreground mt-1">
              This should be the folder containing your car folders (e.g., Mercedes-AMG GT3 EVO, etc.)
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={setPathMutation.isPending || !newPath.trim() || newPath === currentPath}
          >
            <Save className="h-4 w-4 mr-2" />
            {setPathMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={handleCancel} variant="outline">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}