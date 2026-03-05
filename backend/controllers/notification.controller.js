import Notification from '../models/Notification.js';

/**
 * @desc    Get user's notifications
 * @route   GET /api/notifications
 * @access  Private
 */
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ cef: req.user.CEF }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération' });
    }
};

/**
 * @desc    Mark one notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (notification) {
            if (notification.cef !== req.user.CEF) {
                return res.status(403).json({ message: 'Non autorisé' });
            }

            notification.isRead = true;
            await notification.save();
            res.json(notification);
        } else {
            res.status(404).json({ message: 'Notification non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du marquage comme lu' });
    }
};

/**
 * @desc    Mark all notifications as read
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ cef: req.user.CEF, isRead: false }, { isRead: true });
        res.json({ message: 'Toutes les notifications marquées comme lues' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du marquage globale' });
    }
};

export { getNotifications, markAsRead, markAllAsRead };
