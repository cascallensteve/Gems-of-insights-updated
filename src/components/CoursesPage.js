import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../services/api';
import { useAuth } from '../context/AuthContext';
// Removed CourseEnrollmentTest and video lock icons as the sections were deleted
import AppointmentModal from './AppointmentModal';

const CoursesPage = () => {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    otherNames: '',
    gender: '',
    yearOfBirth: '',
    email: '',
    phoneNumber: '',
    otherNumber: '',
    homeAddress: '',
    city: '',
    country: 'Kenya',
    church: '',
    membershipDuration: '',
    selectedModules: []
  });

  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [enrollNotice, setEnrollNotice] = useState(null);

  // Consultation modal state (simple reuse from ConsultationPage)
  const [consultSelected, setConsultSelected] = useState(null);
  const [showConsultModal, setShowConsultModal] = useState(false);

  const consultSpecialists = [
    {
      id: 1,
      name: 'McGovern Kamau',
      specialty: 'Clinical Psychologist',
      image:
        'https://res.cloudinary.com/dqvsjtkqw/image/upload/v1758125962/IMG-20250914-WA0003_zwba1b.jpg',
      availability: 'Available This Week',
    },
    {
      id: 2,
      name: 'H/Dr. Odiwuor Denzel',
      specialty: 'Health & Wellness Coach • Clinical Herbalist & Clinician',
      image:
        'https://res.cloudinary.com/dqvsjtkqw/image/upload/v1757230090/african-american-male-friends-standing-park-discussing-bible_wzoljk.webp',
      availability: 'Available Today',
    },
  ];

  const openConsultModal = (spec) => {
    setConsultSelected(spec);
    setShowConsultModal(true);
  };

  const closeConsultModal = () => {
    setShowConsultModal(false);
    setConsultSelected(null);
  };

  // Array of rotating images for the right side - optimized with smaller sizes
  const rotatingImages = [
    {
      src: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1750921889/logs_co58wn.jpg",
      fallback: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop",
      alt: "Medical missionary courses and training",
      title: "Gospel Medical Training"
    },
    {
      src: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1758127771/herbal-spa-treatment-equipments-put-wooden-floor_1_1_pjzsmw.webp",
      fallback: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=600&h=400&fit=crop",
      alt: "Student learning medical missionary principles",
      title: "Compassionate Learning"
    },
    {
      src: "https://res.cloudinary.com/dqvsjtkqw/image/upload/w_600,h_400,c_fill/v1753882302/beautiful-african-female-florist-smiling-cutting-stems-working-flower-shop-white-wall_2_l3ozdi.webp",
      fallback: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&h=400&fit=crop",
      alt: "Natural healing and herbal medicine practitioner",
      title: "Herbal Medicine"
    },
    {
      src: "https://res.cloudinary.com/dqvsjtkqw/image/upload/w_600,h_400,c_fill/v1753707168/medium-shot-doctor-holding-smartphone_yq2rkh.jpg",
      fallback: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop",
      alt: "Medical professional using modern technology",
      title: "Modern Medical Practice"
    }
  ];

  const location = useLocation();

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    // Ensure first image is visible initially
    setCurrentImageIndex(0);
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % rotatingImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [rotatingImages.length]);

  // Hero carousel manual navigation
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % rotatingImages.length);
  }, [rotatingImages.length]);

  const handlePrevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev - 1 + rotatingImages.length) % rotatingImages.length);
  }, [rotatingImages.length]);

  // Open enrollment form when coming from CTA
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('enroll') === '1') {
      setShowForm(true);
      // Scroll to form
      setTimeout(() => {
        const el = document.querySelector('.registration-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [location.search]);

  // Prefill form from logged-in user
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        firstName: prev.firstName || currentUser.firstName || currentUser.first_name || '',
        otherNames: prev.otherNames || currentUser.lastName || currentUser.last_name || '',
        email: prev.email || currentUser.email || '',
        phoneNumber: prev.phoneNumber || currentUser.phone || currentUser.phone_number || ''
      }));
    }
  }, [currentUser]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'selectedModules') {
      setFormData(prev => ({
        ...prev,
        selectedModules: checked 
          ? [...prev.selectedModules, value]
          : prev.selectedModules.filter(module => module !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.yearOfBirth) newErrors.yearOfBirth = 'Year of birth is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else {
      const phoneOk = /^07\d{8}$/.test(formData.phoneNumber.trim());
      if (!phoneOk) newErrors.phoneNumber = 'Phone must start with 07 and be 10 digits';
    }
    if (!formData.homeAddress) newErrors.homeAddress = 'Home address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.country) newErrors.country = 'Country is required';
    if (formData.selectedModules.length === 0) newErrors.selectedModules = 'Please select a module';
    if (formData.selectedModules.length > 1) newErrors.selectedModules = 'Please select only one module';

    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Map selected module to expected course cost in KES
      const selected = formData.selectedModules[0];
      const moduleCostMap = {
        'Module One': 10000,
        'Module Two': 30000,
        'Module Three': 20000
      };
      const targetCost = moduleCostMap[selected];
      if (!targetCost) {
        alert('Unable to determine selected course. Please try again later.');
        return;
      }

      // Fetch courses and find a course with matching cost
      const data = await apiService.courses.listCourses();
      const list = Array.isArray(data?.courses) ? data.courses : [];
      
      // Find any available course (since we don't have specific course mapping)
      const targetCourse = list.find(c => Number(c.cost) === Number(targetCost)) || list[0];
      if (!targetCourse) {
        alert('No courses are currently available. Please try again later.');
        return;
      }

      console.log('Enrolling in course:', targetCourse.title, 'with cost:', targetCourse.cost);

      // Enroll via backend (requires auth token)
      const payload = {
        name: `${formData.firstName} ${formData.otherNames}`.trim(),
        email: formData.email,
        phone: formData.phoneNumber
      };
      const res = await apiService.courses.enrollInCourse(targetCourse.id, payload);
      
      // Store enrollment data for admin panel
      const enrollmentData = {
        id: Date.now(), // Generate unique ID
        enrollment_id: res?.enrollment_id || Date.now(),
        course_id: targetCourse.id,
        course_title: targetCourse.title,
        student: payload.name,
        email: payload.email,
        phone: payload.phone,
        created_at: new Date().toISOString(),
        status: 'active',
        // Additional enrollment details
        firstName: formData.firstName,
        otherNames: formData.otherNames,
        gender: formData.gender,
        yearOfBirth: formData.yearOfBirth,
        otherNumber: formData.otherNumber,
        homeAddress: formData.homeAddress,
        city: formData.city,
        country: formData.country,
        church: formData.church,
        membershipDuration: formData.membershipDuration,
        selectedModule: formData.selectedModules[0],
        courseCost: targetCourse.cost
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

      // Initiate payment for the enrollment
      const to254 = (input) => {
        const raw = String(input || '').trim();
        if (!raw) return '';
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

      const amountKes = Math.round(Number(targetCourse.cost || 0) / 100) || 1;
      const phone254 = to254(payload.phone);
      try {
        const payRes = await apiService.payments.initiateEnrollmentPayment({
          enrollmentId: enrollmentData.enrollment_id,
          amount: amountKes,
          phone: phone254,
          productType: 'course'
        });

        // Persist local payment record for admin view
        const paymentRecord = {
          id: Date.now(),
          enrollment_id: enrollmentData.enrollment_id,
          course_id: targetCourse.id,
          amount: amountKes,
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

        if (payRes?.success) {
          setEnrollNotice({ type: 'success', message: 'Payment initiated. Check your phone to complete the STK push.' });
        } else {
          setEnrollNotice({ type: 'error', message: 'Payment initiation failed. Please try again.' });
        }
      } catch (pe) {
        console.error('Payment initiation failed:', pe);
        setEnrollNotice({ type: 'error', message: 'Could not initiate payment. Please try again later.' });
      }
      
      console.log('Stored enrollment data:', enrollmentData);
      setEnrollNotice({ type: 'success', message: res?.message || 'Enrolled successfully! We will reach out with next steps.' });
      setTimeout(() => setEnrollNotice(null), 6000);
    } catch (err) {
      console.error('Course enrollment failed:', err);
      const msg = typeof err === 'string' ? err : err?.detail || err?.message || 'Enrollment failed. Please ensure you are logged in.';
      setEnrollNotice({ type: 'error', message: msg });
      setTimeout(() => setEnrollNotice(null), 6000);
    }
  }, [formData, validateForm]);

  // Simplified animation variants for better performance
  const containerVariants = {
    visible: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const itemVariants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div 
      className=""
      initial="visible"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section - Full-width Background Carousel */}
      <motion.section className="relative mt-[40px] md:mt-[52px]" variants={itemVariants}>
        <div className="relative h-[320px] sm:h-[380px] md:h-[440px] overflow-hidden">
          {rotatingImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index === 0 ? 'eager' : 'lazy'}
                onError={(e) => { e.target.src = image.fallback; }}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />
            </div>
          ))}

          {/* Overlayed Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="max-w-2xl text-white">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">Natural Remedies Classes</h1>
                <p className="mt-2 text-base md:text-lg text-white/90">Learn at your own pace and build practical herbal skills from anywhere.</p>

                {/* CTAs */}
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a href="#featured-courses" className="inline-flex items-center rounded-md bg-emerald-700 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600">Browse Courses</a>
                  <a href="#instructors" className="inline-flex items-center rounded-md border border-white/40 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10">Learn More</a>
                </div>

                <div className="mt-2 text-sm text-white/80">Certified Programs • Lifetime Access • Expert Instructors</div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60"
            onClick={handlePrevImage}
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white hover:bg-black/60"
            onClick={handleNextImage}
          >
            ›
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {rotatingImages.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2.5 w-2.5 rounded-full border border-white/60 ${index === currentImageIndex ? 'bg-white' : 'bg-white/30'}`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>
      </motion.section>

      {/* Rest of the content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Featured Courses */}
        <motion.section id="featured-courses" className="py-10" variants={itemVariants}>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Featured Courses</h2>
              <p className="text-sm text-gray-600">Popular natural remedies classes crafted by industry professionals</p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="relative h-40">
                <img src="https://images.unsplash.com/photo-1486899430790-61dbf6f6d98b?w=800&h=400&fit=crop" alt="Digital Marketing Fundamentals" className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 inline-flex rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white">FEATURED</div>
                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-gray-900">KES 10,000</div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-600"><span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">Beginner</span><span className="rounded bg-gray-50 px-2 py-0.5">4 Weeks</span></div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">Foundations of Clinical Nutrition</h3>
                <p className="mt-1 text-sm text-gray-700">Build a strong base in therapeutic nutrition and meal planning for wellness.</p>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <img className="h-7 w-7 rounded-full" src="https://i.pravatar.cc/40?img=12" alt="instructor" />
                    <div>
                      <div className="font-medium text-gray-900">Sarah N.</div>
                      <div className="text-xs">Nutrition Educator</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>⭐ 4.5</div>
                    <div className="text-xs">342 students</div>
                  </div>
                </div>
                <a href="/courses?enroll=1#registration" className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Enroll Now</a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="relative h-40">
                <img src="https://images.unsplash.com/photo-1505577058444-a3dab90d4253?w=800&h=400&fit=crop" alt="Web Development with JavaScript" className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 inline-flex rounded-full bg-emerald-600 px-2 py-1 text-[10px] font-semibold text-white">NEW</div>
                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-gray-900">KES 30,000</div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-600"><span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">Intermediate</span><span className="rounded bg-gray-50 px-2 py-0.5">8 Weeks</span></div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">Anatomy, Physiology & Clinical Pathology</h3>
                <p className="mt-1 text-sm text-gray-700">Understand body systems and disease processes essential for safe practice.</p>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <img className="h-7 w-7 rounded-full" src="https://i.pravatar.cc/40?img=22" alt="instructor" />
                    <div>
                      <div className="font-medium text-gray-900">Michael C.</div>
                      <div className="text-xs">Clinical Trainer</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>⭐ 5.0</div>
                    <div className="text-xs">156 students</div>
                  </div>
                </div>
                <a href="/courses?enroll=1#registration" className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Enroll Now</a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
              <div className="relative h-40">
                <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&h=400&fit=crop" alt="Data Science" className="h-full w-full object-cover" />
                <div className="absolute left-3 top-3 inline-flex rounded-full bg-amber-500 px-2 py-1 text-[10px] font-semibold text-white">CERTIFICATE</div>
                <div className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-gray-900">Free</div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-gray-600"><span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">Beginner</span><span className="rounded bg-gray-50 px-2 py-0.5">4 Weeks</span></div>
                <h3 className="mt-2 text-lg font-semibold text-gray-900">Herbology and Botanical Medicine</h3>
                <p className="mt-1 text-sm text-gray-700">Explore medicinal plants and practical herbal preparations for daily care.</p>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <img className="h-7 w-7 rounded-full" src="https://i.pravatar.cc/40?img=32" alt="instructor" />
                    <div>
                      <div className="font-medium text-gray-900">Dr. Emily W.</div>
                      <div className="text-xs">Herbal Practitioner</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>⭐ 4.2</div>
                    <div className="text-xs">789 students</div>
                  </div>
                </div>
                <a href="/courses?enroll=1#registration" className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">Enroll Now</a>
              </div>
            </div>
          </div>
        </motion.section>

      

        {/* Testimonials */}
        <motion.section className="py-8" variants={itemVariants}>
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Testimonials</h2>
            <p className="text-sm text-gray-600">What learners and partners say about our programs</p>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {quote:'These classes transformed my family health approach. Practical, compassionate, and grounded in faith.', source:'The New Wellness Times'},
              {quote:'Comprehensive and clear. I now confidently guide clients using safe, effective natural protocols.', source:'Health & Hope Journal'},
              {quote:'A beautiful blend of science and Scripture. Highly recommend for every missionary-minded believer.', source:'The Guardian of Health'}
            ].map((t, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="text-amber-500">★★★★★</div>
                <p className="mt-2 text-gray-800">{t.quote}</p>
                <div className="mt-3 font-semibold text-gray-900">{t.source}</div>
              </div>
            ))}
          </div>
        </motion.section>
        {/* Mission Quote */}
        <motion.section className="py-8 sm:py-10" variants={itemVariants}>
          <div className="grid gap-6 md:grid-cols-2 items-center">
            {/* Left side - Quote text */}
            <div>
              <div className="flex items-center gap-3">
                <div className="text-emerald-700">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" fill="currentColor"/>
                    <path d="M15.583 17.321c-1.03-1.094-1.583-2.321-1.583-4.31 0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" fill="currentColor"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Our Mission Foundation</h2>
              </div>
              <blockquote className="mt-2 text-gray-700">
                "Medical missionary work brings to humanity the gospel of release from suffering. 
                It is the pioneer work of the gospel. It is the gospel practiced, the compassion of Christ revealed. 
                Of this work there is great need, and the world is open for it. God grant that the importance of 
                medical missionary work shall be understood, and that new fields may be immediately entered. 
                Then will the work of the ministry be after the Lord's order; the sick will be healed, 
                and poor, suffering humanity will be blessed."
              </blockquote>
              <cite className="mt-1 block text-sm text-gray-500">- MM 239.3</cite>
              <div className="mt-2 h-0.5 w-24 rounded bg-emerald-600"></div>
            </div>

            {/* Right side - Image */}
            <div>
              <div className="relative overflow-hidden rounded-xl shadow">
                <img 
                  src="https://res.cloudinary.com/dqvsjtkqw/image/upload/v1758092800/38386_1_shl4uc.webp" 
                  alt="Medical missionary work - healing through natural remedies"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop";
                  }}
                  className="h-64 w-full object-cover"
                />
                <div className="absolute -left-4 -bottom-4 h-12 w-12 rounded-full bg-emerald-200/70"></div>
                <div className="absolute -right-4 -top-4 h-12 w-12 rounded-full bg-emerald-200/70"></div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="h-12 w-12 overflow-hidden rounded-md">
                  <img 
                    src="https://res.cloudinary.com/dqvsjtkqw/image/upload/w_100,h_100,c_fill/v1750921889/logs_co58wn.jpg" 
                    alt="Natural healing materials and herbs"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=100&h=100&fit=crop";
                    }}
                    className="h-12 w-12 object-cover"
                  />
                </div>
                <div className="h-12 w-12 overflow-hidden rounded-md">
                  <img 
                    src="https://res.cloudinary.com/dqvsjtkqw/image/upload/w_100,h_100,c_fill/v1753882302/beautiful-african-female-florist-smiling-cutting-stems-working-flower-shop-white-wall_2_l3ozdi.webp" 
                    alt="Medical missionary training practitioner"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=100&h=100&fit=crop";
                    }}
                    className="h-12 w-12 object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Training Modules */}
        <motion.section className="py-10" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Levels of Training</h2>
            <div className="h-0.5 w-24 rounded bg-emerald-600"></div>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow transition" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-semibold">A</span>
                <h3 className="text-lg font-semibold text-gray-900">Module One</h3>
              </div>
              <h4 className="mt-2 text-emerald-700 font-medium">Essentials of Applied Clinical Nutrition</h4>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">⏱️ 1 Month</span>
                <span className="font-semibold text-emerald-700">KES 10,000</span>
              </div>
              <p className="mt-3 text-gray-700">Master the fundamentals of clinical nutrition and therapeutic dietary approaches for optimal health.</p>
            </motion.div>

            <motion.div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow transition" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-semibold">B</span>
                <h3 className="text-lg font-semibold text-gray-900">Module Two</h3>
              </div>
              <h4 className="mt-2 text-emerald-700 font-medium">Fundamentals of Human Anatomy, Physiology & Clinical Pathology</h4>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">⏱️ 4 Months</span>
                <span className="font-semibold text-emerald-700">KES 30,000</span>
              </div>
              <p className="mt-3 text-gray-700">Comprehensive understanding of human body systems, functions, and disease processes.</p>
            </motion.div>

            <motion.div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm hover:shadow transition" variants={itemVariants}>
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 font-semibold">C</span>
                <h3 className="text-lg font-semibold text-gray-900">Module Three</h3>
              </div>
              <h4 className="mt-2 text-emerald-700 font-medium">Herbology and Botanical Medicine</h4>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                <span className="inline-flex items-center gap-1">⏱️ 2 Months</span>
                <span className="font-semibold text-emerald-700">KES 20,000</span>
              </div>
              <p className="mt-3 text-gray-700">Study of medicinal plants and their applications in traditional and modern healing practices.</p>
            </motion.div>
          </div>
          <div className="mt-6 rounded-lg bg-emerald-50/60 p-4 text-emerald-900">
            <h3 className="font-semibold">Total Cost: KES 60,000</h3>
          </div>
        </motion.section>

        {/* Registration Section */}
        <motion.section className="registration-section" variants={itemVariants}>
          {enrollNotice && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                marginBottom: 16,
                padding: '12px 14px',
                borderRadius: 8,
                border: '1px solid',
                borderColor: enrollNotice.type === 'success' ? '#c6f6d5' : '#feb2b2',
                background: enrollNotice.type === 'success' ? '#f0fff4' : '#fff5f5',
                color: enrollNotice.type === 'success' ? '#22543d' : '#742a2a',
                fontWeight: 500
              }}
            >
              {enrollNotice.message}
            </motion.div>
          )}
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Registration Form</h2>
          
          <div className="registration-cta mb-3">
            <button 
              className="toggle-form-btn inline-flex items-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Hide Registration Form' : 'Show Registration Form'}
            </button>
          </div>

          {showForm && (
            <motion.div 
              className="registration-form-container rounded-xl border border-emerald-100 bg-white p-4 shadow-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="registration-form">
                <div className="form-section">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
                  
                  <div className="form-row grid gap-3 md:grid-cols-2">
                    <div className="form-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Other Names</label>
                      <input
                        type="text"
                        name="otherNames"
                        value={formData.otherNames}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-row grid gap-3 md:grid-cols-2">
                    <div className="form-group">
                      <label>Gender *</label>
                      <div className="gender-options">
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Male"
                            checked={formData.gender === 'Male'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          Male
                        </label>
                        <label className="radio-label">
                          <input
                            type="radio"
                            name="gender"
                            value="Female"
                            checked={formData.gender === 'Female'}
                            onChange={handleInputChange}
                          />
                          <span className="radio-custom"></span>
                          Female
                        </label>
                      </div>
                      {errors.gender && <span className="error-text">{errors.gender}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Year of Birth *</label>
                      <input
                        type="number"
                        name="yearOfBirth"
                        value={formData.yearOfBirth}
                        onChange={handleInputChange}
                        min="1920"
                        max="2010"
                        className={errors.yearOfBirth ? 'error' : ''}
                      />
                      {errors.yearOfBirth && <span className="error-text">{errors.yearOfBirth}</span>}
                    </div>
                  </div>

                  <div className="form-row grid gap-3 md:grid-cols-2">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? 'error' : ''}
                      />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Phone Number *</label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+254..."
                        className={errors.phoneNumber ? 'error' : ''}
                      />
                      {errors.phoneNumber && <span className="error-text">{errors.phoneNumber}</span>}
                    </div>
                  </div>

                  <div className="form-row grid gap-3 md:grid-cols-2">
                    <div className="form-group">
                      <label>Other Number</label>
                      <input
                        type="tel"
                        name="otherNumber"
                        value={formData.otherNumber}
                        onChange={handleInputChange}
                        placeholder="+254..."
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Home Address *</label>
                      <input
                        type="text"
                        name="homeAddress"
                        value={formData.homeAddress}
                        onChange={handleInputChange}
                        className={errors.homeAddress ? 'error' : ''}
                      />
                      {errors.homeAddress && <span className="error-text">{errors.homeAddress}</span>}
                    </div>
                  </div>

                  <div className="form-row grid gap-3 md:grid-cols-2">
                    <div className="form-group">
                      <label>City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                    
                    <div className="form-group">
                      <label>Country *</label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className={errors.country ? 'error' : ''}
                      />
                      {errors.country && <span className="error-text">{errors.country}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Church</label>
                      <input
                        type="text"
                        name="church"
                        value={formData.church}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Duration of Membership</label>
                    <input
                      type="text"
                      name="membershipDuration"
                      value={formData.membershipDuration}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 years"
                    />
                  </div>
                </div>

                <div className="form-section mt-4">
                  <h3 className="text-lg font-semibold text-gray-900">Select Module of Interest *</h3>
                  <div className="module-selection space-y-2">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="selectedModules"
                        value="Module One"
                        checked={formData.selectedModules.includes('Module One')}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Module One - Essentials of Applied Clinical Nutrition (KES 10,000)
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="selectedModules"
                        value="Module Two"
                        checked={formData.selectedModules.includes('Module Two')}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Module Two - Fundamentals of Human Anatomy, Physiology & Clinical Pathology (KES 30,000)
                    </label>
                    
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="selectedModules"
                        value="Module Three"
                        checked={formData.selectedModules.includes('Module Three')}
                        onChange={handleInputChange}
                      />
                      <span className="checkmark"></span>
                      Module Three - Herbology and Botanical Medicine (KES 20,000)
                    </label>
                  </div>
                  {errors.selectedModules && <span className="error-text">{errors.selectedModules}</span>}
                </div>

                <div className="mt-4">
                  <button type="submit" className="submit-btn inline-flex items-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600">
                    Submit Registration
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.section>

        {/* Premium Video Library removed as requested */}

        {/* Notes removed as requested */}

        {/* Test section removed as requested */}
      </div>
      {/* Booking Modal - reuse the shared AppointmentModal component */}
      <AppointmentModal
        isOpen={showConsultModal}
        onClose={closeConsultModal}
        defaultSpecialist={consultSelected?.name || consultSelected?.id}
      />
    </motion.div>
  );
};

export default CoursesPage;
