/**
 * Utility to check if the reservation window is currently open.
 * Window: J-1 18:00 to J 08:00
 * @returns {boolean}
 */
export function isWindowOpen() {
    const now = new Date();
    const h = now.getHours();

    // Open from 18:00 (6 PM) to 08:00 (8 AM)
    return h >= 18 || h < 8;
}

/**
 * Get a reason why the window might be closed.
 * @returns {string}
 */
export function getWindowClosedReason() {
    if (isWindowOpen()) return '';
    return 'La fenêtre de réservation est fermée. Les réservations sont possibles entre 18:00 et 08:00.';
}
