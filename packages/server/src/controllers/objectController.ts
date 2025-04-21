// packages/server/src/controllers/objectController.ts

import { Request, Response, NextFunction } from 'express';
import Object from '../models/Object.js';
import { NotFoundError } from '../errors/errorClasses.js';

export const getAllObjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const objects = await Object.find().select('name objectId address managers workers').lean();

        if (objects.length === 0) {
            throw new NotFoundError('Объекты не найдены');
        }

        res.json({
            success: true,
            data: objects.map(obj => ({
                _id: obj._id,
                name: obj.name,
                objectId: obj.objectId,
                address: obj.address,
                workers: obj.workers,
                managers: obj.managers
            }))
        });
    } catch (err) {
        next(err);
    }
};