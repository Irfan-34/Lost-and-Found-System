import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginAdmin } from '../api/adminApi';
import { setAuthToken } from '../api/itemsApi';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setAuthToken(storedToken); // Set token in axios headers on app load
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const response = await loginAdmin(credentials);
      const { token } = response;
      if (token) {
        localStorage.setItem('authToken', token);
        setToken(token);
        setIsAuthenticated(true);
        setAuthToken(token); // Set token in axios headers
        return response;
      }
      throw new Error('No token received');
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setIsAuthenticated(false);
    setAuthToken(null); // Remove token from axios headers
  };

  const value = {
    isAuthenticated,
    token,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}