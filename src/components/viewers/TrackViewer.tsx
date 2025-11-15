import { MapPin } from "lucide-react";

interface TrackViewerProps {
    trackId: string | null;
}

export function TrackViewer({ trackId }: TrackViewerProps) {
    if (!trackId) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a track to view details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full p-6">
            <div className="text-center">
                <MapPin className="h-16 w-16 mx-auto mb-6 text-primary" />
                <h2 className="text-2xl font-semibold mb-2">Track View</h2>
                <p className="text-muted-foreground mb-4">
                    Viewing track: <strong>{trackId}</strong>
                </p>
                <div className="bg-muted/50 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-muted-foreground">
                        Track viewer implementation coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
}