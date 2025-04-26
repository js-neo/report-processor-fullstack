// packages/server/src/services/reportService.ts
import Report, { IReport, IPartialReport } from '../models/Report.js';
import Worker from "../models/Worker.js";
import { NotFoundError, BadRequestError } from '../errors/errorClasses.js';
import { validateDates, generateDailyHours } from "../utils/dateUtils.js";
import { format } from "date-fns";
import { IWorker } from "../models/Worker.js";
import Object from "../models/Object.js";
import {IObjectReportEmployee} from "shared";

type IReportParams = {
    start: string;
    end: string;
} & (
    | { workerId: string; objectId?: never }
    | { objectId: string; workerId?: never }
    );

export interface ReportsResponse {
    reports: IReport[];
    total: number;
    pagination: {
        page: number;
        limit: number;
        totalPages: number;
    };
}

interface DateRange {
    start?: string;
    end?: string;
}

interface QueryOptions {
    page?: string | number;
    limit?: string | number;
    sort?: 'asc' | 'desc';
    status?: 'all' | 'filled' | 'edit' | 'task' | 'workers' | 'time';
}

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

export const getWorkerPeriodReportsService = async ({
                                                        workerId = "",
                                                        start,
                                                        end
                                                    }: IReportParams): Promise<{
    reports: IPartialReport[];
    workerName: string;
}> => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    validateDates(startDate, endDate);

    if (!workerId) {
        throw new Error('Отсутствующий идентификатор работника');
    }

    const worker = await Worker.findOne({ workerId })
        .select('name objectRef')
        .populate('objectRef', 'name')
        .lean()
        .exec();

    if (!worker) {
        throw new NotFoundError("Работник не найден", {
            workerId,
            suggestion: "Проверьте идентификатор работника"
        });
    }

    const reports = await Report.find({
        'analysis.workers.workerId': workerId,
        timestamp: { $gte: startDate, $lte: endDate }
    })
        .select('timestamp analysis media transcript objectRef')
        .populate('objectRef', 'name')
        .sort({ timestamp: 1 })
        .lean<IPartialReport[]>();

    if (reports.length === 0) {
        throw new NotFoundError("Запрашиваемые данные не найдены", {
            period: { start, end },
            workerName: worker.name,
            suggestion: "Проверьте параметры запроса"
        });
    }

    return {
        workerName: worker.name,
        reports: reports.map(report => ({
            ...report,
            media: {
                ...report.media,
                metadata: {
                    ...report.media.metadata,
                    creation_date: report.media.metadata?.creation_date || undefined
                }
            },
            objectName: report.objectRef?.name || 'Не указан'
        }))
    };
};

