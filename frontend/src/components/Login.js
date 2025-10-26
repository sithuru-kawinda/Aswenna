import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', formData, {
        timeout: 10000
      });
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        onLogin(response.data);
      }
    } catch (error) {
      if (error.code === 'ECONNREFUSED') {
        setError('සේවාදායකයට සම්බන්ධ විය නොහැක. බැකෙන්ඩ් සේවාදායකය ක්‍රියාත්මක දැයි පරීක්ෂා කරන්න.');
      } else if (error.response) {
        setError(error.response.data.error || 'ලොගින් වීමට අසමත් විය.');
      } else if (error.request) {
        setError('සේවාදායකයෙන් ප්‍රතිචාරයක් නොමැත.');
      } else {
        setError('ලොගින් වීමට අසමත් විය.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background-wrapper">
      {/* Floating Agriculture Icons */}
      <div className="floating-agri-icons">
        <div className="floating-icon">🌱</div>
        <div className="floating-icon">🌾</div>
        <div className="floating-icon">🍃</div>
        <div className="floating-icon">🚜</div>
        <div className="floating-icon">🌽</div>
        <div className="floating-icon">🍅</div>
      </div>

      {/* Login Form */}
      <div className="login-form-container">
        <div className="login-logo">
          <span className="logo-icon">🌱</span>
          <h1>අස්වැන්න</h1>
          <p>ගොවිජන සංසදය වෙත පිළිගනිමු</p>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">📧 ඊමේල් ලිපිනය</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ඔබගේ ඊමේල් ලිපිනය"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">🔒 මුරපදය</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="ඔබගේ මුරපදය"
              className="form-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                ඇතුල් වෙමින්...
              </>
            ) : (
              '🚀 ඇතුල් වන්න'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            ගිණුමක් නොමැතිද? <Link to="/register" className="auth-link">👉 ලියාපදිංචි වන්න</Link>
          </p>
        </div>
        
        <div className="featured-preview">
          <h4>🌟 1000+ නිෂ්පාදන</h4>
          <p>ලොගින් වීමෙන් පසුව නිෂ්පාදන වෙළඳපලට ප්‍රවේශය ලබාගන්න</p>
        </div>
      </div>
    </div>
  );
};

export default Login;