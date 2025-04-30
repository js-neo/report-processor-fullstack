// packages/client/src/components/UI/Pagination.tsx

import React, { memo, useCallback } from "react";
import { Button } from "./Button";
import { Select } from "./Select";
import { cn } from "@/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChangeAction: (page: number) => void;
    itemsPerPage?: number;
    onItemsPerPageChange?: (limit: number) => void;
    className?: string;
    itemsPerPageOptions?: number[];
}

export const Pagination = memo(
    ({
         currentPage,
         totalPages,
         onPageChangeAction,
         itemsPerPage,
         onItemsPerPageChange,
         className = "",
         itemsPerPageOptions = [10, 25, 50, 100],
     }: PaginationProps) => {
        const handlePrev = useCallback(() => {
            onPageChangeAction(Math.max(1, currentPage - 1));
        }, [currentPage, onPageChangeAction]);

        const handleNext = useCallback(() => {
            onPageChangeAction(Math.min(totalPages, currentPage + 1));
        }, [currentPage, totalPages, onPageChangeAction]);

        const handleLimitChange = useCallback(
            (e: React.ChangeEvent<HTMLSelectElement>) => {
                onItemsPerPageChange?.(Number(e.target.value));
            },
            [onItemsPerPageChange]
        );

        if (totalPages <= 1) return null;

        return (
            <div
                className={cn(
                    "flex flex-col sm:flex-row justify-between items-center gap-4",
                    className
                )}
            >
                {itemsPerPage && onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Отчётов на странице:
            </span>
                        <Select
                            value={itemsPerPage.toString()}
                            onChange={handleLimitChange}
                            className="w-20"
                        >
                            {itemsPerPageOptions.map((option) => (
                                <option key={option} value={option.toString()}>
                                    {option}
                                </option>
                            ))}
                        </Select>
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handlePrev}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        Предыдущие
                    </Button>

                    <span className="text-sm text-gray-700 dark:text-gray-300">
            Page <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
          </span>

                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        Следующие
                    </Button>
                </div>
            </div>
        );
    }
);

Pagination.displayName = "Pagination";