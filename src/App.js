import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import ChatView from './components/Chat/ChatView';
import NotesView from './components/Notes/NotesView';
import TasksView from './components/Tasks/TasksView';
import Header from './components/Layout/Header';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const savedUser = localStorage.getItem('smartchat_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('smartchat_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smartchat_user');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <div className="min-h-screen bg-gray-900 text-gray-100">
        {user && <Header />}
        <Routes>
          <Route path="/signin" element={user ? <Navigate to="/dashboard" /> : <SignIn />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <SignUp />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/signin" />} />
          <Route path="/chat/:windowId" element={user ? <ChatView /> : <Navigate to="/signin" />} />
          <Route path="/notes/:windowId" element={user ? <NotesView /> : <Navigate to="/signin" />} />
          <Route path="/tasks/:windowId" element={user ? <TasksView /> : <Navigate to="/signin" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/signin"} />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

export default App;