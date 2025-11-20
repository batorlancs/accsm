import {
    BadgeAlert,
    BadgeCheckIcon,
    BadgePlus,
    Edit2Icon,
    EditIcon,
    Fuel,
    Trash2Icon,
    Wrench,
    X,
} from "lucide-react";
import { useState } from "react";
import ReactJson from "react-json-view";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCars, useEditSetup, useSetup, useTracks } from "@/hooks/useBackend";
import { getCountryFlag } from "@/lib/countryFlags";
import { ExampleUsage, useSetupModals } from "./modals";
import { Badge } from "./ui/badge";
import { CarBrandIcon } from "./ui/car-brand-icon";
import { InputWithIcon } from "./ui/input-with-icon";
import { Kbd, KbdGroup } from "./ui/kbd";

interface SetupValueInputProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    suffix?: string;
    onUpdate: (newValue: number) => void;
}

function SetupValueInput({
    icon,
    label,
    value,
    suffix = "",
    onUpdate,
}: SetupValueInputProps) {
    const handleSubmit = async (newValue: string) => {
        const numValue = Number(newValue);
        if (isNaN(numValue)) {
            throw new Error("Please enter a valid number");
        }

        onUpdate(numValue);
    };

    return (
        <InputWithIcon
            icon={icon}
            inputType="number"
            defaultValue={value.toString()}
            displayValue={`${value}${suffix}`}
            editable={true}
            showErrors={false}
            validation={[
                {
                    validate: (val) => !isNaN(Number(val)) && val.trim() !== "",
                    message: "Please enter a valid number",
                },
            ]}
            onSubmit={handleSubmit}
            onSubmitError={(error) => {
                toast.error(
                    `Failed to update ${label.toLowerCase()}: ${error}`,
                );
            }}
            className="flex-1 min-w-0"
            groupClassName=""
        />
    );
}

interface SetupViewerProps {
    car: string;
    track: string;
    filename: string;
    onDelete?: () => void;
    onClose?: () => void;
    onAfterDelete?: () => void;
    onAfterRename?: (newFilename: string) => void;
}

