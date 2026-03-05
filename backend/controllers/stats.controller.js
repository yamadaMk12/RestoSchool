import Reservation from '../models/Reservation.js';
import User from '../models/User.js';
import Report from '../models/Report.js';

/**
 * @desc    Dashboard overview statistics
 * @route   GET /api/stats/dashboard
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const totalToday = await Reservation.countDocuments({ date: today });
        const presentsToday = await Reservation.countDocuments({ date: today, statut: 'present' });
        const absentsToday = await Reservation.countDocuments({ date: today, statut: 'absent' });

        const presenceRate = totalToday > 0 ? (presentsToday / totalToday) * 100 : 0;
        const suspendedCount = await User.countDocuments({ isSuspended: true });
        const openReports = await Report.countDocuments({ statut: 'ouverte' });

        res.json({
            totalToday,
            presenceRate: Math.round(presenceRate),
            suspendedCount,
            openReports
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du calcul des statistiques' });
    }
};

/**
 * @desc    Weekly statistics (last 7 days)
 * @route   GET /api/stats/weekly
 * @access  Private/Admin
 */
const getWeeklyStats = async (req, res) => {
    try {
        const stats = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];

            const reservations = await Reservation.countDocuments({ date: dateStr });
            const presents = await Reservation.countDocuments({ date: dateStr, statut: 'present' });

            stats.push({
                date: dateStr,
                reservations,
                presents
            });
        }
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des statistiques hebdomadaires' });
    }
};

/**
 * @desc    Statistics by meal type
 * @route   GET /api/stats/by-meal
 * @access  Private/Admin
 */
const getStatsByMeal = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const allReservationsToday = await Reservation.find({ date: today });

        const counts = {
            petit_dejeuner: 0,
            dejeuner: 0,
            diner: 0
        };

        allReservationsToday.forEach(res => {
            res.repas.forEach(meal => {
                if (counts[meal] !== undefined) counts[meal]++;
            });
        });

        res.json([
            { type: 'Petit-déjeuner', count: counts.petit_dejeuner },
            { type: 'Déjeuner', count: counts.dejeuner },
            { type: 'Dîner', count: counts.diner }
        ]);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors du calcul' });
    }
};

export { getDashboardStats, getWeeklyStats, getStatsByMeal };
