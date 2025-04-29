// components/UI/FormInput.tsx
'use client';

import { Input, InputProps } from './Input';
import { FieldError } from 'react-hook-form';
import { cn } from "@/utils";

interface FormInputProps extends InputProps {
    error?: FieldError;
}

export const FormInput = ({ error, className, ...props }: FormInputProps) => {
    return (
        <div className="space-y-1">
            <Input
                className={cn(
                    error && "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500",
                    className
                )}
                {...props}
            />
            {error?.message && (
                <p className="text-sm text-red-600 dark:text-red-400">
                    {error.message}
                </p>
            )}
        </div>
    );
};