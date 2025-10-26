import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyProducts = ({ user }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/products/user/${user.id}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('මෙම නිෂ්පාදනය ඉවත් කිරීමට අවශ්‍යද?')) {
      try {
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        fetchMyProducts();
        alert('නිෂ්පාදනය සාර්ථකව ඉවත් කරන ලදී!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('නිෂ්පාදනය ඉවත් කිරීමට අසමත් විය');
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="products-container">
        <div className="page-header">
          <h1>📦 මගේ නිෂ්පාදන</h1>
          <p>ඔබ විසින් එක් කරන ලද නිෂ්පාදන ({products.length})</p>
        </div>

        {products.length === 0 ? (
          <div className="no-products">
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h3>තවමත් නිෂ්පාදන නොමැත</h3>
              <p>ඔබේ පළමු නිෂ්පාදනය එක් කර විකිණීම ආරම්භ කරන්න</p>
              <Link to="/" className="btn btn-primary">
                ➕ නව නිෂ්පාදනයක්
              </Link>
            </div>
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
                  <p>
                    <strong>තත්වය:</strong> 
                    <span className={`status ${product.isAvailable ? 'available' : 'sold-out'}`}>
                      {product.isAvailable ? '🟢 ලබා ගත හැක' : '🔴 අවසන්'}
                    </span>
                  </p>
                  <p className="created-at">
                    <strong>එක් කළ දිනය:</strong> {new Date(product.createdAt).toLocaleDateString('si-LK')}
                  </p>
                </div>
                <div className="product-actions">
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    🗑 ඉවත් කරන්න
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

export default MyProducts;