import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialWindows } from '../../utils/mockData';
import MessageBubble from './MessageBubble';
import aiService from '../../utils/aiService';
import taskManager from '../../utils/taskManager';

const ChatView = () => {
  const { windowId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [windowData, setWindowData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showTextMenu, setShowTextMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load windows from localStorage
    const savedWindows = localStorage.getItem('smartchat_windows');
    const windows = savedWindows ? JSON.parse(savedWindows) : initialWindows;
    
    const window = windows.find(w => w.id === windowId);
    if (window) {
      setWindowData(window);
      // Load messages from localStorage or use default
      const savedMessages = localStorage.getItem(`smartchat_messages_${windowId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      } else {
        setMessages(window.messages || []);
      }
    } else {
      navigate('/dashboard');
    }
  }, [windowId, navigate]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`smartchat_messages_${windowId}`, JSON.stringify(messages));
    }
  }, [messages, windowId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTextSelection = (e) => {
    const selection = window.getSelection();
    if (selection.toString().length > 0) {
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      setSelectedText(selection.toString());
      setMenuPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
      setShowTextMenu(true);
    } else {
      setShowTextMenu(false);
    }
  };

  const saveToNotes = () => {
    const notesWindows = JSON.parse(localStorage.getItem('smartchat_windows') || '[]')
      .filter(w => w.type === 'notes');
    
    if (notesWindows.length > 0) {
      const notesWindow = notesWindows[0];
      const currentContent = notesWindow.content || '';
      const timestamp = new Date().toLocaleString();
      const newContent = `${currentContent}\n\n---\n**From ${windowData?.title || 'chat'}** (${timestamp}):\n${selectedText}`;
      
      // Update notes window content
      const updatedWindows = JSON.parse(localStorage.getItem('smartchat_windows') || '[]')
        .map(w => w.id === notesWindow.id ? { ...w, content: newContent } : w);
      
      localStorage.setItem('smartchat_windows', JSON.stringify(updatedWindows));
      
      // Show confirmation
      const confirmationMessage = {
        id: Date.now(),
        sender: 'system',
        text: `Saved to ${notesWindow.title}: "${selectedText.substring(0, 30)}..."`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
    }
    
    setShowTextMenu(false);
  };

  const createTask = () => {
    const task = taskManager.createTaskFromText(selectedText);
    const success = taskManager.addTaskToWindow('tasks', task);
    
    if (success) {
      const confirmationMessage = {
        id: Date.now(),
        sender: 'system',
        text: `Task created: "${selectedText.substring(0, 30)}..."`,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, confirmationMessage]);
    }
    
    setShowTextMenu(false);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '' || !windowData || isLoading) return;
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const aiResponse = await aiService.processUserMessage(
        newMessage,
        windowData,
        updatedMessages
      );
      
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpecialAction = async (action) => {
    if (!windowData || isLoading) return;
    
    setIsLoading(true);
    
    try {
      const aiResponse = await aiService.handleSpecialAction(action, windowData);
      
      const newMessage = {
        id: Date.now(),
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        sender: 'ai',
        text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!windowData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading chat...</p>
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

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden" onMouseUp={handleTextSelection}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 rounded-2xl bg-gray-800 shadow-inner">
            {messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                windowColor={windowData.color} 
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`bg-gradient-to-r ${windowData.color} text-white px-4 py-3 rounded-2xl rounded-bl-none`}>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Special Actions */}
          {windowId === 'news' && (
            <div className="mb-4">
              <button
                onClick={() => handleSpecialAction('fetchNews')}
                disabled={isLoading}
                className="w-full bg-blue-900 text-blue-200 hover:bg-blue-800 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Fetching...' : 'Fetch Latest News'}
              </button>
            </div>
          )}
          
          {windowId === 'workout' && (
            <div className="mb-4">
              <button
                onClick={() => handleSpecialAction('generatePlan')}
                disabled={isLoading}
                className="w-full bg-emerald-900 text-emerald-200 hover:bg-emerald-800 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Generating...' : 'Generate Workout Plan'}
              </button>
            </div>
          )}
          
          {windowId === 'crypto' && (
            <div className="mb-4 flex items-center justify-between bg-amber-900 bg-opacity-30 p-3 rounded-lg">
              <span className="text-amber-200">Notify on Price Change</span>
              <button
                onClick={() => handleSpecialAction('toggleNotify')}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-amber-500"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="bg-gray-800 rounded-2xl shadow-lg p-4">
            <div className="flex">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 rounded-xl py-3 px-4 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={newMessage.trim() === '' || isLoading}
                className={`ml-3 px-6 py-3 rounded-xl font-medium transition-colors ${
                  newMessage.trim() === '' || isLoading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                }`}
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              I'll automatically search the web and fetch news when needed
            </p>
          </div>
        </div>
      </div>

      {/* Text Selection Menu */}
      {showTextMenu && (
        <div 
          className="fixed bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50"
          style={{ left: menuPosition.x, top: menuPosition.y }}
        >
          <div className="py-1">
            <button
              onClick={saveToNotes}
              className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
            >
              Save to Notes
            </button>
            <button
              onClick={createTask}
              className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
            >
              Create Task
            </button>
            <button
              onClick={() => setShowTextMenu(false)}
              className="block w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatView;