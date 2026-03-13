import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { getSuspendedStudents, liftSanction } from '../../services/adminService';
import { ShieldAlert, History, UserCheck, Search, Filter, ShieldX } from 'lucide-react';

const AdminSanctions = () => {
    const [suspended, setSuspended] = useState([]);
    const [activeTab, setActiveTab] = useState('current');
    const [showLiftModal, setShowLiftModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        fetchSuspended();
    }, []);

    const fetchSuspended = async () => {
        const data = await getSuspendedStudents();
        setSuspended(data);
    };

    const handleLiftClick = (student) => {
        setSelectedStudent(student);
        setShowLiftModal(true);
    };

    const handleConfirmLift = async () => {
        await liftSanction(selectedStudent.id);
        setShowLiftModal(false);
        fetchSuspended();
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Gestion des Suspensions</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm transition-colors duration-300">Liste des élèves interdits de réservation.</p>
                </div>
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full no-scrollbar whitespace-nowrap">
                    <button
                        onClick={() => setActiveTab('current')}
                        className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${activeTab === 'current' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        <ShieldAlert size={16} />
                        Actuelles ({suspended.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        <ShieldAlert size={16} />
                        Historique
                    </button>
                </div>
            </div>

            <Card className="p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center border-none shadow-lg shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" placeholder="Rechercher un élève suspendu..." className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500" />
                </div>
                <Button variant="secondary" className="gap-2 shrink-0">
                    <Filter size={18} />
                    Filtrer
                </Button>
            </Card>

            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-widest transition-colors duration-300">
                                <th className="px-6 py-4">Étudiant</th>
                                <th className="px-6 py-4">Chambre</th>
                                <th className="px-4 py-4">Début</th>
                                <th className="px-4 py-4 text-red-500 dark:text-red-400">Fin prévue</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {suspended.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center">
                                                <UserCheck size={32} />
                                            </div>
                                            <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">Aucun élève suspendu</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">Tous les comptes sont actuellement actifs et autorisés à réserver.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                suspended.map((s) => (
                                    <tr key={s.id} className="hover:bg-red-50/10 dark:hover:bg-red-900/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-900 dark:text-slate-100">{s.student?.nom} {s.student?.prenom}</span>
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{s.cef}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><Badge variant="default">{s.student?.room || '?'}</Badge></td>
                                        <td className="px-4 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">{new Date(s.dateDebut).toLocaleDateString()}</td>
                                        <td className="px-4 py-4 text-xs font-black text-red-600 dark:text-red-400">{new Date(s.dateFin).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all active:scale-95"
                                                onClick={() => handleLiftClick(s)}
                                            >
                                                <ShieldX size={16} className="mr-2" />
                                                Lever la sanction
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={showLiftModal}
                onClose={() => setShowLiftModal(false)}
                title="Lever la suspension"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowLiftModal(false)}>Annuler</Button>
                        <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmLift}>
                            Confirmer la levée
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">
                        Souhaitez-vous vraiment restaurer l'accès aux réservations pour <span className="font-bold text-slate-900 dark:text-slate-100">{selectedStudent?.nom} {selectedStudent?.prenom}</span> ?
                    </p>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex gap-3 text-emerald-800 dark:text-emerald-400 text-sm">
                        <UserCheck size={20} className="shrink-0" />
                        <p>L'étudiant recevra une notification automatique et pourra réserver dès maintenant.</p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminSanctions;
