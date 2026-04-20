/**
 * Utility to check if the reservation window is currently open.
 * Window: All day Sunday
 * @returns {boolean}
 */
export function isWindowOpen() {
    const now = new Date();
    return now.getDay() === 0;
}

/**
 * Get a reason why the window might be closed.
 * @returns {string}
 */
export function getWindowClosedReason() {
    if (isWindowOpen()) return '';
    return 'Les réservations hebdomadaires sont ouvertes uniquement le dimanche.';
}
