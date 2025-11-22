import type { ReactNode } from "react";

interface SubTitleProps {
    title: ReactNode;
    icon?: ReactNode;
}

interface ViewerHeaderProps {
    title: ReactNode;
    subtitles?: SubTitleProps[];
    corner?: ReactNode;
}

export function ViewerHeader({ title, subtitles, corner }: ViewerHeaderProps) {
    return (
        <div className="p-4 pb-2 flex items-start justify-between">
            {/* <div className="p-4 border-b border-border/50 flex items-start justify-between"> */}
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                {subtitles?.map((subtitle, index) => (
                    <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: off
                        key={index}
                        className="flex text-sm items-center gap-2 opacity-80"
                    >
                        {subtitle.icon}
                        <span className="text-sm text-muted-foreground">
                            {subtitle.title}
                        </span>
                    </div>
                ))}
            </div>
            <div>{corner}</div>
        </div>
    );
}
