import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge } from '../../components/ui';
import {
    Utensils,
    History,
    MessageSquare,
    Bell,
    AlertCircle,
    CalendarCheck,
    Clock
} from 'lucide-react';

const DashboardStagiaire = () => {
    const { user } = useAuth();

    const stats = [
        { label: 'Réservations cette semaine', value: '8', icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Réservations en attente', value: '3', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Bonjour, {user?.nom} 👋</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Salle: <span className="font-semibold text-slate-700 dark:text-slate-300">{user?.room}</span> • Statut: {user?.suspended ? <Badge variant="danger">Suspendu</Badge> : <Badge variant="success">Actif</Badge>}</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/stagiaire/reserver">
                        <Button className="gap-2">
                            <Utensils size={18} />
                            Réserver maintenant
                        </Button>
                    </Link>
                </div>
            </div>

            {user?.suspended && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-2xl p-6 flex items-start gap-4 animate-pulse">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-900 dark:text-red-400">Compte Suspendu</h3>
                        <p className="text-red-700 dark:text-red-300/80 mt-1">
                            Votre accès aux réservations est temporairement suspendu jusqu'au <span className="font-bold">25 Mai 2024 à 18h00</span>.
                            Veuillez contacter l'administration pour plus de détails.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickLink to="/stagiaire/reserver" icon={Utensils} label="Réserver" color="bg-emerald-500" />
                <QuickLink to="/stagiaire/reservations" icon={History} label="Mes Réservations" color="bg-blue-500" />
                <QuickLink to="/stagiaire/reclamation" icon={MessageSquare} label="Réclamations" color="bg-amber-500" />
                <QuickLink to="/stagiaire/notifications" icon={Bell} label="Notifications" color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Dernières Réservations</h3>
                        <Link to="/stagiaire/reservations" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Voir tout</Link>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400">
                                        <Utensils size={18} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">Déjeuner</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">2{i} Mai 2024</p>
                                    </div>
                                </div>
                                <Badge variant={i === 2 ? 'danger' : 'success'}>{i === 2 ? 'ABSENT' : 'PRÉSENT'}</Badge>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="p-0 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Notifications Récentes</h3>
                        <Link to="/stagiaire/notifications" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">Tout lire</Link>
                    </div>
                    <div className="divide-y divide-slate-50 dark:divide-slate-800 text-sm">
                        {[1, 2].map(i => (
                            <div key={i} className="p-4 flex gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${i === 1 ? 'bg-primary-600' : 'bg-transparent'}`}></div>
                                <div>
                                    <p className="text-slate-800 dark:text-slate-100 leading-tight">
                                        {i === 1 ? 'Votre réservation a été confirmée.' : 'Le menu de demain est disponible !'}
                                    </p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Il y a {i * 2} heures</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

const QuickLink = ({ to, icon: Icon, label, color }) => (
    <Link
        to={to}
        className="group flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md hover:border-primary-100 dark:hover:border-primary-900 transition-all card-hover"
    >
        <div className={`w-12 h-12 ${color} text-white rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
            <Icon size={24} />
        </div>
        <span className="font-bold text-slate-700 dark:text-slate-200">{label}</span>
    </Link>
);

export default DashboardStagiaire;
