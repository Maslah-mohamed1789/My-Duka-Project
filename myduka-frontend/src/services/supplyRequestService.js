import api from './api';

// Fetch all supply requests
export const fetchSupplyRequestsAPI = async () => {
    const response = await api.get('/supply_requests');
    return response.data;
};

// Create a new supply request
export const createSupplyRequestAPI = async (requestData) => {
    const response = await api.post('/request_supply', requestData);
    return response.data;
};

// ✅ ADD THESE FUNCTIONS:
export const approveRequestAPI = async (requestId) => {
    const response = await api.put(`/supply_requests/${requestId}/approve`);
    return response.data;
};

export const rejectRequestAPI = async (requestId) => {
    const response = await api.put(`/supply_requests/${requestId}/reject`);
    return response.data;
};
