import axios from "axios";

const API_URL = "https://my-duka-project-g25b.onrender.com"; // Replace with actual backend URL

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const registerClerk = async (token, userData) => {
  try {
    const response = await axios.post(`${API_URL}/register_clerk`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const inviteAdmin = async (token, email) => {
  try {
    const response = await axios.post(
      `${API_URL}/invite_admin`,
      { email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};

export const registerWithToken = async (token, userData) => {
  try {
    const response = await axios.post(`${API_URL}/register_with_token/${token}`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "An error occurred" };
  }
};
