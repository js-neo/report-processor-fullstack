// packages/server/src/utils/dateUtils.ts

import {BadRequestError} from "../errors/errorClasses.js";
import { parse } from "date-fns";
import { format, toZonedTime } from 'date-fns-tz';

const validateDates = (start: Date, end: Date): void => {
    if (isNaN(start.getTime())) throw new BadRequestError('Invalid start date');
    if (isNaN(end.getTime())) throw new BadRequestError('Invalid end date');
    if (start > end) throw new BadRequestError('End date must be after start date');
};


const parseCreationDate = (dateStr: string): Date => {
    const formats = [
        'yyyy-MM-dd HH:mm:ss XXX',
        'yyyy-MM-dd HH:mm:ss.SSSSSS',
        'yyyy-MM-dd HH:mm:ss',
        'yyyy-MM-dd\'T\'HH:mm:ss.SSSSSS'
    ];

    for (const formatStr of formats) {
        try {
            const parsed = parse(dateStr, formatStr, new Date());
            if (!isNaN(parsed.getTime())) return parsed;
        } catch (e) {
            continue;
        }
    }

    return new Date(dateStr);
};

const generateDailyHours = (
    dailyHours: Record<string, number>,
    start: string,
    end: string
): number[] => {
    const timeZone = 'Europe/Moscow';
    const startDate = toZonedTime(new Date(start), timeZone);
    const endDate = toZonedTime(new Date(end), timeZone);

    const result: number[] = [];
    let current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    while (current <= endDate) {
        const dateKey = format(current, 'dd.MM', { timeZone });
        result.push(dailyHours[dateKey] || 0);
        current.setDate(current.getDate() + 1);
    }

    return result;
};

export { validateDates, parseCreationDate ,generateDailyHours };