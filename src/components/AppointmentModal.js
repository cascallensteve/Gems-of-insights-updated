import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
// import { ArrowLeft, ArrowRight, CalendarCheck } from "lucide-react";

const AppointmentModal = ({ isOpen, onClose, defaultSpecialist }) => {
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
    { id: 'mcgovern', name: 'McGovern Kamau', specialty: 'Clinical Psychologist', available: true },
    { id: 'denzel', name: 'H/Dr. Odiwuor Denzel', specialty: 'Health & Wellness Coach • Clinical Herbalist & Clinician', available: true },
  ];

  // Preselect specialist if provided
  React.useEffect(() => {
    if (!isOpen) return;
    if (!defaultSpecialist) return;
    const match = specialists.find(s => 
      s.id.toLowerCase() === String(defaultSpecialist).toLowerCase() ||
      s.name.toLowerCase() === String(defaultSpecialist).toLowerCase()
    );
    if (match) {
      setFormData(prev => ({ ...prev, specialist: match.id }));
    }
  }, [isOpen, defaultSpecialist]);

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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto" onClick={onClose}>
      <div className="relative w-full max-w-3xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden my-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Book Your Appointment</h2>
          <button className="text-2xl leading-none text-gray-500 hover:text-gray-700" onClick={onClose}>×</button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="m-4 rounded-md border border-red-200 bg-red-50 text-red-700 p-3">
            <div className="flex items-start gap-2">
              <div className="mt-0.5">⚠️</div>
              <div>
                <h3 className="font-semibold">Booking Failed</h3>
                <p className="text-sm">{error}</p>
                <button className="mt-2 inline-flex items-center rounded-md bg-red-600 text-white px-3 py-1 text-sm" onClick={() => setError(null)}>
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {showSuccess && (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700">✓</div>
            <h2 className="text-xl font-semibold text-gray-900">Appointment Booked Successfully! 🎉</h2>
            <p className="text-gray-700 mt-1">{successData.message}</p>
            <div className="mt-5 text-left">
              <h3 className="text-sm font-semibold text-gray-800">Appointment Details</h3>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{successData.appointmentDetails.name}</span></div>
                <div><span className="text-gray-500">Service:</span> <span className="font-medium text-gray-900">{successData.appointmentDetails.service}</span></div>
                <div><span className="text-gray-500">Date:</span> <span className="font-medium text-gray-900">{new Date(successData.appointmentDetails.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                <div><span className="text-gray-500">Time:</span> <span className="font-medium text-gray-900">{successData.appointmentDetails.time}</span></div>
                <div><span className="text-gray-500">Specialist:</span> <span className="font-medium text-gray-900">{successData.appointmentDetails.specialist}</span></div>
              </div>
            </div>
            <div className="mt-6">
              <button className="inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-4 py-2 text-sm font-medium shadow hover:bg-emerald-600" onClick={handleSuccessClose}>Close</button>
            </div>
            <div className="mt-3 text-sm text-gray-600">
              <p>We've sent a confirmation email to your inbox.</p>
              <p>Please check your email for further instructions.</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {!showSuccess && !error && (
          <div className="px-4 pt-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map(step => (
              <button key={step} className={`flex items-center gap-2 text-sm ${currentStep >= step ? 'text-emerald-700' : 'text-gray-500'}`} onClick={() => goToStep(step)} title={step < currentStep ? 'Click to go back to this step' : ''}>
                <span className={`grid h-7 w-7 place-items-center rounded-full border ${currentStep >= step ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300'}`}>{step < currentStep ? '✓' : step}</span>
                <span>{step === 1 ? 'Personal Info' : step === 2 ? 'Service & Specialist' : 'Date & Time'}</span>
              </button>
            ))}
          </div>
          <div className="mt-2 h-1 w-full rounded bg-gray-100">
            <div className="h-1 rounded bg-emerald-600" style={{ width: `${(currentStep / 3) * 100}%` }} />
          </div>
        </div>
        )}

        {!showSuccess && !error && (
          <form onSubmit={handleSubmit} className="px-4 pb-4">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+254 712 345 678"
                    className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                    pattern="^\+254[0-9]{9}$"
                    title="Please enter a valid Kenya phone number starting with +254 followed by 9 digits"
                    required
                  />
                  <small className="text-xs text-gray-500">Format: +254 followed by 9 digits (e.g., +254712345678)</small>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Service & Specialist */}
          {currentStep === 2 && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900">Choose Service & Specialist</h3>
              
              <div className="mt-2">
                <label className="text-sm text-gray-700">Select Service *</label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {services.map(service => (
                    <button 
                      key={service.id}
                      type="button"
                      className={`text-left rounded-md border px-3 py-2 ${formData.service === service.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                      onClick={() => setFormData(prev => ({ ...prev, service: service.id }))}
                    >
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="mt-1 text-sm text-gray-600 flex items-center gap-3">
                        <span>{service.price}</span>
                        <span>{service.duration}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-sm text-gray-700">Choose Specialist *</label>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {specialists.map(specialist => (
                    <button 
                      key={specialist.id}
                      type="button"
                      className={`text-left rounded-md border px-3 py-2 ${formData.specialist === specialist.id ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'} ${!specialist.available ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => specialist.available && setFormData(prev => ({ ...prev, specialist: specialist.id }))}
                    >
                      <div className="font-medium text-gray-900">{specialist.name}</div>
                      <p className="text-sm text-gray-600">{specialist.specialty}</p>
                      <span className={`text-xs ${specialist.available ? 'text-emerald-700' : 'text-gray-400'}`}>
                        {specialist.available ? '✓ Available' : '✗ Unavailable'}
                      </span>
                    </button>
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
            <div className="mt-6">
              <h3 className="text-base font-semibold text-gray-900">Select Date & Time</h3>
              
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                    required
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm text-gray-700">Preferred Time *</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`rounded-md border px-3 py-1.5 text-sm ${formData.time === time ? 'border-emerald-600 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}
                        onClick={() => setFormData(prev => ({ ...prev, time }))}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col">
                <label className="text-sm text-gray-700">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any specific symptoms, questions, or requirements..."
                  rows="4"
                  className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                />
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="mt-4 flex items-center justify-between px-1">
            <div>
              {currentStep > 1 && (
                <>
                  <button type="button" className="inline-flex items-center rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50" onClick={handlePrevious}>← Previous</button>
                  <span className="ml-2 text-xs text-gray-500">or click on step {currentStep - 1} above to go back</span>
                </>
              )}
            </div>
            
            <div>
              {currentStep < 3 ? (
                <button 
                  type="button" 
                  className="inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-4 py-2 text-sm font-medium shadow hover:bg-emerald-600" 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next →
                </button>
              ) : (
                <button 
                  type="submit" 
                  className="inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-4 py-2 text-sm font-medium shadow hover:bg-emerald-600"
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
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
