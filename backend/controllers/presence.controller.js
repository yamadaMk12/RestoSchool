import Reservation from '../models/Reservation.js';
import Presence from '../models/Presence.js';
import SanctionService from '../services/sanction.service.js';
import Logger from '../utils/logger.js';

/**
 * @desc    Get reservations of today for presence marking
 * @route   GET /api/presence/today
 * @access  Private/Admin
 */
const getTodayReservations = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const reservations = await Reservation.find({ date: today }).populate('student', 'nom prenom');
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération' });
    }
};

/**
 * @desc    Mark present or absent
 * @route   PATCH /api/presence/:reservationId
 * @access  Private/Admin
 */
const markPresence = async (req, res) => {
    const { statut, adminCef } = req.body;
    const { reservationId } = req.params;

    try {
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Réservation non trouvée' });
        }

        // Update reservation status
        reservation.statut = statut;
        await reservation.save();

        // Create or update Presence record
        await Presence.findOneAndUpdate(
            { reservationId },
            {
                cef: reservation.cef,
                date: reservation.date,
                statut,
                marqueParAdmin: adminCef,
                marqueA: new Date()
            },
            { upsert: true }
        );

        // If absent, trigger sanction
        if (statut === 'absent') {
            await SanctionService.applySanction(reservation.cef, reservationId);
        }

        res.json({ message: `Présence marquée: ${statut}` });
        await Logger.log(adminCef, 'admin', 'PRESENCE_MARKED', { reservationId, statut, studentCef: reservation.cef });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du marquage de la présence', error: error.message });
    }
};

export { getTodayReservations, markPresence };
