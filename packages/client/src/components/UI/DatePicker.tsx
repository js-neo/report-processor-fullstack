// packages/client/src/components/UI/DatePicker.tsx
'use client';

import { cn } from "@/utils";

type DatePickerProps = {
    label: string;
    selected: string;
    onChangeAction: (value: string) => void;
    onBlur?: () => void;
    className?: string;
    hasError?: boolean;
    disabled?: boolean;
};

export const DatePicker = ({
                               label,
                               selected,
                               onChangeAction,
                               onBlur,
                               className = '',
                               hasError = false,
                               disabled = false
                           }: DatePickerProps) => {
    return (
        <div className={cn("space-y-1", className)}>
            <label className={cn(
                "block text-sm font-medium",
                hasError ? "text-red-600 dark:text-red-400" : "text-gray-700 dark:text-gray-300"
            )}>
                {label}
            </label>
            <input
                type="date"
                value={selected}
                onChange={(e) => onChangeAction(e.target.value)}
                onBlur={onBlur}
                disabled={disabled}
                className={cn(
                    "w-full p-2 border rounded-md focus:ring-2 outline-none transition-colors",
                    "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                    hasError
                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                        : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500",
                    disabled && "bg-gray-100 dark:bg-gray-600 cursor-not-allowed opacity-70"
                )}
            />
        </div>
    );
};