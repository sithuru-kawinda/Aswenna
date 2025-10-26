import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyOrders = ({ user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const fetchMyOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/orders/buyer/${user.id}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      default: return 'pending';
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳ රැඳී ඇත';
      case 'confirmed': return '✅ තහවුරු කළා';
      case 'completed': return '🎉 සම්පූර්ණයි';
      case 'cancelled': return '❌ අවලංගු කළා';
      default: return '⏳ රැඳී ඇත';
    }
  };

  return (
    <div className="dashboard">
      <div className="orders-container">
        <div className="page-header">
          <h1>🛒 මගේ ඇණවුම්</h1>
          <p>ඔබ විසින් කරන ලද ඇණවුම් ({orders.length})</p>
        </div>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h3>තවමත් ඇණවුම් නොමැත</h3>
              <p>පළමු ඇණවුම් කිරීම සිදු කර නිෂ්පාදන ගැනුම් කරන්න</p>
              <Link to="/dashboard" className="btn btn-primary">
                🛍️ සාප්පුවට යන්න
              </Link>
            </div>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <h3>{order.product?.productName || 'නිෂ්පාදනය'}</h3>
                  <span className={`status ${getStatusColor(order.orderStatus)}`}>
                    {getStatusText(order.orderStatus)}
                  </span>
                </div>
                
                <div className="order-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <strong>ඇණවුම් ප්‍රමාණය:</strong>
                      <span>{order.quantity}</span>
                    </div>
                    <div className="detail-item">
                      <strong>මුළු මිල:</strong>
                      <span>රු.{order.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-item">
                      <strong>ව්‍යාපාරිකයා:</strong>
                      <span>{order.product?.user?.fullName || 'නොදනී'}</span>
                    </div>
                    <div className="detail-item">
                      <strong>දුරකථන:</strong>
                      <span>{order.product?.user?.phoneNumber || 'නොමැත'}</span>
                    </div>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-item full-width">
                      <strong>ඇණවුම් කළ දිනය:</strong>
                      <span>{new Date(order.createdAt).toLocaleDateString('si-LK')} - {new Date(order.createdAt).toLocaleTimeString('si-LK')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="order-actions">
                  <button 
                    className="btn btn-call"
                    onClick={() => window.open(`tel:${order.product?.user?.phoneNumber}`, '_self')}
                    disabled={!order.product?.user?.phoneNumber}
                  >
                    📞 {order.product?.user?.phoneNumber ? 'ව්‍යාපාරිකයා අමතන්න' : 'දුරකථන අංකය නොමැත'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;