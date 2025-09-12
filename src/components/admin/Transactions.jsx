import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { HiArrowDownTray, HiBanknotes, HiCheckCircle, HiDocumentArrowDown, HiEllipsisHorizontalCircle, HiExclamationCircle, HiMagnifyingGlass, HiXCircle } from 'react-icons/hi2';
import apiService from '../../services/api';
import pdfService from '../../services/pdfService';
import './Transactions.css';

const formatCurrency = (amount) => {
  const n = Number(amount || 0);
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES' }).format(n);
};

const getPayerName = (t) => {
  const first = t?.order?.user?.first_name;
  const last = t?.order?.user?.last_name;
  const name = [first, last].filter(Boolean).join(' ').trim();
  return name || t?.order?.user?.email || '—';
};

const formatDateTime = (d) => {
  try {
    return new Date(d).toLocaleString();
  } catch {
    return 'N/A';
  }
};

const StatusBadge = ({ status }) => {
  const s = String(status || 'pending').toLowerCase();
  const map = {
    success: { className: 'tx-badge success', icon: <HiCheckCircle /> },
    failed: { className: 'tx-badge failed', icon: <HiXCircle /> },
    pending: { className: 'tx-badge pending', icon: <HiEllipsisHorizontalCircle /> }
  };
  const cfg = map[s] || map.pending;
  return <span className={cfg.className}>{cfg.icon}<span>{s}</span></span>;
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');
  const [transactionDetail, setTransactionDetail] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiService.payments.getAllTransactions();
        const list = Array.isArray(res?.transactions) ? res.transactions : (Array.isArray(res) ? res : []);
        setTransactions(list);
      } catch (e) {
        setError(typeof e === 'string' ? e : (e?.detail || e?.message || 'Failed to load transactions'));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter(t => {
      const matchesStatus = status === 'all' || String(t.status || '').toLowerCase() === status.toLowerCase();
      const values = [
        t.id,
        t.phone_number,
        getPayerName(t),
        t?.order?.user?.email,
        t.amount,
        t.mpesa_receipt_number,
        t.checkout_request_id,
        t.merchant_request_id
      ]
        .map(v => String(v ?? '').toLowerCase());
      const matchesSearch = !q || values.some(v => v.includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [transactions, search, status]);

  const downloadCSV = () => {
    const headers = ['ID','Checkout Request','Merchant Request','Phone','Name','Amount','Status','Receipt','Transaction Date'];
    const rows = filtered.map(t => [
      t.id,
      t.checkout_request_id || '',
      t.merchant_request_id || '',
      t.phone_number || '',
      getPayerName(t) || '',
      t.amount || '',
      t.status || '',
      t.mpesa_receipt_number || '',
      t.transaction_date || ''
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const openDetails = async (transactionId) => {
    try {
      setDetailError('');
      setDetailLoading(true);
      setDetailOpen(true);
      const res = await apiService.payments.getTransactionDetails(transactionId);
      // Response shape: { message, transaction }
      setTransactionDetail(res?.transaction || res || null);
    } catch (e) {
      setDetailError(typeof e === 'string' ? e : (e?.detail || e?.message || 'Failed to fetch details'));
      setTransactionDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetails = () => {
    setDetailOpen(false);
    setTransactionDetail(null);
    setDetailError('');
  };

  return (
    <div className="tx-page">
      <div className="tx-header">
        <div className="tx-title-wrap">
          <h2><HiBanknotes /> Payments & Transactions</h2>
          <p>View all M-Pesa payment transactions across orders</p>
        </div>
        <div className="tx-actions">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="tx-btn" onClick={downloadCSV}>
            <HiArrowDownTray /> Export CSV
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="tx-btn alt" onClick={downloadCSV}>
            <HiDocumentArrowDown /> Download
          </motion.button>
        </div>
      </div>

      <div className="tx-filters">
        <div className="tx-search">
          <HiMagnifyingGlass />
          <input placeholder="Search ID, phone, receipt..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        </div>
        <select value={status} onChange={(e)=>setStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div className="tx-loading">Loading transactions...</div>
      ) : error ? (
        <div className="tx-error"><HiExclamationCircle /> {error}</div>
      ) : filtered.length === 0 ? (
        <div className="tx-empty">No transactions found.</div>
      ) : (
        <div className="tx-table-wrap">
          <table className="tx-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Phone</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Receipt</th>
                <th>Checkout</th>
                <th>Merchant</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id}>
                  <td data-label="ID">{t.id}</td>
                  <td data-label="Phone">{t.phone_number || '—'}</td>
                  <td data-label="Name">{getPayerName(t)}</td>
                  <td data-label="Amount">{formatCurrency(t.amount)}</td>
                  <td data-label="Status"><StatusBadge status={t.status} /></td>
                  <td data-label="Receipt">{t.mpesa_receipt_number || '—'}</td>
                  <td data-label="Checkout">{t.checkout_request_id || '—'}</td>
                  <td data-label="Merchant">{t.merchant_request_id || '—'}</td>
                  <td data-label="Date">{formatDateTime(t.transaction_date)}</td>
                  <td>
                    <button className="tx-link" onClick={() => openDetails(t.id)}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {detailOpen && (
        <div className="tx-modal-overlay" onClick={closeDetails}>
          <div className="tx-modal" onClick={(e)=>e.stopPropagation()}>
            <div className="tx-modal-header">
              <h3>Transaction Details</h3>
              <button className="tx-close" onClick={closeDetails}>×</button>
            </div>
            <div className="tx-modal-body">
              {detailLoading ? (
                <div className="tx-loading">Loading...</div>
              ) : detailError ? (
                <div className="tx-error"><HiExclamationCircle /> {detailError}</div>
              ) : transactionDetail ? (
                <div className="tx-detail-grid">
                  <div>
                    <strong>ID:</strong> {transactionDetail.id}
                  </div>
                  <div>
                    <strong>Status:</strong> {transactionDetail.status}
                  </div>
                  <div>
                    <strong>Amount:</strong> {formatCurrency(transactionDetail.amount)}
                  </div>
                  <div>
                    <strong>Phone:</strong> {transactionDetail.phone_number || '—'}
                  </div>
                  <div>
                    <strong>Receipt:</strong> {transactionDetail.mpesa_receipt_number || '—'}
                  </div>
                  <div>
                    <strong>Checkout:</strong> {transactionDetail.checkout_request_id || '—'}
                  </div>
                  <div>
                    <strong>Merchant:</strong> {transactionDetail.merchant_request_id || '—'}
                  </div>
                  <div>
                    <strong>Date:</strong> {formatDateTime(transactionDetail.transaction_date)}
                  </div>
                  <div className="tx-section">
                    <h4>Order</h4>
                    <div><strong>Order ID:</strong> {transactionDetail.order?.id ?? '—'}</div>
                    <div><strong>Status:</strong> {transactionDetail.order?.status ?? '—'}</div>
                  </div>
                  <div className="tx-section">
                    <h4>User</h4>
                    <div>
                      <strong>Name:</strong> {[
                        transactionDetail.order?.user?.first_name,
                        transactionDetail.order?.user?.last_name
                      ].filter(Boolean).join(' ') || '—'}
                    </div>
                    <div><strong>Email:</strong> {transactionDetail.order?.user?.email || '—'}</div>
                    <div><strong>User Type:</strong> {transactionDetail.order?.user?.userType || '—'}</div>
                    <div><strong>Verified:</strong> {transactionDetail.order?.user?.is_email_verified ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              ) : (
                <div className="tx-empty">No details.</div>
              )}
            </div>
            {!detailLoading && transactionDetail && (
              <div className="tx-modal-footer">
                <button className="tx-btn" onClick={() => pdfService.printTransactionReceipt(transactionDetail)}>Print</button>
                <button className="tx-btn alt" onClick={() => pdfService.downloadTransactionPDF(transactionDetail)}>Download PDF</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;


