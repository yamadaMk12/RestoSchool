import Report from '../models/Report.js';
import NotificationService from '../services/notification.service.js';
import Logger from '../utils/logger.js';

/**
 * @desc    Get reports (Admin: all, Eleve: own)
 * @route   GET /api/reports
 * @access  Private
 */
const getReports = async (req, res) => {
    try {
        let reports;
        if (req.user.role === 'admin') {
            reports = await Report.find().sort({ createdAt: -1 }).populate('student', 'nom prenom');
        } else {
            reports = await Report.find({ cef: req.user.CEF }).sort({ createdAt: -1 });
        }
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération' });
    }
};

/**
 * @desc    Create a new report
 * @route   POST /api/reports
 * @access  Private/Eleve
 */
const createReport = async (req, res) => {
    const { message, attachments } = req.body;

    try {
        const report = await Report.create({
            cef: req.user.CEF,
            message,
            attachments
        });

        res.status(201).json(report);
        await Logger.log(req.user.CEF, 'eleve', 'REPORT_CREATED', { reportId: report._id });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création du signalement' });
    }
};

/**
 * @desc    Update report status & response
 * @route   PATCH /api/reports/:id
 * @access  Private/Admin
 */
const updateReport = async (req, res) => {
    const { statut, response } = req.body;

    try {
        const report = await Report.findById(req.params.id);

        if (report) {
            report.statut = statut || report.statut;
            report.response = response || report.response;

            const updatedReport = await report.save();

            if (response) {
                await NotificationService.send(report.cef, {
                    titre: 'Réponse à votre signalement',
                    message: `Une réponse a été apportée à votre signalement: ${response}`,
                    type: 'info'
                });
            }

            res.json(updatedReport);
            await Logger.log(req.user.CEF, 'admin', 'REPORT_UPDATED', { reportId: req.params.id, statut });
        } else {
            res.status(404).json({ message: 'Signalement non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};

export { getReports, createReport, updateReport };
