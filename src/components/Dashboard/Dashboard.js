import React, { useState, useEffect } from 'react';
import { initialWindows } from '../../utils/mockData';
import WindowCard from './WindowCard';
import AddWindowModal from './AddWindowModal';

const Dashboard = () => {
  const [windows, setWindows] = useState(() => {
    const savedWindows = localStorage.getItem('smartchat_windows');
    return savedWindows ? JSON.parse(savedWindows) : initialWindows;
  });
  const [showAddWindow, setShowAddWindow] = useState(false);
  const [pinnedWindows, setPinnedWindows] = useState(() => {
    const savedPinned = localStorage.getItem('smartchat_pinned');
    return savedPinned ? JSON.parse(savedPinned) : ['news', 'notes'];
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Save windows to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('smartchat_windows', JSON.stringify(windows));
  }, [windows]);

  useEffect(() => {
    localStorage.setItem('smartchat_pinned', JSON.stringify(pinnedWindows));
  }, [pinnedWindows]);

  const handleAddWindow = (newWindow) => {
    setWindows(prev => [...prev, newWindow]);
    setShowAddWindow(false);
  };

  const togglePinWindow = (windowId) => {
    setPinnedWindows(prev => {
      if (prev.includes(windowId)) {
        return prev.filter(id => id !== windowId);
      } else {
        // Limit to 3 pinned windows
        if (prev.length >= 3) {
          return [...prev.slice(1), windowId]; // Remove oldest and add new
        }
        return [...prev, windowId];
      }
    });
  };

  const filteredWindows = searchQuery 
    ? windows.filter(window => 
        window.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        window.preview.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : windows;

  const pinnedWindowsList = filteredWindows.filter(w => pinnedWindows.includes(w.id));
  const unpinnedWindowsList = filteredWindows.filter(w => !pinnedWindows.includes(w.id));

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>
              <p className="text-sm text-gray-400">Your AI-powered command center</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search windows..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              
              <button 
                onClick={() => setShowAddWindow(true)}
                className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pinned Windows Section */}
        {pinnedWindowsList.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <h2 className="text-xl font-bold text-gray-100">Pinned</h2>
              <div className="ml-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedWindowsList.map((window) => (
                <WindowCard 
                  key={window.id} 
                  window={window} 
                  isPinned={pinnedWindows.includes(window.id)}
                  onPinToggle={togglePinWindow}
                />
              ))}
            </div>
          </div>
        )}

        {/* All Windows Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-100">All Windows</h2>
            <span className="text-sm text-gray-400">{filteredWindows.length} windows</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unpinnedWindowsList.map((window) => (
              <WindowCard 
                key={window.id} 
                window={window} 
                isPinned={pinnedWindows.includes(window.id)}
                onPinToggle={togglePinWindow}
              />
            ))}

            <div 
              onClick={() => setShowAddWindow(true)}
              className="bg-gray-800 border-2 border-dashed border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="text-4xl text-gray-500 mb-4">+</div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">Add New Window</h3>
              <p className="text-gray-400">Create a new chat window</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Window Modal */}
      {showAddWindow && (
        <AddWindowModal 
          onClose={() => setShowAddWindow(false)} 
          onAddWindow={handleAddWindow}
        />
      )}
    </div>
  );
};

export default Dashboard;