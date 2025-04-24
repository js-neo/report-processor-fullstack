// packages/client/src/components/UI/Textarea.tsx
'use client';

import React from 'react';
import { cn } from "@/utils";

type TextareaProps = {
    className?: string;
    rows?: number;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, rows = 3, ...props }, ref) => {
        return (
            <textarea
                ref={ref}
                className={cn(
                    "block w-full rounded-md border border-gray-300 dark:border-gray-600",
                    "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100",
                    "focus:border-blue-500 focus:ring-blue-500 outline-none",
                    "disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed",
                    "shadow-sm p-2 transition-colors duration-200",
                    className
                )}
                rows={rows}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';