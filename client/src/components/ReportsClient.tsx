"use client";

import { useReports } from '@/hooks/useReports';
import { ReportsTable } from '@/components/ReportsTable';

export const ReportsClient = () => {
    const { reports, loading, error } = useReports();

    if (loading) return <div className="p-6">Загрузка...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return <ReportsTable data={reports} />;
};