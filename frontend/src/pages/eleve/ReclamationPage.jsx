import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { getReclamations, createReclamation } from '../../services/reportService';
import { MessageSquare, Upload, Send, CheckCircle2, ChevronRight } from 'lucide-react';

const ReclamationPage = () => {
    const [reclamations, setReclamations] = useState([]);
    const [message, setMessage] = useState('');
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message) return;

        setSubmitting(true);
        try {
            await createReclamation({ message, files });
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
        switch (status) {
            case 'EN_COURS': return <Badge variant="warning">EN COURS</Badge>;
            case 'FERMÉE': return <Badge variant="success">FERMÉE</Badge>;
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
                        <Card key={rec.id} className="p-6 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                                            <MessageSquare size={18} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100">Réclamation #{rec.id}</h4>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider">{rec.date}</p>
                                        </div>
                                        {getStatusBadge(rec.status)}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm italic">"{rec.message}"</p>

                                    {rec.status === 'FERMÉE' && rec.response && (
                                        <div className="bg-emerald-50 dark:bg-emerald-950/20 border-l-4 border-emerald-500 p-4 mt-4 rounded-r-xl">
                                            <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1">RÉPONSE ADMIN</p>
                                            <p className="text-sm text-emerald-700 dark:text-emerald-300">{rec.response}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-end self-end md:self-auto">
                                    <Button variant="ghost" size="sm" className="gap-1 text-slate-400">
                                        Détails
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReclamationPage;
