// server/src/controllers/workerController.ts
import { Request, Response, NextFunction } from 'express';
import Worker from '../models/Worker.js';
import { NotFoundError } from '../errors/errorClasses.js';

export const getAllWorkers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const workers = await Worker.find()
            .select('name worker_id username position salary_rate').lean();

        if (workers.length === 0) {
            throw new NotFoundError('Сотрудники не найдены');
        }

        res.json({
            success: true,
            data: workers.map(worker => ({
                _id: worker._id,
                name: worker.name,
                worker_id: worker.worker_id,
                username: worker.username,
                position: worker.position,
                salary_rate: worker.salary_rate,
            }))
        });
    } catch (err) {
        next(err);
    }
};