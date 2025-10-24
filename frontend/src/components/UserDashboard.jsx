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
    <div className="space-y-10">
      {/* HERO SECTION */}
      <section className="relative h-[65vh] rounded-2xl overflow-hidden shadow-2xl">
        <div className="user-hero absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
        <div className="relative z-10 flex h-full items-center justify-center">
          <div className="text-center px-6 max-w-3xl">
            {/* Removed the heading and subtitle text */}
            <div className="mt-8 flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => setShowLostForm(true)}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg hover:shadow-red-700/30 transition"
              >
                Report Lost Item
              </button>
              <button
                onClick={() => setShowFoundForm(true)}
                className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg hover:shadow-green-700/30 transition"
              >
                Report Found Item
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* TWO MAIN CARDS */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Lost Items Card */}
        <div className={`rounded-lg shadow-lg p-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-red-400' : 'text-red-600'}`}>
              Lost Items ({lostItems.length})
            </h2>
            <button
              onClick={() => setShowLostForm(true)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
            >
              Report Lost
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {lostItems.length === 0 ? (
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>
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
            <h2 className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              Found Items ({foundItems.length})
            </h2>
            <button
              onClick={() => setShowFoundForm(true)}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDark ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              Report Found
            </button>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {foundItems.length === 0 ? (
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center py-8`}>
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

      {/* Lost Item Modal */}
      {showLostForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
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

      {/* Found Item Modal */}
      {showFoundForm && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
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

      {/* Claim Form Modal */}
      {showClaimForm && selectedItem && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className={`rounded-lg shadow-xl w-full max-w-md ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
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