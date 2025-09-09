import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaUserCircle, FaShieldAlt, FaCrown } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminProfile.css';

const AdminProfile = () => {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: currentUser?.firstName || currentUser?.first_name || '',
    lastName: currentUser?.lastName || currentUser?.last_name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: currentUser?.address || '',
    bio: currentUser?.bio || '',
    avatar: currentUser?.avatar || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Here you would typically save to API
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setProfileData({
      firstName: currentUser?.firstName || currentUser?.first_name || '',
      lastName: currentUser?.lastName || currentUser?.last_name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      address: currentUser?.address || '',
      bio: currentUser?.bio || '',
      avatar: currentUser?.avatar || ''
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const firstName = currentUser?.firstName || currentUser?.first_name || '';
    const lastName = currentUser?.lastName || currentUser?.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getUserType = () => {
    return currentUser?.userType || currentUser?.user_type || currentUser?.role || 'admin';
  };

  const getJoinDate = () => {
    const joinDate = currentUser?.createdAt || currentUser?.created_at || new Date().toISOString();
    return new Date(joinDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-header">
        <div className="admin-profile-banner">
          <div className="admin-profile-banner-overlay"></div>
        </div>
        
        <div className="admin-profile-info">
          <div className="admin-profile-avatar-section">
            <div className="admin-profile-avatar">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Profile" />
              ) : (
                <span className="admin-profile-initials">{getInitials()}</span>
              )}
              <div className="admin-profile-badge">
                <FaCrown />
              </div>
            </div>
            
            <div className="admin-profile-basic-info">
              <h1 className="admin-profile-name">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <div className="admin-profile-role">
                <FaShieldAlt />
                <span>Administrator</span>
              </div>
              <div className="admin-profile-join-date">
                <FaCalendarAlt />
                <span>Joined {getJoinDate()}</span>
              </div>
            </div>
          </div>

          <div className="admin-profile-actions">
            {!isEditing ? (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <div className="admin-profile-edit-actions">
                <button className="btn btn-success" onClick={handleSave}>
                  <FaSave /> Save Changes
                </button>
                <button className="btn btn-secondary" onClick={handleCancel}>
                  <FaTimes /> Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="admin-profile-content">
        <div className="admin-profile-section">
          <h3 className="admin-profile-section-title">
            <FaUser /> Personal Information
          </h3>
          
          <div className="admin-profile-form">
            <div className="admin-profile-form-row">
              <div className="admin-profile-form-group">
                <label>First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter first name"
                  />
                ) : (
                  <div className="admin-profile-field-value">
                    {profileData.firstName || 'Not provided'}
                  </div>
                )}
              </div>
              
              <div className="admin-profile-form-group">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter last name"
                  />
                ) : (
                  <div className="admin-profile-field-value">
                    {profileData.lastName || 'Not provided'}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-profile-form-group">
              <label>
                <FaEnvelope /> Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              ) : (
                <div className="admin-profile-field-value">
                  {profileData.email || 'Not provided'}
                </div>
              )}
            </div>

            <div className="admin-profile-form-group">
              <label>
                <FaPhone /> Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              ) : (
                <div className="admin-profile-field-value">
                  {profileData.phone || 'Not provided'}
                </div>
              )}
            </div>

            <div className="admin-profile-form-group">
              <label>
                <FaMapMarkerAlt /> Address
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              ) : (
                <div className="admin-profile-field-value">
                  {profileData.address || 'Not provided'}
                </div>
              )}
            </div>

            <div className="admin-profile-form-group">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself"
                  rows="4"
                />
              ) : (
                <div className="admin-profile-field-value">
                  {profileData.bio || 'No bio provided'}
                </div>
              )}
            </div>

            {isEditing && (
              <div className="admin-profile-form-group">
                <label>Avatar URL</label>
                <input
                  type="url"
                  name="avatar"
                  value={profileData.avatar}
                  onChange={handleInputChange}
                  placeholder="Enter avatar image URL"
                />
                {profileData.avatar && (
                  <div className="avatar-preview">
                    <img src={profileData.avatar} alt="Avatar preview" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="admin-profile-section">
          <h3 className="admin-profile-section-title">
            <FaShieldAlt /> Account Information
          </h3>
          
          <div className="admin-profile-account-info">
            <div className="admin-profile-info-item">
              <div className="admin-profile-info-label">Account Type</div>
              <div className="admin-profile-info-value admin-badge">
                <FaCrown />
                {getUserType().toUpperCase()}
              </div>
            </div>
            
            <div className="admin-profile-info-item">
              <div className="admin-profile-info-label">User ID</div>
              <div className="admin-profile-info-value">
                #{currentUser?.id || 'N/A'}
              </div>
            </div>
            
            <div className="admin-profile-info-item">
              <div className="admin-profile-info-label">Email Verified</div>
              <div className="admin-profile-info-value">
                <span className={`verification-status ${currentUser?.is_email_verified ? 'verified' : 'unverified'}`}>
                  {currentUser?.is_email_verified ? '✓ Verified' : '✗ Unverified'}
                </span>
              </div>
            </div>
            
            <div className="admin-profile-info-item">
              <div className="admin-profile-info-label">Member Since</div>
              <div className="admin-profile-info-value">
                {getJoinDate()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
