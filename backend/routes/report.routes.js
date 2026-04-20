import express from 'express';
import { body } from 'express-validator';
import { getReports, createReport, updateReport, updateReportStagiaire, deleteReport } from '../controllers/report.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getReports)
    .post(requireRole('stagiaire'), upload.array('files', 3), [
        body('message').notEmpty().withMessage('Message requis'),
        validate
    ], createReport);

router.patch('/:id', requireRole('admin'), updateReport);

router.put('/:id', requireRole('stagiaire'), upload.array('files', 3), updateReportStagiaire);
router.delete('/:id', requireRole('stagiaire'), deleteReport);

export default router;
