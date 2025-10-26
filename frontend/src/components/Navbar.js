import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const location = useLocation();

  const handleLogout = () => {
    onLogout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo/Brand */}
        <div className="nav-brand">
          <Link to="/">
            <h1>🌱 අස්වැන්න</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          {user ? (
            // Show when user is logged in
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
              >
                🏠 ඩෑෂ්බෝඩ්
              </Link>
              
              {user.userType === 'FARMER' ? (
                <Link 
                  to="/my-products" 
                  className={`nav-link ${location.pathname === '/my-products' ? 'active' : ''}`}
                >
                  📦 මගේ නිෂ්පාදන
                </Link>
              ) : (
                <Link 
                  to="/my-orders" 
                  className={`nav-link ${location.pathname === '/my-orders' ? 'active' : ''}`}
                >
                  🛒 මගේ ඇණවුම්
                </Link>
              )}
              
              <div className="user-menu">
                <span className="user-greeting">
                  🙋‍♂️ ආයුබෝවන්, {user.fullName}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-logout nav-btn"
                >
                  🔓 පිටවීම
                </button>
              </div>
            </>
          ) : (
            // Show when user is NOT logged in
            <div className="auth-buttons">
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                🏠 මුල් පිටුව
              </Link>
              <Link 
                to="/login" 
                className={`nav-link login-btn ${location.pathname === '/login' ? 'active' : ''}`}
              >
                🔐 ඇතුල් වන්න
              </Link>
              <Link 
                to="/register" 
                className={`nav-link register-btn ${location.pathname === '/register' ? 'active' : ''}`}
              >
                📝 ලියාපදිංචි වන්න
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;