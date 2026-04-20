import api from './api';

export const getReclamations = async () => {
    const response = await api.get('/reports');
    return response.data;
};

export const createReclamation = async (formData) => {
    const response = await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateReclamation = async (id, formData) => {
    const response = await api.put(`/reports/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteReclamation = async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
};
