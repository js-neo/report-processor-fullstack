// packages/server/src/controllers/workerController.ts
import { Request, Response, NextFunction } from 'express';
import Worker from '../models/Worker.js';
import { NotFoundError } from '../errors/errorClasses.js';
import {WorkerService} from "../services/workerService.js";
import {IObject} from "shared";

export const getAllWorkers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const workers = await Worker.find()
            .populate('objectRef')
            .select('name workerId username position salary_rate objectRef')
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

export const updateWorkerObject = async (req: Request, res: Response, next: NextFunction) => {
    console.log('updateWorkerObject', req.body);
    try {
        const { workerId } = req.params;
        console.log("workerId_controller: ", workerId);
        const { action, userObjectId } = req.body;
        console.log("action_controller: ", action );
        console.log("userObjectId_controller: ", userObjectId);

        const service = new WorkerService();
        const worker = await service.updateWorkerObject(
            workerId,
            userObjectId,
            action
        );

        res.json({
            success: true,
            data: {
                ...worker.toObject(),
                objectRef: worker.objectRef
                    ? {
                        _id: worker.objectRef._id,
                        name: (worker.objectRef as IObject).name
                    }
                    : null
            }
        });
    } catch (err) {
        next(err);
    }
};