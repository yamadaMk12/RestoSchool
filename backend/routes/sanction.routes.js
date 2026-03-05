import express from 'express';
import { getActiveSanctions, getSanctionHistory, liftSanction } from '../controllers/sanction.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);
router.use(requireRole('admin'));

router.get('/active', getActiveSanctions);
router.get('/history', getSanctionHistory);
router.patch('/:userId/lift', liftSanction);

export default router;
