import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal } from '../../components/ui';
import { getReservations, cancelReservation, updateReservation } from '../../services/reservationService';
import { Utensils, History, XCircle, Edit2, Search } from 'lucide-react';
import { isReservationWindowOpen } from '../../utils/dateUtils';

const MesReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRes, setSelectedRes] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editMeals, setEditMeals] = useState({ breakfast: false, lunch: false, dinner: false });
    const isWindowOpen = isReservationWindowOpen();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await getReservations();
            setReservations(data);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelClick = (res) => {
        setSelectedRes(res);
        setShowCancelModal(true);
    };

    const handleConfirmCancel = async () => {
        await cancelReservation(selectedRes._id);
        setShowCancelModal(false);
        fetchData();
    };

    const handleEditClick = (res) => {
        setSelectedRes(res);
        setEditMeals({
            breakfast: res.repas.includes('petit_dejeuner'),
            lunch: res.repas.includes('dejeuner'),
            dinner: res.repas.includes('diner')
        });
        setShowEditModal(true);
    };

    const handleToggleEditMeal = (meal) => {
        setEditMeals(prev => ({ ...prev, [meal]: !prev[meal] }));
    };

    const handleConfirmEdit = async () => {
        if (!editMeals.breakfast && !editMeals.lunch && !editMeals.dinner) return;
        const repas = [];
        if (editMeals.breakfast) repas.push('petit_dejeuner');
        if (editMeals.lunch) repas.push('dejeuner');
        if (editMeals.dinner) repas.push('diner');

        await updateReservation(selectedRes._id, { repas });
        setShowEditModal(false);
        fetchData();
    };

    const getStatusBadge = (status) => {
        switch (status?.toUpperCase()) {
            case 'PRESENT': return <Badge variant="success">PRÉSENT</Badge>;
            case 'ABSENT': return <Badge variant="danger">ABSENT</Badge>;
            case 'EN_ATTENTE':
            default: return <Badge variant="warning">EN ATTENTE</Badge>;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Mes Réservations</h1>
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 transition-colors duration-300">
                    <History size={16} />
                    Historique complet
                </div>
            </div>

            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-sm uppercase tracking-wider transition-colors duration-300">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Repas</th>
                                <th className="px-6 py-4">Statut</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {reservations.length === 0 && !loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 grayscale opacity-40">
                                            <Search size={48} />
                                            <p className="text-xl font-medium">Aucune réservation trouvée</p>
                                            <Button variant="secondary" onClick={() => window.location.href = '/stagiaire/reserver'}>Réserver un repas</Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((res) => (
                                    <tr key={res._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{res.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 uppercase text-xs font-semibold">
                                                <Utensils size={14} className="text-primary-500 shrink-0" />
                                                {res.repas && res.repas.map(r => r.replace('_', ' ')).join(', ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(res.statut)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {res.statut === 'en_attente' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary-600 hover:bg-primary-50"
                                                        onClick={() => handleEditClick(res)}
                                                        disabled={!isWindowOpen}
                                                        title={!isWindowOpen ? "Modification impossible (créneau fermé)" : "Modifier"}
                                                    >
                                                        <Edit2 size={16} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:bg-red-50"
                                                        onClick={() => handleCancelClick(res)}
                                                        disabled={!isWindowOpen}
                                                        title={!isWindowOpen ? "Annulation impossible (créneau fermé)" : "Annuler"}
                                                    >
                                                        <XCircle size={16} />
                                                    </Button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                title="Annuler la réservation"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Retour</Button>
                        <Button variant="danger" onClick={handleConfirmCancel}>Confirmer l'annulation</Button>
                    </>
                }
            >
                <p className="text-slate-600 dark:text-slate-400">
                    Êtes-vous sûr de vouloir annuler votre réservation pour le <span className="font-bold text-slate-900 dark:text-slate-100">{selectedRes?.date}</span> ?
                    Cette action est irréversible.
                </p>
            </Modal>

            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Modifier la réservation"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>Annuler</Button>
                        <Button 
                            variant="primary" 
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                            onClick={handleConfirmEdit}
                            disabled={!editMeals.breakfast && !editMeals.lunch && !editMeals.dinner}
                        >Confirmer</Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <p className="text-slate-600 dark:text-slate-400">Modifier vos repas pour le <span className="font-bold text-slate-900 dark:text-slate-100">{selectedRes?.date}</span> :</p>
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500" checked={editMeals.breakfast} onChange={() => handleToggleEditMeal('breakfast')} />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Petit-déjeuner</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500" checked={editMeals.lunch} onChange={() => handleToggleEditMeal('lunch')} />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Déjeuner</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-primary-500 focus:ring-primary-500" checked={editMeals.dinner} onChange={() => handleToggleEditMeal('dinner')} />
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Dîner</span>
                        </label>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MesReservations;
