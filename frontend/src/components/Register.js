import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    userType: 'BUYER'
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
      console.log('Sending registration data:', formData);
      
      const response = await axios.post('http://localhost:8080/api/auth/register', formData, {
        timeout: 10000
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.error) {
        setError(response.data.error);
      } else {
        onLogin(response.data);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        setError('සේවාදායකයට සම්බන්ධ විය නොහැක. බැකෙන්ඩ් සේවාදායකය ක්‍රියාත්මක දැයි පරීක්ෂා කරන්න.');
      } else if (error.response) {
        setError(error.response.data.error || 'ලියාපදිංචි වීමට අසමත් විය.');
      } else if (error.request) {
        setError('සේවාදායකයෙන් ප්‍රතිචාරයක් නොමැත.');
      } else {
        setError('ලියාපදිංචි වීමට අසමත් විය.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <h2>🌱 අස්වැන්න සමඟ එකතු වන්න</h2>
          <p>ඔබගේ නව ගිණුම සාදන්න</p>
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>👤 පූර්ණ නම</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="ඔබගේ පූර්ණ නම ඇතුළත් කරන්න"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>📧 ඊමේල් ලිපිනය</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ඔබගේ ඊමේල් ලිපිනය ඇතුළත් කරන්න"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>🔒 මුරපදය</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="අවම වශයෙන් අකුරු 6ක මුරපදයක්"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>📞 දුරකථන අංකය</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="ඔබගේ දුරකථන අංකය"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>🏠 ලිපිනය</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="ඔබගේ සම්පූර්ණ ලිපිනය"
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label>🎯 මට අවශ්‍ය වන්නේ</label>
            <select 
              name="userType" 
              value={formData.userType} 
              onChange={handleChange}
              className="form-input"
            >
              <option value="BUYER">🛒 නිෂ්පාදන ගැනුම් කිරීමට</option>
              <option value="FARMER">🌾 නිෂ්පාදන විකිණීමට</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-login"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner-small"></span>
                ලියාපදිංචි වෙමින්...
              </>
            ) : (
              '✅ ගිණුම සාදන්න'
            )}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            දැනටමත් ගිණුමක් තිබේද? <Link to="/login" className="auth-link">👉 ඇතුල් වන්න</Link>
          </p>
        </div>
        
        <div className="welcome-note">
          <div className="welcome-icon">🚜</div>
          <h3>ගොවිජන සමිතියට සාදරයෙන් පිළිගනිමු!</h3>
          <p>නිෂ්පාදන සොයාගන්න, හෝ ඔබේ නිෂ්පාදන විකිණීම ආරම්භ කරන්න</p>
        </div>
      </div>
    </div>
  );
};

export default Register;