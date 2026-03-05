import express from 'express';
import { body } from 'express-validator';
import { getMe, getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

// Public/Private/Auth
router.get('/me', protect, getMe);

// Admin Only
router.route('/')
    .get(protect, requireRole('admin'), getUsers)
    .post(protect, requireRole('admin'), [
        body('CIN').notEmpty().withMessage('CIN requis'),
        body('CEF').notEmpty().withMessage('CEF requis'),
        body('nom').notEmpty().withMessage('Nom requis'),
        body('prenom').notEmpty().withMessage('Prénom requis'),
        body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit faire au moins 6 caractères'),
        validate
    ], createUser);

router.route('/:id')
    .put(protect, requireRole('admin'), updateUser)
    .delete(protect, requireRole('admin'), deleteUser);

export default router;
