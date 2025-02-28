import { Request, Response, NextFunction } from 'express';
import { ParsedQs } from 'qs';
import Report, { IReport } from '../models/Report.ts';
import { BadRequestError, NotFoundError } from '../errors/errorClasses.ts';

interface CustomRequest<T extends ParsedQs = ParsedQs> extends Request {
    params: {
        username?: string;
    };
    query: T;
}

const asyncHandler = (fn: Function) =>
    (req: Request, res: Response, next: NextFunction) =>
        Promise.resolve(fn(req, res, next)).catch(next);

export const getAllReports = asyncHandler(async (_req: Request, res: Response) => {
    const reports: IReport[] = await Report.find().select('-__v').lean();
    if (reports.length === 0) {
        throw new NotFoundError('No reports found');
    }
    res.json(reports);
});

export const getReportsByUser = asyncHandler(async (
    req: CustomRequest,
    res: Response
) => {
    const { username } = req.params;
    if (!username) {
        throw new BadRequestError('Username is required', {
            receivedParams: req.params
        });
    }

    const reports = await Report.find({ 'user.username': username })
        .select('timestamp analysis video.transcript')
        .sort({ timestamp: -1 })
        .lean();

    if (reports.length === 0) {
        throw new NotFoundError('Reports for user not found', {
            username,
            count: reports.length
        });
    }

    res.json(reports);
});

export const getReportsByPeriod = asyncHandler(async (
    req: CustomRequest<{ start?: string; end?: string }>,
    res: Response
) => {
    const { username } = req.params;
    const { start, end } = req.query;

    if (!username || !start || !end) {
        throw new BadRequestError('Missing parameters', {
            required: ['username', 'start', 'end'],
            received: { username, start, end }
        });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime())) {
        throw new BadRequestError('Invalid start date format', {
            received: start
        });
    }

    if (isNaN(endDate.getTime())) {
        throw new BadRequestError('Invalid end date format', {
            received: end
        });
    }

    const reports = await Report.find({
        'user.username': username,
        timestamp: {
            $gte: startDate,
            $lte: endDate
        }
    })
        .select('timestamp analysis report_logs')
        .sort({ timestamp: 1 })
        .lean();

    if (reports.length === 0) {
        throw new NotFoundError('No reports in this period', {
            start: startDate.toISOString(),
            end: endDate.toISOString()
        });
    }

    res.json(reports);
});