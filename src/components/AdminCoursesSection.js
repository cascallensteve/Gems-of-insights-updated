import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaClock, FaUsers, FaStar, FaShoppingCart, FaEye } from 'react-icons/fa';
import EnrollmentModal from './EnrollmentModal';
import LoadingDots from './LoadingDots';
import './AdminCoursesSection.css';
import apiService from '../services/api';

const AdminCoursesSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [enrollingCourse, setEnrollingCourse] = useState(null);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  useEffect(() => {
    fetchCourses();
    
    // Listen for localStorage changes (when admin updates courses)
    const handleStorageChange = () => {
      fetchCourses();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await apiService.courses.listCourses();
      const list = Array.isArray(data?.courses) ? data.courses : [];
      setCourses(list);
    } catch (error) {
      console.error('Error loading courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const formatKshPrice = (costInCents) => {
    if (!costInCents) return '0.00';
    const price = costInCents / 100;
    return price.toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setShowModal(false);
  };

  const handleEnrollCourse = (course) => {
    setEnrollingCourse(course);
    setShowEnrollmentModal(true);
  };

  const handleEnrollmentSuccess = (enrollmentData) => {
    // Update course enrollment count in local state
    setCourses(prevCourses => 
      prevCourses.map(course => 
        course.id === enrollmentData.course.id 
          ? { ...course, enrollments: (course.enrollments || 0) + 1 }
          : course
      )
    );

    // Create a custom event to notify other parts of the application
    window.dispatchEvent(new CustomEvent('studentEnrolled', {
      detail: enrollmentData
    }));
  };

  const handleCloseEnrollmentModal = () => {
    setEnrollingCourse(null);
    setShowEnrollmentModal(false);
  };

  if (loading) {
    return (
      <section className="admin-courses-section">
        <div className="container">
          <div className="courses-loading">
            <LoadingDots text="Loading our latest courses..." />
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="admin-courses-section">
        <div className="container">
          <div className="section-header">
            <h2>
              <FaGraduationCap className="section-icon" />
              Additional Learning Opportunities
            </h2>
            <p>Explore our educational offerings designed to empower your learning journey</p>
          </div>
          
          <div className="no-courses">
            <FaGraduationCap className="no-courses-icon" />
            <h3>Coming Soon</h3>
            <p>We're preparing amazing courses for you. Check back soon for updates!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="admin-courses-section">
      <div className="container">
        <div className="section-header">
          <h2>
            <FaGraduationCap className="section-icon" />
            Additional Learning Opportunities
          </h2>
          <p>Expand your knowledge with our comprehensive courses designed to complement your medical missionary training</p>
          <div className="courses-stats">
            <div className="stat-item">
              <span className="stat-number">{courses.length}</span>
              <span className="stat-label">Available Courses</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{courses.reduce((acc, course) => acc + (course.enrollments || 0), 0)}</span>
              <span className="stat-label">Students Enrolled</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {courses.length > 0 
                  ? (courses.reduce((acc, course) => acc + (course.rating || 0), 0) / courses.length).toFixed(1)
                  : '0.0'
                }
              </span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>

        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.id} className="course-card">
              
              <div className="course-content">
                <div className="course-header">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-price">
                    KSh {course.price || (course.cost ? formatKshPrice(course.cost) : '0.00')}
                  </div>
                </div>
                
                <p className="course-description">
                  {course.description.length > 120 
                    ? `${course.description.substring(0, 120)}...` 
                    : course.description
                  }
                </p>
                
                <div className="course-meta">
                  <div className="meta-item">
                    <FaUsers className="meta-icon" />
                    <span>{course.enrollments || 0} students</span>
                  </div>
                  <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <span>{course.duration || 'Self-paced'}</span>
                  </div>
                  <div className="meta-item">
                    <FaStar className="meta-icon" />
                    <span>{course.rating || 0}/5</span>
                  </div>
                </div>
                
                <div className="course-footer">
                  <div className="instructor">
                    By {course.instructor || 'Expert Instructor'}
                  </div>
                  <button 
                    className="enroll-btn"
                    onClick={() => handleEnrollCourse(course)}
                  >
                    <FaShoppingCart />
                    Enroll Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Course Detail Modal */}
        {showModal && selectedCourse && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedCourse.title}</h2>
                <button className="modal-close" onClick={handleCloseModal}>×</button>
              </div>
              
              <div className="modal-body">
                
                <div className="course-details">
                  <div className="price-section">
                    <span className="price">
                      KSh {selectedCourse.price || (selectedCourse.cost ? formatKshPrice(selectedCourse.cost) : '0.00')}
                    </span>
                    <div className="course-stats">
                      <span><FaUsers /> {selectedCourse.enrollments || 0} students</span>
                      <span><FaClock /> {selectedCourse.duration || 'Self-paced'}</span>
                      <span><FaStar /> {selectedCourse.rating || 0}/5</span>
                    </div>
                  </div>
                  
                  <h3>Course Description</h3>
                  <p>{selectedCourse.description}</p>
                  
                  <div className="instructor-info">
                    <h4>Instructor</h4>
                    <p>{selectedCourse.instructor || 'Expert Instructor'}</p>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="enroll-btn-large"
                  onClick={() => handleEnrollCourse(selectedCourse)}
                >
                  <FaShoppingCart />
                  Enroll Now - KSh {selectedCourse.price || (selectedCourse.cost ? formatKshPrice(selectedCourse.cost) : '0.00')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Modal */}
        <EnrollmentModal
          course={enrollingCourse}
          isOpen={showEnrollmentModal}
          onClose={handleCloseEnrollmentModal}
          onEnrollmentSuccess={handleEnrollmentSuccess}
        />
      </div>
    </section>
  );
};

export default AdminCoursesSection;
