import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirige vers le dashboard approprié si le rôle n'est pas permis
        return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/stagiaire/dashboard'} replace />;
    }

    if (user.role === 'stagiaire' && user.isSuspended) {
        const isAllowed = location.pathname.startsWith('/stagiaire/suspended') || location.pathname.startsWith('/stagiaire/reclamation');
        if (!isAllowed) {
            return <Navigate to="/stagiaire/suspended" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;
