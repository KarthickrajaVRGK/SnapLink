import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

// Page Imports
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import UrlAnalytics from './pages/UrlAnalytics';

// Import CSS stylesheets
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-[#060913] text-gray-100 relative overflow-x-hidden">
          {/* Ambient Drifting Background Blobs */}
          <div className="gradient-bg">
            <div className="ambient-blob blob-indigo"></div>
            <div className="ambient-blob blob-violet"></div>
            <div className="ambient-blob blob-cyan"></div>
          </div>
          <Navbar />
          
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Private Protected Routes */}
              <Route 
                path="/" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/analytics/:id" 
                element={
                  <PrivateRoute>
                    <UrlAnalytics />
                  </PrivateRoute>
                } 
              />

              {/* Fallback route - Redirect unknown paths to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
