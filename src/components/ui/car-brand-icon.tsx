import { CarFront } from "lucide-react";
import type { ComponentProps } from "react";
import { getBrandSvg } from "@/lib/brandSvgs";
import { cn } from "@/lib/utils";

// Predefined brand overrides - easy to extend
const BRAND_OVERRIDES: Record<
    string,
    {
        className?: string;
        style?: React.CSSProperties;
        fallbackClassName?: string;
        outerClassName?: string;
    }
> = {
    audi: {
        outerClassName: "bg-red-500/30 rounded p-[2px]",
        className: "brightness-0 invert",
    },
    honda: {
        className: "brightness-0 invert-[0.7]",
    },
    mclaren: {
        className: "",
        style: {
            filter: "brightness(0) saturate(100%) invert(56%) sepia(91%) saturate(1673%) hue-rotate(359deg) brightness(102%) contrast(104%)",
        },
    },
    bentley: {
        outerClassName: "bg-neutral-500/30 rounded p-[2px]",
        className: "brightness-0 invert",
    },
    alpine: {
        outerClassName: "bg-blue-500/30 rounded p-[2px]",
        className: "brightness-0 invert",
    },
    jaguar: {
        className: "brightness-0 invert-[0.6]",
    },
    ginetta: {
        className: "brightness-0 invert-[0.5]",
    },
    lexus: {
        className: "brightness-0 invert-[0.7]",
    },
    "aston martin": {
        outerClassName: "bg-[#01665E]/30 rounded p-[2px]",
        className: "brightness-0 invert-[0.8]",
    },
    chevrolet: {
        className: "brightness-0 invert-[0.6]",
    },
};

type BrandIconProps = {
    name: string;
    className?: string;
    style?: React.CSSProperties;
} & Omit<ComponentProps<"img">, "src" | "alt" | "className" | "style">;

export function CarBrandIcon({
    name,
    className,
    style,
    ...props
}: BrandIconProps) {
    const brandSvg = getBrandSvg(name);
    console.log("Brand SVG for", name, ":", brandSvg);
    const brandOverride = BRAND_OVERRIDES[name.toLowerCase()];

    const imgClassName = cn(
        "object-contain size-4",
        brandOverride?.className,
        className,
    );

    const fallbackClassName = cn(
        "text-muted-foreground",
        brandOverride?.fallbackClassName,
        className,
    );

    const combinedStyle = {
        ...brandOverride?.style,
        ...style,
    };

    return (
        <div className={brandOverride?.outerClassName}>
            {brandSvg ? (
                <img
                    src={brandSvg}
                    alt={`${name} logo`}
                    className={imgClassName}
                    style={combinedStyle}
                    {...props}
                />
            ) : (
                <CarFront className={fallbackClassName} style={combinedStyle} />
            )}
        </div>
    );
}
