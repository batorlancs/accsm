import type { LucideIcon } from "lucide-react";

interface IconNumberProps {
    icon: LucideIcon;
    number: number;
    className?: string;
}

export function IconNumber({
    icon: Icon,
    number,
    className = "",
}: IconNumberProps) {
    return (
        <div
            className={`flex items-center gap-1 text-xs opacity-80 shrink-0 ${className}`}
        >
            <Icon size={12} />
            <span>{number}</span>
        </div>
    );
}

