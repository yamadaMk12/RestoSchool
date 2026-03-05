import Sanction from '../models/Sanction.js';
import User from '../models/User.js';
import NotificationService from '../services/notification.service.js';
import Logger from '../utils/logger.js';

/**
 * @desc    Get all active suspensions
 * @route   GET /api/sanctions/active
 * @access  Private/Admin
 */
const getActiveSanctions = async (req, res) => {
    try {
        const sanctions = await Sanction.find({ isActive: true }).populate('student', 'nom prenom');
        res.json(sanctions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération' });
    }
};

/**
 * @desc    Get all past sanctions history
 * @route   GET /api/sanctions/history
 * @access  Private/Admin
 */
const getSanctionHistory = async (req, res) => {
    try {
        const sanctions = await Sanction.find().sort({ createdAt: -1 }).populate('student', 'nom prenom');
        res.json(sanctions);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération' });
    }
};

/**
 * @desc    Lift suspension manually
 * @route   PATCH /api/sanctions/:userId/lift
 * @access  Private/Admin
 */
const liftSanction = async (req, res) => {
    const { userId } = req.params; // This is the User ID
    const auditorCef = req.user.CEF;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        user.isSuspended = false;
        user.suspensionEnd = null;
        await user.save();

        // Update Sanction records
        await Sanction.updateMany(
            { cef: user.CEF, isActive: true },
            {
                isActive: false,
                leveeParAdmin: auditorCef,
                leveeA: new Date()
            }
        );

        // Notify user
        await NotificationService.send(user.CEF, {
            titre: 'Suspension levée',
            message: 'Votre suspension a été levée par un administrateur. Vous pouvez à nouveau réserver.',
            type: 'levee_suspension'
        });

        res.json({ message: 'Suspension levée avec succès' });
        await Logger.log(auditorCef, 'admin', 'SANCTION_LIFTED', { targetCef: user.CEF });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la levée de la sanction', error: error.message });
    }
};

export { getActiveSanctions, getSanctionHistory, liftSanction };
