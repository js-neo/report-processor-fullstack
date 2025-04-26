// packages/server/src/controllers/reportController.ts
import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import {
    getAllReportService,
    getObjectPeriodReportsService,
    getWorkerPeriodReportsService, updateReportService, getAllReportsForPeriodService
} from "../services/reportService.js";
import { BadRequestError } from "../errors/errorClasses.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface WorkerParams extends ParamsDictionary {
    workerId: string;
}

interface ObjectParams extends ParamsDictionary {
    objectId: string;
}

interface WorkerQuery {
    start?: string;
    end?: string;
}

interface ObjectQuery {
    start?: string;
    end?: string;
}

export const getAllReports = asyncHandler(
    async (_req: Request, res: Response) => {
        const reports = await getAllReportService();
        res.json({
            success: true,
            data: reports.map(report => ({
                ...report
            }))
        });
    }
);

export const getWorkerPeriodReports = asyncHandler<
    WorkerParams,
    any,
    any,
    WorkerQuery
>(
    async (req, res) => {
        const workerId = req.params.workerId;
        console.log(`worker name report controller: ${workerId}`);

        if (!workerId.trim()) {
            throw new BadRequestError('Invalid worker name', {
                received: workerId,
                note: 'Параметр уже декодирован Express'
            });
        }
        const { start, end } = req.query;

        if (typeof start !== 'string' || typeof end !== 'string') {
            throw new BadRequestError('Start and end dates must be valid strings');
        }

        const {workerName, reports} = await getWorkerPeriodReportsService({ workerId, start, end });
        console.log("reports_controller: ", reports);

        res.json({
            success: true,
            count: reports.length,
            data: {
                workerName,
                reports: reports.map(report => ({
                ...report,
                timestamp: report.timestamp.toISOString()
            }))}
        });
    }
);

export const getObjectPeriodReports = asyncHandler<
    ObjectParams,
    any,
    any,
    ObjectQuery
>(
    async (req, res) => {
        const objectId = req.params.objectId;
        console.log(`object name report controller: ${objectId}`);
        const { start, end } = req.query;

        if (!objectId.trim()) {
            throw new BadRequestError('Object name is required');
        }

        if (typeof start !== 'string' || typeof end !== 'string') {
            throw new BadRequestError('Start and end dates must be valid strings');
        }

        const {objectName: name, employees} = await getObjectPeriodReportsService({ objectId, start, end });

        res.json({
            success: true,
            data: {
                objectName: name,
                period: { start, end },
                employees,
                totalHours: employees.reduce((sum, emp) => sum + emp.totalHours, 0),
                totalCost: employees.reduce((sum, emp) => sum + emp.totalCost, 0)
            }
        });
    }
);

interface getAllReportsForPeriodQuery {
    start?: string;
    end?: string;
    page?: string;
    limit?: string;
    sort?: 'asc' | 'desc';
    status?: 'all' | 'filled' | 'unfilled' | 'task' | 'workers' | 'time';
}

export const getAllReportsForPeriod = asyncHandler<
    { objectId: string },
    any,
    any,
    getAllReportsForPeriodQuery
>(async (req, res) => {
    const { objectId } = req.params;
    const { start, end, page = '1', limit = '10', sort = 'desc', status = 'all' } = req.query;

    console.log(`object name report controller: ${objectId}`);

    if (start && end && new Date(start) > new Date(end)) {
        throw new BadRequestError('Конечная дата должна быть позже начальной');
    }

    const result = await getAllReportsForPeriodService(
        objectId,
        { start, end },
        { page, limit, sort, status }
    );

    console.log("reports_controller: ", result);

    res.json({
        success: true,
        data: result.reports.map(report => ({
            ...report,
            timestamp: report.timestamp.toISOString(),
            objectId
        })),
        pagination: result.pagination,
        total: result.total
    });
});

export const updateReport = asyncHandler(
    async (req: Request<{ reportId: string }>, res: Response) => {
        const { reportId } = req.params;
        const { analysis } = req.body;
        console.log("analysis_updateReport: ", analysis);

        if (!analysis) {
            throw new BadRequestError('Не переданы данные для обновления');
        }

        const updatedReport = await updateReportService(reportId, analysis);

        res.json({
            success: true,
            data: updatedReport
        });
    }
);