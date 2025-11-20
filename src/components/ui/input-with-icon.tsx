import * as React from "react";
import { Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export interface ValidationRule {
    validate: (value: string) => boolean;
    message: string;
}

export interface InputWithIconProps
    extends Omit<React.ComponentProps<"input">, "onChange" | "onSubmit"> {
    icon?: React.ReactNode;
    iconPosition?: "start" | "end";
    inputType?: "text" | "number";
    validation?: ValidationRule[];
    onChange?: (value: string, isValid: boolean) => void;
    onError?: (errors: string[]) => void;
    onSubmit?: (value: string) => void;
    className?: string;
    inputClassName?: string;
    groupClassName?: string;
    editable?: boolean;
    editIcon?: React.ReactNode;
    displayValue?: string;
}

export const InputWithIcon = React.forwardRef<
    HTMLInputElement,
    InputWithIconProps
>(
    (
        {
            icon,
            iconPosition = "start",
            inputType = "text",
            validation = [],
            onChange,
            onError,
            onSubmit,
            className,
            inputClassName,
            groupClassName,
            editable = false,
            editIcon = <Edit3 />,
            displayValue,
            ...props
        },
        ref,
    ) => {
        const [value, setValue] = React.useState(
            props.defaultValue?.toString() || "",
        );
        const [errors, setErrors] = React.useState<string[]>([]);
        const [hasBlurred, setHasBlurred] = React.useState(false);
        const [isEditing, setIsEditing] = React.useState(!editable);
        const [isHovering, setIsHovering] = React.useState(false);
        const inputRef = React.useRef<HTMLInputElement>(null);

        const validateValue = React.useCallback(
            (val: string) => {
                const newErrors: string[] = [];

                validation.forEach((rule) => {
                    if (!rule.validate(val)) {
                        newErrors.push(rule.message);
                    }
                });

                setErrors(newErrors);
                return newErrors.length === 0;
            },
            [validation],
        );

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setValue(newValue);

            if (hasBlurred) {
                const isValid = validateValue(newValue);
                onChange?.(newValue, isValid);

                if (!isValid) {
                    onError?.(errors);
                }
            } else {
                onChange?.(newValue, true);
            }
        };

        const handleSubmitAndExit = () => {
            setHasBlurred(true);
            const isValid = validateValue(value);

            if (!isValid) {
                onError?.(errors);
            }

            onSubmit?.(value);
            
            if (editable) {
                setIsEditing(false);
                setIsHovering(false); // Reset hover state when exiting edit mode
            }
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            handleSubmitAndExit();
            props.onBlur?.(e);
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
                e.preventDefault();
                handleSubmitAndExit();
            }
            if (e.key === "Escape" && editable) {
                setIsEditing(false);
                setValue(props.defaultValue?.toString() || "");
            }
            props.onKeyDown?.(e);
        };

        const handleEditClick = () => {
            if (editable && !isEditing) {
                setIsEditing(true);
                setIsHovering(false); // Reset hover state when entering edit mode
                // Focus the input after it becomes visible
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 0);
            }
        };

        // Use imperative handle to expose the input ref
        React.useImperativeHandle(ref, () => inputRef.current!, []);

        const hasErrors = hasBlurred && errors.length > 0;
        const displayText = displayValue || value || props.placeholder || "";

        if (editable && !isEditing) {
            return (
                <div className={cn("space-y-1", className)}>
                    <motion.div
                        className={cn(
                            "group/editable relative cursor-pointer",
                            "min-h-9 flex items-center",
                            groupClassName
                        )}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        onClick={handleEditClick}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <motion.div 
                            className={cn(
                                "flex items-center gap-2 w-full px-3 py-2 rounded-md border border-input bg-background",
                                hasErrors && "border-destructive"
                            )}
                            animate={{
                                backgroundColor: isHovering ? "hsl(var(--accent) / 0.3)" : "hsl(var(--background))"
                            }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            {icon && iconPosition === "start" && (
                                <motion.div 
                                    className="text-muted-foreground [&>svg:not([class*='size-'])]:size-4"
                                    animate={{ 
                                        opacity: isHovering ? 0.7 : 1,
                                        scale: isHovering ? 0.95 : 1
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {icon}
                                </motion.div>
                            )}
                            
                            <motion.span 
                                className={cn(
                                    "flex-1 text-sm",
                                    !value && "text-muted-foreground"
                                )}
                                animate={{ 
                                    opacity: isHovering ? 0.7 : 1,
                                    x: isHovering ? 2 : 0
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                {displayText}
                            </motion.span>
                            
                            {icon && iconPosition === "end" && (
                                <motion.div 
                                    className="text-muted-foreground [&>svg:not([class*='size-'])]:size-4"
                                    animate={{ 
                                        opacity: isHovering ? 0.7 : 1,
                                        scale: isHovering ? 0.95 : 1
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {icon}
                                </motion.div>
                            )}
                        </motion.div>
                        
                        {/* Edit overlay */}
                        <AnimatePresence>
                            {isHovering && (
                                <motion.div 
                                    className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-md border border-input"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <div className="[&>svg:not([class*='size-'])]:size-4">
                                            {editIcon}
                                        </div>
                                        Click to edit
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {hasErrors && (
                        <div className="space-y-1">
                            {errors.map((error, index) => (
                                <p
                                    key={index}
                                    className="text-sm text-destructive"
                                    role="alert"
                                >
                                    {error}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div className={cn("space-y-1", className)}>
                <InputGroup className={cn(groupClassName)}>
                    {icon && iconPosition === "start" && (
                        <InputGroupAddon align="inline-start">
                            <InputGroupText>{icon}</InputGroupText>
                        </InputGroupAddon>
                    )}

                    <InputGroupInput
                        ref={inputRef}
                        type={inputType}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        aria-invalid={hasErrors}
                        className={cn(inputClassName)}
                        {...props}
                    />

                    {icon && iconPosition === "end" && (
                        <InputGroupAddon align="inline-end">
                            <InputGroupText>{icon}</InputGroupText>
                        </InputGroupAddon>
                    )}
                </InputGroup>

                {hasErrors && (
                    <div className="space-y-1">
                        {errors.map((error, index) => (
                            <p
                                key={index}
                                className="text-sm text-destructive"
                                role="alert"
                            >
                                {error}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        );
    },
);

InputWithIcon.displayName = "InputWithIcon";

// Common validation rules
export const validationRules = {
    required: (message = "This field is required"): ValidationRule => ({
        validate: (value) => value.trim().length > 0,
        message,
    }),

    minLength: (min: number, message?: string): ValidationRule => ({
        validate: (value) => value.length >= min,
        message: message || `Must be at least ${min} characters`,
    }),

    maxLength: (max: number, message?: string): ValidationRule => ({
        validate: (value) => value.length <= max,
        message: message || `Must be no more than ${max} characters`,
    }),

    email: (
        message = "Please enter a valid email address",
    ): ValidationRule => ({
        validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message,
    }),

    number: (message = "Please enter a valid number"): ValidationRule => ({
        validate: (value) => !isNaN(Number(value)) && value.trim() !== "",
        message,
    }),

    positiveNumber: (
        message = "Please enter a positive number",
    ): ValidationRule => ({
        validate: (value) => !isNaN(Number(value)) && Number(value) > 0,
        message,
    }),

    integer: (message = "Please enter a whole number"): ValidationRule => ({
        validate: (value) =>
            Number.isInteger(Number(value)) && !isNaN(Number(value)),
        message,
    }),

    range: (min: number, max: number, message?: string): ValidationRule => ({
        validate: (value) => {
            const num = Number(value);
            return !isNaN(num) && num >= min && num <= max;
        },
        message: message || `Must be between ${min} and ${max}`,
    }),
};

