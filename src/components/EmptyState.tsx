import { FileText } from "lucide-react";
import React from "react";

interface EmptyStateProps {}

export function EmptyState({}: EmptyStateProps) {
    return (
        <div className="h-full">
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Setup Selected</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Select a setup from the explorer to view and edit it, or
                    add a new setup using the + Add button in the menu.
                </p>
            </div>
        </div>
    );
}
