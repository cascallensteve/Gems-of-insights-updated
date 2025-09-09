import React, { useState } from 'react';
import apiService from '../services/api';

const CourseEnrollmentTest = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const testListCourses = async () => {
    setLoading(true);
    setResult('');
    try {
      const data = await apiService.courses.listCourses();
      setCourses(data.courses || []);
      setResult(`✅ Successfully loaded ${data.courses?.length || 0} courses`);
    } catch (error) {
      setResult(`❌ Error loading courses: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const testEnrollment = async (courseId) => {
    setLoading(true);
    setResult('');
    try {
      const enrollmentData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '0712345678'
      };
      
      const response = await apiService.courses.enrollInCourse(courseId, enrollmentData);
      setResult(`✅ Enrollment successful: ${response.message}`);
    } catch (error) {
      setResult(`❌ Enrollment failed: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Course Enrollment Test</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testListCourses} disabled={loading}>
          {loading ? 'Loading...' : 'Test List Courses'}
        </button>
      </div>

      {result && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {result}
        </div>
      )}

      {courses.length > 0 && (
        <div>
          <h4>Available Courses:</h4>
          {courses.map(course => (
            <div key={course.id} style={{ 
              border: '1px solid #ddd', 
              padding: '10px', 
              margin: '10px 0',
              borderRadius: '4px'
            }}>
              <h5>{course.title}</h5>
              <p>Cost: KES {course.cost}</p>
              <p>Description: {course.description}</p>
              <button 
                onClick={() => testEnrollment(course.id)}
                disabled={loading}
                style={{ 
                  backgroundColor: '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  padding: '5px 10px',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Test Enroll
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseEnrollmentTest;

