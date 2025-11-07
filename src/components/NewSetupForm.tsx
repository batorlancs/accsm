import { Plus, Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    useCars,
    useSaveSetup,
    useTracks,
    useValidateSetup,
} from "@/hooks/useBackend";

interface NewSetupFormProps {
    onCancel: () => void;
    onSuccess?: () => void;
}

const SETUP_TYPES = ["race", "qualifying", "wet", "custom"];

const DEFAULT_SETUP_JSON = {
    carName: "",
    basicSetup: {
        tyres: {
            tyreSet: 0,
            tyrePressure: [27.5, 27.0, 26.5, 26.0],
        },
        alignment: {
            camber: [0, 0, 0, 0],
            toe: [0, 0, 0, 0],
            staticCamber: [0, 0, 0, 0],
            toeOutLinear: [0, 0, 0, 0],
            casterLF: 0,
            casterRF: 0,
            steerRatio: 0,
        },
        electronics: {
            tC1: 1,
            tC2: 0,
            abs: 3,
            eCUMap: 0,
            fuelMix: 0,
            telemetryLaps: 99,
        },
        strategy: {
            fuel: 0,
            nPitStops: 0,
            tyreSet: 0,
            frontBrakePadCompound: 0,
            rearBrakePadCompound: 0,
            pitStrategy: [
                {
                    fuelToAdd: 0,
                    tyres: {
                        tyreSet: 0,
                        tyrePressure: [0.0, 0.0, 0.0, 0.0],
                    },
                    tyreStrategy: 0,
                },
            ],
            fuelPerLap: 0.0,
        },
    },
    advancedSetup: {
        mechanicalBalance: {
            aRBFront: 0,
            aRBRear: 0,
            wheelRate: [0, 0, 0, 0],
            bumpStopRateUp: [0, 0, 0, 0],
            bumpStopWindow: [0, 0, 0, 0],
            bumpStopRateDown: [0, 0, 0, 0],
            ballastKg: 0,
            ballastPos: 0,
        },
        dampers: {
            bumpSlow: [0, 0, 0, 0],
            bumpFast: [0, 0, 0, 0],
            reboundSlow: [0, 0, 0, 0],
            reboundFast: [0, 0, 0, 0],
        },
        aeroBalance: {
            rideHeight: [0, 0],
            rodLength: [0, 0, 0, 0],
            splitter: 0,
            rearWing: 0,
            brakeDuct: [0, 0],
        },
        drivetrain: {
            preload: 0,
        },
    },
    trackBopType: 0,
};

export function NewSetupForm({ onCancel, onSuccess }: NewSetupFormProps) {
    const { data: cars } = useCars();
    const { data: tracks } = useTracks();
    const saveMutation = useSaveSetup();
    const validateMutation = useValidateSetup();

    const [selectedCar, setSelectedCar] = useState("");
    const [selectedTrack, setSelectedTrack] = useState("");
    const [filename, setFilename] = useState("");
    const [tags, setTags] = useState("");
    const [setupType, setSetupType] = useState("race");
    const [jsonContent, setJsonContent] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    // Update JSON content when car selection changes
    useEffect(() => {
        if (selectedCar && cars) {
            const car = cars[selectedCar];
            if (car) {
                const updatedSetup = {
                    ...DEFAULT_SETUP_JSON,
                    carName: car.id,
                };
                setJsonContent(JSON.stringify(updatedSetup, null, 2));
            }
        }
    }, [selectedCar, cars]);

    // Initialize with default setup
    useEffect(() => {
        if (!jsonContent) {
            setJsonContent(JSON.stringify(DEFAULT_SETUP_JSON, null, 2));
        }
    }, [jsonContent]);

    const handleSubmit = async () => {
        if (!selectedCar || !selectedTrack || !filename.trim()) {
            toast.error("Please fill in all required fields");
            return;
        }

        // Add .json extension if not present
        const fullFilename = filename.endsWith(".json")
            ? filename
            : `${filename}.json`;

        try {
            // Parse the JSON content
            const parsedContent = JSON.parse(jsonContent);

            // Add our custom metadata
            parsedContent.ACCSMData = {
                lastModified: new Date().toISOString(),
                tags: tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter((tag) => tag.length > 0),
                setupType,
            };

            // Validate the setup
            await validateMutation.mutateAsync({
                car: selectedCar,
                content: parsedContent,
            });

            // Save the setup
            await saveMutation.mutateAsync({
                car: selectedCar,
                track: selectedTrack,
                filename: fullFilename,
                content: parsedContent,
            });

            setValidationError(null);
            onSuccess?.();
            toast.success("Setup created successfully");
        } catch (error) {
            if (error instanceof SyntaxError) {
                setValidationError("Invalid JSON format");
            } else {
                setValidationError(String(error));
            }
            toast.error(`Failed to create setup: ${error}`);
        }
    };

    const carOptions = cars ? Object.values(cars) : [];
    const trackOptions = tracks ? Object.values(tracks) : [];

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Create New Setup
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleSubmit}
                            disabled={
                                saveMutation.isPending ||
                                validateMutation.isPending
                            }
                            size="sm"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Create Setup
                        </Button>
                        <Button onClick={onCancel} variant="outline" size="sm">
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Form fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Car *</label>
                        <Select
                            value={selectedCar}
                            onValueChange={setSelectedCar}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a car" />
                            </SelectTrigger>
                            <SelectContent>
                                {carOptions.map((car) => (
                                    <SelectItem key={car.id} value={car.id}>
                                        {car.pretty_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium">Track *</label>
                        <Select
                            value={selectedTrack}
                            onValueChange={setSelectedTrack}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a track" />
                            </SelectTrigger>
                            <SelectContent>
                                {trackOptions.map((track) => (
                                    <SelectItem key={track.id} value={track.id}>
                                        {track.pretty_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">
                            Filename *
                        </label>
                        <Input
                            value={filename}
                            onChange={(e) => setFilename(e.target.value)}
                            placeholder="e.g., my_setup or my_setup.json"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Setup Type
                        </label>
                        <Select value={setupType} onValueChange={setSetupType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SETUP_TYPES.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        <span className="capitalize">
                                            {type}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-medium">
                        Tags (comma-separated)
                    </label>
                    <Input
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="e.g., stable, aggressive, wet"
                    />
                </div>

                {validationError && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                        {validationError}
                    </div>
                )}

                <div className="flex-1 flex flex-col">
                    <label className="text-sm font-medium mb-2">
                        Setup JSON *
                    </label>
                    <Textarea
                        value={jsonContent}
                        onChange={(e) => setJsonContent(e.target.value)}
                        className="flex-1 font-mono text-xs"
                        placeholder="Enter setup JSON content..."
                    />
                </div>
            </CardContent>
        </Card>
    );
}
