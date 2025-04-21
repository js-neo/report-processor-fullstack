// packages/server/src/middleware/corsMiddleware.ts

import { RequestHandler } from 'express';

const allowedCors = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5000",
    "https://report-processor-fullstack-client.vercel.app",
    "https://report-processor-fullstack.onrender.com",
    "https://*.vercel.app",
    "https://*.github.dev",
    "https://*.githubusercontent.com",
    "https://*.cron-job.org"
];

export const corsMiddleware: RequestHandler = (req, res, next) => {
    const { origin } = req.headers;

    res.header('Vary', 'Origin');

    if (origin && allowedCors.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        );
        res.header(
            "Access-Control-Allow-Methods",
            "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        );
        res.header("Access-Control-Allow-Credentials", "true");
    }

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Max-Age', '86400');
        res.sendStatus(204);
        return;
    }

    next();
};