export function SetupViewer({
    car,
    track,
    filename,
    onClose,
    onAfterDelete,
    onAfterRename,
}: SetupViewerProps) {
    const [isLfmBadgeHovered, setIsLfmBadgeHovered] = useState(false);
    const { data: setup, isLoading, error } = useSetup(car, track, filename);
    const { openDeleteSetup, openRenameSetup, isReady } = useSetupModals();
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
                customToastMessage: "Setup has been saved",
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

    const isLfmCompatible =
        setup.basicSetup?.electronics?.telemetryLaps > 0 &&
        setup.basicSetup?.electronics?.telemetryLaps <= 99;

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
                customToastMessage:
                    "Telemetry laps set to 99 for LFM compatibility",
            },
            {
                onError: (error) => {
                    toast.error(`Failed to update setup: ${error}`);
                },
            },
        );
    };

    const handleUpdateFuel = (newValue: number) => {
        const updatedSetup = {
            ...setup,
            basicSetup: {
                ...setup.basicSetup,
                strategy: {
                    ...setup.basicSetup?.strategy,
                    fuel: newValue,
                },
            },
        };

        editSetup.mutate(
            {
                car,
                track,
                filename,
                content: updatedSetup,
                customToastMessage: `Fuel changed to ${newValue}L`,
            },
            {
                onError: (error) => {
                    toast.error(`Failed to update fuel: ${error}`);
                },
            },
        );
    };

    const handleUpdateAbs = (newValue: number) => {
        const updatedSetup = {
            ...setup,
            basicSetup: {
                ...setup.basicSetup,
                electronics: {
                    ...setup.basicSetup?.electronics,
                    abs: newValue,
                },
            },
        };

        editSetup.mutate(
            {
                car,
                track,
                filename,
                content: updatedSetup,
                customToastMessage: `ABS changed to ${newValue}`,
            },
            {
                onError: (error) => {
                    toast.error(`Failed to update ABS: ${error}`);
                },
            },
        );
    };

    const handleUpdateTc1 = (newValue: number) => {
        const updatedSetup = {
            ...setup,
            basicSetup: {
                ...setup.basicSetup,
                electronics: {
                    ...setup.basicSetup?.electronics,
                    tC1: newValue,
                },
            },
        };

        editSetup.mutate(
            {
                car,
                track,
                filename,
                content: updatedSetup,
                customToastMessage: `TC1 changed to ${newValue}`,
            },
            {
                onError: (error) => {
                    toast.error(`Failed to update TC1: ${error}`);
                },
            },
        );
    };

    const handleUpdateTc2 = (newValue: number) => {
        const updatedSetup = {
            ...setup,
            basicSetup: {
                ...setup.basicSetup,
                electronics: {
                    ...setup.basicSetup?.electronics,
                    tC2: newValue,
                },
            },
        };

        editSetup.mutate(
            {
                car,
                track,
                filename,
                content: updatedSetup,
                customToastMessage: `TC2 changed to ${newValue}`,
            },
            {
                onError: (error) => {
                    toast.error(`Failed to update TC2: ${error}`);
                },
            },
        );
    };

    return (
        <div className="space-y-2 p-4">
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
                                <span className="text-sm shrink-0 w-6 flex items-center justify-center">
                                    {getCountryFlag(trackData?.country || "")}
                                </span>
                                <span className="text-xs">
                                    {trackData.pretty_name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 opacity-60">
                                <span className="text-sm shrink-0 w-6 flex items-center justify-center">
                                    <CarBrandIcon
                                        name={carData.brand_name || ""}
                                    />
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

            <div className="flex items-center justify-between mt-8">
                <div className="flex flex-wrap gap-2 flex-1">
                    <SetupValueInput
                        icon={<Fuel className="size-3" />}
                        label="Fuel"
                        value={setup.basicSetup?.strategy?.fuel || 0}
                        suffix="L"
                        onUpdate={handleUpdateFuel}
                    />

                    <SetupValueInput
                        icon={
                            <span className="text-xs font-medium pt-[2px]">
                                ABS
                            </span>
                        }
                        label="ABS"
                        value={setup.basicSetup?.electronics?.abs || 0}
                        onUpdate={handleUpdateAbs}
                    />

                    <SetupValueInput
                        icon={
                            <span className="text-xs font-medium pt-[2px]">
                                TC1
                            </span>
                        }
                        label="TC1"
                        value={setup.basicSetup?.electronics?.tC1 || 0}
                        onUpdate={handleUpdateTc1}
                    />

                    <SetupValueInput
                        icon={
                            <span className="text-xs font-medium pt-[2px]">
                                TC2
                            </span>
                        }
                        label="TC2"
                        value={setup.basicSetup?.electronics?.tC2 || 0}
                        onUpdate={handleUpdateTc2}
                    />
                </div>
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

            <div className="flex items-start justify-between">
                <div>
                    {isLfmCompatible ? (
                        <Badge className="bg-green-600/30 opacity-70">
                            <BadgeCheckIcon className="mr-1 mb-[2px]" />
                            LFM: Telemtry Laps is set
                        </Badge>
                    ) : (
                        <Badge
                            variant="secondary"
                            className="cursor-pointer transition-all duration-400 hover:bg-orange-600/30 opacity-70"
                            onMouseEnter={() => setIsLfmBadgeHovered(true)}
                            onMouseLeave={() => setIsLfmBadgeHovered(false)}
                            onClick={handleMakeLfmCompatible}
                        >
                            {isLfmBadgeHovered ? (
                                <>
                                    <BadgePlus className="mr-1 mb-[2px]" />
                                    LFM: Set Telemetry Laps to 99
                                </>
                            ) : (
                                <>
                                    <BadgeAlert className="mr-1 mb-[2px]" />
                                    LFM: Telemetry Laps is not set
                                </>
                            )}
                        </Badge>
                    )}
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="xs"
                        className="opacity-80 hover:opacity-100 transition-opacity duration-200"
                        onClick={() => {
                            openRenameSetup(car, track, filename, {
                                onAfterRename,
                            });
                        }}
                    >
                        <EditIcon />
                        Rename
                    </Button>
                    <Button
                        variant="destructive"
                        size="xs"
                        className="opacity-80 hover:opacity-100 transition-opacity duration-200"
                        onClick={() => {
                            openDeleteSetup(car, track, filename, {
                                onAfterDelete,
                            });
                        }}
                    >
                        <Trash2Icon />
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
}
