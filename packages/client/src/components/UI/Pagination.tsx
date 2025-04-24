// packages/client/src/components/UI/Pagination.tsx
'use client';

import React from 'react';
import { Button } from './Button';
import { cn } from "@/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChangeAction: (page: number) => void;
    className?: string;
}

export const Pagination = ({
                               currentPage,
                               totalPages,
                               onPageChangeAction,
                               className = ''
                           }: PaginationProps) => {
    if (totalPages <= 1) return null;

    return (
        <div className={cn("flex justify-center items-center gap-4", className)}>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChangeAction(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Предыдущая страница"
            >
                Назад
            </Button>

            <span className="text-sm text-gray-700 dark:text-gray-300">
                Страница <span className="font-medium">{currentPage}</span> из <span className="font-medium">{totalPages}</span>
            </span>

            <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChangeAction(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Следующая страница"
            >
                Вперед
            </Button>
        </div>
    );
};