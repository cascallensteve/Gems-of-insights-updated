import React, { useState } from 'react';
import './ConsultationPage.css';

const ConsultationPage = () => {
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const specialists = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      specialty: "Nutritionist",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      experience: "8 Years",
      description: "Expert in organic nutrition and dietary planning for optimal health.",
      specialties: ["Weight Management", "Digestive Health", "Food Allergies"],
      rating: 4.9,
      consultations: 450,
      availability: "Available Today"
    },
    {
      id: 2,
      name: "Dr. James Chen",
      specialty: "Herbal Medicine",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      experience: "12 Years",
      description: "Traditional herbal medicine practitioner specializing in natural remedies.",
      specialties: ["Chronic Pain", "Stress Management", "Immune Support"],
      rating: 4.8,
      consultations: 650,
      availability: "Available Tomorrow"
    },
    {
      id: 3,
      name: "Dr. Emily Rodriguez",
      specialty: "Wellness Coach",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      experience: "6 Years",
      description: "Holistic wellness coach focusing on mind-body health integration.",
      specialties: ["Mental Health", "Lifestyle Changes", "Preventive Care"],
      rating: 4.9,
      consultations: 320,
      availability: "Available Today"
    }
  ];

  const consultationTypes = [
    {
      type: "Free Initial Consultation",
      duration: "15 minutes",
      price: "Free",
      description: "Quick assessment and basic guidance"
    },
    {
      type: "Standard Consultation",
      duration: "30 minutes",
      price: "KSH 2,500",
      description: "Detailed health assessment and personalized plan"
    },
    {
      type: "Comprehensive Consultation",
      duration: "60 minutes",
      price: "KSH 4,500",
      description: "In-depth analysis with complete wellness roadmap"
    }
  ];

  const handleBookConsultation = (specialist) => {
    setSelectedSpecialist(specialist);
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedSpecialist(null);
  };

  return (
    <div className="consultation-page">
      {/* Hero Section */}
      <section className="consultation-hero">
        <div className="hero-content">
          <h1>Expert Health Consultations</h1>
          <p>Connect with certified natural health specialists for personalized guidance</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Patients</span>
            </div>
            <div className="stat">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
            <div className="stat">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="consultation-types">
        <div className="container">
          <h2>Choose Your Consultation Type</h2>
          <div className="types-grid">
            {consultationTypes.map((consultation, index) => (
              <div key={index} className="consultation-type-card">
                <h3>{consultation.type}</h3>
                <div className="price">{consultation.price}</div>
                <div className="duration">{consultation.duration}</div>
                <p>{consultation.description}</p>
                <button className="select-type-btn">Select</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists Section */}
      <section className="specialists-section">
        <div className="container">
          <h2>Our Certified Specialists</h2>
          <div className="specialists-grid">
            {specialists.map(specialist => (
              <div key={specialist.id} className="specialist-card">
                <div className="specialist-header">
                  <img src={specialist.image} alt={specialist.name} />
                  <div className="availability-badge">{specialist.availability}</div>
                </div>
                <div className="specialist-info">
                  <h3>{specialist.name}</h3>
                  <span className="specialty">{specialist.specialty}</span>
                  <div className="specialist-stats">
                    <div className="rating">
                      <span>⭐ {specialist.rating}</span>
                    </div>
                    <div className="consultations">
                      <span>{specialist.consultations} consultations</span>
                    </div>
                  </div>
                  <div className="experience">{specialist.experience} Experience</div>
                  <p className="description">{specialist.description}</p>
                  <div className="specialties-tags">
                    {specialist.specialties.map((spec, index) => (
                      <span key={index} className="specialty-tag">{spec}</span>
                    ))}
                  </div>
                  <button 
                    className="book-consultation-btn"
                    onClick={() => handleBookConsultation(specialist)}
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Choose Specialist</h3>
              <p>Select the right specialist based on your health needs</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Book Session</h3>
              <p>Schedule your consultation at a convenient time</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Guidance</h3>
              <p>Receive personalized health recommendations</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Follow Up</h3>
              <p>Track progress with ongoing support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingForm && (
        <div className="booking-modal-overlay" onClick={closeBookingForm}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeBookingForm}>×</button>
            <div className="modal-header">
              <h3>Book Consultation</h3>
              <p>with {selectedSpecialist?.name} - {selectedSpecialist?.specialty}</p>
            </div>
            <form className="booking-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" required />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="your.email@example.com" required />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" placeholder="+254 712 345 678" required />
              </div>
              <div className="form-group">
                <label>Health Concern</label>
                <select required>
                  <option value="">Select your main concern</option>
                  <option value="digestive">Digestive Issues</option>
                  <option value="chronic-fatigue">Chronic Fatigue</option>
                  <option value="mental-wellness">Mental Wellness</option>
                  <option value="weight-management">Weight Management</option>
                  <option value="heart-health">Heart Health</option>
                  <option value="joint-bone">Joint & Bone Health</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Preferred Date</label>
                <input type="date" required />
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <select required>
                  <option value="">Select time</option>
                  <option value="09:00">9:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="16:00">4:00 PM</option>
                </select>
              </div>
              <div className="form-group">
                <label>Additional Notes</label>
                <textarea 
                  placeholder="Please describe your symptoms or any specific questions..."
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" className="submit-btn">
                Book Consultation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;
