import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Logger from '../utils/logger.js';

/**
 * Generate a JWT token for a user.
 * @param {string} cef - User CEF
 */
const generateToken = (cef) => {
    return jwt.sign({ cef }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    });
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    const { cef, password } = req.body;

    try {
        const user = await User.findOne({ CEF: cef });

        if (user && (await user.matchPassword(password))) {
            if (user.role === 'stagiaire' && user.isSuspended) {
                const now = new Date();
                if (user.suspensionEnd && user.suspensionEnd <= now) {
                    user.isSuspended = false;
                    user.suspensionEnd = null;
                    await user.save();
                }
            }
            
            res.json({
                token: generateToken(user.CEF),
                user: {
                    _id: user._id,
                    CEF: user.CEF,
                    room: user.room,
                    nom: user.nom,
                    prenom: user.prenom,
                    role: user.role,
                    isSuspended: user.isSuspended,
                    suspensionEnd: user.suspensionEnd
                }
            });

            await Logger.log(user.CEF, user.role, 'LOGIN');
        } else {
            res.status(401).json({ message: 'CEF ou mot de passe invalide' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    }
};

export { login };
