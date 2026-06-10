import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal } from '../../components/ui';
import { getNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import { Bell, CheckCheck, Circle, Calendar, AlertCircle, Info, ShieldCheck } from 'lucide-react';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [selectedNotif, setSelectedNotif] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
    };

    const handleMarkAsRead = async (id) => {
        await markAsRead(id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    };

    const handleMarkAll = async () => {
        await markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const handleClick = (notif) => {
        if (!notif.isRead) handleMarkAsRead(notif._id);
        setSelectedNotif(notif);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SANCTION': return <AlertCircle size={20} className="text-red-500" />;
            case 'LEVÉE_SUSPENSION': return <ShieldCheck size={20} className="text-emerald-500" />;
            case 'CONFIRMATION': return <Calendar size={20} className="text-primary-500" />;
            default: return <Info size={20} className="text-blue-500" />;
        }
    };

    const formatRelativeTime = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3 transition-colors duration-300">
                    <Bell size={24} className="text-primary-600" />
                    Notifications
                </h1>
                <Button variant="ghost" size="sm" className="text-primary-600 dark:text-primary-400 gap-2 font-bold hover:bg-primary-50 dark:hover:bg-primary-900/20" onClick={handleMarkAll}>
                    <CheckCheck size={18} />
                    Tout marquer comme lu
                </Button>
            </div>

            <div className="space-y-3">
                {notifications.map((notif) => (
                    <Card
                        key={notif._id}
                        className={`p-5 transition-all cursor-pointer border-l-4 ${notif.isRead ? 'border-slate-100 dark:border-slate-800 opacity-60' : 'border-primary-500 bg-primary-50/10 dark:bg-primary-900/10 shadow-md dark:shadow-none'}`}
                        onClick={() => handleClick(notif)}
                    >
                        <div className="flex gap-4">
                            <div className={`mt-1 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${notif.isRead ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary-50 dark:bg-primary-900/30'}`}>
                                {getIcon(notif.type)}
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex justify-between items-start">
                                    <Badge variant={notif.isRead ? 'default' : 'info'} className="text-[10px] mb-1">
                                        {notif.type.replace('_', ' ')}
                                    </Badge>
                                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-2">{formatRelativeTime(notif.createdAt)}</span>
                                </div>
                                <p className={`text-sm font-bold truncate ${notif.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-slate-100'}`}>
                                    {notif.titre}
                                </p>
                                <p className={`text-sm line-clamp-2 ${notif.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {notif.message}
                                </p>
                            </div>

                            {!notif.isRead && (
                                <div className="pt-1 shrink-0">
                                    <Circle size={10} fill="currentColor" className="text-primary-600 animate-pulse" />
                                </div>
                            )}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Detail popup */}
            <Modal
                isOpen={!!selectedNotif}
                onClose={() => setSelectedNotif(null)}
                title={selectedNotif?.titre || 'Notification'}
                footer={
                    <Button variant="secondary" onClick={() => setSelectedNotif(null)}>Fermer</Button>
                }
            >
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Badge variant="info" className="text-[10px]">
                            {selectedNotif?.type?.replace('_', ' ')}
                        </Badge>
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                            {selectedNotif && formatRelativeTime(selectedNotif.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                        {selectedNotif?.message}
                    </p>
                </div>
            </Modal>
        </div>
    );
};

export default NotificationsPage;
