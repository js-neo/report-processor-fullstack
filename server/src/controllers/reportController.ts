import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import Report, { IReport } from '../models/Report.ts';
import { BadRequestError, NotFoundError } from '../errors/errorClasses.ts';
import { format } from 'date-fns';

interface CustomRequest<T extends ParsedQs = ParsedQs> extends Request {
    params: {
        username?: string;
    };
    query: T;
}

interface ObjectReportRequest extends Request {
    params: {
        objectName: string;
    };
    query: {
        start: string;
        end: string;
    };
}

const generateDailyHoursArray = (
    dailyHours: Record<string, number>,
    start: string,
    end: string
) => {
    const result: number[] = [];
    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
        const dateKey = format(current, 'dd.MM');
        result.push(dailyHours[dateKey] || 0);
        current.setDate(current.getDate() + 1);
    }

    return result;
};

const asyncHandler = (fn: Function) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

export const getAllReports = asyncHandler(async (_req: Request, res: Response) => {
    const reports: IReport[] = await Report.find().select('-__v').lean();
    if (reports.length === 0) {
        throw new NotFoundError('No reports found');
    }
    res.json(reports);
});

export const getReportsByUser = asyncHandler(async (
    req: CustomRequest,
    res: Response
) => {
    const { username } = req.params;
    if (!username) {
        throw new BadRequestError('Username is required', {
            receivedParams: req.params
        });
    }

    const reports = await Report.find({ 'analysis.workers': username })
        .select('timestamp analysis video.transcript')
        .sort({ timestamp: -1 })
        .lean();

    if (reports.length === 0) {
        throw new NotFoundError('Reports for user not found', {
            username,
            count: reports.length
        });
    }

    res.json(reports);
});

export const getReportsByPeriod = asyncHandler(async (
    req: CustomRequest<{ start?: string; end?: string }>,
    res: Response
) => {
    const { username } = req.params;
    const { start, end } = req.query;

    if (!username || !start || !end) {
        throw new BadRequestError('Missing parameters', {
            required: ['username', 'start', 'end'],
            received: { username, start, end }
        });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime())) {
        throw new BadRequestError('Invalid start date format', {
            received: start
        });
    }

    if (isNaN(endDate.getTime())) {
        throw new BadRequestError('Invalid end date format', {
            received: end
        });
    }

    const reports = await Report.find({
        'analysis.workers': username,
        timestamp: {
            $gte: startDate,
            $lte: endDate
        }
    })
        .select('timestamp analysis report_logs')
        .sort({ timestamp: 1 })
        .lean();

    if (reports.length === 0) {
        throw new NotFoundError('No reports in this period', {
            start: startDate.toISOString(),
            end: endDate.toISOString()
        });
    }

    res.json(reports);
});

export const getReportsByObject = asyncHandler(
    async (req: ObjectReportRequest, res: Response) => {
        const { objectName } = req.params;
        const { start, end } = req.query;

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (isNaN(startDate.getTime())) {
            throw new BadRequestError('Неверный формат начальной даты');
        }

        if (isNaN(endDate.getTime())) {
            throw new BadRequestError('Неверный формат конечной даты');
        }

        const reports = await Report.find({
            'analysis.objectName': objectName,
            timestamp: {
                $gte: startDate,
                $lte: endDate
            }
        }).lean<IReport[]>();

        const employeesMap = new Map<string, {
            id: string;
            position: string;
            workerName: string;
            rate: number;
            dailyHours: Record<string, number>;
            totalHours: number;
        }>();

        reports.forEach(report => {
            const workers = report.analysis.workers;

            if (workers.length === 0) {
                console.warn(`Отчет ${report._id} не содержит работников`);
                return;
            }

            const uniqueWorkers = [...new Set(workers)];

            uniqueWorkers.forEach(workerUsername => {
                if (!employeesMap.has(workerUsername)) {
                    employeesMap.set(workerUsername, {
                        id: workerUsername,
                        position: 'монтажник',
                        workerName: workerUsername,
                        rate: 600,
                        dailyHours: {},
                        totalHours: 0
                    });
                }

                const employee = employeesMap.get(workerUsername)!;
                const dateKey = format(report.timestamp, 'dd.MM');

                employee.dailyHours[dateKey] = (employee.dailyHours[dateKey] || 0) + report.analysis.time;
                employee.totalHours += report.analysis.time;
            });
        });

        const employees = Array.from(employeesMap.values()).map(emp => ({
            ...emp,
            totalCost: emp.totalHours * emp.rate,
            dailyHours: generateDailyHoursArray(emp.dailyHours, start, end)
        }));

        res.json({
            id: objectName,
            name: objectName,
            employees,
            totalHours: employees.reduce((sum, emp) => sum + emp.totalHours, 0),
            totalCost: employees.reduce((sum, emp) => sum + emp.totalCost, 0)
        });
    }
);