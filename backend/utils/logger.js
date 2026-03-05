import ActionLog from '../models/ActionLog.js';

/**
 * Utility to log administrative and system actions.
 */
class Logger {
    /**
     * Create an action log entry.
     * @param {string} cef - User CEF
     * @param {string} role - User role
     * @param {string} action - Action name
     * @param {Object} details - Additional details
     */
    async log(cef, role, action, details = {}) {
        return await ActionLog.create({
            cef,
            role,
            action,
            details
        });
    }
}

export default new Logger();
