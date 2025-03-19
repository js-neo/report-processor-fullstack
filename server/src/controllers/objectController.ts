// server/src/controllers/objectController.ts
import { Request, Response, NextFunction } from 'express';
import Object from '../models/Object.ts';
import { NotFoundError } from '../errors/errorClasses.ts';

export const getAllObjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const objects = await Object.find().select('name object_id').lean();

        if (objects.length === 0) {
            throw new NotFoundError('Объекты не найдены');
        }

        res.json({
            success: true,
            data: objects.map(obj => ({
                _id: obj._id,
                objectName: obj.name
            }))
        });
    } catch (err) {
        next(err);
    }
};