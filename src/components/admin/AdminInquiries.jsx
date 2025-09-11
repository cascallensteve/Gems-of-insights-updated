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

  return (
    <div className="p-4">
      <div className="mb-3 text-sm font-semibold text-gray-900">Inquiries</div>
      {selected && (
        <div className="mb-3 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">{selected.full_name}</div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => pdfService.printInquiry(selected)}>Print</button>
              <button className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700" onClick={(e) => handleDelete(e, selected.id)}>Remove</button>
              <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 text-sm text-gray-700 sm:grid-cols-2">
            <div><strong>Email:</strong> {selected.email}</div>
            <div><strong>Phone:</strong> {selected.phone_number}</div>
            <div className="sm:col-span-2"><strong>Subject:</strong> {selected.subject}</div>
          </div>
          <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
            {selected.message}
          </div>
        </div>
      )}
      <div className="mb-3 flex items-center gap-2">
        <button className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700" onClick={() => window.location.reload()}>Refresh</button>
        <button className="inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600" onClick={() => pdfService.printInquiriesList(contacts, 'Inquiries List')}>Print All</button>
        {selected && (
          <>
            <button className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={() => pdfService.printInquiry(selected)}>Print Selected</button>
            <button className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700" onClick={(e) => handleDelete(e, selected.id)}>Delete Selected</button>
          </>
        )}
      </div>
      {loading && <div className="rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-700">Loading...</div>}
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
                <th className="px-3 py-2">Subject</th>
                <th className="px-3 py-2">Message</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.length === 0 && (
                <tr>
                  <td className="px-3 py-2 text-center" colSpan="6">No inquiries yet.</td>
                </tr>
              )}
              {contacts.map(c => (
                <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer hover:bg-gray-50">
                  <td className="px-3 py-2">{c.id}</td>
                  <td className="px-3 py-2">{c.full_name}</td>
                  <td className="px-3 py-2">{c.email}</td>
                  <td className="px-3 py-2">{c.phone_number}</td>
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


