import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaSpinner, FaTimes, FaGraduationCap } from 'react-icons/fa';
import apiService from '../services/api';
import './EnrollmentModal.css';
import { useAuth } from '../context/AuthContext';

const EnrollmentModal = ({ course, isOpen, onClose, onEnrollmentSuccess }) => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPhoneTo254 = (input) => {
    const raw = String(input || '').trim();
    if (!raw) return '';
    // Normalize to 2547XXXXXXXX format
    if (raw.startsWith('+')) {
      const r = raw.replace(/^\+/, '');
      if (r.startsWith('254')) return r;
      if (r.startsWith('07')) return `254${r.slice(1)}`;
      if (r.startsWith('7') && r.length === 9) return `254${r}`;
      return r;
    }
    if (raw.startsWith('254')) return raw;
    if (raw.startsWith('07')) return `254${raw.slice(1)}`;
    if (raw.startsWith('7') && raw.length === 9) return `254${raw}`;
    return raw;
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setMessage({ type: '', text: '' });
  };

  const formatKshPrice = (costInCents) => {
    if (!costInCents) return '0.00';
    const price = costInCents / 100;
    return price.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate phone number format
    if (!/^07\d{8}$/.test(formData.phone.trim())) {
      showMessage('error', 'Phone number must start with 07 and be 10 digits');
      return;
    }
    
    setLoading(true);

    try {
      const response = await apiService.courses.enrollInCourse(course.id, formData);
      showMessage('success', response.message);
      
      // Store enrollment data for admin panel
      const enrollmentData = {
        id: Date.now(), // Generate unique ID
        enrollment_id: response?.enrollment_id || Date.now(),
        course_id: course.id,
        course_title: course.title,
        student: formData.name,
        email: formData.email,
        phone: formData.phone,
        created_at: new Date().toISOString(),
        status: 'active'
      };
      
      // Get existing enrollments and add new one
      const existingEnrollments = localStorage.getItem('courseEnrollments');
      let allEnrollments = [];
      
      if (existingEnrollments) {
        try {
          allEnrollments = JSON.parse(existingEnrollments);
        } catch (e) {
          console.error('Error parsing existing enrollments:', e);
        }
      }
      
      allEnrollments.push(enrollmentData);
      localStorage.setItem('courseEnrollments', JSON.stringify(allEnrollments));

      // Initiate payment immediately after enrollment
      const amountCents = Number(course?.cost || 0);
      const amountKes = Math.round(amountCents / 100);
      const phone254 = formatPhoneTo254(formData.phone);
      try {
        const payRes = await apiService.payments.initiateEnrollmentPayment({
          enrollmentId: enrollmentData.enrollment_id,
          amount: amountKes || 1,
          phone: phone254,
          productType: 'course'
        });

        // Persist a minimal payment record for admin view
        const paymentRecord = {
          id: Date.now(),
          enrollment_id: enrollmentData.enrollment_id,
          course_id: course.id,
          amount: amountKes || 1,
          phone: phone254,
          checkout_request_id: payRes.checkout_request_id,
          merchant_request_id: payRes.merchant_request_id,
          response_code: payRes.response_code,
          success: payRes.success === true,
          created_at: new Date().toISOString(),
          status: payRes.success ? 'pending' : 'failed'
        };
        const existingTx = JSON.parse(localStorage.getItem('coursePayments') || '[]');
        existingTx.push(paymentRecord);
        localStorage.setItem('coursePayments', JSON.stringify(existingTx));

        if (payRes.success) {
          showMessage('success', 'Payment initiated. Check your phone to complete the STK push.');
        } else {
          showMessage('error', 'Payment initiation failed. Please try again.');
        }
      } catch (payErr) {
        console.error('Payment initiation error:', payErr);
        showMessage('error', 'Could not initiate payment. Please try again later.');
      }
      
      console.log('Stored enrollment data from modal:', enrollmentData);
      
      // Call success callback to trigger notifications
      if (onEnrollmentSuccess) {
        onEnrollmentSuccess({
          course: course,
          student: formData,
          enrollment: response.enrollment
        });
      }
      
      // Keep modal open a bit to show payment status
      setTimeout(() => {
        resetForm();
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Enrollment error:', error);
      showMessage('error', error.message || 'Failed to enroll in course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Prefill from logged-in user when modal opens
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || `${currentUser.firstName || currentUser.first_name || ''} ${currentUser.lastName || currentUser.last_name || ''}`.trim(),
        email: prev.email || currentUser.email || '',
        phone: prev.phone || currentUser.phone || currentUser.phone_number || ''
      }));
    }
  }, [isOpen, currentUser]);

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !course) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <div className="enrollment-modal">
        <div className="enrollment-modal-header">
          <div className="header-content">
            <FaGraduationCap className="header-icon" />
            <div>
              <h2>Enroll in Course</h2>
              <p className="course-name">{course.title}</p>
            </div>
          </div>
          <button className="modal-close" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="enrollment-modal-body">
          <div className="course-summary">
            {course.banner && (
              <img 
                src={course.banner} 
                alt={course.title}
                className="course-thumbnail"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=120&fit=crop';
                }}
              />
            )}
            <div className="course-info">
              <div className="price-badge">
                KSh {course.price || (course.cost ? formatKshPrice(course.cost) : '0.00')}
              </div>
              <p className="instructor">By {course.instructor || 'Expert Instructor'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="enrollment-form">
            {message.text && (
              <div className={`form-message ${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-wrapper">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <div className="input-wrapper">
                <FaPhone className="input-icon" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="07XXXXXXXX (10 digits starting with 07)"
                  pattern="07[0-9]{8}"
                  maxLength="10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="enrollment-terms">
              <p>By enrolling in this course, you agree to our terms and conditions. You will receive course access details via email after enrollment.</p>
            </div>

            <div className="enrollment-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary enrollment-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="loading-spinner" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <FaGraduationCap />
                    Complete Enrollment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
