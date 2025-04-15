// packages/client/src/components/UI/Button.tsx
'use client';

import { cn } from "@/utils"
import React from "react";
import LoadingSpinner from "@/components/Common/LoadingSpinner";

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children: React.ReactNode;
    isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
                           variant = 'primary',
                           size = 'md',
                           className,
                           children,
                           disabled,
                           isLoading,
                           ...props
                       }: ButtonProps) => {
    const baseStyles = 'rounded-md font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all';

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

    const disabledStyles = {
        primary: 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
        secondary: 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500',
        danger: 'bg-red-200 text-red-400 dark:bg-red-900/20 dark:text-red-400',
    };

    return (
        <button
            className={cn(
                baseStyles,
                sizeStyles[size],
                disabled || isLoading ? disabledStyles[variant] : variantStyles[variant],
                (disabled || isLoading) && 'cursor-not-allowed opacity-80',
                className
            )}
            disabled={disabled || isLoading}
            aria-disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <LoadingSpinner small />
                    {children}
                </span>
            ) : (
                children
            )}
        </button>
    );
};