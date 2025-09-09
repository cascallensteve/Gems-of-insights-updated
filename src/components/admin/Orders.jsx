import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaEye, FaEdit, FaTrash, FaDownload, FaPrint } from 'react-icons/fa';
import LoadingDots from '../LoadingDots';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Mock orders data - replace with real API calls
  const mockOrders = [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@email.com',
      customerPhone: '+254 700 123 456',
      items: [
        { name: 'Organic Green Tea', quantity: 2, price: 1500 },
        { name: 'Vitamin C Supplements', quantity: 1, price: 2500 }
      ],
      totalAmount: 5500,
      status: 'pending',
      paymentMethod: 'M-Pesa',
      orderDate: '2024-01-15T10:30:00',
      deliveryAddress: '123 Main St, Nairobi, Kenya',
      notes: 'Please deliver in the afternoon'
    },
    {
      id: 'ORD-002',
      customerName: 'Sarah Wilson',
      customerEmail: 'sarah.wilson@email.com',
      customerPhone: '+254 711 234 567',
      items: [
        { name: 'Protein Powder', quantity: 1, price: 3500 },
        { name: 'Omega-3 Supplements', quantity: 2, price: 1800 }
      ],
      totalAmount: 7100,
      status: 'processing',
      paymentMethod: 'Credit Card',
      orderDate: '2024-01-14T14:20:00',
      deliveryAddress: '456 Oak Ave, Mombasa, Kenya',
      notes: ''
    },
    {
      id: 'ORD-003',
      customerName: 'Michael Brown',
      customerEmail: 'michael.brown@email.com',
      customerPhone: '+254 722 345 678',
      items: [
        { name: 'Multivitamin Complex', quantity: 1, price: 2200 },
        { name: 'Iron Supplements', quantity: 1, price: 1200 },
        { name: 'Calcium Tablets', quantity: 1, price: 1800 }
      ],
      totalAmount: 5200,
      status: 'shipped',
      paymentMethod: 'M-Pesa',
      orderDate: '2024-01-13T09:15:00',
      deliveryAddress: '789 Pine Rd, Kisumu, Kenya',
      notes: 'Fragile items - handle with care'
    },
    {
      id: 'ORD-004',
      customerName: 'Emily Davis',
      customerEmail: 'emily.davis@email.com',
      customerPhone: '+254 733 456 789',
      items: [
        { name: 'Weight Loss Supplements', quantity: 1, price: 4500 },
        { name: 'Detox Tea', quantity: 3, price: 800 }
      ],
      totalAmount: 6900,
      status: 'delivered',
      paymentMethod: 'Bank Transfer',
      orderDate: '2024-01-12T16:45:00',
      deliveryAddress: '321 Elm St, Nakuru, Kenya',
      notes: ''
    },
    {
      id: 'ORD-005',
      customerName: 'David Johnson',
      customerEmail: 'david.johnson@email.com',
      customerPhone: '+254 744 567 890',
      items: [
        { name: 'Energy Boosters', quantity: 2, price: 1200 },
        { name: 'Joint Health Supplements', quantity: 1, price: 2800 }
      ],
      totalAmount: 5200,
      status: 'cancelled',
      paymentMethod: 'M-Pesa',
      orderDate: '2024-01-11T11:30:00',
      deliveryAddress: '654 Maple Dr, Eldoret, Kenya',
      notes: 'Customer requested cancellation'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#22c55e';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'processing': return 'Processing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const formatCurrency = (amount) => {
    return `KSh ${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === currentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(currentOrders.map(order => order.id));
    }
  };

  const handleBulkAction = (action) => {
    // Implement bulk actions
    console.log(`${action} for orders:`, selectedOrders);
    setSelectedOrders([]);
  };

  if (loading) {
    return (
      <div className="admin-orders">
        <div className="orders-loading">
          <LoadingDots text="Loading orders..." size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {/* Header */}
      <div className="orders-header">
        <div className="header-content">
          <h1>Order Management</h1>
          <p>Manage and track all customer orders</p>
        </div>
        <div className="header-actions">
          <button className="export-btn">
            <FaDownload /> Export
          </button>
          <button className="print-btn">
            <FaPrint /> Print
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{orders.length}</p>
          <span className="stat-label">All Time</span>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">{orders.filter(o => o.status === 'pending').length}</p>
          <span className="stat-label">Awaiting Processing</span>
        </div>
        <div className="stat-card">
          <h3>Processing</h3>
          <p className="stat-number">{orders.filter(o => o.status === 'processing').length}</p>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">{formatCurrency(orders.reduce((sum, order) => sum + order.totalAmount, 0))}</p>
          <span className="stat-label">All Orders</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="orders-filters">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-controls">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button className="filter-btn">
            <FaFilter /> More Filters
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedOrders.length} orders selected</span>
          <div className="bulk-buttons">
            <button onClick={() => handleBulkAction('mark-processing')}>
              Mark as Processing
            </button>
            <button onClick={() => handleBulkAction('mark-shipped')}>
              Mark as Shipped
            </button>
            <button onClick={() => handleBulkAction('delete')} className="danger">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedOrders.length === currentOrders.length && currentOrders.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => handleSelectOrder(order.id)}
                  />
                </td>
                <td>
                  <span className="order-id">{order.id}</span>
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-name">{order.customerName}</div>
                    <div className="customer-email">{order.customerEmail}</div>
                    <div className="customer-phone">{order.customerPhone}</div>
                  </div>
                </td>
                <td>
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="item">
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <span className="order-total">{formatCurrency(order.totalAmount)}</span>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="status-select"
                    style={{ backgroundColor: getStatusColor(order.status) + '20', color: getStatusColor(order.status) }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>
                  <span className="payment-method">{order.paymentMethod}</span>
                </td>
                <td>
                  <span className="order-date">{formatDate(order.orderDate)}</span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" title="View Details">
                      <FaEye />
                    </button>
                    <button className="action-btn edit" title="Edit Order">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" title="Delete Order">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders; 