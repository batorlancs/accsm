import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ViewerContainerProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    onBack?: () => void;
    children: ReactNode;
}

export function ViewerContainer({
    title,
    subtitle,
    icon,
    onBack,
    children,
}: ViewerContainerProps) {
    return (
        <div className="p-4">
            <div className="flex items-start gap-3">
                {onBack && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onBack}
                        className="mt-1"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                )}
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {subtitle && (
                        <div className="flex text-sm items-center gap-2 opacity-80">
                            {icon}
                            <span className="text-sm text-muted-foreground">
                                {subtitle}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-1 overflow-auto">{children}</div>
        </div>
    );
}
