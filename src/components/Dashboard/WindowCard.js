import React from 'react';
import { useNavigate } from 'react-router-dom';

const WindowCard = ({ window, isPinned, onPinToggle }) => {
  const navigate = useNavigate();

  const handleOpenWindow = () => {
    if (window.type === 'chat') {
      navigate(`/chat/${window.id}`);
    } else if (window.type === 'notes') {
      navigate(`/notes/${window.id}`);
    } else if (window.type === 'tasks') {
      navigate(`/tasks/${window.id}`);
    } else {
      navigate(`/chat/${window.id}`);
    }
  };

  return (
    <div 
      className="bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden cursor-pointer"
      onClick={handleOpenWindow}
    >
      <div className={`bg-gradient-to-r ${window.color} p-6 text-white relative`}>
        <div className="flex justify-between items-start">
          <div className="text-3xl">{window.emoji}</div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPinToggle(window.id);
            }}
            className={`opacity-70 hover:opacity-100 transition-opacity ${isPinned ? 'text-yellow-300' : 'text-white'}`}
            title={isPinned ? "Unpin window" : "Pin window"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 17.5a.5.5 0 01-1 0V2.914l-.646-.647a.5.5 0 01.708-.708l1.5 1.5a.5.5 0 010 .708l-1.5 1.5a.5.5 0 01-.708-.708L4.5 3.914V17.5zM9 16a1 1 0 011-1h8a1 1 0 110 2H10a1 1 0 01-1-1zm3-10a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1z" />
            </svg>
          </button>
        </div>
        <h3 className="text-xl font-bold mt-4">{window.title}</h3>
        <div className="absolute top-4 right-4 flex space-x-2">
          {window.hasNew && (
            <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">🔔 New</span>
          )}
          <span className="bg-white bg-opacity-20 text-white text-xs font-bold px-2 py-1 rounded-full">🏆 {window.xp} XP</span>
        </div>
      </div>
      
      <div className="p-6">
        <p className="text-gray-300 mb-6 line-clamp-2">{window.preview}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenWindow();
          }}
          className="w-full bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-colors duration-200 font-medium"
        >
          Open {window.type === 'chat' ? 'Chat' : window.type === 'notes' ? 'Notes' : window.type === 'tasks' ? 'Tasks' : 'Window'}
        </button>
      </div>
    </div>
  );
};

export default WindowCard;