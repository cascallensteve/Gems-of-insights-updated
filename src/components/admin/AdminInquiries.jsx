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
  const [dateRange, setDateRange] = useState('all'); // all | today | week | month
  const [sortOrder, setSortOrder] = useState('newest'); // newest | oldest
  const [phoneQuery, setPhoneQuery] = useState('');
  const { showError, showInfo, showSuccess } = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await apiService.contact.getAllContacts();
        const list = Array.isArray(data)
          ? data
          : (Array.isArray(data?.contacts) ? data.contacts : (Array.isArray(data?.results) ? data.results : []));
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
      const contact = data?.contact || data;
      if (contact) setSelected(contact); else showInfo('No details available for this inquiry');
    } catch (err) {
      showError(err?.detail || err?.message || 'Failed to load contact');
    }
  };

  const handleDownload = (e, c) => {
    e.stopPropagation();
    pdfService.printInquiry(c);
    showSuccess('Opening printable inquiry...');
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

  const inSelectedRange = (iso) => {
    if (!iso) return false;
    const d = new Date(iso);
    const now = new Date();
    if (dateRange === 'all') return true;
    if (dateRange === 'today') {
      const start = new Date(now);
      start.setHours(0,0,0,0);
      const end = new Date(now);
      end.setHours(23,59,59,999);
      return d >= start && d <= end;
    }
    if (dateRange === 'week') {
      const day = now.getDay();
      const diff = (day === 0 ? 6 : day - 1); // Monday as start
      const start = new Date(now);
      start.setDate(now.getDate() - diff);
      start.setHours(0,0,0,0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23,59,59,999);
      return d >= start && d <= end;
    }
    if (dateRange === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return d >= start && d <= end;
    }
    return true;
  };

  const normalizedPhoneIncludes = (value, query) => {
    const strip = (s) => (s || '').toString().replace(/\D+/g, '');
    return strip(value).includes(strip(query));
  };

  const filtered = (contacts || [])
    .filter(c => inSelectedRange(c.created_at))
    .filter(c => phoneQuery ? normalizedPhoneIncludes(c.phone_number || c.phone, phoneQuery) : true)
    .sort((a, b) => {
      const da = new Date(a.created_at || 0).getTime();
      const db = new Date(b.created_at || 0).getTime();
      return sortOrder === 'newest' ? db - da : da - db;
    });

  return (
    <div className="p-4">
      <div className="mb-3 text-sm font-semibold text-gray-900">Inquiries</div>
      {selected && (
        <div className="fixed inset-0 z-[10010] flex items-center justify-center bg-black/50" onClick={() => setSelected(null)}>
          <div className="w-full max-w-2xl rounded-xl border border-emerald-100 bg-white p-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">Inquiry #{selected.id} — {selected.full_name}</div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => pdfService.printInquiry(selected)}>Print</button>
                <button className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700" onClick={(e) => handleDelete(e, selected.id)}>Remove</button>
                <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
              <div><strong>Email:</strong> {selected.email}</div>
              <div><strong>Phone:</strong> {selected.phone_number}</div>
              <div className="sm:col-span-2"><strong>Subject:</strong> {selected.subject}</div>
            </div>
            <div className="mt-3 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
              {selected.message}
            </div>
          </div>
        </div>
      )}
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700" onClick={() => window.location.reload()}>Refresh</button>
          <button className="inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600" onClick={() => pdfService.printInquiriesList(filtered, 'Inquiries List')}>Print</button>
          <select className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <select className="rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input className="w-56 rounded-md border border-gray-300 px-3 py-1.5 text-sm" type="text" placeholder="Search by phone number" value={phoneQuery} onChange={(e) => setPhoneQuery(e.target.value)} />
        </div>
        {selected && (
          <>
            <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => pdfService.printInquiry(selected)}>Print Selected</button>
            <button className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700" onClick={(e) => handleDelete(e, selected.id)}>Delete Selected</button>
          </>
        )}
      </div>
      {/* Remove blocking/visible loading; content renders immediately */}
      {error && <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
      {!loading && !error && (
        <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-emerald-50 text-gray-900">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Full Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.length === 0 && (
                <tr>
                  <td className="px-3 py-2 text-center" colSpan="8">No inquiries yet.</td>
                </tr>
              )}
              {filtered.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-3 py-2">{c.id}</td>
                  <td className="px-3 py-2">{c.full_name}</td>
                  <td className="px-3 py-2">{c.email}</td>
                  <td className="px-3 py-2">{c.phone_number}</td>
                  <td className="px-3 py-2">{c.created_at ? new Date(c.created_at).toLocaleString() : ''}</td>
                  <td className="px-3 py-2">{c.subject}</td>
                  <td className="px-3 py-2">{c.message}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-1">
                      <button className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" onClick={(e) => handleView(e, c.id)}>View</button>
                      <button className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" onClick={(e) => handleDownload(e, c)}>Print</button>
                      <button className="inline-flex items-center rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700" onClick={(e) => handleDelete(e, c.id)}>Delete</button>
                    </div>
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


