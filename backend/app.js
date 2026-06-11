import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import presenceRoutes from './routes/presence.routes.js';
import sanctionRoutes from './routes/sanction.routes.js';
import reportRoutes from './routes/report.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import statsRoutes from './routes/stats.routes.js';
import logRoutes from './routes/log.routes.js';

const app = express();

// Trust reverse proxy (like Vercel) for rate limiter IP identification
app.set('trust proxy', 1);

// Middlewares
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/presence', presenceRoutes);
app.use('/api/sanctions', sanctionRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', logRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Erreur serveur',
        error: process.env.NODE_ENV === 'production' ? null : err.message
    });
});

export default app;
