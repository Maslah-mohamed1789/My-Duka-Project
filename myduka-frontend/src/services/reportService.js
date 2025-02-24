import api from './api';

export const fetchReportsAPI = async (period) => {
    const response = await api.get(`/report?period=${period}`);
    return response.data;
};
