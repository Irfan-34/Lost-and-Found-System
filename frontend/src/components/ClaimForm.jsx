import React, { useState } from 'react';
import { submitClaim } from '../api/itemsApi';

function ClaimForm({ item, onClose, onClaimSubmitted }) {
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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          Claim Item: {item.name}
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <p className="text-gray-600 mb-4">
        Please provide the necessary details to claim this item. We'll verify your information and contact you.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Your Full Name
          </label>
          <input
            type="text"
            name="claimerName"
            value={formData.claimerName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Contact Information
          </label>
          <input
            type="text"
            name="claimerContact"
            value={formData.claimerContact}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
            placeholder="Phone or Email"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Proof of Ownership
          </label>
          <textarea
            name="proofOfOwnership"
            value={formData.proofOfOwnership}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows="3"
            required
            placeholder="Please describe the item in detail or provide proof that you own it"
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Claim'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClaimForm;