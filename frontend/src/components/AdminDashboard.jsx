import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { updateItemStatus, approveItemClaim } from '../api/itemsApi';
import { formatDate } from '../utils/dateUtils';

function AdminDashboard({ items = [], onItemUpdated }) {
  const [activeTab, setActiveTab] = useState('all');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);

  const filteredItems = items?.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return item.status === 'Pending';
    if (activeTab === 'lost') return item.status === 'Lost' || item.status === 'lost';
    if (activeTab === 'found') return item.status === 'Found' || item.status === 'found';
    return true;
  }) || [];

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      setLoading(true);
      await updateItemStatus(itemId, newStatus);
      onItemUpdated();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update item status');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveClaim = async (itemId, claimId) => {
    try {
      setLoading(true);
      await approveItemClaim(itemId, claimId);
      onItemUpdated();
      alert('Claim approved successfully!');
    } catch (error) {
      console.error('Failed to approve claim:', error);
      alert('Failed to approve claim');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      'Lost': 'bg-red-100 text-red-800',
      'lost': 'bg-red-100 text-red-800',
      'Found': 'bg-green-100 text-green-800',
      'found': 'bg-green-100 text-green-800',
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Returned': 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="flex space-x-4 mb-6">
        {['all', 'pending', 'lost', 'found'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize ${
              activeTab === tab
                ? isDark ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {tab} ({items?.filter(item => {
              if (tab === 'all') return true;
              if (tab === 'pending') return item.status === 'Pending';
              if (tab === 'lost') return item.status === 'Lost' || item.status === 'lost';
              if (tab === 'found') return item.status === 'Found' || item.status === 'found';
              return true;
            }).length || 0})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className={`min-w-full ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
          <thead>
            <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
              <th className="px-6 py-3 text-left">Item</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Location</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Reporter</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Claims</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">No items found</td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <td className="px-6 py-4">
                    <div className="font-medium">{item.name || item.description}</div>
                    {item.description && item.name !== item.description && (
                      <div className="text-sm text-gray-500">{item.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">{item.category}</td>
                  <td className="px-6 py-4">{item.location}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4">
                    <div>{item.reporterName}</div>
                    <div className="text-sm text-gray-500">{item.reporterContact}</div>
                  </td>
                  <td className="px-6 py-4">{formatDate(item.date)}</td>
                  <td className="px-6 py-4">
                    {item.claims && item.claims.length > 0 ? (
                      <div className="space-y-1">
                        {item.claims.map(claim => (
                          <div key={claim.id} className="text-sm">
                            <div className="font-medium">{claim.claimerName}</div>
                            <div className="text-gray-500">{claim.claimerContact}</div>
                            <div className={`text-xs ${
                              claim.status === 'Pending' ? 'text-yellow-600' :
                              claim.status === 'Approved' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {claim.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">No claims</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {/* Status change buttons */}
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        disabled={loading}
                        className={`text-sm px-2 py-1 rounded border ${
                          isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="Lost">Lost</option>
                        <option value="Found">Found</option>
                        <option value="Pending">Pending</option>
                        <option value="Returned">Returned</option>
                      </select>
                      
                      {/* Approve claim buttons */}
                      {item.claims && item.claims.filter(claim => claim.status === 'Pending').map(claim => (
                        <button
                          key={claim.id}
                          onClick={() => handleApproveClaim(item.id, claim.id)}
                          disabled={loading}
                          className="block w-full text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                        >
                          Approve Claim by {claim.claimerName}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;