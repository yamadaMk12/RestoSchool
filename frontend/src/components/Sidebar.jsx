import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Utensils,
    History,
    MessageSquare,
    Bell,
    ClipboardCheck,
    ShieldAlert,
    Users,
    BarChart3,
    FileText,
    X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from './ui';

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const stagiaireLinks = user?.isSuspended ? [
        { to: '/stagiaire/suspended', icon: ShieldAlert, label: 'Compte Suspendu' },
        { to: '/stagiaire/reclamation', icon: MessageSquare, label: 'Réclamations' },
    ] : [
        { to: '/stagiaire/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/stagiaire/reserver', icon: Utensils, label: 'Réserver' },
        { to: '/stagiaire/reservations', icon: History, label: 'Mes Réservations' },
        { to: '/stagiaire/reclamation', icon: MessageSquare, label: 'Réclamations' },
        { to: '/stagiaire/notifications', icon: Bell, label: 'Notifications' },
    ];

    const adminLinks = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
        { to: '/admin/reservations', icon: Utensils, label: 'Réservations' },
        { to: '/admin/presence', icon: ClipboardCheck, label: 'Saisie Présence' },
        { to: '/admin/sanctions', icon: ShieldAlert, label: 'Gestion Suspensions' },
        { to: '/admin/reclamations', icon: MessageSquare, label: 'Réclamations' },
        { to: '/admin/statistiques', icon: BarChart3, label: 'Statistiques' },
        { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
        { to: '/admin/logs', icon: FileText, label: 'Logs d\'actions' },
    ];

    const links = user?.role === 'admin' ? adminLinks : stagiaireLinks;

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 md:static md:translate-x-0 md:h-[calc(100vh-64px)]",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-4 flex items-center justify-between md:hidden border-b border-slate-50 dark:border-slate-800 mb-2">
                    <span className="font-bold text-slate-800 dark:text-slate-100">Menu</span>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-1 flex-1 overflow-y-auto">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={onClose}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 shadow-sm border-r-4 border-primary-600 font-bold"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                            )}
                        >
                            <link.icon size={20} />
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
