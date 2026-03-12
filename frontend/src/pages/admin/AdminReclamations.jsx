import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { getReports, updateReport } from '../../services/adminService';
import { MessageSquare, User, Image as ImageIcon, Send, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AdminReclamations = () => {
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedRec, setSelectedRec] = useState(null);
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('');
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data = await getReports();
            setReclamations(data);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetail = (rec) => {
        setSelectedRec(rec);
        setResponse(rec.response || '');
        setStatus(rec.statut);
    };

    const handleUpdate = async () => {
        try {
            await updateReport(selectedRec._id, { statut: status, response });
            setSelectedRec(null);
            fetchReports();
        } catch (error) {
            console.error('Error updating report:', error);
        }
    };

    const statusTabs = [
        { id: 'ALL', label: 'Toutes' },
        { id: 'ouverte', label: 'Ouvertes' },
        { id: 'en_cours', label: 'En cours' },
        { id: 'fermee', label: 'Fermées' },
    ];

    const filteredRecs = activeTab === 'ALL'
        ? reclamations
        : reclamations.filter(r => r.statut === activeTab);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Gestion des Réclamations</h1>
                <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto max-w-full no-scrollbar">
                    {statusTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                    <Loader2 size={40} className="animate-spin mb-4 text-primary-500" />
                    <p className="font-medium">Chargement des réclamations...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecs.map((rec) => (
                        <Card
                            key={rec._id}
                            className="p-6 transition-all border-none shadow-lg shadow-slate-200/40 dark:shadow-none cursor-pointer hover:shadow-2xl hover:translate-y-[-4px]"
                            onClick={() => handleOpenDetail(rec)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <Badge variant={rec.statut === 'ouverte' ? 'info' : rec.statut === 'en_cours' ? 'warning' : 'success'}>
                                    {rec.statut.toUpperCase()}
                                </Badge>
                                <span className="text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase">{new Date(rec.createdAt).toLocaleDateString()}</span>
                            </div>

                            <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-3 mb-6 italic">"{rec.message}"</p>

                            <div className="pt-4 border-t border-slate-50 dark:border-slate-800/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500">
                                        <User size={14} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">{rec.student?.nom} {rec.student?.prenom}</p>
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">CEF: {rec.cef}</p>
                                    </div>
                                </div>
                                <Button size="sm" variant="ghost" className="text-primary-600 dark:text-primary-400 group hover:bg-primary-50 dark:hover:bg-primary-900/20">
                                    Traiter <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                                </Button>
                            </div>
                        </Card>
                    ))}
                    {filteredRecs.length === 0 && (
                        <div className="col-span-full py-20 text-center text-slate-500">Aucune réclamation trouvée</div>
                    )}
                </div>
            )}

            <Modal
                isOpen={!!selectedRec}
                onClose={() => setSelectedRec(null)}
                title={`Réclamation`}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setSelectedRec(null)}>Fermer</Button>
                        {selectedRec?.statut !== 'fermee' && (
                            <Button variant="primary" className="gap-2" onClick={handleUpdate}>
                                <Send size={16} />
                                Enregistrer
                            </Button>
                        )}
                    </>
                }
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                        <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-sm dark:shadow-none">
                            <User size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">{selectedRec?.student?.nom} {selectedRec?.student?.prenom}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">CEF: {selectedRec?.cef} • Salle: {selectedRec?.student?.room}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            <MessageSquare size={14} />
                            Message de l'élève
                        </h4>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm text-slate-700 dark:text-slate-300 italic">
                            "{selectedRec?.message}"
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="flex items-center gap-2 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            <Clock size={14} />
                            Réponse de l'administration
                        </h4>
                        <textarea
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            placeholder="Saisissez votre réponse ici..."
                            className="w-full p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 transition-all outline-none min-h-[120px]"
                            disabled={selectedRec?.statut === 'fermee'}
                        />
                        {selectedRec?.statut !== 'fermee' && (
                            <div className="flex gap-4 items-center">
                                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Changer statut:</span>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-1 focus:ring-primary-500 outline-none text-slate-900 dark:text-slate-100"
                                >
                                    <option value="ouverte">OUVERTE</option>
                                    <option value="en_cours">EN COURS</option>
                                    <option value="fermee">FERMEE & CLÖTURER</option>
                                </select>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminReclamations;
