import React, { useState } from 'react';
import { submitClaim } from '../api/itemsApi';
import { useTheme } from '../context/ThemeContext';

function ClaimForm({ item, onClose, onClaimSubmitted }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [formData, setFormData] = useState({
    claimerName: '',
    claimerContact: '',
    proofOfOwnership: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      await submitClaim(item.id, formData);
      onClaimSubmitted();
    } catch (err) {
      setError(err.message || 'Failed to submit claim');
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
    <div className={isDark ? 'text-white' : ''}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`text-xl font-bold ${
          isDark ? 'text-white' : 'text-gray-800'
        }`}>
          Claim Item: {item.name}
        </h2>
        <button
          onClick={onClose}
          className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Please provide the necessary details to claim this item. We'll verify your information and contact you.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className={labelClasses}>
            Your Full Name
          </label>
          <input
            type="text"
            name="claimerName"
            value={formData.claimerName}
            onChange={handleChange}
            className={inputClasses}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className={labelClasses}>
            Contact Information
          </label>
          <input
            type="text"
            name="claimerContact"
            value={formData.claimerContact}
            onChange={handleChange}
            className={inputClasses}
            required
            placeholder="Phone or Email"
          />
        </div>
        
        <div className="mb-4">
          <label className={labelClasses}>
            Proof of Ownership
          </label>
          <textarea
            name="proofOfOwnership"
            value={formData.proofOfOwnership}
            onChange={handleChange}
            className={inputClasses}
            rows="3"
            required
            placeholder="Please describe the item in detail or provide proof that you own it"
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-md mr-2 ${
              isDark 
                ? 'bg-gray-600 hover:bg-gray-500 text-gray-200' 
                : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
            }`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md ${
              isSubmitting 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:bg-blue-700'
            } bg-blue-600 text-white`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClaimForm;