import api from './api';

export const getReservations = async () => {
    const response = await api.get('/reservations');
    return response.data;
};

export const createReservation = async (data) => {
    const response = await api.post('/reservations', data);
    return response.data;
};

export const updateReservation = async (id, data) => {
    const response = await api.put(`/reservations/${id}`, data);
    return response.data;
};

export const cancelReservation = async (id) => {
    const response = await api.delete(`/reservations/${id}`);
    return response.data;
};

export const createBulkReservations = async (reservations) => {
    const response = await api.post('/reservations/bulk', { reservations });
    return response.data;
};
