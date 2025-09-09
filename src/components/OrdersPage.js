import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import apiService, { getUserOrders, createOrder, initiateMpesaPayment } from '../services/api';
import receiptService from '../services/receiptService';
import LoadingDots from './LoadingDots';
import './OrdersPage.css';

const OrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load orders from API only (no mock/local fallbacks)
  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        // Fetch real user orders
        const apiData = await getUserOrders();

        // Normalize possible shapes
        const rawOrders = Array.isArray(apiData)
          ? apiData
          : (apiData?.orders || apiData?.data || []);

        const normalized = rawOrders.map((o, idx) => {
          const items = (o.items || o.order_items || o.products || []).map((it, i) => ({
            id: it.id ?? it.product_id ?? it.product ?? it.item ?? `${o.id}-item-${i}`,
            productId: it.product ?? it.item ?? it.product_id ?? it.id, // preserve backend product reference
            name: it.name ?? it.product_name ?? it.title ?? null,
            price: Number(it.price ?? it.unit_price ?? it.amount ?? 0) || null,
            quantity: Number(it.quantity ?? it.qty ?? 1),
            image: it.image ?? it.photo ?? null
          }));

          const created = o.date || o.created_at || o.created || new Date().toISOString();
          let status = (o.status || o.order_status || o.payment_status || 'processing').toString().toLowerCase();
          // Normalize payment-related states
          const isPaid = (o.is_paid === true) || ['paid','completed','success','delivered'].includes(status);
          if (!isPaid) {
            if (['pending','awaiting','payment_pending','unpaid'].includes(status)) {
              status = 'payment_pending';
            }
          }
          const shipping = o.shipping_address || o.address || o.delivery_address || 'N/A';
          const tracking = o.tracking_number || o.tracking || null;

          const total = Number(
            o.total ?? o.total_amount ?? o.amount ??
            (items.reduce((s, it) => s + it.price * it.quantity, 0) + 0)
          );

          return {
            id: o.id?.toString?.() || o.order_id || o.reference || `ORD-${Date.now()}-${idx}`,
            date: new Date(created).toISOString().split('T')[0],
            status,
            total,
            items: items.length ? items : [{ id: 'tmp', name: 'Item', price: total, quantity: 1, image: '/images/default-product.jpg' }],
            shippingAddress: shipping,
            trackingNumber: tracking
          };
        });

        // Enrich items that are missing details (only product id/quantity returned by backend)
        const enriched = await Promise.all(normalized.map(async (ord) => {
          const enrichedItems = await Promise.all(ord.items.map(async (it) => {
            if (it.name && it.image && (it.price !== null && it.price !== undefined)) return it;
            const pid = it.productId || it.id;
            if (!pid) return { ...it, name: it.name || 'Item', image: it.image || '/images/default-product.jpg', price: it.price || 0 };
            try {
              const detail = await apiService.store.getItemDetail(pid);
              // normalize detail shape
              const d = detail?.item || detail;
              return {
                ...it,
                name: it.name || d.name || d.title || `Item #${pid}`,
                image: it.image || d.image || d.photo || '/images/default-product.jpg',
                price: (it.price !== null && it.price !== undefined) ? it.price : Number(d.price ?? d.unit_price ?? d.amount ?? 0)
              };
            } catch (_e) {
              return { ...it, name: it.name || `Item #${pid}`, image: it.image || '/images/default-product.jpg', price: it.price || 0 };
            }
          }));
          // Recalculate total if missing or zero
          const recalculatedTotal = enrichedItems.reduce((s, x) => s + Number(x.price || 0) * Number(x.quantity || 1), 0);
          return { ...ord, items: enrichedItems, total: ord.total || recalculatedTotal };
        }));

        setOrders(enriched);
        // Clear any previously stored demo orders
        localStorage.removeItem('orders');
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  // Periodically refresh orders to reflect real-time updates (e.g., payment confirmations)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const apiData = await getUserOrders();
        const rawOrders = Array.isArray(apiData) ? apiData : (apiData?.orders || apiData?.data || []);
        if (rawOrders.length) {
          // Minimal normalization: only update status/total quickly
          setOrders(prev => prev.map(o => {
            const latest = rawOrders.find(r => (r.id?.toString?.() || r.order_id || r.reference) === o.id);
            if (!latest) return o;
            let status = (latest.status || latest.order_status || latest.payment_status || o.status).toString().toLowerCase();
            const isPaid = (latest.is_paid === true) || ['paid','completed','success','delivered'].includes(status);
            if (!isPaid && ['pending','awaiting','payment_pending','unpaid'].includes(status)) {
              status = 'payment_pending';
            }
            return { ...o, status, total: Number(latest.total ?? latest.total_amount ?? o.total) };
          }));
        }
      } catch (e) {
        // ignore
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);


  // Removed mock generator – we will rely purely on real API data

  // Get status color and icon
  const getStatusColor = (status) => {
    const colors = {
      processing: 'var(--warning)',
      shipped: 'var(--info)',
      delivered: 'var(--success)',
      cancelled: 'var(--danger)',
      payment_pending: '#f59e0b'
    };
    return colors[status] || 'var(--text-light)';
  };

  const getStatusIcon = (status) => {
    const icons = {
      processing: '⏳',
      shipped: '🚚',
      delivered: '✅',
      cancelled: '❌',
      payment_pending: '💳'
    };
    return icons[status] || '📦';
  };

  // Filter and sort orders
  const filteredOrders = orders.filter(order => {
    if (filterStatus !== 'all' && order.status !== filterStatus) return false;
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sortBy === 'amount-high') return b.total - a.total;
    if (sortBy === 'amount-low') return a.total - b.total;
    return 0;
  });

  // Order actions
  const handleDeleteOrder = (orderId) => {
    const updatedOrders = orders.filter(order => order.id !== orderId);
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setSelectedOrder(null);
  };

  const handleCancelOrder = (order) => {
    setOrderToCancel(order);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    if (orderToCancel) {
      const updatedOrders = orders.map(order => 
        order.id === orderToCancel.id 
          ? { 
              ...order, 
              status: 'cancelled', 
              cancelReason: 'Cancelled by customer',
              cancelledDate: new Date().toISOString().split('T')[0]
            } 
          : order
      );
      setOrders(updatedOrders);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      setShowCancelModal(false);
      setOrderToCancel(null);
      setSelectedOrder(updatedOrders.find(o => o.id === orderToCancel.id));
    }
  };

  const handleReorder = (order) => {
    alert(`Adding ${order.items.length} items from order ${order.id} to your cart`);
  };

  // Download receipt PDF
  const downloadReceipt = (order) => {
    try {
      receiptService.downloadReceipt(order);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Error downloading receipt. Please try again.');
    }
  };

  // Print order details
  const printOrder = (order) => {
    const orderHtml = `
      <html>
        <head>
          <title>Order ${order.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { margin: 0 0 16px; }
            .row { display: flex; justify-content: space-between; margin: 6px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background: #f3f4f6; text-align: left; }
            .total { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Order Receipt</h1>
          <div class="row"><div><strong>Order ID:</strong> ${order.id}</div><div><strong>Date:</strong> ${formatDate(order.date)}</div></div>
          <div class="row"><div><strong>Status:</strong> ${order.status}</div><div><strong>Tracking:</strong> ${order.trackingNumber || '-'}</div></div>
          <div class="row"><div><strong>Ship To:</strong> ${order.shippingAddress || '-'}</div></div>
          <table>
            <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Line Total</th></tr></thead>
            <tbody>
              ${order.items.map(it => `<tr><td>${it.name}</td><td>${it.quantity}</td><td>KSH ${Number(it.price).toLocaleString()}</td><td>KSH ${(Number(it.price)*Number(it.quantity)).toLocaleString()}</td></tr>`).join('')}
            </tbody>
            <tfoot>
              <tr><td colspan="3" class="total">Total</td><td class="total">KSH ${Number(order.total).toLocaleString()}</td></tr>
            </tfoot>
          </table>
        </body>
      </html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.open();
    win.document.write(orderHtml);
    win.document.close();
    win.focus();
    win.print();
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };



  // Calculate order stats
  const orderStats = {
    totalOrders: orders.length,
    totalSpent: orders.reduce((sum, order) => sum + order.total, 0).toFixed(2),
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        {/* Header */}
        <div className="orders-header">
          <div className="header-left">
            <button className="back-btn" onClick={() => window.history.back()}>
              ← Back to Shop
            </button>
            <h1>My Orders</h1>
            <p>Track and manage your orders</p>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-number">{orderStats.totalOrders}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">KSH {Number(orderStats.totalSpent).toLocaleString()}</span>
              <span className="stat-label">Total Spent</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="orders-filters">
          <div className="filter-group">
            <label>Filter by Status:</label>
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              disabled={isLoading}
            >
              <option value="all">All Orders ({orderStats.totalOrders})</option>
              <option value="processing">Processing ({orderStats.processing})</option>
              <option value="shipped">Shipped ({orderStats.shipped})</option>
              <option value="delivered">Delivered ({orderStats.delivered})</option>
              <option value="cancelled">Cancelled ({orderStats.cancelled})</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Sort by:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              disabled={isLoading}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-high">Highest Amount</option>
              <option value="amount-low">Lowest Amount</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Search:</label>
            <input
              type="text"
              placeholder="Search by order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-state">
            <LoadingDots text="Loading your orders..." size="large" />
          </div>
        )}

        {/* Orders List */}
        {!isLoading && (
          <div className="orders-content">
            <div className="orders-list">
              {sortedOrders.length === 0 ? (
                <div className="no-orders">
                  <div className="no-orders-icon">📦</div>
                  <h3>No orders found</h3>
                  <p>
                    {searchQuery 
                      ? `No orders match your search for "${searchQuery}"`
                      : filterStatus !== 'all'
                        ? `You don't have any ${filterStatus} orders`
                        : "You haven't placed any orders yet"}
                  </p>
                  <button 
                    className="shop-now-btn" 
                    onClick={() => window.location.href = '/shop'}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                sortedOrders.map(order => (
                  <div 
                    key={order.id} 
                    className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Order #{order.id}</h3>
                        <p>{formatDate(order.date)}</p>
                      </div>
                      <div className="order-status">
                        <span 
                          className={`status-badge ${order.status}`}
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="order-items">
                      {order.items.slice(0, 2).map(item => (
                        <div key={`${order.id}-${item.id}`} className="order-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-quantity">Qty: {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="more-items">+{order.items.length - 2} more items</div>
                      )}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: KSH {Number(order.total).toLocaleString()}</strong>
                      </div>
                      <div className="order-actions">
                        {order.status === 'delivered' && (
                          <button 
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order.id);
                            }}
                          >
                            Delete
                          </button>
                        )}
                        {(order.status === 'processing' || order.status === 'shipped') && (
                          <button 
                            className="action-btn cancel-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrder(order);
                            }}
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          className="action-btn view-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Details Sidebar */}
            {selectedOrder && (
              <div className="order-details">
                <div className="details-header">
                  <h2>Order Details</h2>
                  <button 
                    className="close-details"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="details-content">
                  <div className="detail-section">
                    <h3>Order Information</h3>
                    <div className="detail-row">
                      <span>Order ID:</span>
                      <span>{selectedOrder.id}</span>
                    </div>
                    <div className="detail-row">
                      <span>Date:</span>
                      <span>{formatDate(selectedOrder.date)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Status:</span>
                      <span 
                        className={`status-badge ${selectedOrder.status}`}
                        style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                      >
                        {getStatusIcon(selectedOrder.status)} {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                      </span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="detail-row">
                        <span>Tracking:</span>
                        <a 
                          href={`https://tracking.example.com/?tracking=${selectedOrder.trackingNumber}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="tracking-number"
                        >
                          {selectedOrder.trackingNumber}
                        </a>
                      </div>
                    )}
                    {selectedOrder.cancelReason && (
                      <div className="detail-row">
                        <span>Cancel Reason:</span>
                        <span>{selectedOrder.cancelReason}</span>
                      </div>
                    )}
                    {selectedOrder.cancelledDate && (
                      <div className="detail-row">
                        <span>Cancelled On:</span>
                        <span>{formatDate(selectedOrder.cancelledDate)}</span>
                      </div>
                    )}
                  </div>

                  <div className="detail-section">
                    <h3>Items Ordered</h3>
                    <div className="detailed-items">
                      {selectedOrder.items.map(item => (
                        <div key={`${selectedOrder.id}-${item.id}-detail`} className="detailed-item">
                          <img src={item.image} alt={item.name} />
                          <div className="item-info">
                            <h4>{item.name}</h4>
                            <p>Quantity: {item.quantity}</p>
                            <p className="item-price">KSH {Number(item.price || 0).toLocaleString()} each</p>
                          </div>
                          <div className="item-total">
                            KSH {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                    {(() => {
                      const computedSubtotal = selectedOrder.items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);
                      const displayedTotal = Number(selectedOrder.total || computedSubtotal);
                      return (
                        <div className="order-summary">
                          <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>KSH {computedSubtotal.toLocaleString()}</span>
                          </div>
                          <div className="summary-row total-row">
                            <span>Total to Pay:</span>
                            <span><strong>KSH {displayedTotal.toLocaleString()}</strong></span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="detail-section">
                    <h3>Shipping Information</h3>
                    <p>{selectedOrder.shippingAddress}</p>
                    {selectedOrder.estimatedDelivery && (
                      <p><strong>Estimated Delivery:</strong> {formatDate(selectedOrder.estimatedDelivery)}</p>
                    )}
                    {selectedOrder.actualDelivery && (
                      <p><strong>Delivered on:</strong> {formatDate(selectedOrder.actualDelivery)}</p>
                    )}
                  </div>

                  <div className="detail-actions">
                    <button 
                      className="reorder-btn"
                      onClick={() => handleReorder(selectedOrder)}
                    >
                      🔄 Reorder Items
                    </button>
                    <button 
                      className="print-order-btn"
                      onClick={() => printOrder(selectedOrder)}
                    >
                      🖨️ Print Order
                    </button>
                    <button 
                      className="download-receipt-btn"
                      onClick={() => downloadReceipt(selectedOrder)}
                    >
                      📄 Download Receipt
                    </button>
                    {selectedOrder.status === 'delivered' && (
                      <button 
                        className="delete-order-btn"
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                      >
                        <FaTrash style={{ marginRight: 6 }} /> Delete Order
                      </button>
                    )}
                    {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipped') && (
                      <button 
                        className="cancel-order-btn"
                        onClick={() => handleCancelOrder(selectedOrder)}
                      >
                        ❌ Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
            <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Cancel Order #{orderToCancel?.id}</h3>
              <p>You're about to cancel this order. Are you sure you want to proceed?</p>
              <p className="cancel-warning">
                ⚠️ This action cannot be undone. Any shipped items will need to be returned.
              </p>
              <div className="modal-actions">
                <button 
                  className="cancel-btn-secondary"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Order
                </button>
                <button 
                  className="confirm-cancel-btn"
                  onClick={confirmCancelOrder}
                >
                  Yes, Cancel Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;