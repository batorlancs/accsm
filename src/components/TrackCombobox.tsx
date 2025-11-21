import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCountryFlag } from "@/lib/countryFlags";
import { cn } from "@/lib/utils";
import type { Track } from "@/types/backend";

interface TrackComboboxProps {
    tracks: Record<string, Track> | undefined;
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function TrackCombobox({
    tracks,
    value,
    onValueChange,
    placeholder = "Select a track",
    className,
}: TrackComboboxProps) {
    const [open, setOpen] = useState(false);

    const trackEntries = tracks ? Object.entries(tracks) : [];
    const selectedTrack = tracks?.[value];

    return (
        <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("justify-between", className)}
                >
                    {selectedTrack ? (
                        <div className="flex items-center gap-2">
                            {getCountryFlag(selectedTrack.country)}
                            <span>{selectedTrack.pretty_name}</span>
                        </div>
                    ) : (
                        placeholder
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0">
                <Command>
                    <CommandInput placeholder="Search tracks..." />
                    <CommandList>
                        <CommandEmpty>No track found.</CommandEmpty>
                        <ScrollArea className="h-48 overflow-auto">
                            <CommandGroup>
                                {trackEntries.map(([key, track]) => (
                                    <CommandItem
                                        key={key}
                                        value={track.pretty_name}
                                        onSelect={() => {
                                            onValueChange(
                                                key === value ? "" : key,
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-2">
                                            {getCountryFlag(track.country)}
                                            <span>{track.pretty_name}</span>
                                        </div>
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === key
                                                    ? "opacity-100"
                                                    : "opacity-0",
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
