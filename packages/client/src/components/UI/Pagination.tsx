'use client';

import React from 'react';
import { Button } from './Button';

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
        <div className={`flex justify-center items-center gap-2 ${className}`}>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChangeAction(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Назад
            </Button>

            <span className="text-sm">
                Страница {currentPage} из {totalPages}
            </span>

            <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChangeAction(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Вперед
            </Button>
        </div>
    );
};