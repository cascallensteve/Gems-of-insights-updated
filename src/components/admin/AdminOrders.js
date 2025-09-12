import React, { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaUser, FaCalendar, FaDollarSign, FaEye, FaEdit, FaFilter, FaDownload, FaBox, FaTruck, FaCheck, FaTimes, FaTrash, FaSyncAlt, FaCog, FaPrint } from 'react-icons/fa';
import receiptService from '../../services/receiptService';
import { useAuth } from '../../context/AuthContext';
import apiService, { api, checkPaymentStatus, getTransactionStatus } from '../../services/api';
import './AdminOrders.css';
import LoadingDots from '../LoadingDots';

const AdminOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewScope, setViewScope] = useState('all'); // 'all' | 'mine'
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const shippingRef = useRef(null);

  const orderStatuses = [
    'pending', 'paid', 'processing', 'shipped', 'delivered', 
    'completed', 'cancelled', 'refunded', 'failed', 'on_hold'
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication token not found. Please login as admin first.');
        }

        console.log('🛒 Fetching orders with correct Authorization header...');
        
        // Set token in correct Django REST Framework format
        api.defaults.headers.common['Authorization'] = `Token ${token}`;

        let data;
        try {
          if (viewScope === 'mine') {
            console.log('🔄 Fetching my orders...');
            const response = await api.get('/store/my-orders');
            data = response.data?.orders || response.data || [];
          } else {
            console.log('🔄 Attempting to fetch all orders...');
            const response = await api.get('/store/all-orders');
            data = response.data;
          }
          console.log('✅ Orders API request successful');
          console.log('📦 Orders received:', data);
        } catch (apiError) {
          console.log('⚠️ API service failed:', apiError);
          throw apiError;
        }

        // Process and enrich orders data with product names/images/prices
        const processedOrders = await Promise.all((Array.isArray(data) ? data : []).map(async (order) => {
          const items = Array.isArray(order.items) ? order.items : [];
          const enrichedItems = await Promise.all(items.map(async (it) => {
            const productId = it.product || it.item || it.product_id || it.id;
            const hasCore = Boolean(it.name) && (it.price !== undefined && it.price !== null);
            if (!productId && !hasCore) {
              return { ...it, name: it.name || 'Item', price: it.price || 0 };
            }
            if (hasCore) {
              return { ...it };
            }
            try {
              const detail = await apiService.store.getItemDetail(productId);
              const d = detail?.item || detail;
              return {
                ...it,
                name: it.name || d.name || d.title || `Item #${productId}`,
                image: it.image || d.image || d.photo,
                price: (it.price !== undefined && it.price !== null) ? it.price : Number(d.price ?? d.unit_price ?? d.amount ?? 0)
              };
            } catch (_e) {
              return { ...it, name: it.name || `Item #${productId}`, price: it.price || 0 };
            }
          }));

          const total_amount = enrichedItems.reduce((sum, x) => sum + Number(x.price || 0) * Number(x.quantity || 1), 0);

          // Normalize shipping info if present
          const s = order.shipping || order.shipping_info || order.address || null;
          const shipping = s && typeof s === 'object' ? {
            first_name: s.first_name || s.firstName || s.first || s.firstname || '',
            last_name: s.last_name || s.lastName || s.last || s.lastname || '',
            email: s.email || '',
            phone: s.phone || s.phone_number || '',
            address: s.address || s.street || s.line1 || '',
            city: s.city || '',
            county: s.county || s.state || '',
            postal_code: s.postal_code || s.postcode || s.zip || ''
          } : null;

          return {
            ...order,
            items: enrichedItems,
            total_amount,
            item_count: enrichedItems.length,
            status_color: getStatusColor(order.status),
            shipping
          };
        }));

        console.log('✅ Total processed orders:', processedOrders.length);
        setOrders(processedOrders);
      } catch (error) {
        console.error('❌ Error fetching orders:', error);
        setError(error.message || 'Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [viewScope]);

  const calculateOrderTotal = (order) => {
    if (!order.items || !Array.isArray(order.items)) return 0;
    return order.items.reduce((total, item) => {
      // You might need to fetch item prices from another endpoint
      // For now, using placeholder calculation
      return total + (item.quantity * 100); // placeholder price
    }, 0);
  };

  const darkGreen = '#14532d'; // dark green
  const dangerRed = '#dc2626';
  const white = '#ffffff';

  const getStatusColor = (status) => {
    const normalized = (status || '').toString().toLowerCase();
    if (['paid','completed','delivered','success'].includes(normalized)) return darkGreen;
    if (['cancelled','failed','refunded'].includes(normalized)) return dangerRed;
    return darkGreen; // pending uses green border with white bg in badge below
  };

  const filteredOrders = orders.filter(order => {
    const normalizedStatus = (order.status || '').toLowerCase();
    const normalizedPay = (order.payment_status || '').toLowerCase();
    // Exclude failed transactions from the admin list
    if (normalizedStatus === 'failed' || normalizedPay === 'failed') return false;
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = (
      order.id.toString().includes(searchTerm.toLowerCase()) ||
      order.buyer.toString().includes(searchTerm.toLowerCase()) ||
      order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      const response = await api.post(`/store/update-order-status/${orderId}/`, {
        status: newStatus
      });

      console.log('✅ Order status updated:', response.data);

      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus, status_color: getStatusColor(newStatus) }
            : order
        )
      );

      // Update selected order if it's currently shown in modal
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ 
          ...prev, 
          status: newStatus, 
          status_color: getStatusColor(newStatus) 
        }));
      }

      alert(`✅ Order #${orderId} status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`❌ Error updating order status: ${error.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleViewDetails = async (order) => {
    try {
      console.log('👁️ Viewing order details for ID:', order.id);
      setSelectedOrder(order);
      setShowModal(true);
      
      // Optionally fetch detailed order data
      // const detailedOrder = await fetchOrderDetails(order.id);
      // setSelectedOrder(detailedOrder);
    } catch (error) {
      console.error('Error viewing order details:', error);
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Buyer', 'Status', 'Items', 'Total', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.buyer,
        order.status,
        order.item_count,
        order.total_amount,
        new Date(order.created_at).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printAllOrders = () => {
    try {
      const w = window.open('', '_blank');
      if (!w) return;
      const styles = `
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: 800; }
          .meta { color: #475569; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e2e8f0; }
          thead th { background: #f1f5f9; }
        </style>
      `;
      const rows = filteredOrders.map(o => {
        const ship = o.shipping || {};
        const items = Array.isArray(o.items) ? o.items : [];
        const total = Number(o.total_amount || 0).toLocaleString();
        const firstItems = items.slice(0, 2).map(it => (it.name || it.product_name || `Item`)).join(', ');
        const more = items.length > 2 ? ` +${items.length - 2} more` : '';
        return `<tr>
          <td>#${o.id}</td>
          <td>User #${o.buyer}</td>
          <td>${(ship.first_name||'') + ' ' + (ship.last_name||'')}</td>
          <td>${[ship.city, ship.county].filter(Boolean).join(', ')}</td>
          <td>${o.status}</td>
          <td>KSH ${total}</td>
          <td>${firstItems}${more}</td>
          <td>${new Date(o.created_at).toLocaleString()}</td>
        </tr>`;
      }).join('');
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>All Orders - Printable</title>
            ${styles}
          </head>
          <body>
            <div class="header">
              <div>
                <div class="title">All Orders (${filteredOrders.length})</div>
                <div class="meta">Printed: ${new Date().toLocaleString()}</div>
              </div>
              <img src="/images/LOGOGEMS.png" alt="Logo" style="height:64px;object-fit:contain" />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Buyer</th>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>${rows}</tbody>
            </table>
            <script>window.onload = () => window.print();</script>
          </body>
        </html>
      `;
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (e) {
      console.error('Failed to print all orders', e);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await apiService.store.deleteOrder(deleteTarget.id);
      setOrders(prev => prev.filter(o => o.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      console.error('Delete failed', e);
      alert(typeof e === 'string' ? e : (e?.detail || 'Delete failed'));
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const normalized = (status || '').toString().toLowerCase();
    const isCompleted = ['paid','completed','delivered','success'].includes(normalized);
    const isFailed = ['failed','cancelled','refunded'].includes(normalized);
    const style = isCompleted
      ? { background: darkGreen, color: white, border: `1px solid ${darkGreen}` }
      : isFailed
      ? { background: dangerRed, color: white, border: `1px solid ${dangerRed}` }
      : { background: white, color: darkGreen, border: `1px solid ${darkGreen}` };
    const text = isCompleted ? 'Completed' : isFailed ? 'Failed' : 'Pending';
    return <span className="status-badge" style={{
      padding: '4px 10px',
      borderRadius: 999,
      fontWeight: 700,
      fontSize: 12,
      ...style
    }}>{text}</span>;
  };

  const getStatusActions = (order) => {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          <button key="paid" className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(order.id, 'paid')} title="Mark as Paid">
            <FaDollarSign /> Paid
          </button>
        );
        actions.push(
          <button key="cancelled" className="btn btn-sm btn-danger" onClick={() => handleStatusUpdate(order.id, 'cancelled')} title="Cancel Order">
            <FaTimes /> Cancel
          </button>
        );
        break;
      case 'paid':
        actions.push(
          <button key="processing" className="btn btn-sm btn-info" onClick={() => handleStatusUpdate(order.id, 'processing')} title="Start Processing">
            <FaCog /> Process
          </button>
        );
        break;
      case 'processing':
        actions.push(
          <button key="shipped" className="btn btn-sm btn-purple" onClick={() => handleStatusUpdate(order.id, 'shipped')} title="Mark as Shipped">
            <FaTruck /> Ship
          </button>
        );
        break;
      case 'shipped':
        actions.push(
          <button key="delivered" className="btn btn-sm btn-teal" onClick={() => handleStatusUpdate(order.id, 'delivered')} title="Mark as Delivered">
            <FaBox /> Delivered
          </button>
        );
        break;
      case 'delivered':
        actions.push(
          <button key="completed" className="btn btn-sm btn-success" onClick={() => handleStatusUpdate(order.id, 'completed')} title="Complete Order">
            <FaCheck /> Complete
          </button>
        );
        break;
      default:
        break;
    }
    
    return actions;
  };

  const isOrderCompleted = (status) => {
    const normalized = (status || '').toString().toLowerCase();
    return ['paid','completed','delivered','success'].includes(normalized);
  };

  const openOrderWindow = (order) => {
    try {
      const w = window.open('', '_blank');
      if (!w) return;
      const styles = `
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #0f172a; }
          .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
          .title { font-size: 20px; font-weight: 800; }
          .meta { color: #475569; font-size: 12px; }
          .section { margin-top: 16px; }
          .section h3 { margin: 0 0 8px 0; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
          .actions { margin-top: 16px; display: flex; gap: 8px; }
          .btn { padding: 8px 12px; border: 1px solid #e2e8f0; background: #ffffff; cursor: pointer; border-radius: 8px; }
          .btn-primary { background: #14532d; color: #ffffff; border-color: #14532d; }
        </style>
      `;
      const shipping = order.shipping || order.shipping_info || {};
      const items = Array.isArray(order.items) ? order.items : [];
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Order #${order.id}</title>
            ${styles}
          </head>
          <body>
            <div class="header">
              <div>
                <div class="title">Order #${order.id}</div>
                <div class="meta">Status: ${(order.status || '').toString()}</div>
                <div class="meta">Date: ${new Date(order.created_at).toLocaleString()}</div>
              </div>
              <img src="/images/LOGOGEMS.png" alt="Logo" style="height:64px;object-fit:contain" />
            </div>
            <div class="section">
              <h3>Shipping Information</h3>
              <div class="meta">${(shipping.first_name||'') + ' ' + (shipping.last_name||'')}</div>
              <div class="meta">${shipping.phone||''} • ${shipping.email||''}</div>
              <div class="meta">${[shipping.address, shipping.city, shipping.county, shipping.postal_code].filter(Boolean).join(', ')}</div>
            </div>
            <div class="section">
              <h3>Items (${items.length})</h3>
              <table>
                <thead>
                  <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
                </thead>
                <tbody>
                  ${items.map((it) => {
                    const name = it.name || it.product_name || `Item`;
                    const qty = Number(it.quantity||1);
                    const price = Number(it.price||it.unit_price||0);
                    const total = qty * price;
                    return `<tr><td>${name}</td><td>${qty}</td><td>KSH ${price.toLocaleString()}</td><td>KSH ${total.toLocaleString()}</td></tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
            <div class="actions">
              <button class="btn" onclick="window.print()">Print Page</button>
            </div>
          </body>
        </html>
      `;
      w.document.open();
      w.document.write(html);
      w.document.close();
    } catch (e) {
      console.error('Failed to open order window', e);
    }
  };

  // No blocking loading state; render immediately.

  if (error && orders.length === 0) {
    return (
      <div className="admin-orders error">
        <div className="error-message">
          <h3>❌ Error Loading Orders</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {/* Header Section */}
      <div className="orders-header">
        <div className="orders-header__left">
          <h2>Orders Management</h2>
          <p>Manage customer orders and track shipments</p>
        </div>
        <div className="orders-header__right">
          <div className="btn-group" role="group" aria-label="View scope">
            <button className={`btn btn-secondary ${viewScope==='all' ? 'active' : ''}`} onClick={() => setViewScope('all')}>All</button>
            <button className={`btn btn-secondary ${viewScope==='mine' ? 'active' : ''}`} onClick={() => setViewScope('mine')}>Mine</button>
          </div>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>
            <FaSyncAlt /> Refresh
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <FaDownload /> Export CSV
          </button>
          <button className="btn btn-secondary" onClick={printAllOrders}>
            <FaPrint /> Print All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{orders.filter(o => o.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card__icon pending">
            <FaShoppingCart />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{orders.filter(o => ['paid', 'processing'].includes(o.status)).length}</h3>
            <p>Processing</p>
          </div>
          <div className="stat-card__icon processing">
            <FaBox />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{orders.filter(o => ['shipped', 'delivered'].includes(o.status)).length}</h3>
            <p>Shipped</p>
          </div>
          <div className="stat-card__icon shipped">
            <FaTruck />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
          <div className="stat-card__icon total">
            <FaDollarSign />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="orders-controls">
        <div className="orders-controls__left">
          <div className="filter-group">
            <FaFilter />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Status</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="orders-controls__right">
          <input
            type="text"
            placeholder="Search by order ID, buyer, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Shipping</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td>
                  <div className="order-id">
                    <strong>#{order.id}</strong>
                  </div>
                </td>
                <td>
                  <div className="buyer-info">
                    <div className="buyer-avatar">
                      <FaUser />
                    </div>
                    <span>User #{order.buyer}</span>
                  </div>
                </td>
                <td>
                  {order.shipping ? (
                    <div className="shipping-info" style={{display:'flex', flexDirection:'column', gap:4}}>
                      <span><strong>{`${order.shipping.first_name || ''} ${order.shipping.last_name || ''}`.trim() || '—'}</strong></span>
                      <span style={{opacity:0.8}}>{order.shipping.phone || '—'}</span>
                      <span style={{opacity:0.8}}>{[order.shipping.city, order.shipping.county].filter(Boolean).join(', ') || ''}</span>
                    </div>
                  ) : (
                    <span>—</span>
                  )}
                </td>
                <td>
                  <div className="items-info">
                    <span className="item-count">{order.item_count} items</span>
                    {order.items && order.items.length > 0 && (
                      <div className="item-names" style={{display:'flex', gap:8, flexWrap:'wrap'}}>
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="item-pill" style={{display:'flex', alignItems:'center', gap:6, padding:'4px 8px', border:'1px solid #e5e7eb', borderRadius:999}}>
                            <img src={item.image || '/images/default-product.jpg'} alt={item.name || `Item #${item.item}`} style={{width:20, height:20, borderRadius:4, objectFit:'cover'}} />
                            <span>{item.name || `Item #${item.item}`}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <span className="item-pill more">+{order.items.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="total-amount">
                    <strong>KSH {order.total_amount.toLocaleString()}</strong>
                  </div>
                </td>
                <td>
                  {getStatusBadge(order.status)}
                </td>
                <td>
                  <div className="payment-cell">
                    <div className="payment-line"><strong>Method:</strong> {order.payment_method || 'M-Pesa'}</div>
                    <div className="payment-line"><strong>Status:</strong> {(['paid','completed','delivered','success'].includes((order.status||'').toLowerCase()) || (order.payment_status||'').toLowerCase()==='success') ? 'completed' : 'pending'}</div>
                    {order.checkout_request_id && (
                      <div className="payment-line"><strong>Checkout:</strong> {order.checkout_request_id}</div>
                    )}
                    {order.merchant_request_id && (
                      <div className="payment-line"><strong>Merchant:</strong> {order.merchant_request_id}</div>
                    )}
                    {order.receipt && (
                      <div className="payment-line"><strong>Receipt:</strong> {order.receipt}</div>
                    )}
                    {order.checkout_request_id && (
                      <button
                        className="btn btn-sm btn-outline"
                        title="Check Payment"
                        onClick={async () => {
                          try {
                            // Prefer GET transaction status
                            let tx;
                            try {
                              tx = await getTransactionStatus(order.checkout_request_id);
                            } catch (e) {
                              tx = null;
                            }
                            if (!tx) {
                              const legacy = await checkPaymentStatus(order.checkout_request_id, order.merchant_request_id);
                              const code = (legacy?.resultCode || '').toString();
                              if (code === '0') {
                                alert('✅ Payment success');
                              } else {
                                alert('ℹ️ Payment not confirmed yet');
                              }
                            } else {
                              const pretty = (obj) => JSON.stringify(obj, null, 2);
                              const status = tx.status || 'unknown';
                              const details = `Status: ${status}\nAmount: KSH ${Number(tx.amount || 0).toLocaleString()}\nReceipt: ${tx.receipt || 'N/A'}`;
                              alert(details);
                            }
                          } catch (err) {
                            console.error('Payment status check error:', err);
                            alert('Error checking payment status');
                          }
                        }}
                      >
                        Check
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <div className="order-date">
                    <FaCalendar /> {formatDate(order.created_at)}
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => openOrderWindow(order)}
                      title="View Order (opens in new window)"
                    >
                      <FaEye />
                    </button>
                    {isOrderCompleted(order.status) && (
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => receiptService.printReceipt(order)}
                        title="Print Receipt"
                      >
                        <FaPrint />
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => setDeleteTarget(order)}
                      title="Delete Order"
                    >
                      <FaTrash />
                    </button>
                    {getStatusActions(order).map((action, index) => (
                      <React.Fragment key={index}>
                        {updatingStatus === order.id ? (
                          <button className="btn btn-sm btn-outline" disabled>
                            ⏳
                          </button>
                        ) : action}
                      </React.Fragment>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <FaShoppingCart size={48} />
            <h3>{loading ? 'Loading...' : 'No orders found'}</h3>
            <p>{loading ? 'Please wait while we fetch your orders.' : (error ? 'Unable to load orders. Please check your connection and try again.' : 'No orders match your current filters.')}</p>
            {error && (
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
                style={{ marginTop: '15px' }}
              >
                Retry Loading
              </button>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={() => !deleting && setDeleteTarget(null)}>
          <div className="order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Delete Order #{deleteTarget.id}</h3>
              <button onClick={() => !deleting && setDeleteTarget(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 12 }}>This action cannot be undone. Do you want to permanently delete this order?</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button className="btn btn-secondary" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</button>
                <button className="btn btn-danger" onClick={confirmDeleteOrder} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
