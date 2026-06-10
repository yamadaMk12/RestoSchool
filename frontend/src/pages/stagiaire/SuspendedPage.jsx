import React from 'react';
import { Card, Button } from '../../components/ui';
import { ShieldAlert, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SuspendedPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 animate-in fade-in duration-500">
            <Card className="max-w-lg w-full p-8 text-center border-none shadow-2xl shadow-red-500/10 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>
                
                <div className="mx-auto w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 dark:text-red-400 mb-6">
                    <ShieldAlert size={40} strokeWidth={1.5} />
                </div>
                
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                    Compte Suspendu
                </h1>
                
                <div className="space-y-4 mb-8">
                    <p className="text-slate-600 dark:text-slate-400">
                        Votre accès au système de réservation a été temporairement suspendu suite à une absence non justifiée.
                    </p>
                    
                    {user?.suspensionEnd && (
                        <div className="inline-block px-4 py-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900/50">
                            <span className="text-sm font-semibold text-red-800 dark:text-red-400 block mb-1">
                                Fin de la suspension :
                            </span>
                            <span className="text-lg font-black text-red-600 dark:text-red-500">
                                {new Date(user.suspensionEnd).toLocaleString('fr-FR', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-8">
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 text-sm flex items-center justify-center gap-2">
                        <MessageSquare size={16} />
                        Une erreur ? Un justificatif ?
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Si vous avez une justification valable pour votre absence, vous pouvez soumettre une réclamation à l'administration.
                    </p>
                    <Button 
                        onClick={() => navigate('/stagiaire/reclamation')}
                        variant="secondary" 
                        className="w-full gap-2 border-slate-200 dark:border-slate-700"
                    >
                        Soumettre un justificatif
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SuspendedPage;
