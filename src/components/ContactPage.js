import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Tailwind conversion: removed external CSS import
import apiService from '../services/api';
import { useNotifications } from '../context/NotificationContext';

const ContactPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '+2547',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const payload = {
        full_name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        subject: formData.subject,
        message: formData.message
      };
      const res = await apiService.contact.sendMessage(payload);
      setSubmitMessage(res?.message || 'Thank you for your message! We will get back to you soon.');
      setFormSubmitted(true);
      setShowSuccess(true);
      // Emit real-time admin notification
      addNotification({
        type: 'info',
        title: 'New Inquiry Received',
        message: `${payload.full_name} submitted an inquiry: ${payload.subject}`,
        details: {
          'Email': payload.email,
          'Phone': payload.phone_number,
          'Subject': payload.subject
        },
        temporary: false
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      // Auto-close after a short delay
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (error) {
      setSubmitMessage(error?.detail || error?.message || 'Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeSuccess = () => {
    setShowSuccess(false);
    navigate('/');
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+254794491920';
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@gemsofinsight.com?subject=Inquiry from Gems of Insight Website';
  };

  const handleLocationClick = () => {
    navigate('/location');
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('Hello! I would like to get more information about your natural wellness products and services.');
    window.open(`https://wa.me/254794491920?text=${message}`, '_blank');
  };

  return (
    <div className="mt-[64px] md:mt-[72px]">
      {/* Video Hero Section */}
      <div className="relative isolate overflow-hidden">
        <div className="relative h-[320px] md:h-[420px]">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          >
            <source src="https://res.cloudinary.com/dqvsjtkqw/video/upload/v1755519277/large_5mHOOv9b_gp2ytq.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 mx-auto max-w-6xl px-4 h-full flex flex-col items-start justify-center text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Get In Touch</h1>
            <p className="mt-2 max-w-2xl text-white/90">We're here to help you on your natural wellness journey. Reach out to us with any questions or concerns.</p>
          </div>
        </div>
      </div>

      {/* Showcase */}
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Our Natural Wellness Center</h2>
          <div className="h-0.5 w-24 rounded bg-emerald-600"></div>
        </div>
        <p className="mt-2 text-gray-700">Experience quality care and natural healing in a peaceful environment</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
            <img className="h-48 w-full object-cover" src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1755512011/acourses_rqbgul.webp" alt="Consultation services" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Expert Consultations</h3>
              <p className="text-gray-700">Personalized wellness guidance from experienced practitioners</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
            <img className="h-48 w-full object-cover" src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753882302/beautiful-african-female-florist-smiling-cutting-stems-working-flower-shop-white-wall_2_l3ozdi.webp" alt="Herbal preparations" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Natural Remedies</h3>
              <p className="text-gray-700">Fresh herbal medicines prepared with care</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
            <img className="h-48 w-full object-cover" src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1750921889/logs_co58wn.jpg" alt="Pure ingredients" />
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">Pure Ingredients</h3>
              <p className="text-gray-700">Sourced from trusted natural suppliers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact and Form */}
      <div className="mx-auto max-w-6xl px-4 pb-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Contact Information</h2>
            <div className="mt-4 grid gap-4">
              <button onClick={handlePhoneClick} className="group flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm hover:shadow transition">
                <div className="mt-1 rounded-full bg-emerald-50 p-2 text-emerald-700">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 5C3 3.89543 3.89543 3 5 3H8.27924C8.70967 3 9.09181 3.27543 9.22792 3.68377L10.7257 8.17721C10.8831 8.64932 10.6694 9.16531 10.2243 9.38787L7.96701 10.5165C9.06925 12.9612 11.0388 14.9308 13.4835 16.033L14.6121 13.7757C14.8347 13.3306 15.3507 13.1169 15.8228 13.2743L20.3162 14.7721C20.7246 14.9082 21 15.2903 21 15.7208V19C21 20.1046 20.1046 21 19 21H18C9.71573 21 3 14.2843 3 6V5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-700">+254 794 491920</p>
                  <span className="text-sm text-gray-500">Monday - Friday, 8AM - 6PM</span>
                  <div className="text-sm text-emerald-700">📞 Call Now</div>
                </div>
              </button>

              <button onClick={handleEmailClick} className="group flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm hover:shadow transition">
                <div className="mt-1 rounded-full bg-emerald-50 p-2 text-emerald-700">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-700">info@gemsofinsight.com</p>
                  <span className="text-sm text-gray-500">We respond within 24 hours</span>
                  <div className="text-sm text-emerald-700">✉️ Send Email</div>
                </div>
              </button>

              <button onClick={handleLocationClick} className="group flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm hover:shadow transition">
                <div className="mt-1 rounded-full bg-emerald-50 p-2 text-emerald-700">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-700">Nairobi, Kenya</p>
                  <span className="text-sm text-gray-500">Visit us for consultation</span>
                  <div className="text-sm text-emerald-700">📍 View Location</div>
                </div>
              </button>

              <button onClick={handleWhatsAppClick} className="group flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 text-left shadow-sm hover:shadow transition">
                <div className="mt-1 rounded-full bg-emerald-50 p-2 text-emerald-700">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" fill="currentColor"/></svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp</h3>
                  <p className="text-gray-700">+254 794 491920</p>
                  <span className="text-sm text-gray-500">Quick chat support</span>
                  <div className="text-sm text-emerald-700">💬 Chat Now</div>
                </div>
              </button>
            </div>
          </div>

          {/* Form */}
          <div>
            {!formSubmitted ? (
              <>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your full name" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your.email@example.com" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+2547XXXXXXXX" pattern="\+2547\d{8}" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subject *</label>
                      <select name="subject" value={formData.subject} onChange={handleInputChange} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2">
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="consultation">Book Consultation</option>
                        <option value="product">Product Information</option>
                        <option value="order">Order Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Message *</label>
                    <textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us how we can help you..." rows="6" required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-emerald-600 focus:ring-2"></textarea>
                  </div>

                  {submitMessage && (
                    <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-900">
                      {submitMessage}
                    </div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">✓</div>
                <h3 className="text-lg font-semibold text-gray-900">Message Sent</h3>
                <p className="text-gray-700">{submitMessage || 'Thanks for reaching out. We will get back to you shortly.'}</p>
                <button className="mt-3 inline-flex items-center justify-center rounded-lg border border-emerald-200 bg-white px-4 py-2 font-semibold text-emerald-700 hover:bg-emerald-50" onClick={closeSuccess}>Close</button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">How do I book a consultation?</h3>
              <p className="text-gray-700">You can book a consultation through our appointment system or by calling us directly at +254 794 491920.</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">What are your business hours?</h3>
              <p className="text-gray-700">We're open Monday to Friday, 8AM to 6PM EAT. For urgent matters, you can reach us via WhatsApp.</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Do you ship products nationwide?</h3>
              <p className="text-gray-700">Yes, we ship all our natural remedies and wellness products across Kenya with reliable delivery partners.</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900">Are your products certified?</h3>
              <p className="text-gray-700">All our natural remedies are sourced from certified suppliers and comply with local health regulations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
