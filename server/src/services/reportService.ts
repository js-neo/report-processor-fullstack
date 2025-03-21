// server/src/services/reportService.ts

import Report, { IReport, IPartialReport } from '../models/Report.ts';
import {NotFoundError } from '../errors/errorClasses.ts';
import {validateDates, parseCreationDate, generateDailyHours} from "../utils/dateUtils.ts"
import {format} from "date-fns";

type IReportParams = {
    start: string;
    end: string;
} & (
    |{ workerName: string; objectName?: never }
    |{ objectName: string; workerName?: never }
);


export const getAllReportService = async (): Promise<IReport[]> => {
    const reports = await Report.find()
        .select('-__v')
        .lean<IReport[]>();

    if (reports.length === 0) {
        throw new NotFoundError("Запрашиваемый ресурс не найден", {
            details: "Отчеты отсутствуют в базе данных"
        });
    }
return reports;
};

export const getWorkerPeriodReportsService = async ({workerName, start, end}: IReportParams): Promise<IPartialReport[]> => {
    const startDate = new Date(start);
    const endDate = new Date(end);
        validateDates(startDate, endDate);
        const reports = await Report.find({
            'analysis.workers': workerName,
            timestamp: { $gte: startDate, $lte: endDate }
        })
            .select('timestamp analysis media transcript')
            .sort({ timestamp: 1 })
            .lean<IPartialReport[]>();


        if (reports.length === 0) {
            throw new NotFoundError("Запрашиваемые данные не найдены", {
                period: { startDate, endDate },
                workerName,
                suggestion: "Проверьте параметры запроса"
            });
        }

        return reports.map(report => ({
            ...report,
            media: {
                ...report.media,
                metadata: {
                    ...report.media.metadata,
                    creation_date: report.media.metadata?.creation_date
                        ? parseCreationDate(report.media.metadata.creation_date).toISOString()
                        : undefined
                }
            }
        }));

    }

export const getObjectPeriodReportsService = async ({objectName, start, end}: IReportParams) => {


    const startDate = new Date(start);
    const endDate = new Date(end);
    validateDates(startDate, endDate);

    const reports = await Report.find({
        'analysis.objectName': objectName,
        timestamp: { $gte: startDate, $lte: endDate }
    }).lean();

    if (reports.length === 0) {
        throw new NotFoundError("Запрашиваемый ресурс не найден", {
            objectName,
            period: { start, end },
            suggestion: "Убедитесь в правильности имени объекта"
        });
    }

    const employeesMap = new Map<string, {
        id: string;
        position: string;
        workerName: string;
        rate: number;
        dailyHours: Record<string, number>;
        totalHours: number;
    }>();

    for (const report of reports) {
        if (!report.analysis?.workers?.length) continue;

        const uniqueWorkers = [...new Set(report.analysis.workers)];
        const dateKey = format(report.timestamp, 'dd.MM');

        for (const worker of uniqueWorkers) {
            const employee = employeesMap.get(worker) || {
                id: worker,
                position: 'монтажник',
                workerName: worker,
                rate: 600,
                dailyHours: {},
                totalHours: 0
            };

            employee.dailyHours[dateKey] = (employee.dailyHours[dateKey] || 0) + report.analysis.time;
            employee.totalHours += report.analysis.time;
            employeesMap.set(worker, employee);
        }
    }

    return  Array.from(employeesMap.values()).map(emp => ({
        ...emp,
        totalCost: emp.totalHours * emp.rate,
        dailyHours: generateDailyHours(emp.dailyHours, start, end)
    }));
};
