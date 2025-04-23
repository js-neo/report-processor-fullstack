// packages/server/src/utils/dateUtils.ts

import {BadRequestError} from "../errors/errorClasses.js";
import {format, parse} from "date-fns";


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
    const startDate = new Date(start);
    const endDate = new Date(end);
    validateDates(startDate, endDate);

    const result: number[] = [];
    let current = new Date(startDate);

    while (current <= endDate) {
        const dateKey = format(current, 'dd.MM');
        console.log("dateKey_utils: ", dateKey);
        result.push(dailyHours[dateKey] || 0);
        current.setDate(current.getDate() + 1);
    }
    console.log("result_utils: ", result);

    return result;
};

export { validateDates, parseCreationDate ,generateDailyHours };