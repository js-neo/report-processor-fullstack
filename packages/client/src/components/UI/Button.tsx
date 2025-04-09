// packages/client/src/components/UI/Button.tsx
'use client';

import { cn } from "@/utils"
import React from "react";

type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
                           variant = 'primary',
                           size = 'md',
                           className,
                           children,
                           ...props
                       }: ButtonProps) => {
    const baseStyles = 'rounded-md transition-colors font-medium';

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
        danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
    };

    return (
        <button
            className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
};