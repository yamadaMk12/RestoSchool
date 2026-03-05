/**
 * Middleware to restrict access based on user role.
 * @param {string} role - Required role ('admin' or 'eleve')
 */
const requireRole = (role) => (req, res, next) => {
    if (req.user && req.user.role === role) {
        next();
    } else {
        res.status(403).json({ message: 'Accès refusé' });
    }
};

export { requireRole };
