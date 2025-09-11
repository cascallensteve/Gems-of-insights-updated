import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
 

const AboutPage = () => {
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
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
    religion: '',
    church: '',
    membershipDuration: '',
    selectedModules: []
  });

  const [errors, setErrors] = useState({});

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Intersection observer hooks
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [aboutRef, aboutInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const handleRegistrationChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'selectedModules') {
      setRegistrationData(prev => ({
        ...prev,
        selectedModules: checked 
          ? [...prev.selectedModules, value]
          : prev.selectedModules.filter(module => module !== value)
      }));
    } else {
      setRegistrationData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleRegistrationSubmit = (e) => {
    e.preventDefault();
    
    const emailContent = `
      GOSPEL MEDICAL MISSIONARY EVANGELISM TRAINING - REGISTRATION FORM
      
      PERSONAL DETAILS:
      First Name: ${registrationData.firstName}
      Other Names: ${registrationData.otherNames}
      Gender: ${registrationData.gender}
      Year of Birth: ${registrationData.yearOfBirth}
      Email: ${registrationData.email}
      Phone Number: ${registrationData.phoneNumber}
      Other Number: ${registrationData.otherNumber}
      Home Address: ${registrationData.homeAddress}
      City: ${registrationData.city}
      Country: ${registrationData.country}
      Religion: ${registrationData.religion}
      Church: ${registrationData.church}
      Duration of Membership: ${registrationData.membershipDuration}
      
      SELECTED MODULES:
      ${registrationData.selectedModules.join(', ')}
    `;

    const mailtoLink = `mailto:applications@gemsofinsight.com?subject=Medical Missionary Training Registration&body=${encodeURIComponent(emailContent)}`;
    window.location.href = mailtoLink;

    alert('Registration form will be sent via email. Please make the KES 1,500 registration fee payment after submitting.');
  };

  return (
    <div className="">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        className="relative mt-[64px] md:mt-[72px]"
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={fadeInUp}
      >
        <div className="relative overflow-hidden rounded-xl">
          <img 
            src="https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg" 
            alt="Organic Health"
            className="h-64 w-full object-cover md:h-80"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.h1 className="text-white text-2xl md:text-3xl font-bold" variants={fadeInUp}>We Are The Leader In Organic Health</motion.h1>
            <motion.p className="mt-2 max-w-3xl text-white/90" variants={fadeInUp}>
              Empowering communities through natural health education, quality organic products, 
              and holistic wellness solutions that transform lives and restore vitality.
            </motion.p>
            <motion.div className="mt-4 flex items-center gap-3" variants={fadeInUp}>
              <button className="inline-flex items-center rounded-full bg-emerald-600 text-white px-5 py-2 text-sm font-semibold shadow hover:bg-emerald-500">Discover Our Story</button>
              <button className="inline-flex items-center rounded-full border border-white/70 text-white px-5 py-2 text-sm font-semibold hover:bg-white/10">View Products</button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Lupinus Group Section */}
      <motion.section 
        ref={aboutRef}
        className="py-12 bg-white"
        initial="hidden"
        animate={aboutInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <motion.div className="" variants={fadeInUp}>
              <h2 className="text-xl font-bold text-gray-900">About Gems of Insight</h2>
              <p className="mt-2 text-gray-700">
                At Gems of Insight, we believe in the transformative power of natural health and wellness. 
                Our journey began with a simple mission: to provide communities with access to quality 
                organic products, comprehensive health education, and the wisdom needed to make informed 
                decisions about their wellbeing.
              </p>
              <p className="mt-2 text-gray-700">
                We combine traditional healing wisdom with modern understanding, offering a holistic 
                approach to health that addresses not just symptoms, but the root causes of wellness 
                challenges. Our team of dedicated professionals is committed to serving with excellence, 
                integrity, and genuine care for every individual we encounter.
              </p>
            </motion.div>
            <motion.div className="" variants={fadeInUp}>
              <img 
                src="https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg"
                alt="Natural Health Products"
                className="rounded-lg shadow"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Counter Section */}
      <motion.section 
        ref={statsRef}
        className="py-10 bg-gray-50"
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <motion.div className="rounded-md border border-gray-200 bg-white p-4 shadow" variants={fadeInUp}>
              <h3 className="text-xl font-bold text-gray-900">500+</h3>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </motion.div>
            <motion.div className="rounded-md border border-gray-200 bg-white p-4 shadow" variants={fadeInUp}>
              <h3 className="text-xl font-bold text-gray-900">50+</h3>
              <p className="text-sm text-gray-600">Natural Products</p>
            </motion.div>
            <motion.div className="rounded-md border border-gray-200 bg-white p-4 shadow" variants={fadeInUp}>
              <h3 className="text-xl font-bold text-gray-900">15+</h3>
              <p className="text-sm text-gray-600">Years Experience</p>
            </motion.div>
            <motion.div className="rounded-md border border-gray-200 bg-white p-4 shadow" variants={fadeInUp}>
              <h3 className="text-xl font-bold text-gray-900">100+</h3>
              <p className="text-sm text-gray-600">Health Consultations</p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Medical Missionary Training Section */}
      <motion.section 
        className="training-section"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="container">
          <motion.div className="section-header text-center" variants={fadeInUp}>
            <h2>Gospel Medical Missionary Training</h2>
            <p>Equipping individuals with the knowledge and skills to serve others through natural health ministry</p>
          </motion.div>

          <motion.div className="training-content" variants={fadeInUp}>
            <div className="training-quote">
              <blockquote>
                "Medical missionary work brings to humanity the gospel of release from suffering. 
                It is the pioneer work of the gospel. It is the gospel practiced, the compassion of Christ revealed."
              </blockquote>
              <cite>- MM 239.3</cite>
            </div>

            <div className="modules-section">
              <h3>Training Modules</h3>
              <div className="modules-grid">
                <motion.div className="module-card" variants={fadeInUp}>
                  <div className="module-header">
                    <span className="module-number">01</span>
                    <h4>Essentials of Applied Clinical Nutrition</h4>
                  </div>
                  <div className="module-details">
                    <span className="duration">1 Month</span>
                    <span className="price">KSh 10,000</span>
                  </div>
                  <p>Foundation principles of nutrition and therapeutic dietary approaches</p>
                </motion.div>
                
                <motion.div className="module-card" variants={fadeInUp}>
                  <div className="module-header">
                    <span className="module-number">02</span>
                    <h4>Human Anatomy, Physiology & Clinical Pathology</h4>
                  </div>
                  <div className="module-details">
                    <span className="duration">4 Months</span>
                    <span className="price">KSh 30,000</span>
                  </div>
                  <p>Comprehensive understanding of human body systems and disease processes</p>
                </motion.div>
                
                <motion.div className="module-card" variants={fadeInUp}>
                  <div className="module-header">
                    <span className="module-number">03</span>
                    <h4>Herbology and Botanical Medicine</h4>
                  </div>
                  <div className="module-details">
                    <span className="duration">2 Months</span>
                    <span className="price">KSh 20,000</span>
                  </div>
                  <p>Traditional and modern applications of medicinal plants and herbs</p>
                </motion.div>
              </div>
              
              <div className="total-investment">
                <h4>Total Investment: KSh 60,000</h4>
              </div>
            </div>

            <motion.div className="registration-cta" variants={fadeInUp}>
              <button 
                className="btn-primary btn-large"
                onClick={() => setShowRegistrationForm(!showRegistrationForm)}
              >
                {showRegistrationForm ? 'Hide Registration Form' : 'Start Your Journey Today'}
              </button>
            </motion.div>

            {showRegistrationForm && (
              <motion.div 
                className="registration-form-section"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.5 }}
              >
                <h3>Registration Form</h3>
                <form onSubmit={handleRegistrationSubmit} className="registration-form">
                  <div className="form-section">
                    <h4>Personal Information</h4>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={registrationData.firstName}
                          onChange={handleRegistrationChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Other Names</label>
                        <input
                          type="text"
                          name="otherNames"
                          value={registrationData.otherNames}
                          onChange={handleRegistrationChange}
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Gender *</label>
                        <select
                          name="gender"
                          value={registrationData.gender}
                          onChange={handleRegistrationChange}
                          required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>
                      
                      <div className="form-group">
                        <label>Year of Birth *</label>
                        <input
                          type="number"
                          name="yearOfBirth"
                          value={registrationData.yearOfBirth}
                          onChange={handleRegistrationChange}
                          min="1920"
                          max="2010"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={registrationData.email}
                          onChange={handleRegistrationChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={registrationData.phoneNumber}
                          onChange={handleRegistrationChange}
                          placeholder="+254..."
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>City *</label>
                        <input
                          type="text"
                          name="city"
                          value={registrationData.city}
                          onChange={handleRegistrationChange}
                          required
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Country *</label>
                        <input
                          type="text"
                          name="country"
                          value={registrationData.country}
                          onChange={handleRegistrationChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-section">
                    <h4>Select Modules of Interest *</h4>
                    <div className="module-selection">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="selectedModules"
                          value="Module One - Essentials of Applied Clinical Nutrition"
                          checked={registrationData.selectedModules.includes('Module One - Essentials of Applied Clinical Nutrition')}
                          onChange={handleRegistrationChange}
                        />
                        <span className="checkmark"></span>
                        Module One - Essentials of Applied Clinical Nutrition (KSh 10,000)
                      </label>
                      
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="selectedModules"
                          value="Module Two - Fundamentals of Human Anatomy, Physiology & Clinical Pathology"
                          checked={registrationData.selectedModules.includes('Module Two - Fundamentals of Human Anatomy, Physiology & Clinical Pathology')}
                          onChange={handleRegistrationChange}
                        />
                        <span className="checkmark"></span>
                        Module Two - Human Anatomy, Physiology & Clinical Pathology (KSh 30,000)
                      </label>
                      
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="selectedModules"
                          value="Module Three - Herbology and Botanical Medicine"
                          checked={registrationData.selectedModules.includes('Module Three - Herbology and Botanical Medicine')}
                          onChange={handleRegistrationChange}
                        />
                        <span className="checkmark"></span>
                        Module Three - Herbology and Botanical Medicine (KSh 20,000)
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary btn-large">
                    Submit Registration
                  </button>
                </form>
              </motion.div>
            )}

            
          </motion.div>
        </div>
      </motion.section>


    </div>
  );
};

export default AboutPage;
