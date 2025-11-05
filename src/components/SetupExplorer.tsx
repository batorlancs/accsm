import React from 'react';
import { useFolderStructure, useSetupsPath, useRefreshFolderStructure } from '@/hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { RefreshCw, Settings, ChevronDown, ChevronRight, Car, MapPin, FileText } from 'lucide-react';
import type { CarFolder, TrackFolder, SetupInfo } from '@/types/backend';

interface SetupExplorerProps {
  selectedSetup: {
    car: string;
    track: string;
    filename: string;
  } | null;
  onSelectSetup: (car: string, track: string, filename: string) => void;
  onChangePathClick: () => void;
}

export function SetupExplorer({ selectedSetup, onSelectSetup, onChangePathClick }: SetupExplorerProps) {
  const { data: folderStructure, isLoading, error } = useFolderStructure();
  const { data: setupsPath } = useSetupsPath();
  const refreshMutation = useRefreshFolderStructure();

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const isSetupSelected = (car: string, track: string, filename: string) => {
    return selectedSetup?.car === car && 
           selectedSetup?.track === track && 
           selectedSetup?.filename === filename;
  };

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-red-500">Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500 mb-4">Failed to load folder structure</p>
          <Button onClick={handleRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Setup Explorer</CardTitle>
          <div className="flex gap-1">
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              disabled={refreshMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 ${refreshMutation.isPending ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={onChangePathClick} variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Current path */}
        <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
          <div className="font-medium mb-1">Current Path:</div>
          <div className="break-all">{setupsPath || 'Loading...'}</div>
        </div>

        {/* Stats */}
        {folderStructure && (
          <div className="text-xs text-muted-foreground">
            {folderStructure.total_setups} setups across {folderStructure.cars.length} cars
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading folder structure...
          </div>
        ) : folderStructure?.cars.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No cars found in the setups folder
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {folderStructure?.cars.map((car) => (
              <CarNode
                key={car.car_id}
                car={car}
                selectedSetup={selectedSetup}
                onSelectSetup={onSelectSetup}
                isSetupSelected={isSetupSelected}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface CarNodeProps {
  car: CarFolder;
  selectedSetup: SetupExplorerProps['selectedSetup'];
  onSelectSetup: SetupExplorerProps['onSelectSetup'];
  isSetupSelected: (car: string, track: string, filename: string) => boolean;
}

function CarNode({ car, selectedSetup, onSelectSetup, isSetupSelected }: CarNodeProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start px-2 py-1 h-auto text-left"
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
          )}
          <Car className="h-3 w-3 mr-2 flex-shrink-0" />
          <span className="truncate text-sm font-medium">{car.car_name}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            ({car.tracks.reduce((acc, track) => acc + track.setups.length, 0)})
          </span>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="ml-4 space-y-1">
        {car.tracks.map((track) => (
          <TrackNode
            key={track.track_id}
            car={car}
            track={track}
            selectedSetup={selectedSetup}
            onSelectSetup={onSelectSetup}
            isSetupSelected={isSetupSelected}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface TrackNodeProps {
  car: CarFolder;
  track: TrackFolder;
  selectedSetup: SetupExplorerProps['selectedSetup'];
  onSelectSetup: SetupExplorerProps['onSelectSetup'];
  isSetupSelected: (car: string, track: string, filename: string) => boolean;
}

function TrackNode({ car, track, selectedSetup, onSelectSetup, isSetupSelected }: TrackNodeProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start px-2 py-1 h-auto text-left"
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3 mr-2 flex-shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 mr-2 flex-shrink-0" />
          )}
          <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
          <span className="truncate text-sm">{track.track_name}</span>
          <span className="ml-auto text-xs text-muted-foreground">
            ({track.setups.length})
          </span>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="ml-4 space-y-1">
        {track.setups.map((setup) => (
          <SetupNode
            key={setup.filename}
            car={car}
            track={track}
            setup={setup}
            isSelected={isSetupSelected(car.folder_name, track.folder_name, setup.filename)}
            onSelect={() => onSelectSetup(car.car_id, track.track_id, setup.filename)}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface SetupNodeProps {
  car: CarFolder;
  track: TrackFolder;
  setup: SetupInfo;
  isSelected: boolean;
  onSelect: () => void;
}

function SetupNode({ setup, isSelected, onSelect }: SetupNodeProps) {
  return (
    <Button
      variant={isSelected ? "secondary" : "ghost"}
      className="w-full justify-start px-2 py-1 h-auto text-left"
      onClick={onSelect}
    >
      <FileText className="h-3 w-3 mr-2 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-sm truncate">{setup.display_name}</div>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="capitalize">{setup.setup_type}</span>
          {setup.tags.length > 0 && (
            <span>• {setup.tags.join(', ')}</span>
          )}
        </div>
      </div>
    </Button>
  );
}