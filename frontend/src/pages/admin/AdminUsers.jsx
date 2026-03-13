import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { getAllUsers } from '../../services/adminService';
import { Users, Search, Plus, Edit2, Trash2, Shield, UserCircle, Filter, Loader2 } from 'lucide-react';

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await getAllUsers();
            setUsers(data);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const search = searchTerm.toLowerCase();
        return (
            u.nom?.toLowerCase().includes(search) ||
            u.prenom?.toLowerCase().includes(search) ||
            u.CEF?.toLowerCase().includes(search) ||
            u.CIN?.toLowerCase().includes(search)
        );
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Gestion des Utilisateurs</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Gérez le catalogue des étudiants et leurs permissions.</p>
                </div>
                <Button className="gap-2 px-6 w-full sm:w-auto" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Ajouter un élève
                </Button>
            </div>

            <Card className="p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center border-none shadow-lg shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
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
                <Button variant="secondary" size="sm" className="gap-2 shrink-0">
                    <Filter size={18} />
                    Filtrer par salle
                </Button>
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
                                    <th className="px-6 py-4">Salle</th>
                                    <th className="px-6 py-4">Rôle</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredUsers.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
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
                                        <td className="px-6 py-4"><span className="font-bold text-slate-500 dark:text-slate-400">{u.salle}</span></td>
                                        <td className="px-6 py-4">
                                            <Badge variant={u.role === 'admin' ? 'info' : 'success'}>
                                                {u.role?.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20">
                                                    <Edit2 size={14} />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
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
                title="Ajouter un nouvel étudiant"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>Annuler</Button>
                        <Button variant="primary">Créer le compte</Button>
                    </>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="CEF" placeholder="Identifiant" />
                    <InputGroup label="CIN" placeholder="Carte d'identité" />
                    <InputGroup label="Nom" placeholder="Nom" />
                    <InputGroup label="Prénom" placeholder="Prénom" />
                    <div className="col-span-2">
                        <InputGroup label="Salle" placeholder="Ex: B204" />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const InputGroup = ({ label, placeholder }) => (
    <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <input
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
            placeholder={placeholder}
        />
    </div>
);

export default AdminUsers;