export const getObjectPeriodReportsService = async ({
                                                        objectId,
                                                        start,
                                                        end
                                                    }: IReportParams): Promise<{
    employees: IObjectReportEmployee[];
    objectName: string;
}> => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    validateDates(startDate, endDate);

    const object = await Object.findOne({ objectId })
        .select('name')
        .lean()
        .exec();

    if (!object) {
        throw new NotFoundError("Объект не найден", {
            objectId,
            suggestion: "Проверьте правильность ID объекта"
        });
    }

    const objectName = object.name;

    const reports = await Report.aggregate([
        {
            $match: {
                objectRef: object._id,
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

    console.log("reports_server_service: ", reports);

    if (reports.length === 0) {
        throw new NotFoundError("Отчеты за указанный период не найдены", {
            objectName,
            period: { start, end },
            suggestion: "Проверьте правильность периода"
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
        console.log("report.timestamp_server_service: ", report.timestamp);
        console.log("new Date(report.timestamp)_server_service: ", new Date(report.timestamp));
        console.log("dateKey_server_service: ", dateKey);

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

    console.log("employees_server_service: ", Array.from(employeesMap.values()).map(emp => ({
        start,
        end,
        startDate,
        endDate,
        dailyHours: emp.dailyHours,
        dailyHours_gen: generateDailyHours(emp.dailyHours, start, end)
    })));

    return {
        objectName,
        employees: Array.from(employeesMap.values()).map(emp => ({
            ...emp,
            totalCost: emp.totalHours * emp.rate,
            dailyHours: generateDailyHours(emp.dailyHours, start, end)
        }))
    };
};

export const getAllReportsForPeriodService = async (
    objectId: string,
    dateRange?: { start?: string; end?: string },
    options?: {
        page?: string | number;
        limit?: string | number;
        sort?: 'asc' | 'desc';
        status?: 'all' | 'filled' | 'unfilled' | 'task' | 'workers' | 'time';
    }
): Promise<ReportsResponse> => {
    console.log("objectId_server_service:", objectId);
    if (!objectId) {
        throw new BadRequestError('Объект не указан');
    }

    const page = typeof options?.page === 'string' ? parseInt(options.page) : options?.page ?? 1;
    const limit = typeof options?.limit === 'string' ? parseInt(options.limit) : options?.limit ?? 10;
    const sort = options?.sort ?? 'desc';
    const status = options?.status ?? 'all';

    if (isNaN(page)) throw new BadRequestError('Неверный параметр page');
    if (isNaN(limit)) throw new BadRequestError('Неверный параметр limit');
    if (page < 1) throw new BadRequestError('Номер страницы должен быть ≥ 1');
    if (limit < 1 || limit > 100) throw new BadRequestError('Лимит должен быть 1-100');
    if (!['asc', 'desc'].includes(sort)) throw new BadRequestError('Неверный параметр sort');

    const object = await Object.findOne({ objectId }).lean();
    if (!object) {
        throw new NotFoundError("Объект не найден", { objectId });
    }

    const query: Record<string, any> = {
        objectRef: object._id
    };

    if (dateRange?.start && dateRange?.end) {
        query.timestamp = {
            $gte: new Date(dateRange.start),
            $lte: new Date(dateRange.end)
        };
    } else if (dateRange?.start) {
        query.timestamp = { $gte: new Date(dateRange.start) };
    } else if (dateRange?.end) {
        query.timestamp = { $lte: new Date(dateRange.end) };
    }

    switch (status) {
        case 'filled':
            query.$and = [
                { 'analysis.task': { $exists: true, $ne: null, $nin: ['', undefined] } },
                { 'analysis.workers': { $exists: true, $ne: null, $not: { $size: 0 } } },
                { 'analysis.time': { $exists: true, $ne: null, $gt: 0 } }
            ];
            break;
        case 'unfilled':
            query.$or = [
                { 'analysis.task': { $in: [null, '', undefined] } },
                { 'analysis.workers': { $in: [null, undefined, []] } },
                { 'analysis.time': { $in: [null, undefined, 0] } }
            ];
            break;
        case 'task':
            query.$or = [
                { 'analysis.task': { $in: [null, '', undefined] } },
                { 'analysis.task': { $exists: false } }
            ];
            break;
        case 'workers':
            query.$or = [
                { 'analysis.workers': { $in: [null, undefined, []] } },
                { 'analysis.workers': { $exists: false } }
            ];
            break;
        case 'time':
            query.$or = [
                { 'analysis.time': { $in: [null, undefined, 0] } },
                { 'analysis.time': { $exists: false } }
            ];
            break;
    }

    const [reports, total] = await Promise.all([
        Report.find(query)
            .sort({ timestamp: sort === 'asc' ? 1 : -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean<IReport[]>(),
        Report.countDocuments(query)
    ]);

    return {
        reports,
        total,
        pagination: {
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    };
};

export const updateReportService = async (
    reportId: string,
    updateData: {
        task?: string | null;
        workers?: Array<{ workerId: string; name: string }> | null;
        time?: number | null;
    }
): Promise<IReport> => {
    const updateFields: Record<string, any> = {
        updated_at: new Date()
    };

    if (updateData.task !== undefined) {
        updateFields['analysis.task'] = updateData.task;
    }
    if (updateData.workers !== undefined) {
        updateFields['analysis.workers'] = updateData.workers;
    }
    if (updateData.time !== undefined) {
        updateFields['analysis.time'] = updateData.time;
    }

    console.log("updateData: ", updateData);

    const updatedReport = await Report.findOneAndUpdate(
        { _id: reportId },
        { $set: updateFields },
        { new: true, runValidators: false }
    ).lean();

    if (!updatedReport) {
        throw new NotFoundError('Отчет не найден');
    }

    return updatedReport;
};

