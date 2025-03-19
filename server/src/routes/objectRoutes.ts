// server/src/routes/objectRoutes.ts
import express from 'express';
import { getAllObjects } from '../controllers/objectController.ts';

const router = express.Router();

router.get('/', getAllObjects);

export default router;