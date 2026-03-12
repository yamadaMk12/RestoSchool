import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Modal } from '../../components/ui';
import { getAdminReservations, updatePresence } from '../../services/adminService';
import { ClipboardCheck, User, Search, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminPresence = () => {
    const { user: currentUser } = useAuth();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStudents();
    }, [date]);

    const fetchStudents = async () => {
        setFetching(true);
        try {
            const data = await getAdminReservations(date);
            setStudents(data);
        } finally {
            setFetching(false);
        }
    };

    const handleMarkAbsent = (student) => {
        setSelectedStudent(student);
        setShowWarningModal(true);
    };

    const confirmPresence = async (reservationId, status) => {
        setLoading(true);
        try {
            await updatePresence({
                reservationId,
                statut: status,
                adminCef: currentUser.CEF
            });
            setStudents(prev => prev.map(s => s._id === reservationId ? { ...s, statut: status } : s));
            if (status === 'absent') setShowWarningModal(false);
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(s => {
        const student = s.student;
        const search = searchTerm.toLowerCase();
        return (
            student?.nom?.toLowerCase().includes(search) ||
            student?.prenom?.toLowerCase().includes(search) ||
            s.cef?.toLowerCase().includes(search)
        );
    });

    const markedCount = students.filter(s => s.statut !== 'en_attente').length;
    const progress = students.length > 0 ? Math.round((markedCount / students.length) * 100) : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3 transition-colors duration-300">
                        <ClipboardCheck size={28} className="text-primary-600 dark:text-primary-400" />
                        Saisie des Présences
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Pointage en temps réel par chambre et par repas.</p>
                </div>
                <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                        <span>Progression</span>
                        <span>{markedCount} / {students.length}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden shadow-inner">
                        <div
                            className="bg-primary-600 h-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-4 flex items-center gap-4 dark:border-slate-800">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-transparent font-bold text-slate-700 dark:text-slate-200 focus:outline-none"
                    />
                </Card>
                <Card className="p-4 md:col-span-3 dark:border-slate-800">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Scanner CEF ou rechercher nom..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-1 bg-transparent focus:outline-none text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                        />
                    </div>
                </Card>
            </div>

            <Card className="overflow-hidden border-none shadow-2xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    {fetching ? (
                        <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 size={40} className="animate-spin mb-4 text-primary-500" />
                            <p className="font-medium">Chargement des réservations...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] transition-colors duration-300">
                                    <th className="px-6 py-4">CEF</th>
                                    <th className="px-6 py-4">Étudiant</th>
                                    <th className="px-6 py-4">Salle</th>
                                    <th className="px-6 py-4 text-center">Actions / Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredStudents.map((row) => (
                                    <tr key={row._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400 dark:text-slate-500">{row.cef}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.student?.nom} {row.student?.prenom}</p>
                                        </td>
                                        <td className="px-6 py-4"><Badge variant="default">{row.student?.room}</Badge></td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                {row.statut === 'en_attente' ? (
                                                    <>
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
                                                            onClick={() => confirmPresence(row._id, 'present')}
                                                            disabled={loading}
                                                        >
                                                            <CheckCircle size={16} className="mr-1" />
                                                            Présent
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={() => handleMarkAbsent(row)}
                                                            disabled={loading}
                                                        >
                                                            <XCircle size={16} className="mr-1" />
                                                            Absent
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <Badge variant={row.statut === 'present' ? 'success' : 'danger'} className="px-4 py-1.5 text-xs">
                                                        {row.statut === 'present' ? 'PRÉSENT ✅' : 'ABSENT ❌'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStudents.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">Aucune réservation pour ce jour</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>

            <Modal
                isOpen={showWarningModal}
                onClose={() => setShowWarningModal(false)}
                title="Confirmation d'absence"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowWarningModal(false)}>Annuler</Button>
                        <Button variant="danger" onClick={() => confirmPresence(selectedStudent._id, 'absent')} disabled={loading}>
                            Valider l'absence
                        </Button>
                    </>
                }
            >
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center animate-bounce">
                        <AlertTriangle size={32} />
                    </div>
                    <div className="space-y-2">
                        <p className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">Attention !</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Marquer <span className="font-bold text-slate-900 dark:text-slate-100">{selectedStudent?.student?.nom} {selectedStudent?.student?.prenom}</span> comme absent entraînera une suspension automatique de son compte pendant <span className="font-bold text-red-600 dark:text-red-400">24 heures</span>.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminPresence;
