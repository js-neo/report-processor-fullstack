// packages/client/src/components/UI/Button.tsx

'use client';

import { cn } from "@/utils";
import React from "react";
import LoadingSpinner from "@/components/Common/LoadingSpinner";

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    children: React.ReactNode;
    isLoading?: boolean;
    loadingText?: string;
    tooltip?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
                           variant = 'primary',
                           size = 'md',
                           className,
                           children,
                           disabled,
                           isLoading = false,
                           loadingText,
                           tooltip,
                           ...props
                       }: ButtonProps) => {
    const baseStyles = 'rounded-md font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer';

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const variantStyles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
        secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
        danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800',
        outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700',
    };

    const disabledStyles = {
        primary: 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
        secondary: 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500',
        danger: 'bg-red-200 text-red-400 dark:bg-red-900/20 dark:text-red-400',
        outline: 'border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500',
    };

    return (
        <div className="relative group">
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
                        {loadingText || children}
                    </span>
                ) : (
                    children
                )}
            </button>

            {(disabled && tooltip) && (
                <div className="absolute z-10 invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
                    {tooltip}
                    <div className="absolute left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-800"></div>
                </div>
            )}
        </div>
    );
};