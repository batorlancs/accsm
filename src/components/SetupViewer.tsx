import {
    BadgeAlert,
    BadgeCheckIcon,
    BadgePlus,
    CarFront,
    CheckCircle2,
    Fuel,
    Wrench,
    X,
} from "lucide-react";
import { useState } from "react";
import ReactJson from "react-json-view";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCars, useEditSetup, useSetup, useTracks } from "@/hooks/useBackend";
import { getBrandSvg } from "@/lib/brandSvgs";
import { getCountryFlag } from "@/lib/countryFlags";
import { Badge } from "./ui/badge";
import { Kbd, KbdGroup } from "./ui/kbd";

interface SetupViewerProps {
    car: string;
    track: string;
    filename: string;
    onDelete?: () => void;
    onClose?: () => void;
}

export function SetupViewer({
    car,
    track,
    filename,
    onClose,
}: SetupViewerProps) {
    const [isLfmBadgeHovered, setIsLfmBadgeHovered] = useState(false);
    const { data: setup, isLoading, error } = useSetup(car, track, filename);
    const {
        data: cars,
        isLoading: isCarsLoading,
        error: carsError,
    } = useCars();

    const {
        data: tracks,
        isLoading: isTracksLoading,
        error: tracksError,
    } = useTracks();

    const editSetup = useEditSetup();

    if (isLoading || isCarsLoading || isTracksLoading) {
        return null;
    }

    if (error || carsError || tracksError) {
        return (
            <div>
                <h2 className="text-red-500">Error</h2>
                <p className="text-sm text-red-500">
                    Failed to load setup:{" "}
                    {String(error || carsError || tracksError)}
                </p>
            </div>
        );
    }

    if (!setup || !cars || !tracks) {
        return <div className="text-muted-foreground">Setup not found</div>;
    }

    const carData = cars[car];
    const trackData = tracks[track];

    const fileNameWithoutExtension = filename.replace(/\.[^/.]+$/, "");
    const fileNameExtension = filename.split(".").pop() || "";

    const handleJson = (edit: any) => {
        setIsLfmBadgeHovered(false);
        const { updated_src, name, namespace } = edit;

        // Save the updated setup
        editSetup.mutate(
            {
                car,
                track,
                filename,
                content: updated_src,
            },
            {
                onError: (error) => {
                    const keyPath =
                        namespace.length > 0
                            ? `${namespace.join(".")}.${name}`
                            : name;
                    toast.error(`Failed to update ${keyPath}: ${error}`);
                },
            },
        );
    };

    const isLfmCompatible = setup.basicSetup?.electronics?.telemetryLaps === 99;

    const handleMakeLfmCompatible = () => {
        const updatedSetup = {
            ...setup,
            basicSetup: {
                ...setup.basicSetup,
                electronics: {
                    ...setup.basicSetup?.electronics,
                    telemetryLaps: 99,
                },
            },
        };

        editSetup.mutate(
            {
                car,
                track,
                filename,
                content: updatedSetup,
            },
            {
                onError: (error) => {
                    toast.error(`Failed to update setup: ${error}`);
                },
            },
        );
    };

    return (
        <div className="space-y-4 p-4">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="bg-muted rounded flex flex-col items-center justify-center p-2 gap-2 size-24">
                            <Wrench className="text-muted-foreground" />
                            <p className="text-xs text-muted-foreground font-bold opacity-50">
                                SETUP
                            </p>
                        </div>
                        <div className="">
                            <h2 className="text-lg font-medium">
                                {fileNameWithoutExtension}
                                <span className="text-muted-foreground">
                                    {fileNameExtension
                                        ? `.${fileNameExtension}`
                                        : ""}
                                </span>
                            </h2>

                            <div className="flex items-center gap-2 mt-1 opacity-60">
                                <span className="text-sm shrink-0 w-4 flex items-center justify-center">
                                    {getCountryFlag(trackData?.country || "")}
                                </span>
                                <span className="text-xs">
                                    {trackData.pretty_name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 opacity-60">
                                <span className="text-sm shrink-0 w-4 flex items-center justify-center">
                                    {" "}
                                    {(() => {
                                        const brandSvg = getBrandSvg(
                                            carData?.brand_name || "",
                                        );
                                        return brandSvg ? (
                                            <img
                                                src={brandSvg}
                                                alt={`${carData?.brand_name} logo`}
                                                className="size-4 shrink-0 object-contain"
                                            />
                                        ) : (
                                            <CarFront className="size-4 shrink-0" />
                                        );
                                    })()}
                                </span>
                                <span className="text-xs">
                                    {carData.pretty_name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        className="h-8 w-8 p-0"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="flex items-center justify-between mt-6">
                <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                        <Fuel className="w-3 h-3 mr-1 opacity-50" />
                        {setup.basicSetup?.strategy?.fuel || 0}L
                    </Badge>

                    <Badge variant="secondary">
                        <span className="opacity-50">ABS</span>{" "}
                        {setup.basicSetup?.electronics?.abs || 0}
                    </Badge>

                    <Badge variant="secondary">
                        <span className="opacity-50">TC1</span>{" "}
                        {setup.basicSetup?.electronics?.tC1 || 0}
                    </Badge>

                    <Badge variant="secondary">
                        <span className="opacity-50">TC2</span>{" "}
                        {setup.basicSetup?.electronics?.tC2 || 0}
                    </Badge>
                </div>
                {isLfmCompatible ? (
                    <Badge className="">
                        <BadgeCheckIcon className="w-3 h-3 mr-1" />
                        LFM Compatible
                    </Badge>
                ) : (
                    <Badge
                        variant="secondary"
                        className="cursor-pointer transition-all duration-400 hover:bg-green-500/50"
                        onMouseEnter={() => setIsLfmBadgeHovered(true)}
                        onMouseLeave={() => setIsLfmBadgeHovered(false)}
                        onClick={handleMakeLfmCompatible}
                    >
                        {isLfmBadgeHovered ? (
                            <>
                                <BadgePlus className="w-3 h-3 mr-1" />
                                Make LFM Compatible
                            </>
                        ) : (
                            <>
                                <BadgeAlert className="w-3 h-3 mr-1" />
                                LFM Incompatible
                            </>
                        )}
                    </Badge>
                )}
            </div>
            <div className="">
                <div className="bg-[#151515] p-4 rounded opacity-80">
                    <div className="text-xs text-muted-foreground/40 mb-3">
                        <div>
                            Try{" "}
                            <KbdGroup>
                                <Kbd>Ctrl</Kbd>
                                <span>+</span>
                                <Kbd>Enter</Kbd>
                            </KbdGroup>{" "}
                            to submit changes when editing values
                        </div>
                    </div>
                    <ReactJson
                        key={`${track}-${car}-${filename}`}
                        src={setup}
                        name={false}
                        iconStyle="square"
                        collapsed={1}
                        onEdit={handleJson}
                        // onAdd={handleJson}
                        // onDelete={handleJson}
                        enableClipboard={false}
                        theme="chalk"
                    />
                </div>
            </div>
        </div>
    );
}
