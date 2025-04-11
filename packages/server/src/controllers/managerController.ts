// packages/server/src/controllers/managerController.ts
import { Request, Response } from 'express';
import Manager from '../models/Manager.js';
import Object from '../models/Object.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError, BadRequestError } from '../errors/errorClasses.js';

export const updateManagerObject = asyncHandler(async (req: Request, res: Response) => {
    const { objectId } = req.body; // Это наш кастомный ID (например "korzuna")
    const { managerId } = req.user;
console.log({ objectId, managerId });
    console.log("___updateManagerObject___ ");

    if (!objectId) {
        throw new BadRequestError('Object ID is required');
    }

    // Ищем объект по кастомному objectId, а не по _id
    const object = await Object.findOne({ objectId });
    console.log("object_updateManagerObject: ", object);
    if (!object) {
        throw new NotFoundError('Object not found');
    }

    // Обновляем ссылку на объект используя _id из найденного объекта
    const updatedManager = await Manager.findOneAndUpdate(
        { managerId },
        { 'profile.objectRef': object._id }, // Используем MongoDB _id
        { new: true, runValidators: true }
    ).populate('profile.objectRef');

    if (!updatedManager) {
        throw new NotFoundError('Manager not found');
    }

    res.json({
        success: true,
        data: updatedManager
    });
});