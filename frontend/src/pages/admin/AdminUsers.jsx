import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/adminService';
import { Users, Search, Plus, Edit2, Trash2, Shield, UserCircle, Filter, Loader2 } from 'lucide-react';

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRoom, setFilterRoom] = useState('ALL');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('CREATE'); // 'CREATE' or 'EDIT'
    const [formData, setFormData] = useState({ id: '', CEF: '', CIN: '', nom: '', prenom: '', genre: 'M', room: '' });
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const availableRooms = useMemo(() => {
        return [...new Set(users.map(u => String(u.room || '?')))].sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
    }, [users]);

    const filteredUsers = useMemo(() => {
        return users.filter(u => {
            const search = searchTerm.toLowerCase();
            const matchesSearch = 
                u.nom?.toLowerCase().includes(search) ||
                u.prenom?.toLowerCase().includes(search) ||
                u.CEF?.toLowerCase().includes(search) ||
                u.CIN?.toLowerCase().includes(search);
                
            const matchesRoom = filterRoom === 'ALL' || String(u.room || '?') === filterRoom;
            
            return matchesSearch && matchesRoom;
        });
    }, [users, searchTerm, filterRoom]);

    const handleOpenCreate = () => {
        setFormData({ id: '', CEF: '', CIN: '', nom: '', prenom: '', genre: 'M', room: '' });
        setModalMode('CREATE');
        setShowModal(true);
    };

    const handleOpenEdit = (user) => {
        setFormData({
            id: user._id,
            CEF: user.CEF || '',
            CIN: user.CIN || '',
            nom: user.nom || '',
            prenom: user.prenom || '',
            genre: user.genre || 'M',
            room: user.room || ''
        });
        setModalMode('EDIT');
        setShowModal(true);
    };

    const handleDelete = async (id, nom, prenom) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'étudiant ${nom} ${prenom} ? Cette action est irréversible.`)) {
            try {
                await deleteUser(id);
                fetchUsers();
            } catch (error) {
                console.error("Erreur lors de la suppression", error);
                alert("Erreur lors de la suppression. Il est possible que cet étudiant ait des réservations ou des logs liés.");
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.CEF || !formData.CIN || !formData.nom || !formData.prenom) {
            alert("Veuillez remplir tous les champs obligatoires (CEF, CIN, Nom, Prénom).");
            return;
        }

        setActionLoading(true);
        try {
            if (modalMode === 'CREATE') {
                const payload = { ...formData, password: `${formData.CEF}CMCTTA` };
                await createUser(payload);
            } else {
                await updateUser(formData.id, formData);
            }
            setShowModal(false);
            fetchUsers();
        } catch (error) {
            console.error("Erreur de sauvegarde", error);
            alert(error.response?.data?.message || "Erreur lors de la sauvegarde.");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Gestion des Utilisateurs</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Gérez le catalogue des étudiants et leurs permissions.</p>
                </div>
                <Button className="gap-2 px-6 w-full sm:w-auto" onClick={handleOpenCreate}>
                    <Plus size={18} />
                    Ajouter un élève
                </Button>
            </div>

            <Card className="p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center border-none shadow-lg shadow-slate-200/40 dark:shadow-none transition-colors duration-300 overflow-visible">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher par CEF, CIN, Nom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    />
                </div>
                <div className="relative">
                    <Button 
                        variant="secondary" 
                        size="sm" 
                        className="gap-2 shrink-0 py-2.5 h-auto"
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    >
                        <Filter size={18} />
                        {filterRoom === 'ALL' ? 'Filtrer par room' : `Chambre: ${filterRoom}`}
                    </Button>
                    {showFilterDropdown && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            <button
                                onClick={() => { setFilterRoom('ALL'); setShowFilterDropdown(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${filterRoom === 'ALL' ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                            >
                                Toutes les chambres
                            </button>
                            {availableRooms.map(r => (
                                <button
                                    key={r}
                                    onClick={() => { setFilterRoom(r); setShowFilterDropdown(false); }}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${filterRoom === r ? 'font-bold text-primary-600 dark:text-primary-400' : 'text-slate-700 dark:text-slate-300'}`}
                                >
                                    Chambre {r}
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
                            <p className="font-medium">Chargement des utilisateurs...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors duration-300">
                                    <th className="px-6 py-4">CEF / CIN</th>
                                    <th className="px-6 py-4">Étudiant</th>
                                    <th className="px-6 py-4 text-center">Genre</th>
                                    <th className="px-6 py-4">Chambre</th>
                                    <th className="px-6 py-4">Rôle</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-500 dark:text-slate-400">{u.CEF}</span>
                                                <span className="text-[10px] font-medium text-slate-300 dark:text-slate-500">{u.CIN}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <UserCircle size={32} className="text-slate-200 dark:text-slate-700" />
                                                <span className="font-black text-slate-800 dark:text-slate-100 uppercase text-xs">{u.nom} {u.prenom}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Badge variant="default" className="w-6 h-6 flex items-center justify-center p-0">{u.genre || '?'}</Badge>
                                        </td>
                                        <td className="px-6 py-4"><span className="font-bold text-slate-500 dark:text-slate-400">{u.room || '?'}</span></td>
                                        <td className="px-6 py-4">
                                            <Badge variant={u.role === 'admin' ? 'info' : 'success'}>
                                                {u.role?.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20"
                                                    onClick={() => handleOpenEdit(u)}
                                                >
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    onClick={() => handleDelete(u._id, u.nom, u.prenom)}
                                                    disabled={u.role === 'admin'}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">Aucun utilisateur trouvé</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={modalMode === 'CREATE' ? "Ajouter un nouvel étudiant" : "Modifier l'étudiant"}
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button 
                            variant="primary" 
                            onClick={handleSubmit} 
                            disabled={actionLoading}
                            className="min-w-[120px]"
                        >
                            {actionLoading ? <Loader2 size={18} className="animate-spin mx-auto" /> : (modalMode === 'CREATE' ? 'Créer le compte' : 'Sauvegarder')}
                        </Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="CEF *" value={formData.CEF} onChange={(e) => setFormData({...formData, CEF: e.target.value})} placeholder="Identifiant unique" disabled={modalMode === 'EDIT'} />
                    <InputGroup label="CIN *" value={formData.CIN} onChange={(e) => setFormData({...formData, CIN: e.target.value})} placeholder="Carte d'identité" />
                    <InputGroup label="Nom *" value={formData.nom} onChange={(e) => setFormData({...formData, nom: e.target.value})} placeholder="Nom de famille" />
                    <InputGroup label="Prénom *" value={formData.prenom} onChange={(e) => setFormData({...formData, prenom: e.target.value})} placeholder="Prénom" />
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">Genre</label>
                        <select 
                            value={formData.genre}
                            onChange={(e) => setFormData({...formData, genre: e.target.value})}
                            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-900 dark:text-slate-100 appearance-none"
                        >
                            <option value="M">Masculin (M)</option>
                            <option value="F">Féminin (F)</option>
                        </select>
                    </div>
                    <InputGroup label="Chambre" value={formData.room} onChange={(e) => setFormData({...formData, room: e.target.value})} type="number" placeholder="Numéro de chambre" />
                </div>
                {modalMode === 'CREATE' && (
                    <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                        <Shield size={16} className="shrink-0" />
                        <span>Le mot de passe sera automatiquement généré: <strong className="break-all">{'[CEF]'}CMCTTA</strong></span>
                    </div>
                )}
            </Modal>

            {/* Click outside overlay for dropdown */}
            {showFilterDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowFilterDropdown(false)} />
            )}
        </div>
    );
};

const InputGroup = ({ label, value, onChange, placeholder, disabled, type = "text" }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder={placeholder}
        />
    </div>
);

export default AdminUsers;
