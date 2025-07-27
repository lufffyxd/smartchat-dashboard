import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialWindows } from '../../utils/mockData';

const NotesView = () => {
  const { windowId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [windowData, setWindowData] = useState(null);

  useEffect(() => {
    const savedWindows = localStorage.getItem('smartchat_windows');
    const windows = savedWindows ? JSON.parse(savedWindows) : initialWindows;
    
    const window = windows.find(w => w.id === windowId && w.type === 'notes');
    if (window) {
      setWindowData(window);
      setContent(window.content || '');
    } else {
      navigate('/dashboard');
    }
  }, [windowId, navigate]);

  // Save content to localStorage
  useEffect(() => {
    if (windowData) {
      const savedWindows = localStorage.getItem('smartchat_windows');
      let windows = savedWindows ? JSON.parse(savedWindows) : [];
      
      const updatedWindows = windows.map(w => 
        w.id === windowId ? { ...w, content } : w
      );
      
      localStorage.setItem('smartchat_windows', JSON.stringify(updatedWindows));
    }
  }, [content, windowData, windowId]);

  if (!windowData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${windowData.color} text-white shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-white hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Dashboard
            </button>
            <div className="flex items-center">
              <span className="text-2xl mr-3">{windowData.emoji}</span>
              <h1 className="text-xl font-bold">{windowData.title}</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="opacity-70 hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </button>
              <span className="bg-white bg-opacity-20 text-white text-xs font-bold px-2 py-1 rounded-full">🏆 {windowData.xp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Editor */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[500px] p-6 rounded-2xl bg-gray-800 text-gray-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-yellow-500"
            placeholder="Start writing your notes here..."
          />
        </div>
      </div>
    </div>
  );
};

export default NotesView;