// packages/client/src/utils/helpers.ts

import { IReport, IAnalysisData, IGroupedReports} from "shared";
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

export const formatDate = (
    date: Date | string | undefined,
    formatType: 'dd' | 'dd.MM' | 'full' = 'full'
): string => {
    if (!date) return '-';

    const parsedDate = typeof date === 'string'
        ? new Date(date)
        : date;

    if (isNaN(parsedDate.getTime())) {
        console.warn('Invalid date:', date);
        return '-';
    }

    if (formatType === 'dd') {
        return parsedDate.getDate().toString();
    }

    if (formatType === 'dd.MM') {
        return format(date, "dd.MM")
    }

    return new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(parsedDate);
};

export const extractLocation = (analysis: IAnalysisData): string => {
    return analysis.objectName || "Нет данных об объекте";
};


export const generateDateHeaders = (start: string, end: string): string[] => {
    const dates = [];
    const current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
        dates.push(format(current, 'dd.MM'));
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

export const formatReportPeriod = (startDate: string, endDate: string): string => {
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (isNaN(start.getTime())) return 'Некорректный период';
        if (isNaN(end.getTime())) return 'Некорректный период';

        if (start.getMonth() === end.getMonth()) {
            return format(start, 'LLLL yyyy', { locale: ru });
        }

        return `${format(start, 'dd.MM.yyyy', { locale: ru })} - ${format(end, 'dd.MM.yyyy', { locale: ru })}`;

    } catch (e) {
        console.log(e);
        return 'Некорректный период';
    }
};

export function getColumnLetter(columnIndex: number): string {
    let letter = "";
    while (columnIndex > 0) {
        const modulo = (columnIndex - 1) % 26;
        letter = String.fromCharCode(65 + modulo) + letter;
        columnIndex = Math.floor((columnIndex - modulo) / 26);
    }
    return letter;
}