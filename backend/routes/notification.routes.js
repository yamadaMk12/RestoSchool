import express from 'express';
import { getNotifications, markAsRead, markAllAsRead, sendNotification } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/read-all', markAllAsRead);
router.patch('/:id/read', markAsRead);
router.post('/send', requireRole('admin'), sendNotification);

export default router;
