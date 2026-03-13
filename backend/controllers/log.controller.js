import ActionLog from '../models/ActionLog.js';

/**
 * @desc    Get the last 3 logs
 * @route   GET /api/logs/last
 * @access  Private/Admin
 */
export const getLastLogs = async (req, res) => {
    try {
        const logs = await ActionLog.find()
            .sort({ createdAt: -1 })
            .limit(6);

        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des logs' });
    }
};
