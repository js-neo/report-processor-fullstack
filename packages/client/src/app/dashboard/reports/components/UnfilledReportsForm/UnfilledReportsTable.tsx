// packages/client/src/app/dashboard/reports/components/UnfilledReportsForm/UnfilledReportsForm.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/UI/Button';
import { IReport } from 'shared';
import { useUser } from "@/stores/appStore";
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ReportCardModal } from './ReportCardModal';
import { useUnfilledReports } from '@/hooks/useUnfilledReports';
import { Pagination } from '@/components/UI/Pagination';
import LoadingSpinner from "@/components/Common/LoadingSpinner";

export const UnfilledReportsTable = () => {
    const user = useUser();
    const {
        reports,
        setReports,
        loading,
        error,
        pagination,
        updatePagination
    } = useUnfilledReports({
        objectId: user?.objectRef?.objectId || ''
    });

    const [selectedReport, setSelectedReport] = useState<IReport | null>(null);

    const handlePageChange = (newPage: number) => {
        updatePagination(newPage);
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="p-4 text-red-500">{error}</div>;
    if (reports.length === 0) return <div className="p-4">Нет незаполненных отчетов</div>;

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
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
                            className="hover:bg-gray-50 cursor-pointer"
                            onClick={() => setSelectedReport(report)}
                        >
                            <td className="px-4 py-2">{report.user.name}</td>
                            <td className="px-4 py-2">
                                {new Date(report.timestamp).toLocaleDateString('ru-RU')}
                            </td>
                            <td className="px-4 py-2">
                                <a
                                    href={report.media.drive_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                                    className="text-blue-500 hover:underline flex items-center"
                                >
                                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Медиа</span>
                                </a>
                            </td>
                            <td className="px-4 py-2">
                                <ReportStatusBadges report={report} />
                            </td>
                            <td className="px-4 py-2">
                                <Button
                                    size="sm"
                                    onClick={(e: React.MouseEvent) => {
                                        e.stopPropagation();
                                        setSelectedReport(report);
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

            <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChangeAction={handlePageChange}
            />

            {selectedReport && (
                <ReportCardModal
                    report={selectedReport}
                    onCloseAction={() => setSelectedReport(null)}
                    onSaveAction={(updatedReport) => {
                        setReports(reports.map(r =>
                            r._id === updatedReport._id ? updatedReport : r
                        ));
                    }}
                />
            )}
        </div>
    );
};

const ReportStatusBadges = ({ report }: { report: IReport }) => {
    const taskStatus = report.analysis?.task ? '✓' : '✗';
    const workersCount = report.analysis?.workers?.length || 0;
    const timeValue = report.analysis?.time || 0;

    return (
        <div className="flex gap-1 flex-wrap">
            <span className={`px-2 py-1 text-xs rounded-full ${
                report.analysis?.task ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                Задача: {taskStatus}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
                workersCount > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                Рабочие: {workersCount}
            </span>
            <span className={`px-2 py-1 text-xs rounded-full ${
                timeValue > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
                Время: {timeValue} ч
            </span>
        </div>
    );
};