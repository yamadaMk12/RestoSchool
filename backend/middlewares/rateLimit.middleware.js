import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for login route.
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per windowMs
    message: { message: 'Trop de tentatives de connexion, veuillez réessayer plus tard.' }
});

/**
 * Rate limiter for reservation routes.
 */
export const reservationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // Limit each user to 20 requests per minute
    message: { message: 'Trop de requêtes, veuillez ralentir.' }
});
