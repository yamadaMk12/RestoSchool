import User from '../models/User.js';
import Sanction from '../models/Sanction.js';
import Notification from '../models/Notification.js';
import ActionLog from '../models/ActionLog.js';

/**
 * Service to handle application of sanctions.
 */
class SanctionService {
    /**
     * Apply a 24h suspension to a student for an unjustified absence.
     * @param {string} cef - Student CEF
     * @param {string} reservationId - Reservation ID related to the absence
     */
    async applySanction(cef, reservationId) {
        const now = new Date();
        const dateFin = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        // Create Sanction record
        await Sanction.create({
            cef,
            reservationId,
            dateDebut: now,
            dateFin,
            isActive: true
        });

        // Update User status
        await User.findOneAndUpdate(
            { CEF: cef },
            { isSuspended: true, suspensionEnd: dateFin }
        );

        // Send Notification
        await Notification.create({
            cef,
            titre: 'Suspension appliquée',
            message: `Vous avez été suspendu jusqu'au ${dateFin.toLocaleString('fr-FR')} suite à une absence non justifiée.`,
            type: 'sanction'
        });

        // Log Action
        await ActionLog.create({
            cef,
            role: 'stagiaire',
            action: 'SANCTION_APPLIED',
            details: { reservationId, dateFin }
        });
    }
}

export default new SanctionService();
