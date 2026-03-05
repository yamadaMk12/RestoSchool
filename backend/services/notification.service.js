import Notification from '../models/Notification.js';

/**
 * Service to handle sending notifications.
 */
class NotificationService {
    /**
     * Create and send a notification to a specific user.
     * @param {string} cef - User CEF
     * @param {Object} data - Notification data
     * @param {string} data.titre - Title
     * @param {string} data.message - Message body
     * @param {string} data.type - Type (confirmation, sanction, levee_suspension, info)
     */
    async send(cef, { titre, message, type }) {
        return await Notification.create({
            cef,
            titre,
            message,
            type
        });
    }
}

export default new NotificationService();
