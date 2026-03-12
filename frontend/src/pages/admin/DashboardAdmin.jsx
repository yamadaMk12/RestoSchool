import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { getAdminStats, getLogs } from '../../services/adminService';
import {
    Users,
    Utensils,
    ShieldAlert,
    MessageSquare,
    ArrowUpRight,
    TrendingUp,
    Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardAdmin = () => {
    const [stats, setStats] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const s = await getAdminStats();
        const l = await getLogs();
        setStats(s);
        setLogs(l);
    };

    const statCards = [
        { label: 'Réservations Aujourd\'hui', value: stats?.reservationsToday, icon: Utensils, color: 'text-blue-600', bg: 'bg-blue-50', link: '/admin/reservations' },
        { label: 'Taux de Présence', value: `${stats?.presenceRate || 0}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/admin/statistiques' },
        { label: 'Stagiaires Suspendus', value: stats?.suspendedCount, icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-50', link: '/admin/sanctions' },
        { label: 'Réclamations Ouvertes', value: stats?.openReclamations, icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-50', link: '/admin/reclamations' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Espace Administration</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Vue d'ensemble et gestion du système de restauration.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/presence">
                        <Button className="gap-2">
                            <Utensils size={18} />
                            Saisir Présences
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <Link key={i} to={card.link}>
                        <Card className="p-6 card-hover group cursor-pointer border-none shadow-xl shadow-slate-200/40 dark:shadow-none">
                            <div className="flex justify-between items-start">
                                <div className={`w-12 h-12 ${card.bg} dark:bg-slate-800/50 ${card.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                    <card.icon size={24} />
                                </div>
                                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                            </div>
                            <div className="mt-4">
                                <p className="text-3xl font-black text-slate-900 dark:text-white">{card.value || '0'}</p>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{card.label}</p>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Dernières Actions</h3>
                        <Link to="/admin/logs" className="text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Voir tout l'historique</Link>
                    </div>
                    <Card className="overflow-hidden border-none shadow-lg shadow-slate-200/50 dark:shadow-none">
                        <div className="divide-y divide-slate-50 dark:divide-slate-800">
                            {logs && logs.length > 0 ? (
                                logs.map((log) => (
                                    <div key={log.id} className="p-4 flex gap-4 items-start hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                            <Clock size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{log.action}</p>
                                                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{log.date}</span>
                                            </div>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 truncate mt-0.5">{log.details}</p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-wider">Par: {log.user} ({log.role})</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                                        <Clock size={32} className="text-slate-300 dark:text-slate-600" />
                                    </div>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Aucune action récente enregistrée</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white">Accès Rapide</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <QuickActionButton to="/admin/sanctions" label="Gérer les suspensions" icon={ShieldAlert} color="bg-red-500" />
                        <QuickActionButton to="/admin/reclamations" label="Réclamations" icon={MessageSquare} color="bg-amber-500" />
                        <QuickActionButton to="/admin/users" label="Gestion Utilisateurs" icon={Users} color="bg-slate-700" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuickActionButton = ({ to, label, icon: Icon, color }) => (
    <Link
        to={to}
        className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900 transition-all group"
    >
        <div className={`w-10 h-10 ${color} text-white rounded-lg flex items-center justify-center transition-transform group-hover:rotate-6`}>
            <Icon size={20} />
        </div>
        <span className="font-bold text-slate-700 dark:text-slate-200">{label}</span>
    </Link>
);

export default DashboardAdmin;
