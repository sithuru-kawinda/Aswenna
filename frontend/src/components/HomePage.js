import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="floating-elements">
            <div className="floating-icon">🌾</div>
            <div className="floating-icon">🍃</div>
            <div className="floating-icon">🚜</div>
            <div className="floating-icon">🌱</div>
            <div className="floating-icon">🌽</div>
            <div className="floating-icon">🍅</div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-logo">
            <span className="logo-main">🌱</span>
            <h1 className="hero-title">අස්වැන්න</h1>
            <p className="hero-subtitle">ගොවිජන සංසදය වෙත සාදරයෙන් පිළිගනිමු</p>
          </div>

          <div className="hero-actions">
            {user ? (
              <div className="welcome-user">
                <h2>ආයුබෝවන්, {user.fullName}!</h2>
                <p>ඔබගේ {user.userType === 'FARMER' ? 'නිෂ්පාදන' : 'ඇණවුම්'} පැනලයට පිවිසෙන්න</p>
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  🚀 මගේ ඩෑෂ්බෝඩ්
                </Link>
              </div>
            ) : (
              <div className="auth-options">
                <h2>අස්වැන්න සමඟ එකතු වන්න</h2>
                <div className="auth-buttons">
                  <Link to="/register" className="btn btn-primary btn-large">
                    📝 ලියාපදිංචි වන්න
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    🔐 ඇතුල් වන්න
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">අස්වැන්න සමඟ ලබාගත හැකි වාසි</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🌾</div>
              <h3>ගොවීන් සඳහා</h3>
              <ul>
                <li>✅ නිෂ්පාදන ලැයිස්තුගත කිරීම</li>
                <li>✅ සෘජු වෙළඳපොල ප්‍රවේශය</li>
                <li>✅ ලාභදායී මිල නියම කිරීම</li>
                <li>✅ ග්‍රාහකයන් සමඟ සෘජු සම්බන්ධතාව</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>ග්‍රාහකයන් සඳහා</h3>
              <ul>
                <li>✅ ගුණාත්මක නිෂ්පාදන</li>
                <li>✅ සෘජුවම ගොවීන්ගෙන් මිලදී ගැනීම</li>
                <li>✅ ලාභදායී මිල</li>
                <li>✅ කැඳවීමේ විකල්පය</li>
              </ul>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>තාක්ෂණික වාසි</h3>
              <ul>
                <li>✅ රියල්-ටයිම් යාවත්කාලීන කිරීම්</li>
                <li>✅ මොබයිල් සහය</li>
                <li>✅ ද්වි-භාෂා සහය</li>
                <li>✅ ආරක්ෂිත ගනුදෙනු</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">නිෂ්පාදන</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">ගොවීන්</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">2000+</div>
              <div className="stat-label">ග්‍රාහකයන්</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">සෑහීම</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>අදම අස්වැන්න සමඟ එකතු වන්න</h2>
            <p>ගොවිතැනේ අනාගතය ගොඩනගා ගැනීමට අප සමඟ එකතු වන්න</p>
            {!user && (
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-large">
                  🌱 නොමිලේ ගිණුමක් සාදන්න
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;