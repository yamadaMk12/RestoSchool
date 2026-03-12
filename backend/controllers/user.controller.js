import User from '../models/User.js';
import Logger from '../utils/logger.js';

/**
 * @desc    Get current user profile
 * @route   GET /api/users/me
 * @access  Private
 */
const getMe = async (req, res) => {
    res.json(req.user);
};

/**
 * @desc    Get all students
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'stagiaire' }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
    }
};

/**
 * @desc    Create a new student
 * @route   POST /api/users
 * @access  Private/Admin
 */
const createUser = async (req, res) => {
    const { CIN, CEF, nom, prenom, genre, room, password } = req.body;

    try {
        const userExists = await User.findOne({ CEF });

        if (userExists) {
            return res.status(400).json({ message: 'L\'utilisateur existe déjà (CEF)' });
        }

        const user = await User.create({
            CIN,
            CEF,
            nom,
            prenom,
            genre,
            room,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                CEF: user.CEF,
                nom: user.nom,
                prenom: user.prenom,
                role: user.role
            });
            await Logger.log(req.user.CEF, 'admin', 'USER_CREATED', { targetCEF: CEF });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
};

/**
 * @desc    Update student
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            user.CIN = req.body.CIN || user.CIN;
            user.nom = req.body.nom || user.nom;
            user.prenom = req.body.prenom || user.prenom;
            user.genre = req.body.genre || user.genre;
            user.room = req.body.room || user.room;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json(updatedUser);
            await Logger.log(req.user.CEF, 'admin', 'USER_UPDATED', { targetId: req.params.id });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour' });
    }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user) {
            await user.deleteOne();
            res.json({ message: 'Utilisateur supprimé' });
            await Logger.log(req.user.CEF, 'admin', 'USER_DELETED', { targetId: req.params.id });
        } else {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression' });
    }
};

export { getMe, getUsers, createUser, updateUser, deleteUser };
