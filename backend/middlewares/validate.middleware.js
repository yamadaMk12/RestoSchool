import { validationResult } from 'express-validator';

/**
 * Middleware to handle express-validator errors.
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

export { validate };
