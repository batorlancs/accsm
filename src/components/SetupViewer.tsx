import { CarFront, Wrench, X } from "lucide-react";
import ReactJson from "react-json-view";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCars, useEditSetup, useSetup, useTracks } from "@/hooks/useBackend";
import { getBrandSvg } from "@/lib/brandSvgs";
import { getCountryFlag } from "@/lib/countryFlags";
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
