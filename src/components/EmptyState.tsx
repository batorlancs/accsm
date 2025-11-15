import { File, Wrench } from "lucide-react";
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "./ui/empty";

export function EmptyState() {
    return (
        <div className="flex h-full w-full items-center justify-center pb-24">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Wrench className="opacity-50" />
                    </EmptyMedia>
                    <EmptyTitle>No setup selected</EmptyTitle>
                    <EmptyDescription className="text-sm">
                        Choose a setup from the sidebar or add a new one to get
                        started
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    );
}
