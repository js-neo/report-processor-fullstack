'use client';

import React from 'react';
import { cn } from "@/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                className={cn(
                    "w-full p-2 border rounded-md bg-white dark:bg-gray-700",
                    "dark:border-gray-600 dark:text-gray-100 focus:ring-2",
                    "focus:ring-blue-500 focus:border-blue-500 outline-none",
                    "transition-colors duration-200",
                    className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = 'Input';