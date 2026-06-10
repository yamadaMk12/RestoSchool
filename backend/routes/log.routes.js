import express from 'express';
import { getLastLogs, getAllLogs } from '../controllers/log.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

// Apply protection and admin role requirement for all routes
router.use(protect);
router.use(requireRole('admin'));

router.get('/last', getLastLogs);
router.get('/', getAllLogs);

export default router;
