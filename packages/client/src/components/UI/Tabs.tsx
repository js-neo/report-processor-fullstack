// packages/client/src/components/UI/Tabs.tsx
'use client';

import { cn } from "@/utils";
import * as React from "react";

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    children: React.ReactNode;
}

interface TabsListProps {
    className?: string;
    children: React.ReactNode;
}

interface TabsTriggerProps {
    value: string;
    className?: string;
    children: React.ReactNode;
    activeValue?: string;
    onValueChange?: (value: string) => void;
}

interface TabsContentProps {
    value: string;
    className?: string;
    children: React.ReactNode;
    activeValue?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({ className, value, onValueChange, children, ...props }, ref) => {
        const enhancedChildren = React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                if (child.type === TabsTrigger) {
                    return React.cloneElement(child as React.ReactElement<TabsTriggerProps>, {
                        activeValue: value,
                        onValueChange,
                    });
                }
                if (child.type === TabsContent) {
                    return React.cloneElement(child as React.ReactElement<TabsContentProps>, {
                        activeValue: value,
                    });
                }
            }
            return child;
        });

        return (
            <div
                ref={ref}
                className={cn("flex flex-col w-full", className)}
                {...props}
            >
                {enhancedChildren}
            </div>
        );
    }
);

Tabs.displayName = 'Tabs';

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex w-full rounded-lg bg-gray-100 p-1 dark:bg-gray-800",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

TabsList.displayName = 'TabsList';

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, activeValue, onValueChange, children, ...props }, ref) => {
        const isActive = activeValue === value;

        console.log('TabsTrigger:', {
            value,
            activeValue,
            isActive
        });

        return (
            <button
                ref={ref}
                onClick={() => onValueChange?.(value)}
                className={cn(
                    "flex-1 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    isActive
                        ? "bg-blue-500 text-white dark:bg-blue-600 dark:text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, activeValue, children, ...props }, ref) => {
        const isActive = activeValue === value;

        return isActive ? (
            <div
                ref={ref}
                className={cn(
                    "mt-4 w-full focus-visible:outline-none",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        ) : null;
    }
);

TabsContent.displayName = 'TabsContent';