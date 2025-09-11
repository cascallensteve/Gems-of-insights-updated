import React from 'react';
import { useNavigate } from 'react-router-dom';

const LocationPage = () => {
  const navigate = useNavigate();

  const handleBackToContact = () => {
    navigate('/contact');
  };

  const handleGetDirections = () => {
    const address = encodeURIComponent('Nairobi, Kenya');
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
  };

  const handleCallUs = () => {
    window.location.href = 'tel:+254794491920';
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hello! I would like to visit your location. Can you provide more details?');
    window.open(`https://wa.me/254794491920?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/40">
      <div className="relative isolate overflow-hidden bg-[url('https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14 sm:py-20">
          <div className="flex flex-col items-start gap-6 text-white">
            <button
              onClick={handleBackToContact}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/20 transition"
            >
              ← Back to Contact
            </button>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Our Location
            </h1>
            <p className="max-w-2xl text-white/90">
              Visit us in Nairobi for personalized wellness consultations and natural remedies.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden shadow-soft border border-emerald-100 bg-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819876!2d36.8176!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMcKwMTcnMzEuNiJTIDM2wrA0OScwMy40IkU!5e0!3m2!1sen!2ske!4v1234567890"
                width="100%"
                height="460"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gems of Insight Location"
              ></iframe>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-soft">
              <h2 className="text-xl font-bold text-emerald-700">📍 Nairobi, Kenya</h2>
              <p className="text-slate-600">Central Business District</p>

              <div className="mt-6 space-y-5">
                <div className="flex gap-4">
                  <div className="text-2xl">🕒</div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Business Hours</h4>
                    <p className="text-slate-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p className="text-slate-600">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-slate-600">Sunday: Closed</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl">🚗</div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Parking</h4>
                    <p className="text-slate-600">Free parking available on-site for customers</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl">♿</div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Accessibility</h4>
                    <p className="text-slate-600">Wheelchair accessible with ramp and elevator</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-soft">
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={handleGetDirections}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow hover:bg-emerald-700 transition"
                >
                  🚗 Get Directions
                </button>
                <button
                  onClick={handleCallUs}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white shadow hover:bg-slate-900 transition"
                >
                  📞 Call Us
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 text-emerald-700 px-4 py-3 font-semibold border border-emerald-200 hover:bg-emerald-100 transition"
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={() => navigate('/consultation')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-emerald-700 border border-emerald-200 hover:bg-emerald-50 transition"
                >
                  📅 Book Consultation
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-6">
              <p className="text-sm text-emerald-900">
                Tip: Arrive 10 minutes early for your appointment to complete a brief wellness questionnaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;


