import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Card } from '../../components/ui';
import { LogIn, ShieldCheck, User } from 'lucide-react';

const LoginPage = () => {
    const [cef, setCef] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoggingIn(true);

        try {
            const user = await login(cef, password);
            if (user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/stagiaire/dashboard');
            }
        } catch (err) {
            console.log(err);
            setError('CEF ou mot de passe incorrect');
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-200 dark:shadow-primary-950/50 mb-4 transform rotate-3">
                        <LogIn size={32} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">RestoSchool</h2>
                    <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-400">Système de réservation de restaurant scolaire</p>
                </div>

                <Card className="p-6 md:p-8 border-none shadow-2xl shadow-slate-200 dark:shadow-none">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="cef" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Identifiant (CEF)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <User size={18} />
                                </div>
                                <input
                                    id="cef"
                                    type="text"
                                    required
                                    value={cef}
                                    onChange={(e) => setCef(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="Votre identifiant CEF"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                    <ShieldCheck size={18} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all sm:text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900/50 animate-shake">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg font-bold"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;
