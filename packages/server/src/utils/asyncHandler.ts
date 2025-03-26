// server/src/utils/asyncHandler.ts

import {
    Request,
    Response,
    NextFunction,
    RequestHandler
} from 'express';
import {
    ParamsDictionary,
} from 'express-serve-static-core';
import mongoose from 'mongoose';
import { BadRequestError } from '../errors/errorClasses.js';
import { ParsedQs } from 'qs';

type AsyncRequestHandler<
    P = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs
> = (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
) => Promise<void>;

export const asyncHandler = <
    P extends ParamsDictionary = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = ParsedQs
>(
    fn: AsyncRequestHandler<P, ResBody, ReqBody, ReqQuery>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next);
        } catch (err) {
            if (err instanceof mongoose.Error.CastError) {
                next(new BadRequestError(`Invalid ${err.path}: ${err.value}`));
            } else {
                next(err instanceof Error ? err : new Error('Unknown error'));
            }
        }
    };
};