import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});
 
// Set auth token for requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const fetchItems = async () => {
  try {
    const response = await api.get('/items');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to fetch items');
  }
};

export const createItem = async (itemData) => {
  try {
    const response = await api.post('/items', itemData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to create item');
  }
};

export const updateItemStatus = async (itemId, status) => {
  try {
    const response = await api.put(`/items/${itemId}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to update item status');
  }
};

export const submitClaim = async (itemId, claimData) => {
  try {
    const response = await api.post(`/items/${itemId}/claim`, claimData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to submit claim');
  }
};

export const approveItemClaim = async (itemId, claimId) => {
  try {
    const response = await api.put(`/items/${itemId}/approve`, { claimId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to approve claim');
  }
};