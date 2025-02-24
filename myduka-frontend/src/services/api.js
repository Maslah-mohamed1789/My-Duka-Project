import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Ensure this matches your backend

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token to request headers if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
});

// ✅ Fetch reports function
export const fetchReports = async (period = 'monthly') => {
    try {
        const response = await api.get(`/report?period=${period}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reports:', error);
        return { error: 'Failed to fetch reports' };
    }
};

// ✅ Fetch stores function
export const fetchStores = async () => {
    try {
        const response = await api.get('/stores'); // Ensure your backend has this endpoint
        return response.data;
    } catch (error) {
        console.error('Error fetching stores:', error);
        return [];
    }
};
export const addStore = async (storeData) => {
    const response = await api.post('/stores', storeData);
    return response.data;
};

export const updateStore = async (id, storeData) => {
    const response = await api.put(`/stores/${id}`, storeData);
    return response.data;
};

export const deleteStore = async (id) => {
    await api.delete(`/stores/${id}`);
};


export default api;
