// Dashboard.js - Updated with proper navigation and logout
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user, onLogout }) => {
  const [products, setProducts] = useState([]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [productForm, setProductForm] = useState({
    productName: '',
    price: '',
    quantity: '',
    description: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error loading products');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const productData = {
        productName: productForm.productName,
        price: parseFloat(productForm.price),
        quantity: productForm.quantity,
        description: productForm.description,
        user: { id: user.id }
      };

      const response = await axios.post('http://localhost:8080/api/products', productData);
      
      setProductForm({
        productName: '',
        price: '',
        quantity: '',
        description: ''
      });
      setShowProductForm(false);
      fetchProducts();
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
      const totalPrice = selectedProduct.price * orderQuantity;
      await axios.post('http://localhost:8080/api/orders', {
        product: { id: selectedProduct.id },
        buyer: { id: user.id },
        quantity: orderQuantity,
        totalPrice: totalPrice
      });
      setShowOrderForm(false);
      setSelectedProduct(null);
      alert('Order placed successfully! The farmer will contact you soon.');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order: ' + (error.response?.data || error.message));
    }
  };

  const handleCallFarmer = (phoneNumber) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${productId}`);
        fetchProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <div className="dashboard">
     

      {/* Welcome Message */}
      <div className="welcome-banner">
        <h2>🌱 ආයුබෝවන්, {user.fullName}!</h2>
        <p>{user.userType === 'FARMER' ? 'ඔබේ නිෂ්පාදන විකිණීම ආරම්භ කරන්න' : 'නිෂ්පාදන ගැනුම් කරන්න'}</p>
      </div>

      {/* User Info Card */}
      <div className="user-info-card">
        <div className="user-details">
          <h3>👤 ඔබගේ තොරතුරු</h3>
          <p><strong>නම:</strong> {user.fullName}</p>
          <p><strong>වර්ගය:</strong> {user.userType === 'FARMER' ? '👨‍🌾 ගොවියා' : '🛒 ගැනුම්කරු'}</p>
          <p><strong>දුරකථන:</strong> {user.phoneNumber}</p>
        </div>
      </div>

      {/* Add Product Form (for farmers) */}
      {user.userType === 'FARMER' && (
        <div className="form-container">
          <div className="form-toggle">
            <button 
              className={`btn ${showProductForm ? 'btn-secondary' : 'btn-primary'}`}
              onClick={() => setShowProductForm(!showProductForm)}
            >
              {showProductForm ? '✖ අවලංගු කරන්න' : '➕ නව නිෂ්පාදනයක්'}
            </button>
          </div>

          {showProductForm && (
            <div className="product-form-container">
              <h3>🌿 නව නිෂ්පාදනයක් එකතු කරන්න</h3>
              <form onSubmit={handleAddProduct} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>නිෂ්පාදනයේ නම *</label>
                    <input
                      type="text"
                      value={productForm.productName}
                      onChange={(e) => setProductForm({...productForm, productName: e.target.value})}
                      required
                      disabled={loading}
                      placeholder="උදා: තැඹිලි, බත, ලූනු"
                    />
                  </div>
                  <div className="form-group">
                    <label>මිල (රුපියල්) *</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      step="0.01"
                      min="0"
                      required
                      disabled={loading}
                      placeholder="උදා: 250.00"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>ප්‍රමාණය *</label>
                    <input
                      type="text"
                      value={productForm.quantity}
                      onChange={(e) => setProductForm({...productForm, quantity: e.target.value})}
                      placeholder="උදා: 1kg, 5 පොට්ටු, 1 දසුන"
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>විස්තරය</label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                      rows="3"
                      disabled={loading}
                      placeholder="නිෂ්පාදනය පිළිබඳ විස්තර..."
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-submit" disabled={loading}>
                  {loading ? 'එකතු කරමින්...' : '✅ නිෂ්පාදනය එකතු කරන්න'}
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="products-container">
        <h2>🛒 ලබාගත හැකි නිෂ්පාදන ({products.length})</h2>
        {products.length === 0 ? (
          <div className="no-products">
            <p>තවමත් නිෂ්පාදන නොමැත.</p>
            {user.userType === 'FARMER' && !showProductForm && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowProductForm(true)}
              >
                ➕ පළමු නිෂ්පාදනය එකතු කරන්න
              </button>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-header">
                  <h3>{product.productName}</h3>
                  <span className="price">රු.{product.price}</span>
                </div>
                <div className="product-details">
                  <p><strong>ප්‍රමාණය:</strong> {product.quantity}</p>
                  {product.description && (
                    <p><strong>විස්තරය:</strong> {product.description}</p>
                  )}
                  <p><strong>ව්‍යාපාරිකයා:</strong> {product.user?.fullName || 'Unknown'}</p>
                  <p><strong>දුරකථන:</strong> {product.user?.phoneNumber || 'N/A'}</p>
                </div>
                <div className="product-actions">
                  {user.userType === 'BUYER' && (
                    <>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowOrderForm(true);
                        }}
                      >
                        🛒 ඇණවුම් කරන්න
                      </button>
                      <button 
                        className="btn btn-call"
                        onClick={() => handleCallFarmer(product.user?.phoneNumber)}
                        disabled={!product.user?.phoneNumber}
                      >
                        📞 අමතන්න
                      </button>
                    </>
                  )}
                  {user.userType === 'FARMER' && user.id === product.user?.id && (
                    <button 
                      className="btn btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      🗑 ඉවත් කරන්න
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Modal */}
      {showOrderForm && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🛒 ඇණවුම් කිරීම</h2>
            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label><strong>නිෂ්පාදනය:</strong> {selectedProduct.productName}</label>
              </div>
              <div className="form-group">
                <label><strong>ඒකකයක මිල:</strong> රු.{selectedProduct.price}</label>
              </div>
              <div className="form-group">
                <label>ඇණවුම් ප්‍රමාණය:</label>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>
              <div className="form-group">
                <label><strong>මුළු මිල:</strong> රු.{(selectedProduct.price * orderQuantity).toFixed(2)}</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowOrderForm(false)}>
                  ✖ අවලංගු කරන්න
                </button>
                <button type="submit" className="btn btn-primary">
                  ✅ ඇණවුම් කරන්න
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;