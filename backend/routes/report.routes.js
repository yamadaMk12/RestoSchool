import express from 'express';
import { body } from 'express-validator';
import { getReports, createReport, updateReport } from '../controllers/report.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getReports)
    .post(requireRole('eleve'), [
        body('message').notEmpty().withMessage('Message requis'),
        validate
    ], createReport);

router.patch('/:id', requireRole('admin'), updateReport);

export default router;
