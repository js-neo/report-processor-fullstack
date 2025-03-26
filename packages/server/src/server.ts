// server/src/server.ts

import express, { Express } from 'express';
import { cors } from './middleware/cors.js';
import connectDB from './config/db.js';
import reportRoutes from './routes/reportRoutes.js';
import { errorHandler, notFoundHandler } from './utils/errorHandler.js';
import dotenv from 'dotenv';
import workerRoutes from "./routes/workerRoutes.js";
import objectRoutes from "./routes/objectRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;

app.use(cors);
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/objects', objectRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Startup failed:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
};

startServer().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});