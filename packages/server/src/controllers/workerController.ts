// packages/server/src/controllers/workerController.ts
import { Request, Response, NextFunction } from 'express';
import Worker from '../models/Worker.js';
import { NotFoundError } from '../errors/errorClasses.js';
import { updateWorkerObject, createWorker } from "../services/workerService.js";
import { IObject } from "shared";
import mongoose from "mongoose";

export const getAllWorkers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const workers = await Worker.find()
            .populate('objectRef')
            .select('name workerId position salary_rate objectRef telegram_username')
            .lean();

        if (workers.length === 0) {
            throw new NotFoundError('Сотрудники не найдены');
        }

        res.json({
            success: true,
            data: workers.map(worker => ({
                _id: worker._id.toString(),
                name: worker.name,
                workerId: worker.workerId,
                position: worker.position,
                salary_rate: worker.salary_rate,
                telegram_username: worker.telegram_username,
                objectRef: worker.objectRef ? {
                    _id: worker.objectRef._id.toString(),
                    objectId: (worker.objectRef as any).objectId,
                    name: (worker.objectRef as any).name
                } : null
            }))
        });
    } catch (err) {
        next(err);
    }
};

export const updateWorkerObjectHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { workerId } = req.params;
        const { action, userObjectId: userObjectIdStr } = req.body;
        const userObjectId = userObjectIdStr ? new mongoose.Types.ObjectId(userObjectIdStr) : null;

        const worker = await updateWorkerObject(workerId, userObjectId, action);

        res.json({
            success: true,
            data: {
                ...worker.toObject(),
                objectRef: worker.objectRef
                    ? {
                        _id: worker.objectRef._id.toString(),
                        name: (worker.objectRef as IObject).name
                    }
                    : null
            }
        });
    } catch (err) {
        next(err);
    }
};

export const createWorkerHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, position, salary_rate, objectRef, telegram_username } = req.body;
        const worker = await createWorker(name, position, salary_rate, objectRef, telegram_username);

        res.json({
            success: true,
            data: {
                ...worker.toObject(),
                objectRef: worker.objectRef
                    ? {
                        _id: worker.objectRef._id.toString(),
                        name: (worker.objectRef as IObject).name
                    }
                    : null
            }
        });
    } catch (err) {
        next(err);
    }
};