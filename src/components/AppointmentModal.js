import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import './AppointmentModal.css';
// import { ArrowLeft, ArrowRight, CalendarCheck } from "lucide-react";

const AppointmentModal = ({ isOpen, onClose }) => {
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    specialist: '',
    date: '',
    time: '',
    concern: '',
    notes: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  const services = [
    { id: 'nutrition', name: 'Nutrition Consultation', price: 'KSH 2,500', duration: '30 min' },
    { id: 'herbal', name: 'Herbal Medicine', price: 'KSH 3,000', duration: '45 min' },
    { id: 'wellness', name: 'Wellness Coaching', price: 'KSH 2,000', duration: '30 min' },
    { id: 'initial', name: 'Initial Consultation', price: 'Free', duration: '15 min' }
  ];

  const specialists = [
    { id: 'sarah', name: 'Dr.Denzel Odiwuor', specialty: 'Nutritionist', available: true },
    { id: 'james', name: 'Dr.Elisha Achiando', specialty: 'Herbal Medicine', available: true },
    
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const healthConcerns = [
    'Weight Management',
    'Digestive Issues',
    'Chronic Fatigue',
    'Stress & Anxiety',
    'Heart Health',
    'Joint Pain',
    'Sleep Problems',
    'Immune Support',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow numbers and + at the beginning
      const cleanValue = value.replace(/[^\d+]/g, '');
      
      // Ensure it starts with +254 for Kenya
      let formattedValue = cleanValue;
      if (cleanValue && !cleanValue.startsWith('+254')) {
        if (cleanValue.startsWith('0')) {
          // Remove leading 0 and add +254
          formattedValue = '+254' + cleanValue.substring(1);
        } else if (cleanValue.startsWith('254')) {
          // Add + if missing
          formattedValue = '+' + cleanValue;
        } else if (!cleanValue.startsWith('+')) {
          // Add +254 prefix
          formattedValue = '+254' + cleanValue;
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    // Allow navigation to completed steps or current step
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };
// Convert 12-hour time format to 24-hour format for API
const convertTo24Hour = (time12h) => {
  if (!time12h) return "";
  
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (period === 'PM' && hours !== '12') {
    hours = String(parseInt(hours) + 12);
  } else if (period === 'AM' && hours === '12') {
    hours = '00';
  }
  
  return `${hours.padStart(2, '0')}:${minutes}:00`;
};

// Format phone number to ensure consistency
const formatPhoneNumber = (phone) => {
  if (!phone) return "";
  
  // Remove any non-digit characters except + at the beginning
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  
  // If it doesn't start with +, add +254 prefix for Kenya
  if (!cleanPhone.startsWith('+')) {
    // Remove leading 0 if present for Kenyan numbers
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    cleanPhone = '+254' + cleanPhone;
  }
  
  return cleanPhone;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const requestData = {
    full_name: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    phone_no: formatPhoneNumber(formData.phone),
    health_concern: formData.concern,
    preferred_date: formData.date,
    preferred_time: convertTo24Hour(formData.time),
    additional_notes: formData.notes ? formData.notes.trim() : "",
  };

  console.log("Sending appointment data:", requestData);

  try {
    const response = await fetch("https://gems-of-truth.vercel.app/bookings/book-appointment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const responseText = await response.text();
    console.log("Raw response:", responseText);

    if (!response.ok) {
      let errorMessage = "Failed to book appointment";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
        if (errorData.errors) {
          console.log("Validation errors:", errorData.errors);
        }
      } catch (parseError) {
        console.error("Could not parse error response:", parseError);
        errorMessage = `Server error (${response.status}): ${responseText}`;
      }
      throw new Error(errorMessage);
    }

    const data = JSON.parse(responseText);
    
    // Set success data and show success screen
    setSuccessData({
      message: data.message || "Appointment booked successfully!",
      appointmentDetails: {
        name: formData.fullName,
        service: services.find(s => s.id === formData.service)?.name || 'Selected Service',
        date: formData.date,
        time: formData.time,
        specialist: specialists.find(s => s.id === formData.specialist)?.name || 'Selected Specialist'
      }
    });
    setShowSuccess(true);
    setError(null);

    // Emit real-time admin notification for appointment
    addNotification({
      type: 'info',
      title: 'New Appointment Booked',
      message: `${formData.fullName} booked ${services.find(s => s.id === formData.service)?.name || 'a service'}`,
      details: {
        'Email': formData.email,
        'Phone': formData.phone,
        'Date': formData.date,
        'Time': formData.time,
        'Specialist': specialists.find(s => s.id === formData.specialist)?.name || 'Selected Specialist'
      },
      temporary: false
    });
  } catch (error) {
    console.error("Appointment booking error:", error);
    setError(error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleSuccessClose = () => {
    // Reset form after success
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      service: "",
      specialist: "",
      date: "",
      time: "",
      concern: "",
      notes: "",
    });
    setCurrentStep(1);
    setShowSuccess(false);
    setSuccessData(null);
    setError(null);
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone;
      case 2:
        return formData.service && formData.specialist && formData.concern;
      case 3:
        return formData.date && formData.time;
      default:
        return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="appointment-modal-overlay" onClick={onClose}>
      <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Book Your Appointment</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-display">
            <div className="error-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#EF4444" stroke="#DC2626" strokeWidth="2"/>
                <path d="M15 9L9 15M9 9L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="error-title">Booking Failed</h3>
            <p className="error-message">{error}</p>
            <button className="error-close-btn" onClick={() => setError(null)}>
              Try Again
            </button>
          </div>
        )}

        {/* Success Screen */}
        {showSuccess && (
          <div className="success-screen">
            <div className="success-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="#10B981" stroke="#059669" strokeWidth="2"/>
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <h2 className="success-title">Appointment Booked Successfully! 🎉</h2>
            <p className="success-message">{successData.message}</p>
            
            <div className="appointment-summary">
              <h3>Appointment Details</h3>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Name:</span>
                  <span className="summary-value">{successData.appointmentDetails.name}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Service:</span>
                  <span className="summary-value">{successData.appointmentDetails.service}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Date:</span>
                  <span className="summary-value">{new Date(successData.appointmentDetails.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Time:</span>
                  <span className="summary-value">{successData.appointmentDetails.time}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Specialist:</span>
                  <span className="summary-value">{successData.appointmentDetails.specialist}</span>
                </div>
              </div>
            </div>
            
            <div className="success-actions">
              <button className="success-close-btn" onClick={handleSuccessClose}>
                Close
              </button>
            </div>
            
            <div className="success-footer">
              <p>We've sent a confirmation email to your inbox.</p>
              <p>Please check your email for further instructions.</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!showSuccess && !error && (
          <div className="progress-bar">
          <div className="progress-steps">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''} ${step < currentStep ? 'clickable' : ''}`}
                onClick={() => goToStep(step)}
                title={step < currentStep ? 'Click to go back to this step' : ''}
              >
                <div className="step-circle">
                  {step < currentStep ? '✓' : step}
                </div>
                <span className="step-label">
                  {step === 1 ? 'Personal Info' : step === 2 ? 'Service & Specialist' : 'Date & Time'}
                </span>
              </div>
            ))}
          </div>
          <div 
            className="progress-fill" 
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
        </div>
        )}

        {!showSuccess && !error && (
          <form onSubmit={handleSubmit} className="appointment-form">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Personal Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 712 345 678"
                    pattern="^\+254[0-9]{9}$"
                    title="Please enter a valid Kenya phone number starting with +254 followed by 9 digits"
                    required
                  />
                  <small className="phone-hint">Format: +254 followed by 9 digits (e.g., +254712345678)</small>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service & Specialist */}
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Choose Service & Specialist</h3>
              
              <div className="form-group">
                <label>Select Service *</label>
                <div className="service-cards">
                  {services.map(service => (
                    <div 
                      key={service.id}
                      className={`service-card ${formData.service === service.id ? 'selected' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, service: service.id }))}
                    >
                      <h4>{service.name}</h4>
                      <div className="service-details">
                        <span className="price">{service.price}</span>
                        <span className="duration">{service.duration}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Choose Specialist *</label>
                <div className="specialist-cards">
                  {specialists.map(specialist => (
                    <div 
                      key={specialist.id}
                      className={`specialist-card ${formData.specialist === specialist.id ? 'selected' : ''} ${!specialist.available ? 'disabled' : ''}`}
                      onClick={() => specialist.available && setFormData(prev => ({ ...prev, specialist: specialist.id }))}
                    >
                      <h4>{specialist.name}</h4>
                      <p>{specialist.specialty}</p>
                      <span className={`availability ${specialist.available ? 'available' : 'unavailable'}`}>
                        {specialist.available ? '✓ Available' : '✗ Unavailable'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Main Health Concern *</label>
                <select
                  name="concern"
                  value={formData.concern}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select your main concern</option>
                  {healthConcerns.map(concern => (
                    <option key={concern} value={concern}>{concern}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Date & Time */}
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Select Date & Time</h3>
              
              <div className="form-grid">
                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Preferred Time *</label>
                  <div className="time-slots">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot ${formData.time === time ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, time }))}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any specific symptoms, questions, or requirements..."
                  rows="4"
                />
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="form-navigation">
            <div className="nav-left">
              {currentStep > 1 && (
                <>
                  <button type="button" className="btn-secondary" onClick={handlePrevious}>
                    ← Previous
                  </button>
                  <span className="back-hint">
                    or click on step {currentStep - 1} above to go back
                  </span>
                </>
              )}
            </div>
            
            <div className="nav-right">
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="btn-primary submit-btn"
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="loading">
                      <span className="spinner"></span>
                      Booking...
                    </span>
                  ) : (
                    '🗓️ Book Appointment'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentModal;
