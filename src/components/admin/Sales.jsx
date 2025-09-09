import React from 'react';
import './Sales.css';

const Sales = () => {
  return (
    <div className="admin-sales">
      <div className="sales-header">
        <div className="header-content">
          <h1>Sales Management</h1>
          <p>Track and manage your sales performance and transactions</p>
        </div>
      </div>
      
      <div className="sales-content">
        <div className="sales-overview">
          <div className="sales-card">
            <h3>Total Sales</h3>
            <p className="sales-amount">KSh 125,670</p>
            <span className="sales-period">This Month</span>
          </div>
          
          <div className="sales-card">
            <h3>Orders</h3>
            <p className="sales-amount">3,542</p>
            <span className="sales-period">Total Orders</span>
          </div>
          
          <div className="sales-card">
            <h3>Average Order</h3>
            <p className="sales-amount">KSh 35.50</p>
            <span className="sales-period">Per Order</span>
          </div>
        </div>
        
        <div className="sales-placeholder">
          <div className="placeholder-content">
            <h2>Sales Dashboard</h2>
            <p>Sales analytics and reporting features will be implemented here.</p>
            <div className="placeholder-features">
              <div className="feature-item">📊 Sales Analytics</div>
              <div className="feature-item">📈 Revenue Reports</div>
              <div className="feature-item">�� Order Management</div>
              <div className="feature-item">�� Payment Tracking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales; 