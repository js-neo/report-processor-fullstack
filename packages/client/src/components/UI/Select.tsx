// packages/client/src/components/UI/Select.tsx
'use client';

import React from "react";
import { cn } from "@/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <select
                ref={ref}
                className={cn(
                    "w-full p-2 border rounded-md bg-white dark:bg-gray-700",
                    "border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100",
                    "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none",
                    "disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed",
                    "transition-colors duration-200",
                    className
                )}
                {...props}
            >
                {children}
            </select>
        );
    }
);

Select.displayName = 'Select';