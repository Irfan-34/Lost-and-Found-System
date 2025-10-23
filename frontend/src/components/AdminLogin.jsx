import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkAdminExists, registerAdmin } from '../api/adminApi';
import { useTheme } from '../context/ThemeContext';

function AdminLogin() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [isRegistration, setIsRegistration] = useState(false);
  const [adminExists, setAdminExists] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { exists } = await checkAdminExists();
        setAdminExists(exists);
        setIsRegistration(!exists);
      } catch (err) {
        console.error('Failed to check if admin exists:', err);
      }
    };
    
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (isRegistration) {
        await registerAdmin(formData);
        await login(formData);
      } else {
        await login(formData);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `w-full p-2 border rounded-md ${
    isDark 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
  }`;

  const labelClasses = `block mb-2 ${
    isDark ? 'text-gray-200' : 'text-gray-700'
  }`;

  return (
    <div className={`max-w-md mx-auto mt-10 p-6 rounded-lg shadow-md ${
      isDark ? 'bg-gray-800 text-white' : 'bg-white'
    }`}>
      <h2 className={`text-2xl font-bold mb-6 ${
        isDark ? 'text-white' : 'text-gray-800'
      }`}>
        {isRegistration ? 'Create Admin Account' : 'Admin Login'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={labelClasses}>
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className={labelClasses}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md w-full ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting 
              ? 'Processing...' 
              : isRegistration 
                ? 'Create Admin Account' 
                : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminLogin;