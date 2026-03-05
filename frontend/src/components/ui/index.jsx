import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs) => {
    return twMerge(clsx(inputs));
};

export const Button = ({ className, variant = 'primary', size = 'md', ...props }) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-200 dark:shadow-primary-950/20',
        secondary: 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-200 dark:shadow-red-950/20',
        ghost: 'bg-transparent text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};

export const Badge = ({ className, variant = 'default', ...props }) => {
    const variants = {
        default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
        success: 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400',
        warning: 'bg-amber-100 dark:bg-amber-950/30 text-amber-800 dark:text-amber-400',
        danger: 'bg-red-100 dark:bg-red-950/30 text-red-800 dark:text-red-400',
        info: 'bg-blue-100 dark:bg-blue-950/30 text-blue-800 dark:text-blue-400',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
                variants[variant],
                className
            )}
            {...props}
        />
    );
};

export const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={cn(
                'bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
export * from './Modal';
