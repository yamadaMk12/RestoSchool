import Reservation from '../models/Reservation.js';
import User from '../models/User.js';
import Logger from '../utils/logger.js';
import { isWindowOpen, getWindowClosedReason } from '../utils/reservationWindow.js';

/**
 * @desc    Get reservations (Admin: all today, Stagiaire: own)
 * @route   GET /api/reservations
 * @access  Private
 */
const getReservations = async (req, res) => {
    try {
        let reservations;
        if (req.user.role === 'admin') {
            const date = req.query.date || new Date().toISOString().split('T')[0];
            reservations = await Reservation.find({ date }).populate('student', 'nom prenom salle');
        } else {
            reservations = await Reservation.find({ cef: req.user.CEF }).sort({ date: -1 });
        }
        res.json(reservations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations' });
    }
};

/**
 * @desc    Check reservation status (window + suspension)
 * @route   GET /api/reservations/status
 * @access  Private
 */
const getStatus = async (req, res) => {
    const canReserve = isWindowOpen() && !req.user.isSuspended;
    let reason = '';

    if (!isWindowOpen()) {
        reason = getWindowClosedReason();
    } else if (req.user.isSuspended) {
        reason = `Votre compte est suspendu jusqu'au ${req.user.suspensionEnd?.toLocaleString('fr-FR')}.`;
    }

    res.json({ canReserve, reason });
};

/**
 * @desc    Create a reservation
 * @route   POST /api/reservations
 * @access  Private/Stagiaire
 */
const createReservation = async (req, res) => {
    const { repas, date } = req.body;

    try {
        // Guards
        if (!isWindowOpen()) {
            return res.status(403).json({ message: getWindowClosedReason() });
        }

        if (req.user.isSuspended) {
            return res.status(403).json({ message: 'Votre compte est suspendu.' });
        }

        const existing = await Reservation.findOne({ cef: req.user.CEF, date });
        if (existing) {
            return res.status(400).json({ message: 'Vous avez déjà une réservation pour cette date.' });
        }

        const reservation = await Reservation.create({
            cef: req.user.CEF,
            date,
            repas
        });

        res.status(201).json(reservation);
        await Logger.log(req.user.CEF, 'stagiaire', 'RESERVATION_CREATED', { reservationId: reservation._id, date });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la réservation' });
    }
};

/**
 * @desc    Cancel a reservation
 * @route   DELETE /api/reservations/:id
 * @access  Private/Stagiaire
 */
const deleteReservation = async (req, res) => {
    try {
        if (!isWindowOpen()) {
            return res.status(403).json({ message: 'Annulation impossible en dehors de la fenêtre.' });
        }

        const reservation = await Reservation.findById(req.params.id);

        if (reservation) {
            if (reservation.cef !== req.user.CEF) {
                return res.status(403).json({ message: 'Non autorisé' });
            }

            await reservation.deleteOne();
            res.json({ message: 'Réservation annulée' });
            await Logger.log(req.user.CEF, 'stagiaire', 'RESERVATION_CANCELLED', { reservationId: req.params.id });
        } else {
            res.status(404).json({ message: 'Réservation non trouvée' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'annulation' });
    }
};

export { getReservations, getStatus, createReservation, deleteReservation };
