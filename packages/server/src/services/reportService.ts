// packages/server/src/services/reportService.ts
import Report, { IReport, IPartialReport } from '../models/Report.js';
import { NotFoundError, BadRequestError } from '../errors/errorClasses.js';
import { validateDates, generateDailyHours } from "../utils/dateUtils.js";
import { format } from "date-fns";
import { IWorker } from "../models/Worker.js";
import { IObjectReportEmployee } from "shared";

type IReportParams = {
    start: string;
    end: string;
} & (
    | { workerName: string; objectName?: never }
    | { objectName: string; workerName?: never }
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

    console.log({startDate, endDate});
    validateDates(startDate, endDate);

    const reports = await Report.find({
        'analysis.workers.name': workerName,
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
                creation_date: report.media.metadata?.creation_date || undefined
            }
        }
    }));
};

export const getObjectPeriodReportsService = async ({objectName, start, end}: IReportParams): Promise<IObjectReportEmployee[]> => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    validateDates(startDate, endDate);

    const reports = await Report.aggregate([
        {
            $match: {
                'analysis.objectName': objectName,
                timestamp: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $lookup: {
                from: 'workers',
                localField: 'analysis.workers.workerId',
                foreignField: 'workerId',
                as: 'workersData'
            }
        },
        {
            $addFields: {
                'analysis.workers': {
                    $map: {
                        input: '$analysis.workers',
                        as: 'worker',
                        in: {
                            $mergeObjects: [
                                '$$worker',
                                {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$workersData',
                                                as: 'wd',
                                                cond: {
                                                    $eq: ['$$wd.workerId', '$$worker.workerId']
                                                }
                                            }
                                        },
                                        0
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        },
        {
            $project: {
                workersData: 0
            }
        }
    ]);

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

        const dateKey = format(new Date(report.timestamp), 'dd.MM');

        for (const worker of report.analysis.workers) {
            const workerName = worker.name;
            const workerData = worker as IWorker & {
                position?: string;
                salary_rate?: number
            };

            const employee = employeesMap.get(workerName) || {
                id: worker.workerId,
                position: workerData.position || 'Должность не указана',
                workerName: workerName,
                rate: workerData.salary_rate || 0,
                dailyHours: {} as Record<string, number>,
                totalHours: 0
            };

            const currentHours = employee.dailyHours[dateKey] || 0;
            employee.dailyHours[dateKey] = currentHours + report.analysis.time;
            employee.totalHours += report.analysis.time;

            employeesMap.set(workerName, employee);
        }
    }

    return Array.from(employeesMap.values()).map(emp => ({
        ...emp,
        totalCost: emp.totalHours * emp.rate,
        dailyHours: generateDailyHours(emp.dailyHours, start, end)
    }));
};

export const getUnfilledReportsService = async (objectId: string): Promise<IReport[]> => {
    if (!objectId) {
        throw new BadRequestError('objectId is required');
    }

    const reports = await Report.find({
        objectRef: objectId,
        $or: [
            { 'analysis.task': '' },
            { 'analysis.workers': { $size: 0 } },
            { 'analysis.time': 0 }
        ]
    })
        .lean<IReport[]>();

    if (reports.length === 0) {
        throw new NotFoundError("Незаполненные отчеты не найдены", {
            objectId,
            suggestion: "Проверьте правильность objectId или убедитесь, что есть незаполненные отчеты"
        });
    }

    return reports;
};