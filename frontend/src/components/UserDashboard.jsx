import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import ItemForm from './ItemForm';
import ItemCard from './ItemCard';
import ClaimForm from './ClaimForm';

function UserDashboard({ items = [], onItemAdded }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [showLostForm, setShowLostForm] = useState(false);
  const [showFoundForm, setShowFoundForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showClaimForm, setShowClaimForm] = useState(false);

  const lostItems = items.filter(item => 
    item.status === 'Lost' || item.status === 'lost'
  );
  
  const foundItems = items.filter(item => 
    item.status === 'Found' || item.status === 'found'
  );

  const handleClaim = (item) => {
    setSelectedItem(item);
    setShowClaimForm(true);
  };

  const handleClaimSubmitted = () => {
    setShowClaimForm(false);
    setSelectedItem(null);
    onItemAdded();
  };

  return (
    <div className="space-y-8">
      {/* Two Main Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Lost Items Card */}
        <div className={`rounded-lg shadow-lg p-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-red-400' : 'text-red-600'
            }`}>
              Lost Items ({lostItems.length})
            </h2>
            <button
              onClick={() => setShowLostForm(true)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDark 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Report Lost Item
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {lostItems.length === 0 ? (
              <p className={`text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No lost items reported yet
              </p>
            ) : (
              lostItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onClaim={() => handleClaim(item)}
                  showClaimButton={false}
                />
              ))
            )}
          </div>
        </div>

        {/* Found Items Card */}
        <div className={`rounded-lg shadow-lg p-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${
              isDark ? 'text-green-400' : 'text-green-600'
            }`}>
              Found Items ({foundItems.length})
            </h2>
            <button
              onClick={() => setShowFoundForm(true)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDark 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Report Found Item
            </button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {foundItems.length === 0 ? (
              <p className={`text-center py-8 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                No found items reported yet
              </p>
            ) : (
              foundItems.map(item => (
                <ItemCard 
                  key={item.id} 
                  item={item} 
                  onClaim={() => handleClaim(item)}
                  showClaimButton={true}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for Lost Item Form */}
      {showLostForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <ItemForm
                defaultStatus="Lost"
                onClose={() => setShowLostForm(false)}
                onItemAdded={() => {
                  setShowLostForm(false);
                  onItemAdded();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Found Item Form */}
      {showFoundForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <ItemForm
                defaultStatus="Found"
                onClose={() => setShowFoundForm(false)}
                onItemAdded={() => {
                  setShowFoundForm(false);
                  onItemAdded();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for Claim Form */}
      {showClaimForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-md ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <ClaimForm
                item={selectedItem}
                onClose={() => setShowClaimForm(false)}
                onClaimSubmitted={handleClaimSubmitted}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;