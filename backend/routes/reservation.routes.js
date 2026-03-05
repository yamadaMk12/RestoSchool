import express from 'express';
import { body } from 'express-validator';
import { getReservations, getStatus, createReservation, deleteReservation } from '../controllers/reservation.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { reservationLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getReservations);
router.get('/status', getStatus);

router.post('/', [
    reservationLimiter,
    requireRole('eleve'),
    body('date').notEmpty().withMessage('Date requise'),
    body('repas').isArray({ min: 1 }).withMessage('Au moins un repas requis'),
    validate
], createReservation);

router.delete('/:id', requireRole('eleve'), deleteReservation);

export default router;
