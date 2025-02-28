import express, { Express} from 'express';
import connectDB from './config/db.ts';
import reportRoutes from './routes/reportRoutes.ts';
import { errorHandler, notFoundHandler } from './utils/errorHandler.ts';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/reports', reportRoutes);

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