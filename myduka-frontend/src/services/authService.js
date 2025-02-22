import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth'; // Adjust if needed

export const login = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// ✅ Add these missing functions for admin actions

export const addUser = async (userData) => {
    const response = await axios.post(`${API_URL}/users`, userData);  // Ensure this matches your backend route
    return response.data;
};

export const fetchUsers = async () => {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`);
    return response.data;
};
