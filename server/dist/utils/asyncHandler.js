// server/src/utils/asyncHandler.ts
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/errorClasses.js';
export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next);
        }
        catch (err) {
            if (err instanceof mongoose.Error.CastError) {
                next(new BadRequestError(`Invalid ${err.path}: ${err.value}`));
            }
            else {
                next(err instanceof Error ? err : new Error('Unknown error'));
            }
        }
    };
};
//# sourceMappingURL=asyncHandler.js.map