import React, { useState, useEffect } from 'react';
import { FaCalendar, FaClock, FaUser, FaPhone, FaEnvelope, FaStickyNote, FaCheck, FaTimes, FaEye, FaFilter, FaDownload, FaFilePdf, FaFileAlt, FaTrash } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import pdfService from '../../services/pdfService';
// Tailwind conversion: removed './AdminAppointments.css'

const AdminAppointments = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, cancelled
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  // Removed mock data - using only real API data

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('userData');
        
        console.log('🔑 Authentication Debug:');
        console.log('- Token exists:', token ? 'YES' : 'NO');
        console.log('- Token preview:', token ? token.substring(0, 20) + '...' : 'N/A');
        console.log('- UserData exists:', userData ? 'YES' : 'NO');
        
        if (userData) {
          try {
            const user = JSON.parse(userData);
            console.log('- User role:', user.role || 'Not specified');
            console.log('- User email:', user.email || 'Not specified');
            console.log('- Is admin:', user.is_admin || user.role === 'admin' ? 'YES' : 'NO');
          } catch (e) {
            console.log('- UserData parse error:', e);
          }
        }
        
        if (!token) {
          throw new Error('Authentication token not found. Please login as admin first.');
        }

        console.log('🌐 Making API request to:', api.defaults.baseURL + '/bookings/appointment-list');
        console.log('📡 API base URL:', api.defaults.baseURL);

        // Use the api service as designed - it handles Token header properly
        console.log('📤 Using API service with Token header...');
        
        // Set token in correct Django REST Framework format
        api.defaults.headers.common['Authorization'] = `Token ${token}`;
        console.log('✅ Authorization header set correctly');

        let data;
        try {
          console.log('🔄 Attempting API service request...');
          const response = await api.get('/bookings/appointment-list');
          data = response.data;
          console.log('✅ API service request successful');
        } catch (apiError) {
          console.log('⚠️ API service failed, trying direct fetch as fallback...');
          console.log('API Error:', apiError);
          
          // Fallback: direct fetch with query parameter to bypass CORS
          const response = await fetch(`https://gems-of-truth.vercel.app/bookings/appointment-list?token=${encodeURIComponent(token)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.log('❌ Fallback HTTP Error Details:');
            console.log('- Status:', response.status);
            console.log('- Status Text:', response.statusText);
            console.log('- Response Body:', errorText);
            
            if (response.status === 403) {
              throw new Error('Access Forbidden: The API server may not support query parameter authentication. Please contact the developer to fix CORS settings.');
            }
            
            throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
          }

          data = await response.json();
        }
        
        console.log('📋 Appointments API Response:', data);
        console.log('📊 Number of appointments received:', data.appointments?.length || 0);

        if (!data.appointments) {
          console.warn('⚠️ No appointments array in response:', data);
        }

        // Process appointments and add status based on date
        const processedAppointments = (data.appointments || []).map(appointment => {
          const processed = {
            ...appointment,
            created_at: appointment.timestamp || new Date().toISOString(),
            status: getAppointmentStatus(appointment)
          };
          console.log('🔄 Processed appointment:', processed);
          return processed;
        });

        console.log('✅ Total processed appointments:', processedAppointments.length);
        setAppointments(processedAppointments);
      } catch (error) {
        console.error('❌ Error fetching appointments:', error);
        console.error('❌ Error details:', {
          message: error.message,
          response: error.response,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });

        let errorMessage = 'Network Error';
        
        if (error.response) {
          // Server responded with error status
          errorMessage = `Server Error ${error.response.status}: ${error.response.statusText}`;
          if (error.response.data?.message) {
            errorMessage += ` - ${error.response.data.message}`;
          }
        } else if (error.request) {
          // Request was made but no response received
          errorMessage = 'No response from server. Please check your internet connection and API server status.';
        } else {
          // Something else happened
          errorMessage = error.message || 'Unknown error occurred';
        }
        
        setError(errorMessage);
        setAppointments([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Helper function to determine appointment status
  const getAppointmentStatus = (appointment) => {
    const appointmentDate = new Date(appointment.preferred_date);
    const today = new Date();
    
    // If appointment is in the past, mark as completed or cancelled
    if (appointmentDate < today) {
      return 'completed';
    }
    
    // Default to pending for future appointments
    return 'pending';
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesFilter = filter === 'all' || appointment.status === filter;
    const matchesSearch = appointment.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.health_concern.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const fetchAppointmentDetails = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Use the api service with correct Authorization header
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      const response = await api.get(`/bookings/appointment-detail/${appointmentId}/`);
      const data = response.data;

      return {
        ...data.appointment,
        created_at: data.appointment.timestamp || new Date().toISOString(),
        status: getAppointmentStatus(data.appointment)
      };
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      throw error;
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      // Note: API doesn't have status update endpoint, so we'll update locally
      // TODO: Add status update API endpoint if needed
      
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );

      // Update selected appointment if it's currently shown in modal
      if (selectedAppointment && selectedAppointment.id === appointmentId) {
        setSelectedAppointment(prev => ({ ...prev, status: newStatus }));
      }

      // Show success message
      alert(`Appointment ${newStatus} successfully!`);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Error updating appointment status');
    }
  };

  const handleViewDetails = async (appointment) => {
    try {
      setSelectedAppointment(appointment);
      setShowModal(true);
      
      // Optionally fetch detailed appointment data
      // const detailedAppointment = await fetchAppointmentDetails(appointment.id);
      // setSelectedAppointment(detailedAppointment);
    } catch (error) {
      console.error('Error viewing appointment details:', error);
      setSelectedAppointment(appointment);
      setShowModal(true);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Health Concern', 'Date', 'Time', 'Status', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...filteredAppointments.map(apt => [
        apt.full_name,
        apt.email,
        apt.phone_no,
        apt.health_concern,
        apt.preferred_date,
        apt.preferred_time,
        apt.status,
        `"${apt.additional_notes || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'appointments.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Download individual appointment as PDF
  const downloadAppointmentPDF = (appointment) => {
    try {
      pdfService.printAppointment(appointment);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Download all appointments as PDF
  const downloadAllAppointmentsPDF = () => {
    console.log('📄 Download All PDF clicked');
    console.log('📊 Filtered appointments count:', filteredAppointments.length);
    console.log('📋 Appointments data:', filteredAppointments);
    
    if (filteredAppointments.length === 0) {
      alert('No appointments to download');
      return;
    }
    
    try {
      const title = filter === 'all' ? 'All Appointments' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`;
      console.log('📄 Generating print with title:', title);
      pdfService.printAppointmentsList(filteredAppointments, title);
      console.log('✅ Print generation completed');
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Download filtered appointments as PDF
  const downloadFilteredAppointmentsPDF = () => {
    console.log('📄 Download Filtered PDF clicked');
    console.log('🔍 Current filter:', filter);
    console.log('📊 Filtered appointments count:', filteredAppointments.length);
    
    if (filteredAppointments.length === 0) {
      alert('No appointments to download');
      return;
    }
    
    try {
      console.log('📄 Generating filtered print...');
      pdfService.printAppointmentsList(filteredAppointments, `${filter.charAt(0).toUpperCase() + filter.slice(1)} Appointments`);
      console.log('✅ Filtered print generation completed');
    } catch (error) {
      console.error('❌ Error generating filtered PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  // Download today's appointments as PDF
  const downloadTodayAppointmentsPDF = () => {
    console.log('📄 Download Today\'s PDF clicked');
    const today = new Date().toISOString().split('T')[0];
    console.log('📅 Today\'s date:', today);
    
    const todayAppointments = appointments.filter(apt => 
      apt.preferred_date === today
    );
    
    console.log('📊 Today\'s appointments count:', todayAppointments.length);
    console.log('📋 Today\'s appointments:', todayAppointments);
    
    if (todayAppointments.length === 0) {
      alert('No appointments scheduled for today');
      return;
    }
    
    try {
      console.log('📄 Generating today\'s print...');
      pdfService.printAppointmentsList(todayAppointments, "Today's Appointments");
      console.log('✅ Today\'s print generation completed');
    } catch (error) {
      console.error('❌ Error generating today\'s PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const formatTime = (time24h) => {
    const [hours, minutes] = time24h.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Pending' },
      confirmed: { class: 'badge-success', text: 'Confirmed' },
      cancelled: { class: 'badge-danger', text: 'Cancelled' },
      completed: { class: 'badge-info', text: 'Completed' }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="grid place-items-center rounded-xl border border-emerald-100 bg-white p-6 text-sm text-gray-700 shadow-sm">Loading...</div>
      </div>
    );
  }

  if (error && appointments.length === 0) {
    return (
      <div className="p-4">
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <div className="font-semibold">❌ Error Loading Appointments</div>
          <p>{error}</p>
          <button className="mt-2 inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-appointments">
      {/* Header Section */}
      <div className="appointments-header">
        <div className="appointments-header__left">
          <h2>Appointments Management</h2>
          <p>Manage and track patient appointments</p>
        </div>
        <div className="appointments-header__right">
          <button className="btn btn-secondary" onClick={() => {
            console.log('🧪 Full Debug Info:');
            console.log('🔑 Token:', localStorage.getItem('token'));
            console.log('👤 UserData:', localStorage.getItem('userData'));
            console.log('🌐 API Base URL:', api.defaults.baseURL);
            console.log('👨‍💼 Current User:', currentUser);
            console.log('📍 All localStorage keys:', Object.keys(localStorage));
            
            // Try to parse userData
            const userData = localStorage.getItem('userData');
            if (userData) {
              try {
                const parsed = JSON.parse(userData);
                console.log('👤 Parsed User Data:', parsed);
              } catch (e) {
                console.log('❌ Error parsing userData:', e);
              }
            }
            window.location.reload();
          }}>
            🔄 Debug & Refresh
          </button>
          <button className="btn btn-primary" onClick={downloadAllAppointmentsPDF}>
            <FaFilePdf /> All PDF
          </button>
          <button className="btn btn-info" onClick={downloadFilteredAppointmentsPDF}>
            <FaFilePdf /> Filtered PDF
          </button>
          <button className="btn btn-success" onClick={downloadTodayAppointmentsPDF}>
            <FaFilePdf /> Today's PDF
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <FaDownload /> Export CSV
          </button>
          <button className="btn btn-warning" onClick={() => {
            console.log('🧪 Testing PDF Service...');
            console.log('📊 Appointments available:', appointments.length);
            console.log('📋 PDF Service available:', typeof pdfService);
            console.log('📄 PDF Service methods:', Object.keys(pdfService));
          }}>
            🧪 Test PDF
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="appointments-stats">
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{appointments.filter(a => a.status === 'pending').length}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card__icon pending">
            <FaClock />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{appointments.filter(a => a.status === 'confirmed').length}</h3>
            <p>Confirmed</p>
          </div>
          <div className="stat-card__icon confirmed">
            <FaCheck />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{appointments.filter(a => a.status === 'completed').length}</h3>
            <p>Completed</p>
          </div>
          <div className="stat-card__icon completed">
            <FaCheck />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{appointments.length}</h3>
            <p>Total</p>
          </div>
          <div className="stat-card__icon total">
            <FaCalendar />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="appointments-controls">
                 <div className="appointments-controls__left">
           <select
             value={filter}
             onChange={(e) => setFilter(e.target.value)}
             className="filter-select"
           >
             <option value="all">All Appointments</option>
             <option value="pending">Pending</option>
             <option value="confirmed">Confirmed</option>
             <option value="completed">Completed</option>
             <option value="cancelled">Cancelled</option>
           </select>
           
           {/* PDF download buttons */}
           <button
             className="btn btn-primary"
             onClick={downloadAllAppointmentsPDF}
             title="Download All Appointments as PDF"
           >
             <FaFilePdf /> Download All PDF
           </button>
           
           <button
             className="btn btn-secondary"
             onClick={exportToCSV}
             title="Download Filtered Appointments as CSV"
           >
             <FaDownload /> Download CSV
           </button>
        </div>
        <div className="appointments-controls__right">
          <input
            type="text"
            placeholder="Search by name, email, or concern..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Appointments Table */}
      <div className="appointments-table-container">
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Contact</th>
              <th>Health Concern</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(appointment => (
              <tr key={appointment.id}>
                <td>
                  <div className="patient-info">
                    <div className="patient-avatar">
                      <FaUser />
                    </div>
                    <div>
                      <strong>{appointment.full_name}</strong>
                      <span className="booking-date">
                        Booked: {new Date(appointment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <div><FaEnvelope /> {appointment.email}</div>
                    <div><FaPhone /> {appointment.phone_no}</div>
                  </div>
                </td>
                <td>
                  <span className="health-concern">{appointment.health_concern}</span>
                </td>
                <td>
                  <div className="datetime-info">
                    <div><FaCalendar /> {formatDate(appointment.preferred_date)}</div>
                    <div><FaClock /> {formatTime(appointment.preferred_time)}</div>
                  </div>
                </td>
                <td>
                  {getStatusBadge(appointment.status)}
                </td>
                <td>
                  <div className="action-buttons">
                                         <button
                       className="btn btn-sm btn-outline"
                       onClick={() => handleViewDetails(appointment)}
                       title="View Details"
                     >
                       <FaEye />
                     </button>
                     
                     {/* Individual PDF download button */}
                     <button
                       className="btn btn-sm btn-info"
                       onClick={() => downloadAppointmentPDF(appointment)}
                       title="Download as PDF"
                     >
                       <FaFilePdf />
                     </button>
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                          title="Confirm"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                          title="Cancel"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                        title="Mark as Completed"
                      >
                        ✅
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAppointments.length === 0 && !loading && (
          <div className="no-appointments">
            <FaCalendar size={48} />
            <h3>No appointments found</h3>
            <p>{error ? 'Unable to load appointments. Please check your connection and try again.' : 'No appointments match your current filters.'}</p>
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

      {/* Appointment Details Modal */}
      {showModal && selectedAppointment && (
        <div className="appointments-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Appointment Details</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="appointment-details">
                <div className="detail-row">
                  <label>Patient Name:</label>
                  <span>{selectedAppointment.full_name}</span>
                </div>
                <div className="detail-row">
                  <label>Email:</label>
                  <span>{selectedAppointment.email}</span>
                </div>
                <div className="detail-row">
                  <label>Phone:</label>
                  <span>{selectedAppointment.phone_no}</span>
                </div>
                <div className="detail-row">
                  <label>Health Concern:</label>
                  <span>{selectedAppointment.health_concern}</span>
                </div>
                <div className="detail-row">
                  <label>Preferred Date:</label>
                  <span>{formatDate(selectedAppointment.preferred_date)}</span>
                </div>
                <div className="detail-row">
                  <label>Preferred Time:</label>
                  <span>{formatTime(selectedAppointment.preferred_time)}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span>{getStatusBadge(selectedAppointment.status)}</span>
                </div>
                <div className="detail-row">
                  <label>Booking Date:</label>
                  <span>{new Date(selectedAppointment.created_at).toLocaleString()}</span>
                </div>
                {selectedAppointment.additional_notes && (
                  <div className="detail-row full-width">
                    <label><FaStickyNote /> Additional Notes:</label>
                    <div className="notes-content">
                      {selectedAppointment.additional_notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-info"
                onClick={() => {
                  downloadAppointmentPDF(selectedAppointment);
                }}
                title="Download as PDF"
              >
                <FaFilePdf /> Download PDF
              </button>
              {selectedAppointment.status === 'pending' && (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={() => {
                      handleStatusUpdate(selectedAppointment.id, 'confirmed');
                      setShowModal(false);
                    }}
                  >
                    <FaCheck /> Confirm Appointment
                  </button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => {
                      handleStatusUpdate(selectedAppointment.id, 'cancelled');
                      setShowModal(false);
                    }}
                  >
                    <FaTimes /> Cancel Appointment
                  </button>
                </>
              )}
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;
