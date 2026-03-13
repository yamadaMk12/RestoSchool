import { LogOut, User, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui';

import ThemeToggle from './ThemeToggle';

const Navbar = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 transition-colors duration-300">
            <div className="flex items-center gap-2">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg md:hidden"
                >
                    <Menu size={20} />
                </button>
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold ml-1 md:ml-0">R</div>
                <span className="font-bold text-xl text-slate-800 dark:text-slate-100 hidden sm:block">RestoSchool</span>
            </div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.nom}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{user?.role === 'admin' ? 'Administrateur' : `Élève - ${user?.room}`}</p>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        <User size={20} />
                    </div>
                    <Button variant="ghost" size="sm" onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
                        <LogOut size={18} />
                    </Button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
