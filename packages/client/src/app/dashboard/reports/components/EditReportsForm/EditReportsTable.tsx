// packages/client/src/app/dashboard/reports/components/EditReportsForm/EditReportsTable.tsx

'use client';

import React, { useState, useCallback, memo, useEffect } from 'react';
import { Button } from '@/components/UI/Button';
import { IReport } from 'shared';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ReportCardModal } from './ReportCardModal';
import { useAllReports } from '@/hooks/useAllReports';
import { Pagination } from '@/components/UI/Pagination';
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import toast from 'react-hot-toast';

type SortType = 'asc' | 'desc';
type StatusType = 'all' | 'filled' | 'unfilled' | 'task' | 'workers' | 'time';

interface EditReportsTableProps {
    objectId: string;
    searchParams: {
        status?: string;
        sort?: string;
        limit?: string;
        page?: string;
        start?: string;
        end?: string;
    };
}

export const EditReportsTable = memo(({
                                          objectId,
                                          searchParams
                                      }: EditReportsTableProps) => {
    const [selectedReport, setSelectedReport] = useState<IReport | null>(null);
    const [abortController, setAbortController] = useState<AbortController | null>(null);

    const validatedSort: SortType = searchParams.sort === 'asc' ? 'asc' : 'desc';
    const validatedStatus: StatusType =
        ['all', 'filled', 'unfilled', 'task', 'workers', 'time'].includes(searchParams.status || '')
            ? searchParams.status as StatusType
            : 'all';

    const {
        reports,
        setReports,
        loading,
        error,
        pagination,
        updatePagination,
        loadReports
    } = useAllReports({
        objectId,
        startDate: searchParams.start,
        endDate: searchParams.end,
        page: Number(searchParams.page) || 1,
        limit: Number(searchParams.limit) || 10,
        sort: validatedSort,
        status: validatedStatus
    });

    useEffect(() => {
        return () => {
            if (abortController) {
                abortController.abort();
            }
        };
    }, [abortController]);

    const handleLoadReports = useCallback(async () => {
        const controller = new AbortController();
        setAbortController(controller);

        try {
            await loadReports(controller.signal);
        } catch (err) {
            if (err instanceof Error) {
                if (err.name !== 'AbortError') {
                    toast.error(err.message);
                }
            } else {
                toast.error('Произошла неизвестная ошибка при загрузке отчетов');
            }
        }
    }, [loadReports]);

    const handlePageChange = useCallback((newPage: number) => {
        if (abortController) {
            abortController.abort();
        }
        updatePagination(newPage);
        handleLoadReports();
    }, [abortController, updatePagination, handleLoadReports]);

    const handleLimitChange = useCallback((newLimit: number) => {
        if (abortController) {
            abortController.abort();
        }
        updatePagination(1, newLimit);
        handleLoadReports();
    }, [abortController, updatePagination, handleLoadReports]);

    const handleRowClick = useCallback((report: IReport) => {
        setSelectedReport(report);
    }, []);

    const handleCloseModal = useCallback(() => {
        setSelectedReport(null);
    }, []);

    const handleSaveReport = useCallback((updatedReport: IReport) => {
        setReports(prev => prev.map(r =>
            r._id === updatedReport._id ? updatedReport : r
        ));
        toast.success('Изменения успешно сохранены');
    }, [setReports]);

    if (loading) return <LoadingSpinner />;

    if (error) return (
        <div className="p-4 text-red-500 dark:text-red-400">
            {error}
            <Button
                variant="outline"
                className="mt-2"
                onClick={handleLoadReports}
            >
                Повторить попытку
            </Button>
        </div>
    );

    if (reports.length === 0) return (
        <div className="p-4 text-gray-800 dark:text-gray-200">
            Нет отчетов по заданным критериям
            <Button
                variant="outline"
                className="mt-2"
                onClick={handleLoadReports}
            >
                Обновить
            </Button>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-left">Сотрудник</th>
                        <th className="px-4 py-2 text-left">Дата</th>
                        <th className="px-4 py-2 text-left">Медиа</th>
                        <th className="px-4 py-2 text-left">Статус</th>
                        <th className="px-4 py-2 text-left">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.map(report => (
                        <tr
                            key={report._id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-200 dark:border-gray-600"
                            onClick={() => handleRowClick(report)}
                        >
                            <td className="px-4 py-2">
                                {report.user?.name || 'Не указан'}
                            </td>
                            <td className="px-4 py-2">
                                {new Date(report.timestamp).toLocaleDateString('ru-RU')}
                            </td>
                            <td className="px-4 py-2">
                                {report.media?.drive_link && (
                                    <a
                                        href={report.media.drive_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="text-blue-500 hover:underline dark:text-blue-400 flex items-center"
                                    >
                                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                                        <span className="text-xs">Медиа</span>
                                    </a>
                                )}
                            </td>
                            <td className="px-4 py-2">
                                <ReportStatusBadges report={report} />
                            </td>
                            <td className="px-4 py-2">
                                <Button
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRowClick(report);
                                    }}
                                >
                                    Заполнить
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChangeAction={handlePageChange}
                    itemsPerPage={pagination.limit}
                    onItemsPerPageChange={handleLimitChange}
                />
            )}

            {selectedReport && (
                <ReportCardModal
                    report={selectedReport}
                    onCloseAction={handleCloseModal}
                    onSaveAction={handleSaveReport}
                />
            )}
        </div>
    );
});

EditReportsTable.displayName = 'EditReportsTable';

const ReportStatusBadges = memo(({ report }: { report: IReport }) => {
    const taskStatus = report.analysis?.task ? '✓' : '✗';
    const workersCount = report.analysis?.workers?.length || 0;
    const timeValue = report.analysis?.time || 0;

    return (
        <div className="flex gap-1 flex-wrap">
            <span className={`px-2 py-1 text-xs rounded-full ${
                report.analysis?.task
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
                Задача: {taskStatus}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
                workersCount > 0
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
                Рабочие: {workersCount}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
                timeValue > 0
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
                Время: {timeValue} ч
            </span>
        </div>
    );
});

ReportStatusBadges.displayName = 'ReportStatusBadges';