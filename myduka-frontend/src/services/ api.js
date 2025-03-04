// src/services/api.js
import axios from 'axios';

const API_URL = 'https://my-duka-project-g25b.onrender.com'; // Your backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Authentication API calls
export const registerClerk = (data, token) => api.post('/register_clerk', data, { headers: { Authorization: `Bearer ${token}` } });
export const login = (data) => api.post('/login', data);
export const inviteAdmin = (data, token) => api.post('/invite_admin', data, { headers: { Authorization: `Bearer ${token}` } });
export const registerWithToken = (data, token) => api.post(`/register_with_token/${token}`, data);

// Inventory API calls
export const addInventory = (data, token) => api.post('/inventory', data, { headers: { Authorization: `Bearer ${token}` } });
export const getInventory = (token) => api.get('/inventory', { headers: { Authorization: `Bearer ${token}` } });
export const updateInventory = (inventoryId, data, token) => api.put(`/inventory/${inventoryId}`, data, { headers: { Authorization: `Bearer ${token}` } });
export const deleteInventory = (inventoryId, token) => api.delete(`/inventory/${inventoryId}`, { headers: { Authorization: `Bearer ${token}` } });

// Payment API calls
export const processPayment = (data, token) => api.post('/payment', data, { headers: { Authorization: `Bearer ${token}` } });
export const getPayments = (token) => api.get('/payment', { headers: { Authorization: `Bearer ${token}` } });

// Report API calls
export const generateReport = (data, token) => api.post('/report', data, { headers: { Authorization: `Bearer ${token}` } });
export const getReports = (token) => api.get('/report', { headers: { Authorization: `Bearer ${token}` } });

// Supply API calls
export const requestSupply = (data, token) => api.post('/supply_request', data, { headers: { Authorization: `Bearer ${token}` } });
export const getSupplyRequests = (token) => api.get('/supply_request', { headers: { Authorization: `Bearer ${token}` } });