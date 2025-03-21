// server/src/controllers/reportController.ts

import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';

import {
    getAllReportService,
    getObjectPeriodReportsService,
    getWorkerPeriodReportsService
} from "../services/reportService.js";
import {BadRequestError} from "../errors/errorClasses.js";
import mongoose from "mongoose";


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
    const reports = await getAllReportService();
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
        const reports = await getWorkerPeriodReportsService({workerName, start, end});

        res.json({
            success: true,
            count: reports.length,
            data: reports.map(report => ({
                ...report
            }))
        });
    }
);

export const getObjectPeriodReports = asyncHandler<ObjectReportRequest>(async (req, res) => {
    const rawObjectName  = req.params.objectName;
    const { start, end } = req.query;

    const objectName = decodeURIComponent(decodeURIComponent(rawObjectName));

    if (!objectName.trim()) {
        throw new BadRequestError('Object name is required');
    }

    const employees = await getObjectPeriodReportsService({objectName, start, end});

    res.json({
        success: true,
        data: {
            objectName,
            period: { start, end },
            employees,
            totalHours: employees.reduce((sum, emp) =>
                sum + emp.totalHours, 0),
            totalCost: employees.reduce((sum, emp) =>
                sum + emp.totalCost, 0)
        }
    });
});
