import express from 'express';
import {
    getAllReports,
    getReportsByUser,
    getReportsByPeriod
} from '../controllers/reportController.ts';

const router = express.Router();

router.get('/', getAllReports);
router.get('/user/:username', getReportsByUser);
router.get('/user/:username/period', getReportsByPeriod);

export default router;