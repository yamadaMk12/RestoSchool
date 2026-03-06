import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for login route.
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.' }
});

/**
 * Rate limiter for reservation routes.
 */
export const reservationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: { message: 'Trop de requêtes, veuillez ralentir.' }
});
