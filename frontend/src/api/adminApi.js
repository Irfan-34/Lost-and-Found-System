import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const checkAdminExists = async () => {
  try {
    const response = await api.get('/admin/exists');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to check admin status');
  }
};

export const registerAdmin = async (adminData) => {
  try {
    const response = await api.post('/admin/register', adminData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to register admin');
  }
};

export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Invalid credentials');
  }
};