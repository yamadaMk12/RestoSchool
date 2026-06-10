import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { BarChart3, PieChart as PieChartIcon, Target, Users } from 'lucide-react';

import { getAdminStats, getWeeklyStats, getStatsByMeal } from '../../services/adminService';

const AdminStats = () => {
    const [dashboardStats, setDashboardStats] = useState(null);
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [mealStats, setMealStats] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const dash = await getAdminStats();
                setDashboardStats(dash);
                
                const weekly = await getWeeklyStats();
                const formattedWeekly = weekly.reverse().map(item => {
                    const dateObj = new Date(item.date);
                    const name = dateObj.toLocaleDateString('fr-FR', { weekday: 'short' });
                    return { ...item, name: name.charAt(0).toUpperCase() + name.slice(1), presence: item.presents };
                });
                setWeeklyStats(formattedWeekly);

                const meals = await getStatsByMeal();
                setMealStats(meals.map(m => ({ name: m.type, value: m.count })));
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3 transition-colors duration-300">
                    <BarChart3 size={28} className="text-primary-600 dark:text-primary-400" />
                    Analyses & Statistiques
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors duration-300">Surveillez l'activité et le taux de présence de la cantine.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatSummaryCard title="Total Réservations (Auj)" value={dashboardStats?.totalToday || 0} trend="Auj" icon={Users} color="text-blue-600" bg="bg-blue-50" />
                <StatSummaryCard title="Taux de présence moyen" value={`${dashboardStats?.presenceRate || 0}%`} trend="Auj" icon={Target} color="text-emerald-600" bg="bg-emerald-50" />
                <StatSummaryCard title="Réclamations Ouvertes" value={dashboardStats?.openReports || 0} trend="Actif" icon={PieChartIcon} color="text-amber-600" bg="bg-amber-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-6 border-none shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
                    <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs mb-8">Réservations vs Présences</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyStats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
                                <Tooltip cursor={{ fill: 'rgba(51, 65, 85, 0.3)' }} contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }} itemStyle={{ color: '#f8fafc' }} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar name="Réservations" dataKey="reservations" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar name="Présences" dataKey="presence" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <div className="grid grid-cols-1 gap-8">
                    <Card className="p-6 border-none shadow-xl shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
                        <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-xs mb-8">Répartition par repas</h3>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={mealStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {mealStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" align="center" layout="horizontal" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

const StatSummaryCard = ({ title, value, trend, icon: Icon, color, bg }) => (
    <Card className="p-6 border-none shadow-lg shadow-slate-200/40 dark:shadow-none transition-colors duration-300">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${bg} ${color}`}>
                <Icon size={24} />
            </div>
            <span className="text-emerald-500 text-xs font-black">{trend}</span>
        </div>
        <div className="mt-4">
            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none transition-colors duration-300">{title}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white mt-2 transition-colors duration-300">{value}</p>
        </div>
    </Card>
);

export default AdminStats;
