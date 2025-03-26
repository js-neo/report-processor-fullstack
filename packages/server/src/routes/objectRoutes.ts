// server/src/routes/objectRoutes.ts
import express from 'express';
import { getAllObjects } from '../controllers/objectController.js';

const router = express.Router();

router.get('/', getAllObjects);

export default router;