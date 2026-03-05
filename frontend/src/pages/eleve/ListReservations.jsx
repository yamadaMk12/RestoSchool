import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal } from '../../components/ui';
import { getReservations, cancelReservation } from '../../services/reservationService';
import { Utensils, History, XCircle, Edit2, Search } from 'lucide-react';
import { isReservationWindowOpen } from '../../utils/dateUtils';

const MesReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRes, setSelectedRes] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
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
        await cancelReservation(selectedRes.id);
        setShowCancelModal(false);
        fetchData();
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'PRESENT': return <Badge variant="success">PRÉSENT</Badge>;
            case 'ABSENT': return <Badge variant="danger">ABSENT</Badge>;
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
                                            <Button variant="secondary" onClick={() => window.location.href = '/eleve/reserver'}>Réserver un repas</Button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reservations.map((res) => (
                                    <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-300">{res.date}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Utensils size={14} className="text-primary-500" />
                                                {res.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(res.status)}</td>
                                        <td className="px-6 py-4 text-right">
                                            {res.status === 'EN_ATTENTE' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary-600 hover:bg-primary-50"
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
                    Êtes-vous sûr de vouloir annuler votre réservation pour le <span className="font-bold text-slate-900 dark:text-slate-100">{selectedRes?.date}</span> ({selectedRes?.type}) ?
                    Cette action est irréversible.
                </p>
            </Modal>
        </div>
    );
};

export default MesReservations;
