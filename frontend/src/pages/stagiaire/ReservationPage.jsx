import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge, cn } from '../../components/ui';
import { isReservationWindowOpen, getNextOpeningTime, getUpcomingWeekDates, formatFullDate } from '../../utils/dateUtils';
import { Utensils, Coffee, Moon, CheckCircle2, AlertCircle, Calendar, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { getReservations, createBulkReservations } from '../../services/reservationService';

const ReservationPage = () => {
    const { user } = useAuth();
    const isOpen = isReservationWindowOpen();
    const isSuspended = user?.suspended;

    const [weeklySelections, setWeeklySelections] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [hasSubmittedWeekly, setHasSubmittedWeekly] = useState(false);
    
    // Get the Monday-to-Sunday range for the upcoming week
    const upcomingRange = getUpcomingWeekDates();

    useEffect(() => {
        const loadReservations = async () => {
            try {
                const existing = await getReservations();
                const initialSelections = {};
                
                let foundAnyForNextWeek = false;
                upcomingRange.forEach(date => {
                    const res = existing.find(r => r.date === date);
                    if (res && res.repas?.length > 0) {
                        foundAnyForNextWeek = true;
                    }
                    initialSelections[date] = {
                        breakfast: res?.repas?.includes('petit_dejeuner') || false,
                        lunch: res?.repas?.includes('dejeuner') || false,
                        dinner: res?.repas?.includes('diner') || false
                    };
                });
                
                setWeeklySelections(initialSelections);
                if (foundAnyForNextWeek) {
                    setHasSubmittedWeekly(true);
                }
            } catch (error) {
                console.error("Failed to load reservations", error);
            } finally {
                setLoading(false);
            }
        };
        loadReservations();
    }, []);

    const toggleMeal = (date, meal) => {
        setWeeklySelections(prev => ({
            ...prev,
            [date]: {
                ...prev[date],
                [meal]: !prev[date][meal]
            }
        }));
    };

    const handleConfirmAll = async () => {
        const reservations = Object.entries(weeklySelections)
            .map(([date, meals]) => {
                const repas = [];
                if (meals.breakfast) repas.push('petit_dejeuner');
                if (meals.lunch) repas.push('dejeuner');
                if (meals.dinner) repas.push('diner');
                return { date, repas };
            })
            .filter(r => r.repas.length > 0); // Don't allow empty reservations for a day

        if (reservations.length === 0) {
            alert("Veuillez sélectionner au moins un repas pour la semaine.");
            return;
        }

        setSubmitting(true);
        try {
            await createBulkReservations(reservations);
            setSuccess(true);
            setHasSubmittedWeekly(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 animate-pulse font-medium">Chargement de votre planning...</p>
            </div>
        );
    }

    const isLocked = !isOpen || isSuspended || hasSubmittedWeekly;

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Planning Hebdomadaire</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">Gérez vos réservations pour la semaine prochaine.</p>
                </div>
                
                <div className="flex flex-col gap-3 w-full md:w-auto">
                    {hasSubmittedWeekly ? (
                        <Badge variant="info" className="text-sm py-2 px-4 justify-center gap-2 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                            <CheckCircle2 size={16} /> Planning déjà soumis
                        </Badge>
                    ) : !isOpen ? (
                        <Badge variant="danger" className="text-sm py-2 px-4 justify-center gap-2">
                            <AlertCircle size={16} /> Fenêtre fermée • Ouverture le {getNextOpeningTime()}
                        </Badge>
                    ) : (
                        <Badge variant="success" className="text-sm py-2 px-4 justify-center gap-2">
                            <CheckCircle2 size={16} /> Fenêtre de réservation ouverte
                        </Badge>
                    )}
                </div>
            </div>

            {(isSuspended || hasSubmittedWeekly) && (
                <Card className={cn(
                    "p-6 shadow-none",
                    isSuspended ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50" : "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50"
                )}>
                    <div className={cn(
                        "flex items-center gap-4",
                        isSuspended ? "text-red-800 dark:text-red-400" : "text-blue-800 dark:text-blue-400"
                    )}>
                        <AlertCircle size={24} />
                        <p className="font-bold">
                            {isSuspended 
                                ? "Votre compte est suspendu. Les réservations sont bloquées." 
                                : "Vous avez déjà soumis votre planning pour la semaine prochaine. Les modifications ne sont plus possibles."}
                        </p>
                    </div>
                </Card>
            )}

            {/* Grid of days */}
            <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-8", isLocked && "opacity-50 pointer-events-none")}>
                {upcomingRange.map((date) => (
                    <DayReservationCard 
                        key={date}
                        date={date}
                        selections={weeklySelections[date] || {}}
                        onToggle={(meal) => toggleMeal(date, meal)}
                        disabled={isLocked}
                    />
                ))}
            </div>

            {/* Floating Action Bar */}
            <div className="sticky bottom-8 z-10">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                    <div className="flex items-center gap-4 px-4 text-slate-600 dark:text-slate-400">
                        <Calendar size={24} className="text-primary-500" />
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">Prêt à confirmer ?</p>
                            <p className="text-xs">Toutes les dates sélectionnées seront synchronisées.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {success && (
                            <span className="text-emerald-600 font-bold text-sm animate-in fade-in zoom-in slide-in-from-right-4 duration-300">
                                Planning mis à jour !
                            </span>
                        )}
                        <Button
                            size="lg"
                            className="w-full md:w-auto gap-2 px-8 py-6 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-lg font-bold"
                            disabled={!isOpen || isSuspended || submitting}
                            onClick={handleConfirmAll}
                        >
                            {submitting ? 'Synchronisation...' : 'Enregistrer mon planning'}
                            <Save size={20} />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DayReservationCard = ({ date, selections, onToggle, disabled }) => {
    return (
        <Card className={cn(
            "p-0 overflow-hidden border-slate-200 dark:border-slate-800 transition-all duration-300",
            disabled && "opacity-60 grayscale-[0.5]"
        )}>
            <div className="bg-slate-50 dark:bg-white/5 p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-500 text-white rounded-xl shadow-lg shadow-primary-500/20">
                        <Calendar size={18} />
                    </div>
                    <span className="font-bold text-slate-800 dark:text-slate-100 capitalize">{formatFullDate(date)}</span>
                </div>
                {Object.values(selections).some(v => v) ? (
                    <Badge variant="success" className="animate-in zoom-in">Réservé</Badge>
                ) : (
                    <Badge variant="secondary" className="opacity-50">Aucun repas</Badge>
                )}
            </div>
            
            <div className="p-6 grid grid-cols-3 gap-4">
                <MealToggle 
                    label="P.Déj" 
                    icon={Coffee} 
                    active={selections.breakfast} 
                    onClick={() => onToggle('breakfast')}
                    color="amber"
                />
                <MealToggle 
                    label="Déjeuner" 
                    icon={Utensils} 
                    active={selections.lunch} 
                    onClick={() => onToggle('lunch')}
                    color="sky"
                />
                <MealToggle 
                    label="Dîner" 
                    icon={Moon} 
                    active={selections.dinner} 
                    onClick={() => onToggle('dinner')}
                    color="indigo"
                />
            </div>
        </Card>
    );
};

const MealToggle = ({ label, icon: Icon, active, onClick, color }) => {
    const colorClasses = {
        amber: active ? "bg-amber-500 text-white shadow-amber-200/50" : "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
        sky: active ? "bg-sky-500 text-white shadow-sky-200/50" : "text-sky-500 bg-sky-50 dark:bg-sky-500/10",
        indigo: active ? "bg-indigo-500 text-white shadow-indigo-200/50" : "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300",
                active 
                    ? "border-primary-500 ring-4 ring-primary-500/10 shadow-lg scale-105" 
                    : "border-transparent bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 hover:scale-105"
            )}
        >
            <div className={cn("p-3 rounded-xl transition-all duration-500", colorClasses[color])}>
                <Icon size={24} />
            </div>
            <span className={cn("text-xs font-bold uppercase tracking-wider", active ? "text-primary-600 dark:text-primary-400" : "text-slate-500")}>
                {label}
            </span>
        </button>
    );
};

export default ReservationPage;
