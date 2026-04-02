import express from 'express';
import { body } from 'express-validator';
import { getReservations, getStatus, createReservation, deleteReservation, updateReservation, bulkCreateReservations } from '../controllers/reservation.controller.js';
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
    requireRole('stagiaire'),
    body('date').notEmpty().withMessage('Date requise'),
    body('repas').isArray({ min: 1 }).withMessage('Au moins un repas requis'),
    validate
], createReservation);

router.delete('/:id', requireRole('stagiaire'), deleteReservation);

router.put('/:id', [
    requireRole('stagiaire'),
    body('repas').isArray({ min: 1 }).withMessage('Au moins un repas requis'),
    validate
], updateReservation);

router.post('/bulk', [
    reservationLimiter,
    requireRole('stagiaire'),
    body('reservations').isArray({ min: 1 }).withMessage('Au moins une réservation requise'),
    validate
], bulkCreateReservations);

export default router;
