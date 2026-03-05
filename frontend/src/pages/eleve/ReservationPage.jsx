import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, Button, Badge, cn } from '../../components/ui';
import { isReservationWindowOpen, getNextOpeningTime } from '../../utils/dateUtils';
import { Utensils, Coffee, Moon, CheckCircle2, AlertCircle } from 'lucide-react';
import { createReservation } from '../../services/reservationService';

const ReservationPage = () => {
    const { user } = useAuth();
    const isOpen = isReservationWindowOpen();
    const isSuspended = user?.suspended;

    const [selectedMeals, setSelectedMeals] = useState({
        breakfast: false,
        lunch: false,
        dinner: false
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const toggleMeal = (meal) => {
        setSelectedMeals(prev => ({ ...prev, [meal]: !prev[meal] }));
    };

    const handleConfirm = async () => {
        if (Object.values(selectedMeals).every(v => !v)) return;

        setSubmitting(true);
        try {
            await createReservation({ meals: selectedMeals, date: new Date().toISOString() });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">Réserver vos repas</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Sélectionnez les repas que vous souhaitez réserver pour la journée de demain.</p>
            </div>

            {!isOpen ? (
                <Card className="p-6 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50">
                    <div className="flex items-center gap-4 text-red-800 dark:text-red-400">
                        <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl"><AlertCircle size={24} /></div>
                        <div>
                            <p className="text-lg font-bold">Réservation fermée</p>
                            <p className="dark:text-red-300">Prochaine ouverture à <span className="font-bold">{getNextOpeningTime()}</span>.</p>
                        </div>
                    </div>
                </Card>
            ) : (
                <Card className="p-6 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50">
                    <div className="flex items-center gap-4 text-emerald-800 dark:text-emerald-400">
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl"><CheckCircle2 size={24} /></div>
                        <div>
                            <p className="text-lg font-bold">Réservation ouverte</p>
                            <p className="dark:text-emerald-300">Vous avez jusqu'à 08h00 demain pour modifier vos choix.</p>
                        </div>
                    </div>
                </Card>
            )}

            {isSuspended && (
                <Card className="p-6 bg-slate-900 text-white border-none shadow-xl">
                    <div className="flex items-center gap-4">
                        <div className="bg-white/10 p-3 rounded-xl"><AlertCircle size={24} className="text-red-400" /></div>
                        <div>
                            <p className="text-lg font-bold">Accès restreint</p>
                            <p className="text-slate-300">Votre compte est actuellement suspendu. Vous ne pouvez pas effectuer de réservations.</p>
                        </div>
                    </div>
                </Card>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${(isSuspended || !isOpen) ? 'opacity-50 pointer-events-none' : ''}`}>
                <MealCard
                    id="breakfast"
                    label="Petit-déjeuner"
                    icon={Coffee}
                    checked={selectedMeals.breakfast}
                    onToggle={() => toggleMeal('breakfast')}
                    time="07h00 - 08h30"
                    color="bg-amber-500"
                />
                <MealCard
                    id="lunch"
                    label="Déjeuner"
                    icon={Utensils}
                    checked={selectedMeals.lunch}
                    onToggle={() => toggleMeal('lunch')}
                    time="12h00 - 14h00"
                    color="bg-sky-500"
                />
                <MealCard
                    id="dinner"
                    label="Dîner"
                    icon={Moon}
                    checked={selectedMeals.dinner}
                    onToggle={() => toggleMeal('dinner')}
                    time="19h00 - 20h30"
                    color="bg-indigo-500"
                />
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
                {success && (
                    <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce flex items-center gap-2">
                        <CheckCircle2 size={20} />
                        Réservation confirmée avec succès !
                    </div>
                )}

                <Button
                    size="lg"
                    className="w-full md:w-auto px-12 py-6 text-xl shadow-2xl transition-all hover:scale-105 active:scale-95"
                    disabled={!isOpen || isSuspended || Object.values(selectedMeals).every(v => !v) || submitting}
                    onClick={handleConfirm}
                >
                    {submitting ? 'Traitement...' : 'Confirmer la réservation'}
                </Button>
            </div>
        </div>
    );
};

const MealCard = ({ label, icon: Icon, checked, onToggle, time, color }) => (
    <div
        onClick={onToggle}
        className={cn(
            "relative cursor-pointer group p-6 rounded-2xl border-2 transition-all flex flex-col items-center text-center",
            checked
                ? "border-primary-500 bg-primary-50/50 dark:bg-primary-900/20 shadow-lg shadow-primary-100 dark:shadow-none"
                : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md"
        )}
    >
        <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-4 transition-transform group-hover:scale-110",
            color
        )}>
            <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{label}</h3>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{time}</p>

        <div className={cn(
            "absolute top-4 right-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
            checked ? "bg-primary-500 border-primary-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
        )}>
            {checked && <CheckCircle2 size={16} className="text-white" />}
        </div>
    </div>
);

export default ReservationPage;
