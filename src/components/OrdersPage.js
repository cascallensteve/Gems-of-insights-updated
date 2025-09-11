import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import apiService, { getUserOrders, createOrder, initiateMpesaPayment } from '../services/api';
import receiptService from '../services/receiptService';
import pdfService from '../services/pdfService';
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

  // Download receipt (paid) or cart (unpaid) as PDF
  const downloadReceiptOrCart = async (order) => {
    try {
      const status = (order?.status || '').toLowerCase();
      const isPaid = ['paid','completed','success','delivered'].includes(status);
      if (isPaid) {
        const ok = await receiptService.downloadReceipt(order);
        if (!ok) throw new Error('Receipt download failed');
      } else {
        // for unpaid, export cart details only
        const ok = await receiptService.downloadCartDetailsPDF(order);
        if (!ok) throw new Error('Cart PDF generation failed');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Download failed. Please try again.');
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div>
            <button className="inline-flex items-center text-sm text-emerald-700 hover:text-emerald-800" onClick={() => window.history.back()}>
              ← Back to Shop
            </button>
            <h1 className="text-2xl font-semibold text-gray-900 mt-1">My Orders</h1>
            <p className="text-gray-500">Track and manage your orders</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">{orderStats.totalOrders}</div>
              <div className="text-sm text-gray-500">Total Orders</div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-gray-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-gray-900">KSH {Number(orderStats.totalSpent).toLocaleString()}</div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 mb-1">Filter by Status</label>
            <select 
              className="w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
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
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 mb-1">Sort by</label>
            <select 
              className="w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
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
          <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search</label>
            <input
              className="w-full rounded-md border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 text-sm"
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
          <div className="flex items-center justify-center py-16">
            <LoadingDots text="Loading your orders..." size="large" />
          </div>
        )}

        {/* Orders List */}
        {!isLoading && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {sortedOrders.length === 0 ? (
                <div className="text-center bg-white border border-gray-100 rounded-xl p-10 shadow-sm">
                  <div className="text-4xl mb-2">📦</div>
                  <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
                  <p className="text-gray-500 mt-1">
                    {searchQuery 
                      ? `No orders match your search for "${searchQuery}"`
                      : filterStatus !== 'all'
                        ? `You don't have any ${filterStatus} orders`
                        : "You haven't placed any orders yet"}
                  </p>
                  <button 
                    className="mt-4 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white text-sm font-medium hover:bg-emerald-700"
                    onClick={() => window.location.href = '/shop'}
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                sortedOrders.map(order => (
                  <div 
                    key={order.id} 
                    className={`bg-white border ${selectedOrder?.id === order.id ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-gray-100'} rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer`}
                    onClick={() => setSelectedOrder(order)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">Order #{order.id}</h3>
                        <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                      </div>
                      <div>
                        <span 
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          <span className="mr-1">{getStatusIcon(order.status)}</span>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-3">
                      {order.items.slice(0, 2).map(item => (
                        <div key={`${order.id}-${item.id}`} className="flex items-center gap-3 bg-gray-50 rounded-md p-2 border border-gray-100">
                          <img className="w-12 h-12 rounded object-cover" src={item.image} alt={item.name} />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-xs text-gray-500">+{order.items.length - 2} more items</div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        <strong className="text-gray-900">Total:</strong> KSH {Number(order.total).toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === 'delivered' && (
                          <button 
                            className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
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
                            className="inline-flex items-center rounded-md border border-amber-300 text-amber-700 bg-amber-50 px-3 py-1.5 text-sm hover:bg-amber-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrder(order);
                            }}
                          >
                            Cancel
                          </button>
                        )}
                        <button 
                          className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrder(order);
                          }}
                        >
                          View Details
                        </button>
                        <button
                          className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                          onClick={(e) => { e.stopPropagation(); downloadReceiptOrCart(order); }}
                        >
                          {(['paid','completed','success','delivered'].includes((order.status||'').toLowerCase()) ? 'Download Receipt' : 'Download Cart PDF')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Order Details Sidebar */}
            {selectedOrder && (
              <div className="lg:col-span-1 bg-white border border-gray-100 rounded-xl shadow-sm p-5 sticky top-6 h-fit">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
                  <button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ×
                  </button>
                </div>

                <div className="mt-4 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Order Information</h3>
                    <div className="mt-2 space-y-2 text-sm text-gray-700">
                      <div className="flex items-center justify-between"><span className="text-gray-500">Order ID:</span><span>{selectedOrder.id}</span></div>
                      <div className="flex items-center justify-between"><span className="text-gray-500">Date:</span><span>{formatDate(selectedOrder.date)}</span></div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Status:</span>
                        <span 
                          className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white"
                          style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                        >
                          <span className="mr-1">{getStatusIcon(selectedOrder.status)}</span>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-500">Tracking:</span>
                          <a 
                            href={`https://tracking.example.com/?tracking=${selectedOrder.trackingNumber}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-700 hover:underline"
                          >
                            {selectedOrder.trackingNumber}
                          </a>
                        </div>
                      )}
                      {selectedOrder.cancelReason && (
                        <div className="flex items-center justify-between"><span className="text-gray-500">Cancel Reason:</span><span>{selectedOrder.cancelReason}</span></div>
                      )}
                      {selectedOrder.cancelledDate && (
                        <div className="flex items-center justify-between"><span className="text-gray-500">Cancelled On:</span><span>{formatDate(selectedOrder.cancelledDate)}</span></div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Items Ordered</h3>
                    <div className="mt-2 space-y-3">
                      {selectedOrder.items.map(item => (
                        <div key={`${selectedOrder.id}-${item.id}-detail`} className="flex items-center justify-between gap-3 p-2 rounded-md border border-gray-100 bg-gray-50">
                          <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded object-cover" src={item.image} alt={item.name} />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-900">KSH {(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}</div>
                        </div>
                      ))}
                    </div>
                    {(() => {
                      const computedSubtotal = selectedOrder.items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);
                      const displayedTotal = Number(selectedOrder.total || computedSubtotal);
                      return (
                        <div className="mt-3 space-y-2 text-sm">
                          <div className="flex items-center justify-between"><span className="text-gray-500">Subtotal:</span><span>KSH {computedSubtotal.toLocaleString()}</span></div>
                          <div className="flex items-center justify-between font-semibold"><span>Total to Pay:</span><span>KSH {displayedTotal.toLocaleString()}</span></div>
                        </div>
                      );
                    })()}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Shipping Information</h3>
                    <p className="mt-2 text-sm text-gray-700">{selectedOrder.shippingAddress}</p>
                    {selectedOrder.estimatedDelivery && (
                      <p className="text-sm text-gray-700"><strong>Estimated Delivery:</strong> {formatDate(selectedOrder.estimatedDelivery)}</p>
                    )}
                    {selectedOrder.actualDelivery && (
                      <p className="text-sm text-gray-700"><strong>Delivered on:</strong> {formatDate(selectedOrder.actualDelivery)}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button 
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => handleReorder(selectedOrder)}
                    >
                      🔄 Reorder Items
                    </button>
                    <button 
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => printOrder(selectedOrder)}
                    >
                      🖨️ Print Order
                    </button>
                    <button 
                      className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                      onClick={() => downloadReceiptOrCart(selectedOrder)}
                    >
                      📄 {(['paid','completed','success','delivered'].includes((selectedOrder.status||'').toLowerCase()) ? 'Download Receipt' : 'Download Cart PDF')}
                    </button>
                    {selectedOrder.status === 'delivered' && (
                      <button 
                        className="inline-flex items-center justify-center rounded-md border border-red-300 text-red-700 bg-red-50 px-3 py-1.5 text-sm hover:bg-red-100"
                        onClick={() => handleDeleteOrder(selectedOrder.id)}
                      >
                        <FaTrash style={{ marginRight: 6 }} /> Delete Order
                      </button>
                    )}
                    {(selectedOrder.status === 'processing' || selectedOrder.status === 'shipped') && (
                      <button 
                        className="inline-flex items-center justify-center rounded-md border border-amber-300 text-amber-700 bg-amber-50 px-3 py-1.5 text-sm hover:bg-amber-100"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowCancelModal(false)}>
            <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Order #{orderToCancel?.id}</h3>
              <p className="mt-2 text-sm text-gray-700">You're about to cancel this order. Are you sure you want to proceed?</p>
              <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">⚠️ This action cannot be undone. Any shipped items will need to be returned.</p>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button 
                  className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setShowCancelModal(false)}
                >
                  Keep Order
                </button>
                <button 
                  className="inline-flex items-center justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
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