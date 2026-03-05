import express from 'express';
import { body } from 'express-validator';
import { login } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { loginLimiter } from '../middlewares/rateLimit.middleware.js';

const router = express.Router();

router.post('/login', [
    loginLimiter,
    body('cef').notEmpty().withMessage('Le CEF est requis'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
    validate
], login);

export default router;
