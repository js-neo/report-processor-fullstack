// packages/client/src/components/UI/Select.tsx
'use client';

import React from "react";

export const Select = ({
                           children,
                           className,
                           ...props
                       }: React.SelectHTMLAttributes<HTMLSelectElement>) => {
    return (
        <select
            className={`w-full p-2 border rounded-md bg-white dark:bg-gray-700 
        dark:border-gray-600 dark:text-gray-100 focus:ring-2 
        focus:ring-blue-500 focus:border-blue-500 ${className}`}
            {...props}
        >
            {children}
        </select>
    );
};