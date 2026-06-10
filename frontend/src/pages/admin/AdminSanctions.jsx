import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { getSuspendedStudents, getSanctionHistory, liftSanction } from '../../services/adminService';
import { ShieldAlert, History, UserCheck, Search, Filter, ShieldX, Loader2 } from 'lucide-react';

const AdminSanctions = () => {
    const [activeSanctions, setActiveSanctions] = useState([]);
    const [historySanctions, setHistorySanctions] = useState([]);
    const [activeTab, setActiveTab] = useState('current');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterMotif, setFilterMotif] = useState('ALL');
    const [showLiftModal, setShowLiftModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [activeData, historyData] = await Promise.all([
                getSuspendedStudents(),
                getSanctionHistory()
            ]);
            setActiveSanctions(activeData);
            setHistorySanctions(historyData);
        } catch (error) {
            console.error('Error fetching sanctions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique motifs for filter dropdown
    const availableMotifs = useMemo(() => {
        const currentList = activeTab === 'current' ? activeSanctions : historySanctions;
        const motifs = [...new Set(currentList.map(s => s.motif).filter(Boolean))];
        return motifs;
    }, [activeSanctions, historySanctions, activeTab]);

    // Filtered data based on search + motif filter
    const filteredData = useMemo(() => {
        const currentList = activeTab === 'current' ? activeSanctions : historySanctions;

        return currentList.filter(s => {
            const name = `${s.student?.nom || ''} ${s.student?.prenom || ''}`.toLowerCase();
            const cef = (s.cef || '').toLowerCase();
            const room = String(s.student?.room || '');
            const term = searchTerm.toLowerCase();

            const matchesSearch = !term || name.includes(term) || cef.includes(term) || room.includes(term);
            const matchesMotif = filterMotif === 'ALL' || s.motif === filterMotif;

            return matchesSearch && matchesMotif;
        });
    }, [activeSanctions, historySanctions, activeTab, searchTerm, filterMotif]);

    const handleLiftClick = (student) => {
        setSelectedStudent(student);
        setShowLiftModal(true);
    };

    const handleConfirmLift = async () => {
        try {
            await liftSanction(selectedStudent.student._id);
            setShowLiftModal(false);
            setSelectedStudent(null);
            await fetchData();
        } catch (error) {
            console.error('Error lifting sanction:', error);
        }
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
                        onClick={() => { setActiveTab('current'); setFilterMotif('ALL'); setSearchTerm(''); }}
                        className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${activeTab === 'current' ? 'bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        <ShieldAlert size={16} />
                        Actuelles ({activeSanctions.length})
                    </button>
                    <button
                        onClick={() => { setActiveTab('history'); setFilterMotif('ALL'); setSearchTerm(''); }}
                        className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shrink-0 ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                    >
                        <History size={16} />
                        Historique ({historySanctions.filter(s => !s.isActive).length})
                    </button>
                </div>
            </div>

            <Card className="p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center border-none shadow-lg shadow-slate-200/40 dark:shadow-none transition-colors duration-300 overflow-visible">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom, CEF ou chambre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                </div>
                <div className="relative">
                    <Button
                        variant="secondary"
                        className="gap-2 shrink-0"
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                        <Filter size={18} />
                        {filterMotif === 'ALL' ? 'Filtrer' : 'Filtré'}
                    </Button>
                    {showFilterDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={() => { setFilterMotif('ALL'); setShowFilterDropdown(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${filterMotif === 'ALL' ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                            >
                                Tous les motifs
                            </button>
                            {availableMotifs.map(motif => (
                                <button
                                    key={motif}
                                    onClick={() => { setFilterMotif(motif); setShowFilterDropdown(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${filterMotif === motif ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    {motif}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 size={40} className="animate-spin mb-4 text-primary-500" />
                            <p className="font-medium">Chargement des sanctions...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-widest transition-colors duration-300">
                                    <th className="px-6 py-4">Étudiant</th>
                                    <th className="px-6 py-4">Chambre</th>
                                    <th className="px-6 py-4">Motif</th>
                                    <th className="px-4 py-4">Début</th>
                                    <th className="px-4 py-4 text-red-500 dark:text-red-400">Fin prévue</th>
                                    {activeTab === 'history' && <th className="px-4 py-4">Statut</th>}
                                    {activeTab === 'current' && <th className="px-6 py-4 text-right">Actions</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={activeTab === 'history' ? 6 : 6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center">
                                                    <UserCheck size={32} />
                                                </div>
                                                <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                                                    {searchTerm || filterMotif !== 'ALL' ? 'Aucun résultat' : 'Aucun élève suspendu'}
                                                </p>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                                                    {searchTerm || filterMotif !== 'ALL'
                                                        ? 'Essayez de modifier votre recherche ou vos filtres.'
                                                        : 'Tous les comptes sont actuellement actifs et autorisés à réserver.'
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((s) => (
                                        <tr key={s._id} className="hover:bg-red-50/10 dark:hover:bg-red-900/5 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-900 dark:text-slate-100">{s.student?.nom} {s.student?.prenom}</span>
                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{s.cef}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4"><Badge variant="default">{s.student?.room || '?'}</Badge></td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                                    {s.motif}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">{new Date(s.dateDebut).toLocaleDateString('fr-FR')}</td>
                                            <td className="px-4 py-4 text-xs font-black text-red-600 dark:text-red-400">{new Date(s.dateFin).toLocaleDateString('fr-FR')}</td>
                                            {activeTab === 'history' && (
                                                <td className="px-4 py-4">
                                                    <Badge variant={s.isActive ? 'danger' : 'success'}>
                                                        {s.isActive ? 'Active' : 'Levée'}
                                                    </Badge>
                                                    {s.leveeA && (
                                                        <span className="block text-[10px] text-slate-400 mt-1">
                                                            {new Date(s.leveeA).toLocaleDateString('fr-FR')}
                                                        </span>
                                                    )}
                                                </td>
                                            )}
                                            {activeTab === 'current' && (
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
                                            )}
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
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
                        Souhaitez-vous vraiment restaurer l'accès aux réservations pour <span className="font-bold text-slate-900 dark:text-slate-100">{selectedStudent?.student?.nom} {selectedStudent?.student?.prenom}</span> ?
                    </p>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <p><span className="font-bold">Motif:</span> {selectedStudent?.motif}</p>
                        <p><span className="font-bold">Depuis:</span> {selectedStudent?.dateDebut && new Date(selectedStudent.dateDebut).toLocaleDateString('fr-FR')}</p>
                        <p><span className="font-bold">Fin prévue:</span> {selectedStudent?.dateFin && new Date(selectedStudent.dateFin).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50 flex gap-3 text-emerald-800 dark:text-emerald-400 text-sm">
                        <UserCheck size={20} className="shrink-0" />
                        <p>L'étudiant recevra une notification automatique et pourra réserver dès maintenant.</p>
                    </div>
                </div>
            </Modal>

            {/* Close filter dropdown when clicking outside */}
            {showFilterDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
            )}
        </div>
    );
};

export default AdminSanctions;
