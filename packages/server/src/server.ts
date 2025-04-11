// packages/server/src/server.ts

import express, { Express } from 'express';
import http from 'http';
import chalk from 'chalk';
import { corsMiddleware } from './middleware/corsMiddleware.js';
import connectDB from './config/db.js';
import reportRoutes from './routes/reportRoutes.js';
import { errorHandler, notFoundHandler } from './utils/errorHandler.js';
import dotenv from 'dotenv';
import workerRoutes from "./routes/workerRoutes.js";
import objectRoutes from "./routes/objectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import managerRoutes from "@/routes/managerRoutes.js";

dotenv.config();

const app: Express = express();

app.set('trust proxy', true);

const PORT: number = parseInt(process.env.PORT || '5000', 10);
const server = http.createServer(app);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

app.get("/", (_req, res) => {
    res.sendStatus(200)
});

app.head("/", (_req, res) => {
    res.sendStatus(200)
});

app.get("/health", (req, res) => {
    const currentTime = new Date().toISOString();

    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIP = Array.isArray(forwardedFor)
        ? forwardedFor[0].split(',')[0].trim()
        : (forwardedFor || req.socket.remoteAddress)?.split(',')[0].trim();

    console.log(`[${currentTime}] Health check from client IP: ${clientIP}`);

    res.json({
        status: "ok",
        timestamp: currentTime,
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/render-port', (_req, res) => {
    res.send(`Port ${PORT} is active`);
});

app.use(corsMiddleware);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/objects', objectRoutes);
app.use('/api/managers', managerRoutes);
console.log('Manager routes mounted at /managers');
app.use(notFoundHandler);
app.use(errorHandler);

process.on('uncaughtException', (error) => {
    console.error('⚠️ Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('⚠️ Unhandled Rejection at:', promise, 'Reason:', reason);
});

const startServer = async () => {
    try {
        server.listen(PORT, '0.0.0.0', () => {
            console.log(chalk.green.bold(`=== Server Configuration ===`));
            console.log(`Render detected port: ${PORT}`);
            console.log(chalk.cyan(`🚀 Server running on port ${PORT}`));
            console.log(chalk.yellow(`Environment: ${process.env.NODE_ENV || 'development'}`));
            console.log(`KeepAlive Timeout: ${server.keepAliveTimeout}ms`);
            console.log(`Headers Timeout: ${server.headersTimeout}ms`);
            console.log(chalk.green.bold(`============================`));
        });
        await connectDB();

    } catch (error) {
        console.error('❌ Startup failed:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};

startServer().catch(e => {
    console.error('💥 Fatal error:', e);
    process.exit(1);
});