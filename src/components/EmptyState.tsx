import { FileText, Plus } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    onCreateNew: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
    return (
        <div className="h-full">
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Setup Selected</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Select a setup from the explorer to view and edit it, or
                    create a new setup to get started.
                </p>
                <Button
                    onClick={onCreateNew}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Create New Setup
                </Button>
            </div>
        </div>
    );
}
