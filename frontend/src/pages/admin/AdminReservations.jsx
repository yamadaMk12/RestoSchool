import { useState, useEffect, useMemo } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { Download, Search, Filter, Calendar as CalendarIcon, User, Loader2 } from 'lucide-react';
import { getAdminReservations, getAllUsers } from '../../services/adminService';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const AdminReservations = () => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [activeTab, setActiveTab] = useState('reserved');
    const [filterType, setFilterType] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [reservations, setReservations] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [resData, usersData] = await Promise.all([
                    getAdminReservations(date),
                    getAllUsers()
                ]);
                setReservations(resData);
                setAllUsers(usersData);
            } catch (error) {
                console.error('Error fetching reservations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [date]);

    const formattedData = useMemo(() => {
        // Students who reserved
        const reservedList = reservations.map(r => ({
            id: r._id,
            cef: r.cef || '?',
            nom: r.student?.nom || 'Inconnu',
            prenom: r.student?.prenom || '',
            room: r.student?.room || '?',
            meals: r.repas, // Array from backend
            status: r.statut
        }));

        // Students who didn't reserve for this specific date
        const reservedCefs = new Set(reservations.map(r => r.cef));
        const notReservedList = allUsers
            .filter(u => u.role === 'stagiaire' && !reservedCefs.has(u.CEF))
            .map(u => ({
                id: u._id,
                cef: u.CEF,
                nom: u.nom,
                prenom: u.prenom,
                room: u.room || '?',
                meals: [],
                status: 'Non réservé'
            }));

        return {
            reserved: reservedList,
            notReserved: notReservedList
        };
    }, [reservations, allUsers]);

    const filteredData = useMemo(() => {
        const currentList = activeTab === 'reserved' ? formattedData.reserved : formattedData.notReserved;

        return currentList.filter(item => {
            const matchesSearch =
                String(item.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(item.prenom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(item.cef || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                String(item.room || '').toLowerCase().includes(searchTerm.toLowerCase());

            if (activeTab === 'not_reserved') return matchesSearch;

            const matchesType = filterType === 'ALL' || item.meals.some(m => {
                if (filterType === 'BREAKFAST') return m === 'petit_dejeuner';
                if (filterType === 'LUNCH') return m === 'dejeuner';
                if (filterType === 'DINNER') return m === 'diner';
                return false;
            });

            return matchesSearch && matchesType;
        });
    }, [formattedData, activeTab, searchTerm, filterType]);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("RestoSchool - Liste des réservations", 14, 22);
        doc.setFontSize(11);
        doc.text(`Date: ${new Date(date).toLocaleDateString('fr-FR')}`, 14, 30);

        const waitingList = formattedData.reserved.filter(r => r.status === 'en_attente');
        
        const groupedByRoom = {};
        waitingList.forEach(item => {
            const room = item.room || '?';
            if (!groupedByRoom[room]) groupedByRoom[room] = [];
            groupedByRoom[room].push(item);
        });

        const sortedRooms = Object.keys(groupedByRoom).sort((a, b) => a.localeCompare(b, undefined, {numeric: true}));
        const tableBody = [];
        
        sortedRooms.forEach(room => {
            const students = groupedByRoom[room];
            students.forEach((student, index) => {
                const hasBreakfast = student.meals.includes('petit_dejeuner');
                const hasLunch = student.meals.includes('dejeuner');
                const hasDinner = student.meals.includes('diner');

                const getMealCell = (hasMeal) => hasMeal 
                    ? { content: '', styles: { halign: 'center' } }
                    : { content: '', styles: { halign: 'center', fillColor: [0, 0, 0] } };

                const row = [];
                if (index === 0) {
                    row.push({ content: room, rowSpan: students.length, styles: { valign: 'middle', halign: 'center', fontStyle: 'bold' } });
                }
                row.push(`${student.nom} ${student.prenom}`);
                row.push(student.cef);
                row.push(getMealCell(hasBreakfast));
                row.push(getMealCell(hasLunch));
                row.push(getMealCell(hasDinner));
                
                tableBody.push(row);
            });
        });

        autoTable(doc, {
            startY: 35,
            head: [['Chambre', 'Nom', 'CEF', 'Petit-déj', 'Déjeuner', 'Dîner']],
            body: tableBody,
            theme: 'grid',
            headStyles: { fillColor: [15, 23, 42] },
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { cellWidth: 25 },
                3: { cellWidth: 25 },
                4: { cellWidth: 25 },
                5: { cellWidth: 25 }
            }
        });

        doc.save(`reservations_attente_${date}.pdf`);
    };

    const getMealBadge = (meal) => {
        const labels = {
            'petit_dejeuner': 'Petit-déjeuner',
            'dejeuner': 'Déjeuner',
            'diner': 'Dîner'
        };
        return <Badge key={meal} variant="info" className="text-[10px] whitespace-nowrap">{labels[meal] || meal}</Badge>;
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white transition-colors duration-300">Gestion des Réservations</h1>
                <div className="flex gap-2">
                    <Button variant="secondary" className="gap-2" onClick={handleExportPDF}>
                        <Download size={18} />
                        Exporter PDF
                    </Button>
                </div>
            </div>

            <Card className="p-4 border-none shadow-lg shadow-slate-200/40 dark:shadow-none">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
                    <div className="space-y-1.5 w-full">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Sélectionner Date</label>
                        <div className="relative">
                            <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium text-slate-900 dark:text-slate-100"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5 w-full">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Type de repas</label>
                        <div className="relative">
                            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                disabled={activeTab === 'not_reserved'}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none font-medium text-slate-900 dark:text-slate-100 disabled:opacity-50"
                            >
                                <option value="ALL">Tous les repas</option>
                                <option value="BREAKFAST">Petit-déjeuner</option>
                                <option value="LUNCH">Déjeuner</option>
                                <option value="DINNER">Dîner</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5 w-full md:col-span-1 lg:col-span-2">
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider ml-1">Recherche</label>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Rechercher par nom, CEF ou room..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                            />
                        </div>
                    </div>
                </div>
            </Card>

            <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 w-full overflow-x-auto no-scrollbar rounded-xl whitespace-nowrap">
                <button
                    onClick={() => setActiveTab('reserved')}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ${activeTab === 'reserved' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Ont réservé ({formattedData.reserved.length})
                </button>
                <button
                    onClick={() => setActiveTab('not_reserved')}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all shrink-0 ${activeTab === 'not_reserved' ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    N'ont pas réservé ({formattedData.notReserved.length})
                </button>
            </div>

            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                            <Loader2 size={40} className="animate-spin mb-4 text-primary-500" />
                            <p className="font-medium">Chargement des réservations...</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-widest transition-colors duration-300">
                                    <th className="px-6 py-4">CEF</th>
                                    <th className="px-6 py-4">Étudiant</th>
                                    <th className="px-6 py-4">Chambre</th>
                                    <th className="px-6 py-4">Repas réservés</th>
                                    <th className="px-6 py-4">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredData.length > 0 ? (
                                    filteredData.map((row) => (
                                        <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400 dark:text-slate-500">{row.cef}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400">
                                                        <User size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{row.nom} {row.prenom}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-sm text-slate-600 dark:text-slate-400">{row.room}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {row.meals.length > 0 ? row.meals.map(m => getMealBadge(m)) : <span className="text-xs text-slate-400 italic">Aucun</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={row.status === 'en_attente' ? 'warning' : row.status === 'present' ? 'success' : 'danger'}>
                                                    {row.status.toUpperCase()}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            Aucun résultat trouvé pour cette sélection
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminReservations;
