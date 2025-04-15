// packages/server/src/controllers/managerController.ts
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Manager from '../models/Manager.js';
import Object from '../models/Object.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError, BadRequestError } from '../errors/errorClasses.js';

export const updateManagerObject = asyncHandler(async (req: Request, res: Response) => {
    const { objectId } = req.body;
    const { managerId } = req.user;
    console.log({ objectId, managerId });

    function isValidObjectId(id: string): boolean {
        return ObjectId.isValid(id) && new ObjectId(id).toString() === id;
    }

    if (!isValidObjectId(objectId)) {
        throw new BadRequestError('Invalid object ID format');
    }

    const object = await Object.findOne({ _id: new ObjectId(String(objectId)) });

    console.log("object: ", object);
    if (!object) {
        throw new NotFoundError('Object not found');
    }

    const updatedManager = await Manager.findOneAndUpdate(
        { managerId },
        { 'profile.objectRef': object._id },
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