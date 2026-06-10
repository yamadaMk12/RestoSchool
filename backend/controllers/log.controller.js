import ActionLog from '../models/ActionLog.js';

/**
 * @desc    Get the last 6 logs
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

/**
 * @desc    Get all logs with pagination
 * @route   GET /api/logs
 * @access  Private/Admin
 */
export const getAllLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const total = await ActionLog.countDocuments();
        const logs = await ActionLog.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            logs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLogs: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des logs' });
    }
};
