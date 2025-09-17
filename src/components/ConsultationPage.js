import React, { useState } from 'react';
import AppointmentModal from './AppointmentModal';
import SiteStats from './SiteStats';

const ConsultationPage = () => {
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const specialists = [
    {
      id: 1,
      name: "McGovern Kamau",
      specialty: "Clinical Psychologist",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1758125962/IMG-20250914-WA0003_zwba1b.jpg",
      experience: "10 Years",
      description:
        "Seasoned mental health specialist with a decade of experience in strengthening health systems and expanding access to quality care. Supports clients through assessment, treatment planning, and one-on-one psychotherapy with holistic, culturally sensitive, and non-stigmatizing care.",
      specialties: [
        "Anxiety",
        "Stress",
        "Psychosis",
        "Personality Disorder",
        "Eating Disorders",
        "Addictions",
        "Learning Disabilities",
        "Family or Relationship Issues"
      ],
      rating: 4.9,
      consultations: 0,
      availability: "Available This Week"
    },
    {
      id: 2,
      name: "H/Dr. Odiwuor Denzel",
      specialty: "Health & Wellness Coach • Clinical Herbalist & Clinician",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1757230090/african-american-male-friends-standing-park-discussing-bible_wzoljk.webp",
      experience: "5 Years",
      description:
        "I help you find true well-being by looking at the whole picture—not just symptoms. Combining clinical expertise with herbal medicine, nutrition, and lifestyle adjustments, I create personalized plans to help you feel better and take control of your health.",
      specialties: [
        "Herbal Medicine",
        "Nutrition Guidance",
        "Lifestyle Optimization",
        "Preventive Wellness"
      ],
      rating: 4.8,
      consultations: 156,
      availability: "Available Today"
    }
  ];

  // Consultation types removed per request

  const handleBookConsultation = (specialist) => {
    setSelectedSpecialist(specialist);
    setShowBookingForm(true);
  };

  const closeBookingForm = () => {
    setShowBookingForm(false);
    setSelectedSpecialist(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-700 to-emerald-500 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold">Expert Health Consultations</h1>
          <p className="mt-3 text-base md:text-lg opacity-90">Connect with certified natural health specialists for personalized guidance</p>
          <div className="mt-8">
            <SiteStats onDark />
          </div>
        </div>
      </section>

      {/* Consultation types section intentionally removed */}

      {/* Specialists Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-900 text-center mb-10">Our Certified Specialists</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {specialists.map(specialist => (
              <div key={specialist.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden">
                <div className="relative h-56">
                  <img className="w-full h-full object-cover" src={specialist.image || 'https://via.placeholder.com/800x500?text=Profile+Photo'} alt={specialist.name} />
                  <div className="absolute top-3 right-3 rounded-full bg-emerald-600 text-white text-xs font-semibold px-3 py-1 shadow">
                    {specialist.availability}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900">{specialist.name}</h3>
                  <span className="mt-1 block text-emerald-700 font-semibold">{specialist.specialty}</span>
                  <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
                    <div>⭐ {specialist.rating}</div>
                    <div>{specialist.consultations} consultations</div>
                  </div>
                  <div className="mt-2 inline-block rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold px-3 py-1">
                    {specialist.experience} Experience
                  </div>
                  <p className="mt-3 text-gray-700 leading-relaxed">{specialist.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {specialist.specialties.map((spec, index) => (
                      <span key={index} className="rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1">{spec}</span>
                    ))}
                  </div>
                  <button 
                    className="mt-5 w-full inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-4 py-2 text-sm font-semibold shadow hover:bg-emerald-600"
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
      <section className="py-16 bg-emerald-50/50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-900 text-center">How It Works</h2>
          <p className="text-center text-gray-600 mt-2">Simple steps to begin your wellness journey</p>

          <div className="mt-10 grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Step 1 */}
            <div className="group rounded-2xl bg-white shadow hover:shadow-lg transition p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition" />
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white text-sm font-bold shadow">1</span>
                <span className="text-2xl">🧑‍⚕️</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Choose Specialist</h3>
              <p className="mt-1 text-sm text-gray-600">Select the right expert based on your health needs.</p>
            </div>

            {/* Step 2 */}
            <div className="group rounded-2xl bg-white shadow hover:shadow-lg transition p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition" />
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white text-sm font-bold shadow">2</span>
                <span className="text-2xl">📆</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Book Session</h3>
              <p className="mt-1 text-sm text-gray-600">Schedule your consultation at a convenient time.</p>
            </div>

            {/* Step 3 */}
            <div className="group rounded-2xl bg-white shadow hover:shadow-lg transition p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition" />
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white text-sm font-bold shadow">3</span>
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Get Guidance</h3>
              <p className="mt-1 text-sm text-gray-600">Receive personalized, actionable recommendations.</p>
            </div>

            {/* Step 4 */}
            <div className="group rounded-2xl bg-white shadow hover:shadow-lg transition p-6 relative overflow-hidden">
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-emerald-100 group-hover:bg-emerald-200 transition" />
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-600 text-white text-sm font-bold shadow">4</span>
                <span className="text-2xl">🔁</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Follow Up</h3>
              <p className="mt-1 text-sm text-gray-600">Track progress with ongoing support and check-ins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal - reuse the shared AppointmentModal component */}
      <AppointmentModal 
        isOpen={showBookingForm} 
        onClose={closeBookingForm} 
        defaultSpecialist={selectedSpecialist?.name || selectedSpecialist?.id}
      />
    </div>
  );
};

export default ConsultationPage;
