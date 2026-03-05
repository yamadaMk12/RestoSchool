import express from 'express';
import { getTodayReservations, markPresence } from '../controllers/presence.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/today', getTodayReservations);
router.patch('/:reservationId', markPresence);

export default router;
