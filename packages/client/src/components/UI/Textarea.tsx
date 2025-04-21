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
                    "block w-full rounded-md border border-gray-300 shadow-sm",
                    "focus:border-blue-500 focus:ring-blue-500",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                rows={rows}
                {...props}
            />
        );
    }
);

Textarea.displayName = 'Textarea';