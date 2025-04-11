// packages/server/src/routes/reportRoutes.ts
import express from 'express';
import {
    getAllReports,
    getWorkerPeriodReports,
    getObjectPeriodReports,
    getUnfilledReports
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/', getAllReports);
router.get('/workers/:workerName/period', getWorkerPeriodReports);
router.get('/objects/:objectName/period', getObjectPeriodReports);
router.get('/unfilled', getUnfilledReports);

export default router;