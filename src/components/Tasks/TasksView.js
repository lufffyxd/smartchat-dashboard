import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { initialWindows } from '../../utils/mockData';

const TasksView = () => {
  const { windowId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [windowData, setWindowData] = useState(null);

  useEffect(() => {
    const savedWindows = localStorage.getItem('smartchat_windows');
    const windows = savedWindows ? JSON.parse(savedWindows) : initialWindows;
    
    const window = windows.find(w => w.id === windowId && w.type === 'tasks');
    if (window) {
      setWindowData(window);
      setTasks(window.tasks || []);
    } else {
      navigate('/dashboard');
    }
  }, [windowId, navigate]);

  // Save tasks to localStorage
  useEffect(() => {
    if (windowData) {
      const savedWindows = localStorage.getItem('smartchat_windows');
      let windows = savedWindows ? JSON.parse(savedWindows) : [];
      
      const updatedWindows = windows.map(w => 
        w.id === windowId ? { ...w, tasks } : w
      );
      
      localStorage.setItem('smartchat_windows', JSON.stringify(updatedWindows));
    }
  }, [tasks, windowData, windowId]);

  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      due: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  if (!windowData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading tasks...</p>
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

      {/* Tasks Container */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 h-full">
          <div className="bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Add New Task</h2>
            <div className="flex">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="What needs to be done?"
                className="flex-1 rounded-xl py-3 px-4 bg-gray-700 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button
                onClick={addTask}
                className="ml-3 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl hover:from-rose-600 hover:to-pink-700 transition-colors font-medium"
              >
                Add
              </button>
            </div>
          </div>

          <div className="bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Your Tasks</h2>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center p-3 rounded-lg hover:bg-gray-750">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="h-5 w-5 text-rose-500 rounded focus:ring-rose-500 bg-gray-700 border-gray-600"
                  />
                  <span className={`ml-3 flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                    {task.text}
                  </span>
                  <span className="text-sm text-gray-400 mr-3">{task.due}</span>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-gray-500 hover:text-red-400"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-gray-400 text-center py-8">No tasks yet. Add your first task above!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksView;