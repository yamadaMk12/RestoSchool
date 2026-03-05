import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from './ui';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative flex items-center justify-between w-16 h-8 p-1 rounded-full transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-primary-500",
                theme === 'dark' ? "bg-slate-800" : "bg-slate-200"
            )}
            aria-label="Toggle theme"
        >
            <div
                className={cn(
                    "absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center",
                    theme === 'dark' ? "translate-x-8" : "translate-x-0"
                )}
            >
                {theme === 'dark' ? (
                    <Moon size={14} className="text-primary-600" />
                ) : (
                    <Sun size={14} className="text-amber-500" />
                )}
            </div>
            <div className="flex justify-between items-center w-full px-1.5">
                <Sun size={14} className={cn("transition-opacity duration-500", theme === 'dark' ? "opacity-100" : "opacity-0")} />
                <Moon size={14} className={cn("transition-opacity duration-500", theme === 'dark' ? "opacity-0" : "opacity-100")} />
            </div>
        </button>
    );
};

export default ThemeToggle;
