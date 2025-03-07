// server/src/controllers/reportController.ts

import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import Report, { IReport } from '../models/Report.ts';
import { BadRequestError, NotFoundError } from '../errors/errorClasses.ts';
import { format, parse } from 'date-fns';
import mongoose from 'mongoose';

declare module 'express' {
    interface Request {
        params: {
            [key: string]: string;
        };
    }
}

interface WorkerReportRequest extends Request {
    params: {
        workerName: string;
    };
    query: {
        start: string;
        end: string;
    } & ParsedQs;
}

interface ObjectReportRequest extends Request {
    params: {
        objectName: string;
    };
    query: {
        start: string;
        end: string;
    } & ParsedQs;
}

type ReportDocument = Omit<IReport, '_id'> & {
    _id: mongoose.Types.ObjectId;
};

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

const asyncHandler = <T extends Request>(
    fn: (req: T, res: Response, next: NextFunction) => Promise<void>
) => async (req: T, res: Response, next: NextFunction) => {
    try {
        await fn(req, res, next);
    } catch (err) {
        if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError(`Invalid ${err.path}: ${err.value}`));
        } else if (err instanceof Error) {
            next(err);
        } else {
            next(new Error('Unknown error occurred'));
        }
    }
};

export const getAllReports = asyncHandler<Request>(async (_req, res) => {
    const reports = await Report.find()
        .select('-__v')
        .lean<Array<ReportDocument>>();

    if (reports.length === 0) {
        throw new NotFoundError("Запрашиваемый ресурс не найден", {
            details: "Отчеты отсутствуют в базе данных"
        });
    }

    res.json({
        success: true,
        data: reports.map(report => ({
            ...report
        }))
    });
});

export const getWorkerPeriodReports = asyncHandler<WorkerReportRequest>(
    async (req, res) => {
        const rawWorkerName = req.params.workerName;
        const workerName = decodeURIComponent(decodeURIComponent(rawWorkerName));

        if (!workerName.trim()) {
            throw new BadRequestError('Invalid worker name', {
                received: rawWorkerName,
                decoded: workerName
            });
        }

        const { start, end } = req.query;
        const startDate = new Date(start);
        const endDate = new Date(end);
        validateDates(startDate, endDate);
console.log("workerName: ", workerName);
        const reports = await Report.find({
            'analysis.workers': workerName,
            timestamp: { $gte: startDate, $lte: endDate }
        })
            .select('timestamp analysis video transcript')
            .sort({ timestamp: 1 })
            .lean<Array<ReportDocument>>();

        console.log("reports: ", reports);

        if (reports.length === 0) {
            throw new NotFoundError("Запрашиваемые данные не найдены", {
                period: { start, end },
                workerName,
                suggestion: "Проверьте параметры запроса"
            });
        }

        const processedReports = reports.map(report => ({
            ...report,
            video: {
                ...report.video,
                metadata: {
                    ...report.video.metadata,
                    creation_date: report.video.metadata?.creation_date
                        ? parseCreationDate(report.video.metadata.creation_date).toISOString()
                        : undefined
                }
            }
        }));

        res.json({
            success: true,
            count: processedReports.length,
            data: processedReports.map(report => ({
                ...report,
                objectName: report.analysis.objectName || "ТРК Небо"
            }))
        });
    }
);

export const getObjectPeriodReports = asyncHandler<ObjectReportRequest>(async (req, res) => {
    const { objectName } = req.params;
    const { start, end } = req.query;

    if (!objectName.trim()) {
        throw new BadRequestError('Object name is required');
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    validateDates(startDate, endDate);

    const reports = await Report.find({
        'analysis.objectName': objectName,
        timestamp: { $gte: startDate, $lte: endDate }
    }).lean<Array<ReportDocument>>();

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

    const employees = Array.from(employeesMap.values()).map(emp => ({
        ...emp,
        totalCost: emp.totalHours * emp.rate,
        dailyHours: generateDailyHours(emp.dailyHours, start, end)
    }));

    res.json({
        success: true,
        objectName,
        period: { start, end },
        employees,
        totalHours: employees.reduce((sum, emp) => sum + emp.totalHours, 0),
        totalCost: employees.reduce((sum, emp) => sum + emp.totalCost, 0)
    });
});

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
        result.push(dailyHours[dateKey] || 0);
        current.setDate(current.getDate() + 1);
    }

    return result;
};