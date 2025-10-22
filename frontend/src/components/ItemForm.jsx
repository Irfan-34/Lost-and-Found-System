import React, { useState } from 'react';
import { createItem } from '../api/itemsApi';
import { useTheme } from '../context/ThemeContext';

function ItemForm({ onClose, onItemAdded, defaultStatus = 'Lost' }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    description: '',
    location: '',
    date: '',
    reporterName: '',
    reporterContact: '',
    status: defaultStatus,
    category: 'Electronics'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError('');
      
      const updatedFormData = {
        ...formData,
        itemName: formData.description // Backend expects itemName field
      };

      await createItem(updatedFormData);
      
      setFormData({
        description: '',
        location: '',
        date: '',
        reporterName: '',
        reporterContact: '',
        status: defaultStatus,
        category: 'Electronics'
      });

      onItemAdded?.();
      onClose?.();
    } catch (error) {
      console.error('Error submitting item:', error);
      setError(error.message || 'Failed to submit item'); 
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Electronics',
    'Clothing',
    'Documents',
    'Accessories',
    'Books',
    'Keys',
    'Other'
  ];

  const inputClasses = `w-full p-2 border rounded ${
    isDark 
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
      : 'bg-white border-gray-300'
  }`;

  const labelClasses = `block text-sm font-medium mb-1 ${
    isDark ? 'text-gray-200' : 'text-gray-700'
  }`;

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${isDark ? 'text-white' : ''}`}>
      <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Report {defaultStatus} Item
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div>
        <label className={labelClasses}>Description</label>
        <textarea
          className={inputClasses}
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
          placeholder="Describe the item..."
        />
      </div>

      <div>
        <label className={labelClasses}>Category</label>
        <select
          className={inputClasses}
          value={formData.category}
          onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
          required
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClasses}>Location</label>
        <input
          type="text"
          className={inputClasses}
          value={formData.location}
          onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
          required
          placeholder="Where was it lost/found?"
        />
      </div>

      <div>
        <label className={labelClasses}>Date</label>
        <input
          type="date"
          className={inputClasses}
          value={formData.date}
          onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className={labelClasses}>Your Name</label>
        <input
          type="text"
          className={inputClasses}
          value={formData.reporterName}
          onChange={e => setFormData(prev => ({ ...prev, reporterName: e.target.value }))}
          required
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className={labelClasses}>Contact Information</label>
        <input
          type="text"
          className={inputClasses}
          value={formData.reporterContact}
          onChange={e => setFormData(prev => ({ ...prev, reporterContact: e.target.value }))}
          required
          placeholder="Phone or email"
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded ${
            isDark 
              ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : isDark
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-600 hover:bg-blue-700'
          } text-white`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </div>
    </form>
  );
}

export default ItemForm;

const loadItems = async () => {
  try {
    setLoading(true);
    const data = await fetchItems();
    setItems(data);
  } catch (err) {
    console.error('Failed to load items:', err);
  } finally {
    setLoading(false);
  }
};

// Pass this to ItemForm
<ItemForm onItemAdded={loadItems} />