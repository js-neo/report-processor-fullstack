// packages/server/src/routes/objectRoutes.ts
import express from 'express';
import {createObjectHandler, getAllObjects} from '../controllers/objectController.js';

const router = express.Router();

router.get('/', getAllObjects);
router.post('/', createObjectHandler);

export default router;