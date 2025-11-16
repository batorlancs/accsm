import { CarFront } from "lucide-react";
import { getBrandSvg } from "@/lib/brandSvgs";
import { cn } from "@/lib/utils";

type BrandIconProps = {
    name: string;
    className?: string;
};

export function CarBrandIcon({ name, className }: BrandIconProps) {
    const brandSvg = getBrandSvg(name);

    return (
        <>
            {brandSvg ? (
                <img
                    src={brandSvg}
                    alt={`${name} logo`}
                    className={cn(className, "size-4 object-contain")}
                />
            ) : (
                <CarFront
                    className={cn(className, "size-4 text-muted-foreground")}
                />
            )}
        </>
    );
}
