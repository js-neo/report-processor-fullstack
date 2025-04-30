// packages/server/src/controllers/objectController.ts
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '../errors/errorClasses.js';
import { getAllObjects as getAllObjectsService, createObject as createObjectService } from '../services/objectService.js';

export const getAllObjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const objects = await getAllObjectsService();

        if (objects.length === 0) {
            throw new NotFoundError('Объекты не найдены');
        }

        res.json({
            success: true,
            data: objects.map(obj => ({
                _id: obj._id.toString(),
                name: obj.name,
                objectId: obj.objectId,
                address: obj.address,
                coordinates: obj.coordinates
            }))
        });
    } catch (err) {
        next(err);
    }
};

export const createObjectHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, address } = req.body;

        const newObject = await createObjectService({ name, address });

        res.status(201).json({
            success: true,
            data: {
                _id: newObject._id.toString(),
                objectId: newObject.objectId,
                name: newObject.name,
                address: newObject.address,
                coordinates: newObject.coordinates,
                created_at: newObject.created_at
            }
        });
    } catch (err) {
        if (err instanceof Error) {
            if (err.message.includes('duplicate key error')) {
                next(new BadRequestError('Object with this ID already exists'));
            } else {
                next(err);
            }
        } else {
            next(new Error('Unknown error occurred'));
        }
    }
};