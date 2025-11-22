/** biome-ignore-all lint/style/noNonNullAssertion: false positive */
import { Check, Edit3, Sparkles, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CarBrandIcon } from "@/components/ui/car-brand-icon";
import { Input } from "@/components/ui/input";
import { useCars } from "@/hooks/useBackend";
import {
    generateSimplifiedNames,
    hasQualyAndRaceSetups,
    SIMPLIFIED_NAMES,
} from "@/lib/filename-simplify";
import type { ValidationResult } from "@/types/backend";

interface SetupFilenameEditorProps {
    validResults: ValidationResult[];
    onFilenamesChange: (updatedFilenames: Record<number, string>) => void;
}

export function SetupFilenameEditor({
    validResults,
    onFilenamesChange,
}: SetupFilenameEditorProps) {
    const [customFilenames, setCustomFilenames] = useState<
        Record<number, string>
    >({});
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [preEditFilename, setPreEditFilename] = useState<string | null>(null);
    const [showSimplifyCheck, setShowSimplifyCheck] = useState(false);
    const [isHoveringSimplify, setIsHoveringSimplify] = useState(false);
    const [customSimplifyName, setCustomSimplifyName] = useState("");
    const { data: cars } = useCars();

    useEffect(() => {
        setTimeout(() => {
            if (showSimplifyCheck) {
                setShowSimplifyCheck(false);
            }
        }, 1000);
    }, [showSimplifyCheck]);

    const getDisplayName = (result: ValidationResult, index: number) => {
        // Return custom filename if set, otherwise use original filename
        return (
            customFilenames[index] || result.filename || "imported_setup.json"
        );
    };

    const handleEdit = (index: number) => {
        const currentName = getDisplayName(validResults[index], index);
        setPreEditFilename(currentName);
        // Remove .json extension for editing
        const nameWithoutExt = currentName.replace(/\.json$/, "");
        setCustomFilenames((prev) => ({ ...prev, [index]: nameWithoutExt }));
        setEditingIndex(index);
    };

    const handleSave = (index: number) => {
        const newName = customFilenames[index];
        if (newName?.trim()) {
            // Ensure .json extension
            const finalName = newName.trim().endsWith(".json")
                ? newName.trim()
                : `${newName.trim()}.json`;

            const updatedFilenames = { ...customFilenames, [index]: finalName };
            setCustomFilenames(updatedFilenames);
            onFilenamesChange(updatedFilenames);
        }
        setEditingIndex(null);
        setPreEditFilename(null);
    };

    const handleCancel = (index: number) => {
        const updated = { ...customFilenames };
        if (preEditFilename) {
            updated[index] = preEditFilename;
        } else {
            delete updated[index];
        }
        setCustomFilenames(updated);
        onFilenamesChange(updated);
        setEditingIndex(null);
        setPreEditFilename(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "Enter") {
            handleSave(index);
        } else if (e.key === "Escape") {
            handleCancel(index);
        }
    };

    const handleQuickRename = (
        index: number,
        type: "race" | "qualify" | "qualify-2" | "wet",
    ) => {
        const baseName = SIMPLIFIED_NAMES[type];
        const finalName = customSimplifyName
            ? `(${customSimplifyName}) ${baseName}.json`
            : `${baseName}.json`;

        const updatedFilenames = { ...customFilenames, [index]: finalName };
        setCustomFilenames(updatedFilenames);
        onFilenamesChange(updatedFilenames);
    };

    // Check if we should show the simplify button
    const filenames = validResults.map((result) => result.filename || "");
    const shouldShowSimplify =
        validResults.length >= 2 && hasQualyAndRaceSetups(filenames);

    const isNameDifferent = (index: number) => {
        const originalName = getDisplayName(validResults[index], index);
        const simplifiedNames = generateSimplifiedNames(
            filenames,
            customSimplifyName,
        );
        const previewName =
            simplifiedNames[index] ||
            getDisplayName(validResults[index], index);
        return originalName !== previewName;
    };

    // Get preview names for hover effect
    const getPreviewName = (result: ValidationResult, index: number) => {
        if (!isHoveringSimplify) return getDisplayName(result, index);

        const simplifiedNames = generateSimplifiedNames(
            filenames,
            customSimplifyName,
        );
        return simplifiedNames[index] || getDisplayName(result, index);
    };

    const handleSimplify = () => {
        const simplifiedNames = generateSimplifiedNames(
            filenames,
            customSimplifyName,
        );
        setCustomFilenames((prev) => ({ ...prev, ...simplifiedNames }));
        onFilenamesChange({ ...customFilenames, ...simplifiedNames });
        setShowSimplifyCheck(true);
    };

    if (validResults.length === 0) return null;

    return (
        <div className="space-y-3">
            {shouldShowSimplify && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 border border-border/40">
                    <Input
                        value={customSimplifyName}
                        onChange={(e) => setCustomSimplifyName(e.target.value)}
                        placeholder="Optional prefix for simplified setups"
                        className="flex-1 h-8"
                    />
                    <motion.div
                        onHoverStart={() => {
                            setIsHoveringSimplify(true);
                            setShowSimplifyCheck(false);
                        }}
                        onHoverEnd={() => setIsHoveringSimplify(false)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={handleSimplify}
                            className="h-8 px-3 gap-2 hover:bg-yellow-200/10! hover:text-yellow-200 hover:border-yellow-200/50! transition-all duration-200"
                        >
                            {showSimplifyCheck ? "Simplified" : "Simplify"}
                            {showSimplifyCheck ? <Check /> : <Sparkles />}
                        </Button>
                    </motion.div>
                </div>
            )}
            <div className="space-y-2 max-h-80 overflow-y-auto">
                {validResults.map((result, index) => (
                    <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: off
                        key={index}
                        className="relative flex items-center rounded bg-foreground/1.5 border border-border/60 hover:bg-foreground/3 hover:border-border/80"
                    >
                        <div className="p-2 bg-foreground/4 h-16 w-16 flex items-center justify-center rounded-l-lg">
                            {cars?.[result.car!] ? (
                                <CarBrandIcon
                                    name={cars[result.car!].brand_name}
                                    className="size-6 opacity-80"
                                />
                            ) : (
                                <Wrench className="size-5 opacity-40" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0 px-3 py-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {cars?.[result.car!].full_name}
                                </span>
                            </div>

                            {editingIndex === index ? (
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        value={customFilenames[index] || ""}
                                        onChange={(e) =>
                                            setCustomFilenames((prev) => ({
                                                ...prev,
                                                [index]: e.target.value,
                                            }))
                                        }
                                        onKeyDown={(e) =>
                                            handleKeyDown(e, index)
                                        }
                                        placeholder="Enter filename (without .json)"
                                        className="h-7 text-sm flex-1"
                                        autoFocus
                                    />
                                    <Button
                                        size="sm"
                                        // variant="primary"
                                        onClick={() => handleSave(index)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleCancel(index)}
                                        className="h-7 px-2 text-xs"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 mt-1">
                                    <AnimatePresence
                                        mode="wait"
                                        initial={false}
                                    >
                                        <motion.span
                                            key={getPreviewName(result, index)}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            transition={{ duration: 0.15 }}
                                            className={`truncate text-sm font-medium ${
                                                isHoveringSimplify &&
                                                isNameDifferent(index)
                                                    ? "text-yellow-200/60"
                                                    : ""
                                            }`}
                                        >
                                            {getPreviewName(result, index)}
                                        </motion.span>
                                    </AnimatePresence>
                                    <div className="flex h-6 w-6 items-center justify-center">
                                        <AnimatePresence mode="wait">
                                            {isHoveringSimplify &&
                                            isNameDifferent(index) ? (
                                                <motion.div
                                                    key="sparkles"
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.5,
                                                    }}
                                                    transition={{
                                                        duration: 0.15,
                                                    }}
                                                >
                                                    <Sparkles className="size-4 text-yellow-200/30" />
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="edit"
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    exit={{
                                                        opacity: 0,
                                                        scale: 0.5,
                                                    }}
                                                    transition={{
                                                        duration: 0.15,
                                                    }}
                                                >
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() =>
                                                            handleEdit(index)
                                                        }
                                                        className="h-6 w-6 p-0 opacity-40 hover:opacity-80 hover:bg-transparent!"
                                                    >
                                                        <Edit3 className="size-4" />
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </div>
                        {editingIndex !== index && (
                            <div className="absolute bottom-1 right-1 flex items-center gap-1">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleQuickRename(index, "race")
                                    }
                                    className="h-5 px-1.5 text-xs opacity-50 hover:opacity-100 font-mono"
                                >
                                    R
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleQuickRename(index, "qualify")
                                    }
                                    className="h-5 px-1.5 text-xs opacity-50 hover:opacity-100 font-mono"
                                >
                                    Q
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleQuickRename(index, "qualify-2")
                                    }
                                    className="h-5 px-1.5 text-xs opacity-50 hover:opacity-100 font-mono"
                                >
                                    Q2
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                        handleQuickRename(index, "wet")
                                    }
                                    className="h-5 px-1.5 text-xs opacity-50 hover:opacity-100 font-mono"
                                >
                                    W
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
