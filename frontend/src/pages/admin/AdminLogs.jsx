import React from 'react';
import { Card, Badge } from '../../components/ui';
import { FileText, Search, Clock, Shield } from 'lucide-react';

const AdminLogs = () => {
    const logs = [
        { id: 1, date: '2024-05-20 14:30', user: 'Admin', role: 'admin', action: 'Connexion', details: 'Connexion réussie depuis 192.168.1.1' },
        { id: 2, date: '2024-05-20 12:15', user: 'Admin', role: 'admin', action: 'Saisie Présence', details: 'Pointage Déjeuner Chambre B204 (12 présents, 1 absent)' },
        { id: 3, date: '2024-05-20 12:16', user: 'Système', role: 'SYSTEM', action: 'Sanction', details: 'Suspension automatique CEF 67890 (Alice Martin) pour absence' },
        { id: 4, date: '2024-05-19 18:00', user: 'Système', role: 'SYSTEM', action: 'Ouverture', details: 'Ouverture automatique des réservations pour le lendemain' },
        { id: 5, date: '2024-05-19 09:00', user: 'Jean Dupont', role: 'ELEVE', action: 'Réclamation', details: 'Nouvelle réclamation #45: "Repas froid"' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3 transition-colors duration-300">
                        <FileText size={28} className="text-primary-600 dark:text-primary-400" />
                        Logs d'actions
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Traçabilité complète des actions effectuées sur le système.</p>
                </div>
            </div>

            <Card className="p-4 flex gap-4 items-center border-none shadow-lg shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Filtrer par utilisateur ou action..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors duration-300" />
                </div>
            </Card>

            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors duration-300">
                                <th className="px-6 py-4">Date & Heure</th>
                                <th className="px-6 py-4">Utilisateur</th>
                                <th className="px-6 py-4">Rôle</th>
                                <th className="px-6 py-4">Action</th>
                                <th className="px-6 py-4">Détails</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {logs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                            <Clock size={14} />
                                            <span className="text-xs font-bold transition-colors duration-300">{log.date}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-700 dark:text-slate-200 text-xs uppercase transition-colors duration-300">{log.user}</td>
                                    <td className="px-6 py-4">
                                        <Badge variant={log.role === 'admin' ? 'info' : log.role === 'SYSTEM' ? 'default' : 'warning'}>
                                            {log.role}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 text-sm transition-colors duration-300">{log.action}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm italic transition-colors duration-300">
                                            <Shield size={14} className="shrink-0" />
                                            {log.details}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex justify-center pt-4">
                <nav className="flex gap-2">
                    <button className="px-4 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Précédent</button>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold text-xs shadow-md">1</button>
                    <button className="px-4 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">2</button>
                    <button className="px-4 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Suivant</button>
                </nav>
            </div>
        </div>
    );
};

export default AdminLogs;
