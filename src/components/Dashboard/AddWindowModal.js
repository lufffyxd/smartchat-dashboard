import React, { useState } from 'react';
import { presetWindows } from '../../utils/mockData';

const AddWindowModal = ({ onClose, onAddWindow }) => {
  const [customName, setCustomName] = useState('');
  const [customSubject, setCustomSubject] = useState('');
  const [customType, setCustomType] = useState('chat');
  const [customEmoji, setCustomEmoji] = useState('⚙️');

  const handleAddPreset = (preset) => {
    const newWindow = {
      id: `window-${Date.now()}`,
      title: preset.title,
      preview: 'New window created',
      emoji: preset.emoji,
      color: preset.color,
      xp: 0,
      hasNew: false,
      type: preset.type || 'chat',
      messages: preset.type === 'chat' ? [{ 
        id: 1, 
        sender: 'ai', 
        text: `Welcome to your ${preset.title} window! How can I help you today?`,
        timestamp: new Date().toLocaleTimeString()
      }] : [],
      content: preset.type === 'notes' ? `# ${preset.title}\n\nStart writing here...` : '',
      tasks: preset.type === 'tasks' ? [] : []
    };
    
    onAddWindow(newWindow);
  };

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    
    const newWindow = {
      id: `window-${Date.now()}`,
      title: customName,
      preview: customSubject || 'Custom window created',
      emoji: customEmoji,
      color: 'from-gray-500 to-gray-700',
      xp: 0,
      hasNew: false,
      type: customType,
      subject: customSubject,
      messages: customType === 'chat' ? [{ 
        id: 1, 
        sender: 'ai', 
        text: customSubject 
          ? `I'm your ${customName} assistant focused on ${customSubject}. How can I help you today?`
          : `Welcome to your ${customName} window! How can I help you today?`,
        timestamp: new Date().toLocaleTimeString()
      }] : [],
      content: customType === 'notes' ? `# ${customName}\n\n${customSubject || 'Start writing here...'}` : '',
      tasks: customType === 'tasks' ? [] : []
    };
    
    onAddWindow(newWindow);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-100">Add New Window</h2>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <p className="text-gray-300 mb-6">Choose a preset template or create a custom window:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {presetWindows.map((preset, index) => (
              <div
                key={index}
                onClick={() => handleAddPreset(preset)}
                className="border border-gray-700 rounded-xl p-4 hover:border-indigo-500 hover:bg-gray-750 transition-colors cursor-pointer"
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{preset.emoji}</span>
                  <h3 className="font-semibold text-gray-100">{preset.title}</h3>
                </div>
                <p className="text-sm text-gray-400">
                  {preset.type === 'chat' && 'AI-powered conversation'}
                  {preset.type === 'notes' && 'Personal note-taking space'}
                  {preset.type === 'tasks' && 'Task management'}
                </p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-100 mb-4">Create Custom Window</h3>
            <div className="bg-gray-750 p-4 rounded-xl">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300 mb-1">Window Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. 'My Research Assistant'"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-300 mb-1">Subject/Topic</label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="e.g. 'Market research for tech startups'"
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
                  <select
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="chat">Chat</option>
                    <option value="notes">Notes</option>
                    <option value="tasks">Tasks</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Emoji</label>
                  <input
                    type="text"
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    placeholder="e.g. 🤖"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleAddCustom}
                disabled={!customName.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !customName.trim()
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                }`}
              >
                Create Custom Window
              </button>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWindowModal;