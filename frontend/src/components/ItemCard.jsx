import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { formatDate } from '../utils/dateUtils';

const ItemCard = ({ item, onClaim, showClaimButton = false }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'lost': return isDark ? 'text-red-400' : 'text-red-600';
      case 'found': return isDark ? 'text-green-400' : 'text-green-600';
      case 'pending': return isDark ? 'text-yellow-400' : 'text-yellow-600';
      case 'returned': return isDark ? 'text-blue-400' : 'text-blue-600';
      default: return isDark ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${
      isDark 
        ? 'border-gray-600 bg-gray-700' 
        : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className={`font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {item.name || item.description || 'Unnamed Item'}
        </h3>
        <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
          {item.status}
        </span>
      </div>
      
      <div className={`space-y-1 text-sm ${
        isDark ? 'text-gray-300' : 'text-gray-600'
      }`}>
        {item.description && item.name !== item.description && (
          <p><span className="font-medium">Description:</span> {item.description}</p>
        )}
        {item.category && (
          <p><span className="font-medium">Category:</span> {item.category}</p>
        )}
        <p><span className="font-medium">Location:</span> {item.location || 'Not specified'}</p>
        <p><span className="font-medium">Date:</span> {formatDate(item.date)}</p>
        <p><span className="font-medium">Reporter:</span> {item.reporterName || 'Anonymous'}</p>
        {item.reporterContact && (
          <p><span className="font-medium">Contact:</span> {item.reporterContact}</p>
        )}
        {item.claims && item.claims.length > 0 && (
          <p><span className="font-medium">Claims:</span> {item.claims.length}</p>
        )}
      </div>

      {showClaimButton && item.status?.toLowerCase() === 'found' && (
        <button
          onClick={() => onClaim(item)}
          className={`mt-3 w-full px-3 py-2 text-sm font-medium rounded ${
            isDark 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Claim This Item
        </button>
      )}
    </div>
  );
};

export default ItemCard;