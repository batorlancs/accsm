import type { ReactNode } from "react";

interface ViewerHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
}

export function ViewerHeader({ title, subtitle, icon }: ViewerHeaderProps) {
    return (
        <div className="p-4 border-b border-border/50">
            <h2 className="text-lg font-semibold">{title}</h2>
            {subtitle && (
                <div className="flex text-sm items-center gap-2 opacity-80 mt-1">
                    {icon}
                    <span className="text-sm text-muted-foreground">
                        {subtitle}
                    </span>
                </div>
            )}
        </div>
    );
}