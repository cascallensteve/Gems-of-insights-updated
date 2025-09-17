import React from 'react';
import './Products.css';

const Products = () => {
  return (
    <div className="admin-products">
      <div className="products-header">
        <div className="header-content">
          <h1>Product Management</h1>
          <p>Manage your product catalog and inventory</p>
        </div>
        <div className="header-actions">
          <button className="add-product-btn">+ Add New Product</button>
        </div>
      </div>
      
      <div className="products-content">
        <div className="products-overview">
          <div className="products-card">
            <h3>Total Products</h3>
            <p className="products-number">156</p>
            <span className="products-period">Active Products</span>
          </div>
          
          <div className="products-card">
            <h3>Categories</h3>
            <p className="products-number">12</p>
            <span className="products-period">Product Categories</span>
          </div>
          
          <div className="products-card">
            <h3>Low Stock</h3>
            <p className="products-number">8</p>
            <span className="products-period">Items Need Restocking</span>
          </div>
        </div>
        
        <div className="products-placeholder">
          <div className="placeholder-content">
            <h2>Product Management</h2>
            <p>Product catalog and inventory management features will be implemented here.</p>
            <div className="placeholder-features">
              <div className="feature-item">📦 Product Catalog</div>
              <div className="feature-item">🏷️ Category Management</div>
              <div className="feature-item">�� Inventory Tracking</div>
              <div className="feature-item">🖼️ Media Management</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 