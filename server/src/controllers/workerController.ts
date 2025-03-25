// server/src/controllers/workerController.ts
import { Request, Response, NextFunction } from 'express';
import Worker from '../models/Worker.js';
import { NotFoundError } from '../errors/errorClasses.js';

export const getAllWorkers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const workers = await Worker.find().select('name worker_id').lean();

        if (workers.length === 0) {
            throw new NotFoundError('Сотрудники не найдены');
        }

        res.json({
            success: true,
            data: workers.map(worker => ({
                _id: worker._id,
                name: worker.name,
                worker_id: worker.worker_id
            }))
        });
    } catch (err) {
        next(err);
    }
};