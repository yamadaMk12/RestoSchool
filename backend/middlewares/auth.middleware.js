import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware to verify JWT token and attach user to request object.
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findOne({ CEF: decoded.cef }).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Utilisateur non trouvé' });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Non autorisé, échec du jeton' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Non autorisé, aucun jeton' });
    }
};

export { protect };
