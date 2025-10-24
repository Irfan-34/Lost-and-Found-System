import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { checkAdminExists, registerAdmin } from '../api/adminApi';

function AdminLogin() {
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

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {isRegistration ? 'Create Admin Account' : 'Admin Login'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
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