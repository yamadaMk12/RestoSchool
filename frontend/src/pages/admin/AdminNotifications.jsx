import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { getAllUsers, sendNotification } from '../../services/adminService';
import { Bell, Send, Users, UserCheck, Search, Loader2, CheckCircle, X } from 'lucide-react';

const AdminNotifications = () => {
    const [titre, setTitre] = useState('');
    const [message, setMessage] = useState('');
    const [target, setTarget] = useState('all');
    const [selectedCefs, setSelectedCefs] = useState([]);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } finally {
            setLoadingUsers(false);
        }
    };

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter(u =>
            u.nom.toLowerCase().includes(q) ||
            u.prenom.toLowerCase().includes(q) ||
            u.CEF.toLowerCase().includes(q)
        );
    }, [users, search]);

    const toggleUser = (cef) => {
        setSelectedCefs(prev =>
            prev.includes(cef) ? prev.filter(c => c !== cef) : [...prev, cef]
        );
    };

    const selectAll = () => {
        if (selectedCefs.length === filteredUsers.length) {
            setSelectedCefs([]);
        } else {
            setSelectedCefs(filteredUsers.map(u => u.CEF));
        }
    };

    const handleSend = async () => {
        setError(null);
        setSuccess(null);

        if (!titre.trim() || !message.trim()) {
            setError('Veuillez remplir le titre et le message');
            return;
        }

        if (target === 'specific' && selectedCefs.length === 0) {
            setError('Veuillez sélectionner au moins un utilisateur');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                titre: titre.trim(),
                message: message.trim(),
                target,
                ...(target === 'specific' && { cefs: selectedCefs })
            };
            const result = await sendNotification(payload);
            setSuccess(result.message);
            setTitre('');
            setMessage('');
            setSelectedCefs([]);
            setTarget('all');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de l\'envoi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">
                    Envoyer une Notification
                </h1>
                <Badge variant="info" className="px-3 py-1.5 text-xs font-bold">
                    <Bell size={14} className="mr-1.5" />
                    {users.length} stagiaires
                </Badge>
            </div>

            {/* Success / Error alerts */}
            {success && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl animate-in slide-in-from-top duration-300">
                    <CheckCircle size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{success}</span>
                    <button onClick={() => setSuccess(null)} className="ml-auto text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-200">
                        <X size={16} />
                    </button>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-2xl animate-in slide-in-from-top duration-300">
                    <X size={20} className="text-red-600 dark:text-red-400 shrink-0" />
                    <span className="text-sm font-medium text-red-800 dark:text-red-300">{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-200">
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left: Form */}
                <Card className="lg:col-span-3 p-6 border-none shadow-lg shadow-slate-200/40 dark:shadow-none">
                    <div className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Titre de la notification
                            </label>
                            <input
                                type="text"
                                value={titre}
                                onChange={(e) => setTitre(e.target.value)}
                                placeholder="Ex: Rappel important"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 transition-all outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Message
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Saisissez le contenu de la notification..."
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 transition-all outline-none min-h-[160px] resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>

                        {/* Target selector */}
                        <div className="space-y-3">
                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Destinataires
                            </label>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setTarget('all')}
                                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                                        target === 'all'
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 shadow-md shadow-primary-100 dark:shadow-none'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <Users size={20} />
                                    Tous les stagiaires
                                </button>
                                <button
                                    onClick={() => setTarget('specific')}
                                    className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-bold text-sm ${
                                        target === 'specific'
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 shadow-md shadow-primary-100 dark:shadow-none'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                                    }`}
                                >
                                    <UserCheck size={20} />
                                    Utilisateurs spécifiques
                                </button>
                            </div>
                        </div>

                        {/* Send button */}
                        <Button
                            variant="primary"
                            className="w-full py-3.5 text-sm font-bold gap-2 rounded-2xl"
                            onClick={handleSend}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Envoyer la notification
                                    {target === 'specific' && selectedCefs.length > 0 && (
                                        <Badge variant="default" className="ml-2 bg-white/20 text-white text-[10px]">
                                            {selectedCefs.length}
                                        </Badge>
                                    )}
                                </>
                            )}
                        </Button>
                    </div>
                </Card>

                {/* Right: User picker (visible when 'specific') */}
                <Card className={`lg:col-span-2 border-none shadow-lg shadow-slate-200/40 dark:shadow-none transition-all duration-300 ${
                    target === 'specific' ? 'opacity-100' : 'opacity-40 pointer-events-none'
                }`}>
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-wide">
                                Sélectionner les utilisateurs
                            </h3>
                            {target === 'specific' && (
                                <Badge variant={selectedCefs.length > 0 ? 'success' : 'default'} className="text-[10px]">
                                    {selectedCefs.length} sélectionné(s)
                                </Badge>
                            )}
                        </div>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par nom ou CEF..."
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary-500 transition-all outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
                            />
                        </div>
                        <button
                            onClick={selectAll}
                            className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                        >
                            {selectedCefs.length === filteredUsers.length && filteredUsers.length > 0 ? 'Tout désélectionner' : 'Tout sélectionner'}
                        </button>
                    </div>

                    <div className="max-h-[420px] overflow-y-auto no-scrollbar">
                        {loadingUsers ? (
                            <div className="p-10 flex flex-col items-center justify-center text-slate-400">
                                <Loader2 size={28} className="animate-spin mb-3 text-primary-500" />
                                <p className="text-xs font-medium">Chargement...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="p-10 text-center text-sm text-slate-400 dark:text-slate-500">
                                Aucun utilisateur trouvé
                            </div>
                        ) : (
                            filteredUsers.map((user) => {
                                const isSelected = selectedCefs.includes(user.CEF);
                                return (
                                    <button
                                        key={user.CEF}
                                        onClick={() => toggleUser(user.CEF)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-slate-50 dark:border-slate-800/50 last:border-none ${
                                            isSelected
                                                ? 'bg-primary-50 dark:bg-primary-950/15'
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                                            isSelected
                                                ? 'bg-primary-600 border-primary-600 text-white'
                                                : 'border-slate-300 dark:border-slate-600'
                                        }`}>
                                            {isSelected && <CheckCircle size={12} />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                                                {user.nom} {user.prenom}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                                CEF: {user.CEF} • Chambre {user.room}
                                            </p>
                                        </div>
                                        <Badge variant={user.genre === 'M' ? 'info' : 'warning'} className="text-[9px] shrink-0">
                                            {user.genre === 'M' ? 'G' : 'F'}
                                        </Badge>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminNotifications;
