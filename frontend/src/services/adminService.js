import api from './api';

export const getAllUsers = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const updatePresence = async (data) => {
    // data: { studentId, mealType, status }
    const response = await api.post('/presence', data);
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

export const getReports = async () => {
    const response = await api.get('/reports');
    return response.data;
};

export const updateReport = async (id, data) => {
    const response = await api.patch(`/reports/${id}`, data);
    return response.data;
};

export const getAdminStats = async () => {
    const response = await api.get('/stats/summary');
    return response.data;
};

export const getDailyStats = async () => {
    const response = await api.get('/stats/daily');
    return response.data;
};

export const getLogs = async () => {
    const response = await api.get('/logs');
    return response.data;
};
export const getAdminReservations = async (date) => {
    const response = await api.get(`/reservations?date=${date}`);
    return response.data;
};
