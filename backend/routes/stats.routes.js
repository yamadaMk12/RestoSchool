import express from 'express';
import { getDashboardStats, getWeeklyStats, getStatsByMeal } from '../controllers/stats.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/weekly', getWeeklyStats);
router.get('/by-meal', getStatsByMeal);

export default router;
