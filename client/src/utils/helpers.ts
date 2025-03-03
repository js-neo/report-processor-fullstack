// client/src/utils/helpers.ts

import { IReport, IAnalysisData, IGroupedReports } from '@/interfaces/report.interface';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export const groupByDay = (reports: IReport[]): IGroupedReports => {
    return reports.reduce((acc, report) => {
        const dateKey = new Date(report.timestamp).toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(report);
        return acc;
    }, {} as IGroupedReports);
};

export const formatDate = (date: Date | string, format: 'dd' | 'full' = 'full') => {
    const d = new Date(date);
    if (format === 'dd') return d.getDate().toString();
    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(d);
};

export const extractLocation = (analysis: IAnalysisData): string => {
    return analysis.objectName;
};


export const generateDateHeaders = (start: string, end: string): string[] => {
    const dates = [];
    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
        dates.push(format(current, 'dd.MM'));
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

export const formatReportPeriod = (start: string, end: string): string => {
    return `${format(new Date(start), 'LLLL yyyy', { locale: ru })} - ${format(new Date(end), 'dd.MM')}`;
};