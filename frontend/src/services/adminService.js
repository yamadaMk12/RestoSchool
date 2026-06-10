import api from './api';

export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post('/users', data);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export const updatePresence = async (data) => {
    const response = await api.patch(`/presence/${data.reservationId}`, {
        statut: data.statut,
        adminCef: data.adminCef
    });
    return response.data;
};

export const getSuspendedStudents = async () => {
    const response = await api.get('/sanctions/active');
    return response.data;
};

export const liftSanction = async (userId) => {
    const response = await api.patch(`/sanctions/${userId}/lift`);
    return response.data;
};

export const getSanctionHistory = async () => {
    const response = await api.get('/sanctions/history');
    return response.data;
};

export const getReports = async () => {
    const response = await api.get('/reports');
    return response.data;
};

export const updateReport = async (id, data) => {
    const response = await api.patch(`/reports/${id}`, data);
    return response.data;
};

export const getAdminStats = async () => {
    const response = await api.get('/stats/dashboard');
    return response.data;
};

export const getWeeklyStats = async () => {
    const response = await api.get('/stats/weekly');
    return response.data;
};

export const getStatsByMeal = async () => {
    const response = await api.get('/stats/by-meal');
    return response.data;
};

export const getLastLogs = async () => {
    const response = await api.get('/logs/last');
    return response.data;
};

export const getAllLogs = async (page = 1, limit = 20) => {
    const response = await api.get(`/logs?page=${page}&limit=${limit}`);
    return response.data;
};
export const getAdminReservations = async (date) => {
    const response = await api.get(`/reservations?date=${date}`);
    return response.data;
};

export const sendNotification = async (data) => {
    const response = await api.post('/notifications/send', data);
    return response.data;
};
