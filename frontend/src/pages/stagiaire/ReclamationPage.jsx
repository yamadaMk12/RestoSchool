import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { getReclamations, createReclamation, updateReclamation, deleteReclamation } from '../../services/reportService';
import { MessageSquare, Upload, Send, CheckCircle2, ChevronRight, Edit2, Trash2, X } from 'lucide-react';

const ReclamationPage = () => {
    const [reclamations, setReclamations] = useState([]);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRec, setSelectedRec] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editMessage, setEditMessage] = useState('');
    const [editFiles, setEditFiles] = useState([]);
    const [editExistingFiles, setEditExistingFiles] = useState([]);

    useEffect(() => {
        fetchReclamations();
    }, []);

    const fetchReclamations = async () => {
        const data = await getReclamations();
        setReclamations(data);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).slice(0, 3);
        setFiles(selectedFiles);
    };

    const handleEditFileChange = (e) => {
        const remainingSlots = 3 - editExistingFiles.length;
        const selectedFiles = Array.from(e.target.files).slice(0, remainingSlots);
        setEditFiles(selectedFiles);
    };

    const handleDetailsClick = (rec) => {
        setSelectedRec(rec);
        setEditMode(false);
        setEditMessage(rec.message);
        setEditFiles([]);
        setEditExistingFiles(rec.attachments || []);
        setShowDetailsModal(true);
    };

    const handleDelete = async () => {
        if (!selectedRec) return;
        if (window.confirm("Voulez-vous vraiment supprimer ce signalement ?")) {
            await deleteReclamation(selectedRec._id || selectedRec.id);
            setShowDetailsModal(false);
            fetchReclamations();
        }
    };

    const handleUpdate = async () => {
        if (!editMessage) return;
        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('message', editMessage);
            if (editFiles && editFiles.length > 0) {
                editFiles.forEach(file => {
                    formData.append('files', file);
                });
            }
            if (editExistingFiles && editExistingFiles.length > 0) {
                editExistingFiles.forEach(url => {
                    formData.append('keptAttachments', url);
                });
            }

            await updateReclamation(selectedRec._id || selectedRec.id, formData);
            setShowDetailsModal(false);
            fetchReclamations();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('message', message);
            if (files && files.length > 0) {
                files.forEach(file => {
                    formData.append('files', file);
                });
            }

            await createReclamation(formData);
            setSuccess(true);
            setMessage('');
            setFiles([]);
            fetchReclamations();
            setTimeout(() => setSuccess(false), 3000);
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'EN_COURS': return <Badge variant="warning">EN COURS</Badge>;
            case 'FERMEE':
            case 'FERMÉE': return <Badge variant="success">FERMÉE</Badge>;
            case 'OUVERTE':
            default: return <Badge variant="info">OUVERTE</Badge>;
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-1 space-y-6">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Nouvelle Réclamation</h1>
                <Card className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                rows={5}
                                required
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                                placeholder="Décrivez votre problème en détail..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Pièces jointes (Max 3)</label>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 italic">Images uniquement (.jpg, .png)</p>
                            <div className="relative group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 group-hover:border-primary-300 dark:group-hover:border-primary-400 rounded-xl p-6 flex flex-col items-center justify-center transition-colors">
                                    <Upload size={24} className="text-slate-400 dark:text-slate-500 group-hover:text-primary-500 mb-2" />
                                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {files.length > 0 ? `${files.length} fichier(s) sélectionné(s)` : "Cliquez ou glissez les images"}
                                    </span>
                                </div>
                            </div>
                            {files.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {files.map((f, i) => (
                                        <Badge key={i} variant="default" className="bg-slate-100 text-[10px]">{f.name}</Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {success && (
                            <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold animate-in zoom-in">
                                <CheckCircle2 size={16} />
                                Réclamation envoyée !
                            </div>
                        )}

                        <Button type="submit" className="w-full gap-2 py-3" disabled={submitting}>
                            <Send size={18} />
                            {submitting ? 'Envoi...' : 'Envoyer la réclamation'}
                        </Button>
                    </form>
                </Card>
            </div>

            <div className="lg:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Historique des Réclamations</h2>
                <div className="space-y-4">
                    {reclamations.map((rec) => (
                        <Card key={rec._id || rec.id} className="p-6 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-3 flex-1 min-w-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
                                            <MessageSquare size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate">Réclamation #{rec._id ? rec._id.substring(0,6) : rec.id}</h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : rec.date}</p>
                                        </div>
                                        <div className="shrink-0">
                                            {getStatusBadge(rec.statut)}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm italic line-clamp-2 break-words">"{rec.message}"</p>

                                    {rec.statut === 'fermee' && rec.response && (
                                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 p-4 mt-4 rounded-r-xl">
                                            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1">RÉPONSE ADMIN</p>
                                            <p className="text-sm text-emerald-700 dark:text-emerald-300 line-clamp-2">{rec.response}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-end self-end md:self-auto shrink-0">
                                    <Button variant="ghost" size="sm" className="gap-1 text-slate-400" onClick={() => handleDetailsClick(rec)}>
                                        Détails
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <Modal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                title={editMode ? "Modifier Signalement" : "Détails du signalement"}
                footer={
                    <div className="flex gap-2 w-full justify-between">
                        <div>
                            {selectedRec?.statut === 'ouverte' && !editMode && (
                                <Button variant="danger" className="gap-2 shrink-0 h-10" onClick={handleDelete}>
                                    <Trash2 size={16} /> Supprimer
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => editMode ? setEditMode(false) : setShowDetailsModal(false)}>
                                {editMode ? 'Annuler' : 'Fermer'}
                            </Button>
                            {selectedRec?.statut === 'ouverte' && (
                                editMode ? (
                                    <Button variant="primary" onClick={handleUpdate} disabled={submitting}>
                                        Enregistrer
                                    </Button>
                                ) : (
                                    <Button variant="primary" className="gap-2" onClick={() => setEditMode(true)}>
                                        <Edit2 size={16} /> Modifier
                                    </Button>
                                )
                            )}
                        </div>
                    </div>
                }
            >
                {editMode ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                            <textarea
                                value={editMessage}
                                onChange={(e) => setEditMessage(e.target.value)}
                                rows={5}
                                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Pièces jointes existantes</label>
                            <div className="flex flex-wrap gap-3">
                                {editExistingFiles.map((url, i) => (
                                    <div key={i} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                                        <img src={`http://46.247.108.191:30205${url}`} alt="Attachment" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setEditExistingFiles(prev => prev.filter(u => u !== url))}
                                            className="absolute top-0 right-0 bg-red-500/90 text-white p-1 rounded-bl-lg hover:bg-red-600 transition-colors shadow-md"
                                            title="Supprimer cette image"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                                {editExistingFiles.length === 0 && <span className="text-xs text-slate-500 italic py-2">Aucune image existante.</span>}
                            </div>
                        </div>

                        {editExistingFiles.length + editFiles.length < 3 && (
                            <div className="pt-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Ajouter de nouvelles images (Max {3 - editExistingFiles.length})</label>
                                <input type="file" multiple accept="image/*" onChange={handleEditFileChange} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                                {editFiles.length > 0 && <p className="text-xs text-slate-500 mt-2">{editFiles.length} nouveau(x) fichier(s) sélectionné(s)</p>}
                            </div>
                        )}
                        {editExistingFiles.length + editFiles.length >= 3 && (
                            <p className="text-xs font-medium text-amber-600 dark:text-amber-500 italic pt-2">Limite de 3 pièces jointes atteinte.</p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Réclamation #{selectedRec?._id?.substring(0, 6) || selectedRec?.id}</h3>
                                {getStatusBadge(selectedRec?.statut)}
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden">
                                <p className="text-slate-700 dark:text-slate-300 break-words whitespace-pre-wrap">{selectedRec?.message}</p>
                            </div>
                            {selectedRec?.attachments?.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pièces jointes :</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedRec.attachments.map((url, i) => (
                                            <a key={i} href={`http://46.247.108.191:30205${url}`} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 group hover:opacity-80 transition-opacity">
                                                <img src={`http://46.247.108.191:30205${url}`} alt="Attachment" className="w-full h-full object-cover" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selectedRec?.response && (
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 rounded-r-xl">
                                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1">RÉPONSE DE L'ADMINISTRATION</p>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300 break-words whitespace-pre-wrap">{selectedRec.response}</p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ReclamationPage;
