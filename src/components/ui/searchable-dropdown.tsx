import { CheckIcon, ChevronDownIcon, SearchIcon } from "lucide-react";
import * as React from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface SearchableDropdownOption {
    value: string;
    label: string;
}

export interface SearchableDropdownProps {
    /** Array of options to display in dropdown */
    options: SearchableDropdownOption[];
    /** Default selected option value */
    defaultValue?: string;
    /** Placeholder text for the search input */
    placeholder?: string;
    /** Text to display on the dropdown button */
    dropdownLabel?: string;
    /** Callback when input value changes */
    onChange?: (value: string) => void;
    /** Callback when form is submitted (Enter key or button click) */
    onSubmit?: (
        value: string,
        selectedOption?: SearchableDropdownOption,
    ) => void;
    /** Callback when dropdown option is selected */
    onSelect?: (option: SearchableDropdownOption) => void;
    /** Additional CSS classes for the container */
    className?: string;
    /** Whether the input is disabled */
    disabled?: boolean;
    /** Show search icon in input */
    showSearchIcon?: boolean;
}

export function SearchableDropdown({
    options,
    defaultValue = "",
    placeholder = "Enter search query",
    dropdownLabel = "Search In...",
    onChange,
    onSubmit,
    onSelect,
    className,
    disabled = false,
    showSearchIcon = false,
}: SearchableDropdownProps) {
    const [inputValue, setInputValue] = React.useState(defaultValue);
    const [selectedOption, setSelectedOption] = React.useState<
        SearchableDropdownOption | undefined
    >(
        options.find((opt) => opt.value === defaultValue) || options[0], // Default to first option if no default
    );

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onChange?.(value);
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(inputValue, selectedOption);
    };

    // Handle dropdown option selection
    const handleOptionSelect = (option: SearchableDropdownOption) => {
        setSelectedOption(option);
        onSelect?.(option);
    };

    return (
        <form onSubmit={handleSubmit} className={cn("w-full", className)}>
            <InputGroup>
                {showSearchIcon && (
                    <InputGroupAddon align="inline-start">
                        <SearchIcon className="size-4" />
                    </InputGroupAddon>
                )}

                <InputGroupInput
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={disabled}
                    className="text-sm"
                />

                <InputGroupAddon align="inline-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <InputGroupButton
                                variant="ghost"
                                className="pr-1.5 text-xs"
                                disabled={disabled}
                                type="button"
                            >
                                {selectedOption?.label || dropdownLabel}{" "}
                                <ChevronDownIcon className="size-3" />
                            </InputGroupButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {options.map((option) => (
                                <DropdownMenuItem
                                    key={option.value}
                                    onClick={() => handleOptionSelect(option)}
                                    className={cn(
                                        "flex items-center justify-between",
                                        selectedOption?.value ===
                                            option.value && "bg-accent/50",
                                    )}
                                >
                                    <span>{option.label}</span>
                                    {selectedOption?.value === option.value && (
                                        <CheckIcon className="size-3" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </InputGroupAddon>
            </InputGroup>
        </form>
    );
}
