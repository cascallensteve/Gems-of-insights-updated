import React, { useState, useEffect } from 'react';
import { newsletterService } from '../../services/newsletterService';
import apiService from '../../services/api';
import './NewsletterManager.css';

const NewsletterManager = () => {
  const [activeTab, setActiveTab] = useState('subscribers');
  const [subscribers, setSubscribers] = useState([]);
  const [courseEnrollments, setCourseEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Newsletter sending state
  const [newsletterData, setNewsletterData] = useState({
    subject: '',
    body: ''
  });
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      if (activeTab === 'subscribers') {
        await fetchSubscribers();
      } else if (activeTab === 'courses') {
        await fetchCourseEnrollments();
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      // Try to fetch from API first
      try {
        const response = await apiService.newsletter.getAllSubscribers();
        setSubscribers(response.subscribers || []);
      } catch (apiError) {
        console.log('API not available, using local storage');
        // Fallback to local storage
        const localSubscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        setSubscribers(localSubscribers.map(email => ({ email, subscribed_at: 'Local Storage' })));
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      // Fallback to local storage
      const localSubscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      setSubscribers(localSubscribers.map(email => ({ email, subscribed_at: 'Local Storage' })));
    }
  };

  const fetchCourseEnrollments = async () => {
    try {
      // Try to fetch course enrollments from API
      try {
        const response = await apiService.courses.getAllEnrollments();
        setCourseEnrollments(response.enrollments || []);
      } catch (apiError) {
        console.log('Course API not available, using mock data');
        // Fallback to mock data for demonstration
        setCourseEnrollments([
          {
            id: 1,
            student_name: 'John Doe',
            email: 'john@example.com',
            course_name: 'Health & Wellness Fundamentals',
            enrollment_date: '2024-01-15',
            status: 'Active',
            progress: 75
          },
          {
            id: 2,
            student_name: 'Jane Smith',
            email: 'jane@example.com',
            course_name: 'Nutrition Mastery',
            enrollment_date: '2024-01-20',
            status: 'Active',
            progress: 45
          },
          {
            id: 3,
            student_name: 'Mike Johnson',
            email: 'mike@example.com',
            course_name: 'Mental Health Awareness',
            enrollment_date: '2024-01-25',
            status: 'Completed',
            progress: 100
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching course enrollments:', error);
      setError('Failed to fetch course enrollments');
    }
  };

  const handleSendNewsletter = async (e) => {
    e.preventDefault();
    
    if (!newsletterData.subject.trim() || !newsletterData.body.trim()) {
      setError('Please fill in both subject and body fields');
      return;
    }

    setSendingNewsletter(true);
    setError('');
    setMessage('');

    try {
      const result = await newsletterService.sendNewsletter(newsletterData);
      setMessage(result.message || 'Newsletter sent successfully!');
      
      // Clear form on success
      setNewsletterData({
        subject: '',
        body: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to send newsletter. Please try again.');
    } finally {
      setSendingNewsletter(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsletterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const exportSubscribers = () => {
    if (subscribers.length === 0) {
      setError('No subscribers to export');
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Subscribed Date\n"
      + subscribers.map(sub => `${sub.email},${sub.subscribed_at}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setMessage(`Exported ${subscribers.length} subscribers to CSV`);
  };

  const exportCourseEnrollments = () => {
    if (courseEnrollments.length === 0) {
      setError('No course enrollments to export');
      return;
    }
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student Name,Email,Course Name,Enrollment Date,Status,Progress\n"
      + courseEnrollments.map(enrollment => 
        `${enrollment.student_name},${enrollment.email},${enrollment.course_name},${enrollment.enrollment_date},${enrollment.status},${enrollment.progress}%`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `course_enrollments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setMessage(`Exported ${courseEnrollments.length} course enrollments to CSV`);
  };

  return (
    <div className="newsletter-manager">
      <div className="newsletter-header">
        <h1>Newsletter & Course Management</h1>
        <p>Manage newsletter subscribers and course enrollments</p>
      </div>

      <div className="newsletter-tabs">
        <button 
          className={`tab-button ${activeTab === 'subscribers' ? 'active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          📧 Newsletter Subscribers ({subscribers.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          🎓 Course Enrollments ({courseEnrollments.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'send' ? 'active' : ''}`}
          onClick={() => setActiveTab('send')}
        >
          📤 Send Newsletter
        </button>
      </div>

      {message && (
        <div className="success-message">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      <div className="newsletter-content">
        {activeTab === 'subscribers' && (
          <div className="subscribers-section">
            <div className="section-header">
              <h2>Newsletter Subscribers</h2>
              <div className="section-actions">
                <button onClick={fetchSubscribers} className="refresh-btn">
                  🔄 Refresh
                </button>
                <button onClick={exportSubscribers} className="export-btn">
                  📥 Export CSV
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading subscribers...</div>
            ) : (
              <div className="subscribers-table">
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Subscribed Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.length > 0 ? (
                      subscribers.map((subscriber, index) => (
                        <tr key={index}>
                          <td>{subscriber.email}</td>
                          <td>{subscriber.subscribed_at}</td>
                          <td>
                            <span className="status-badge active">Active</span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="no-data">No subscribers found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div className="courses-section">
            <div className="section-header">
              <h2>Course Enrollments</h2>
              <div className="section-actions">
                <button onClick={fetchCourseEnrollments} className="refresh-btn">
                  🔄 Refresh
                </button>
                <button onClick={exportCourseEnrollments} className="export-btn">
                  📥 Export CSV
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading course enrollments...</div>
            ) : (
              <div className="courses-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Course</th>
                      <th>Enrollment Date</th>
                      <th>Status</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courseEnrollments.length > 0 ? (
                      courseEnrollments.map((enrollment) => (
                        <tr key={enrollment.id}>
                          <td>{enrollment.student_name}</td>
                          <td>{enrollment.email}</td>
                          <td>{enrollment.course_name}</td>
                          <td>{enrollment.enrollment_date}</td>
                          <td>
                            <span className={`status-badge ${enrollment.status.toLowerCase()}`}>
                              {enrollment.status}
                            </span>
                          </td>
                          <td>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${enrollment.progress}%` }}
                              ></div>
                              <span className="progress-text">{enrollment.progress}%</span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="no-data">No course enrollments found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'send' && (
          <div className="send-newsletter-section">
            <div className="section-header">
              <h2>Send Newsletter</h2>
              <p>Send a newsletter to all subscribers</p>
            </div>

            <form onSubmit={handleSendNewsletter} className="newsletter-form">
              <div className="form-group">
                <label htmlFor="subject">Subject:</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={newsletterData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter newsletter subject..."
                  required
                  disabled={sendingNewsletter}
                />
              </div>

              <div className="form-group">
                <label htmlFor="body">Body:</label>
                <textarea
                  id="body"
                  name="body"
                  value={newsletterData.body}
                  onChange={handleInputChange}
                  placeholder="Enter newsletter content..."
                  rows="8"
                  required
                  disabled={sendingNewsletter}
                />
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="send-button"
                  disabled={sendingNewsletter}
                >
                  {sendingNewsletter ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    'Send Newsletter'
                  )}
                </button>
              </div>
            </form>

            <div className="newsletter-info">
              <h3>Newsletter Information:</h3>
              <ul>
                <li><strong>Total Subscribers:</strong> {subscribers.length}</li>
                <li><strong>API Endpoint:</strong> POST /newsletter/send-newsletter</li>
                <li><strong>Authentication:</strong> Required (Admin only)</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsletterManager;
