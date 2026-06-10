import React, { useState, useEffect } from 'react';
import { Card, Badge } from '../../components/ui';
import { FileText, Search, Clock, Shield, Loader2 } from 'lucide-react';
import { getAllLogs } from '../../services/adminService';

const AdminLogs = () => {
    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLogs(page);
    }, [page]);

    const fetchLogs = async (currentPage) => {
        setLoading(true);
        try {
            const data = await getAllLogs(currentPage, 20);
            setLogs(data.logs);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setLoading(false);
        }
    };

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
                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 size={40} className="animate-spin mb-4 text-primary-500" />
                            <p className="font-medium">Chargement des logs...</p>
                        </div>
                    ) : (
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
                                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                                                <Clock size={14} />
                                                <span className="text-xs font-bold transition-colors duration-300">{new Date(log.createdAt).toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-slate-700 dark:text-slate-200 text-xs uppercase transition-colors duration-300">{log.cef}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={log.role === 'admin' ? 'info' : log.role === 'SYSTEM' ? 'default' : 'warning'}>
                                                {log.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-600 dark:text-slate-300 text-sm transition-colors duration-300">{log.action}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm italic transition-colors duration-300">
                                                <Shield size={14} className="shrink-0" />
                                                {JSON.stringify(log.details)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">Aucun log trouvé</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            <div className="flex justify-center pt-4">
                <nav className="flex gap-2">
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50">Précédent</button>
                    <span className="px-4 py-2 bg-primary-600 text-white rounded-lg font-bold text-xs shadow-md">{page} / {totalPages || 1}</span>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                        className="px-4 py-2 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50">Suivant</button>
                </nav>
            </div>
        </div>
    );
};

export default AdminLogs;
