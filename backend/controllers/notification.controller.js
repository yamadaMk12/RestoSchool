import Notification from '../models/Notification.js';
import User from '../models/User.js';
import Logger from '../utils/logger.js';

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

export { getNotifications, markAsRead, markAllAsRead, sendNotification };

/**
 * @desc    Admin sends notification to all or specific users
 * @route   POST /api/notifications/send
 * @access  Private/Admin
 */
const sendNotification = async (req, res) => {
    const { titre, message, target, cefs } = req.body;

    if (!titre || !message || !target) {
        return res.status(400).json({ message: 'Titre, message et cible sont requis' });
    }

    try {
        let targetCefs = [];

        if (target === 'all') {
            const users = await User.find({ role: 'stagiaire' }).select('CEF');
            targetCefs = users.map(u => u.CEF);
        } else if (target === 'specific') {
            if (!cefs || !Array.isArray(cefs) || cefs.length === 0) {
                return res.status(400).json({ message: 'Veuillez sélectionner au moins un utilisateur' });
            }
            targetCefs = cefs;
        } else {
            return res.status(400).json({ message: 'Cible invalide' });
        }

        const notifications = targetCefs.map(cef => ({
            cef,
            titre,
            message,
            type: 'info',
            isRead: false
        }));

        await Notification.insertMany(notifications);

        await Logger.log(req.user.CEF, 'admin', 'NOTIFICATION_SENT', {
            target,
            count: targetCefs.length,
            titre
        });

        res.status(201).json({
            message: `Notification envoyée à ${targetCefs.length} utilisateur(s)`,
            count: targetCefs.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'envoi de la notification' });
    }
};
