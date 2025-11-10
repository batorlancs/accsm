import { MapPin } from "lucide-react";

// Mock data for tracks - replace with actual data from backend
const tracks = [
    {
        id: "monza",
        name: "Monza",
        country: "Italy",
        length: "5.793 km",
        turns: 11,
        type: "Road Course",
    },
    {
        id: "silverstone",
        name: "Silverstone",
        country: "United Kingdom", 
        length: "5.891 km",
        turns: 18,
        type: "Road Course",
    },
    {
        id: "spa",
        name: "Spa-Francorchamps",
        country: "Belgium",
        length: "7.004 km", 
        turns: 19,
        type: "Road Course",
    },
    {
        id: "nurburgring",
        name: "Nürburgring",
        country: "Germany",
        length: "5.148 km",
        turns: 17,
        type: "Road Course",
    },
    {
        id: "brands_hatch",
        name: "Brands Hatch",
        country: "United Kingdom",
        length: "3.908 km",
        turns: 12,
        type: "Road Course",
    }
];

export function TrackView() {
    return (
        <div className="h-full">
            <div className="mb-4">
                <h2 className="text-lg font-medium">Tracks</h2>
                <p className="text-sm text-muted-foreground">
                    Browse available tracks
                </p>
            </div>

            <div className="space-y-2">
                {tracks.map((track) => (
                    <div
                        key={track.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                        <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium truncate">{track.name}</h3>
                                <span className="text-xs text-muted-foreground">
                                    {track.country}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                <span>{track.length}</span>
                                <span>{track.turns} turns</span>
                                <span>{track.type}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}