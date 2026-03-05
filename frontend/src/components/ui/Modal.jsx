import React from 'react';
import { cn } from './index';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800 transition-colors duration-300"
                onClick={e => e.stopPropagation()}
            >
                <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white transition-colors duration-300">{title}</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto no-scrollbar">
                    {children}
                </div>
                {footer && (
                    <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0 transition-colors duration-300">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};
