import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Components
import Navbar from './components/Navbar.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Dashboard from './components/Dashboard.js';
import MyProducts from './components/MyProducts.js';
import MyOrders from './components/MyOrders.js';
import HomePage from './components/HomePage.js';

const API_BASE_URL = 'http://localhost:8080/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (err) {
      console.error('Error loading user from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner">🌱</div>
        <p>අස්වැන්න යෙදුම පූරණය වෙමින්...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Navbar always visible */}
        <Navbar user={user} onLogout={logout} />
        
        <main className="main-content">
          <Routes>
            {/* Home Page - Public */}
            <Route path="/" element={<HomePage user={user} />} />
            
            {/* Auth Pages - Public */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/dashboard" /> : <Login onLogin={login} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/dashboard" /> : <Register onLogin={login} />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/my-products" 
              element={user ? <MyProducts user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/my-orders" 
              element={user ? <MyOrders user={user} /> : <Navigate to="/login" />} 
            />
            
            {/* Redirect to home if route not found */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;