// packages/server/src/controllers/reportController.ts

import { Request, Response} from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

import {
    getAllReportService,
    getObjectPeriodReportsService,
    getWorkerPeriodReportsService
} from "../services/reportService.js";
import { BadRequestError } from "../errors/errorClasses.js";
import { asyncHandler } from "../utils/asyncHandler.js";

interface WorkerParams extends ParamsDictionary {
    workerName: string;
}

interface ObjectParams extends ParamsDictionary {
    objectName: string;
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
        const workerName = req.params.workerName;
        console.log(`worker name report controller: ${workerName}`);

        if (!workerName.trim()) {
            throw new BadRequestError('Invalid worker name', {
                received: workerName,
                note: 'Параметр уже декодирован Express'
            });
        }
        const { start, end } = req.query;

        if (typeof start !== 'string' || typeof end !== 'string') {
            throw new BadRequestError('Start and end dates must be valid strings');
        }

        const reports = await getWorkerPeriodReportsService({ workerName, start, end });

        res.json({
            success: true,
            count: reports.length,
            data: reports.map(report => ({
                ...report
            }))
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
        const objectName = req.params.objectName;
        console.log(`object name report controller: ${objectName}`);
        const { start, end } = req.query;

        if (!objectName.trim()) {
            throw new BadRequestError('Object name is required');
        }

        if (typeof start !== 'string' || typeof end !== 'string') {
            throw new BadRequestError('Start and end dates must be valid strings');
        }

        const employees = await getObjectPeriodReportsService({ objectName, start, end });

        res.json({
            success: true,
            data: {
                objectName,
                period: { start, end },
                employees,
                totalHours: employees.reduce((sum, emp) => sum + emp.totalHours, 0),
                totalCost: employees.reduce((sum, emp) => sum + emp.totalCost, 0)
            }
        });
    }
);