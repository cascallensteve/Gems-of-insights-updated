import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import apiService from '../../services/api';
import pdfService from '../../services/pdfService';
import { useToast } from '../../context/ToastContext';

const AdminInquiries = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selected, setSelected] = useState(null);
  const { showError, showInfo, showSuccess } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiService.contact.getAllContacts();
        const list = Array.isArray(data?.contacts) ? data.contacts : [];
        const hidden = new Set(JSON.parse(localStorage.getItem('adminContactsHidden') || '[]'));
        setContacts(list.filter(c => !hidden.has(c.id)));
      } catch (e) {
        setError(e?.detail || e?.message || 'Failed to fetch contacts');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleView = async (e, id) => {
    e.stopPropagation();
    try {
      const data = await apiService.contact.getContactById(id);
      if (data?.contact) {
        setSelected(data.contact);
      } else {
        showInfo('No details available for this inquiry');
      }
    } catch (err) {
      showError(err?.detail || err?.message || 'Failed to load contact');
    }
  };

  const handleDownload = (e, c) => {
    e.stopPropagation();
    pdfService.downloadInquiryPDF(c);
    showSuccess('Downloading inquiry PDF...');
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    const stored = JSON.parse(localStorage.getItem('adminContactsHidden') || '[]');
    if (!stored.includes(id)) stored.push(id);
    localStorage.setItem('adminContactsHidden', JSON.stringify(stored));
    setContacts(prev => prev.filter(x => x.id !== id));
    if (selected?.id === id) setSelected(null);
    showSuccess('Inquiry removed from the list');
  };

  return (
    <div className="admin-inquiries">
      <h2>Inquiries</h2>
      {selected && (
        <div className="inquiry-detail-card" style={{ marginBottom: 14 }}>
          <div className="detail-header">
            <div className="detail-title">{selected.full_name}</div>
            <div className="detail-actions">
              <button className="btn btn-sm" onClick={() => pdfService.downloadInquiryPDF(selected)}>Download PDF</button>
              <button className="btn btn-sm btn-danger" onClick={(e) => handleDelete(e, selected.id)}>Remove</button>
              <button className="btn btn-sm" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
          <div className="detail-grid">
            <div><strong>Email:</strong> {selected.email}</div>
            <div><strong>Phone:</strong> {selected.phone_number}</div>
            <div><strong>Subject:</strong> {selected.subject}</div>
          </div>
          <div className="detail-message">
            {selected.message}
          </div>
        </div>
      )}
      <div className="admin-controls" style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <button className="btn btn-danger" onClick={() => window.location.reload()}>Refresh</button>
        <button className="btn btn-primary" onClick={() => pdfService.downloadInquiriesListPDF(contacts, 'Inquiries List')}>Download PDF</button>
        {selected && (
          <>
            <button className="btn btn-secondary" onClick={() => pdfService.downloadInquiryPDF(selected)}>Download Selected</button>
            <button className="btn btn-danger" onClick={(e) => handleDelete(e, selected.id)}>Delete Selected</button>
          </>
        )}
      </div>
      {loading && <div className="admin-table-status">Loading...</div>}
      {error && <div className="admin-table-error">{error}</div>}
      {!loading && !error && (
        <div className="admin-table-wrapper">
          <table className="admin-table" cellSpacing="0" cellPadding="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>No inquiries yet.</td>
                </tr>
              )}
              {contacts.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)} style={{ cursor: 'pointer' }}>
                  <td>{c.id}</td>
                  <td>{c.full_name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone_number}</td>
                  <td>{c.subject}</td>
                  <td>{c.message}</td>
                  <td>
                    <button className="btn btn-sm" onClick={(e) => handleView(e, c.id)}>View</button>
                    <button className="btn btn-sm" onClick={(e) => handleDownload(e, c)}>PDF</button>
                    <button className="btn btn-sm btn-danger" onClick={(e) => handleDelete(e, c.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Handlers moved inside component scope to use toasts and state
const handleView = async (e, id) => {};
const handleDownload = (e, c) => {};
const handleDelete = (e, id) => {};

export default AdminInquiries;


