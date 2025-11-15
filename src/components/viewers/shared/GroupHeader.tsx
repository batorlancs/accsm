import type { ReactNode } from "react";

interface GroupHeaderProps {
    title: string;
    icon?: ReactNode;
    children?: ReactNode;
}

export function GroupHeader({ title, icon }: GroupHeaderProps) {
    return (
        <div className="px-2 py-1 bg-muted/30 border-b border-b-border/50">
            <div className="flex items-center gap-2 text-sm py-1">
                {icon}
                <h3 className="">{title}</h3>
            </div>
        </div>
    );
}
