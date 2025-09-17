import React, { useState, useEffect } from 'react';
import LoadingDots from '../LoadingDots';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Gems of Insight',
    siteDescription: 'Your trusted source for natural health and wellness products',
    siteUrl: 'https://gems-of-insight.vercel.app',
    adminEmail: 'admin@gemsofinsight.com',
    timezone: 'Africa/Nairobi',
    language: 'en',
    currency: 'KSH',
    maintenanceMode: false
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: 'noreply@gemsofinsight.com',
    fromName: 'Gems of Insight',
    enableNotifications: true,
    orderConfirmation: true,
    userRegistration: true,
    passwordReset: true,
    newsletter: true
  });

  const [paymentSettings, setPaymentSettings] = useState({
    enableMpesa: true,
    mpesaConsumerKey: '',
    mpesaConsumerSecret: '',
    mpesaPasskey: '',
    mpesaShortcode: '',
    enablePaypal: false,
    paypalClientId: '',
    paypalClientSecret: '',
    enableStripe: false,
    stripePublishableKey: '',
    stripeSecretKey: '',
    enableCod: true,
    taxRate: 16,
    shippingFee: 200
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enableCaptcha: true,
    passwordMinLength: 8,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    enableAuditLog: true,
    enableSslRedirect: true
  });

  const [systemSettings, setSystemSettings] = useState({
    debugMode: false,
    logLevel: 'info',
    cacheEnabled: true,
    cacheTimeout: 3600,
    maxFileSize: 10,
    allowedFileTypes: 'jpg,jpeg,png,gif,pdf,doc,docx',
    backupFrequency: 'daily',
    enableCompression: true,
    enableCdn: false,
    cdnUrl: ''
  });

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'email', name: 'Email', icon: '📧' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'system', name: 'System', icon: '🖥️' }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Mock loading settings - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      showMessage('error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async (settingsType) => {
    try {
      setLoading(true);
      // Mock saving settings - replace with real API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      showMessage('success', `${settingsType} settings saved successfully!`);
    } catch (error) {
      showMessage('error', `Failed to save ${settingsType} settings`);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    saveSettings('general');
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    saveSettings('email');
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    saveSettings('payment');
  };

  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    saveSettings('security');
  };

  const handleSystemSubmit = (e) => {
    e.preventDefault();
    saveSettings('system');
  };

  const testEmailConnection = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      showMessage('success', 'Email connection test successful!');
    } catch (error) {
      showMessage('error', 'Email connection test failed');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      showMessage('success', 'Cache cleared successfully!');
    } catch (error) {
      showMessage('error', 'Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      showMessage('success', 'Backup created successfully!');
    } catch (error) {
      showMessage('error', 'Failed to create backup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-settings">
      {/* Header */}
      <div className="settings-header">
        <div className="header-content">
          <h1>System Settings</h1>
          <p>Configure and manage your application settings</p>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`settings-message ${message.type}`}>
          {message.text}
          <button onClick={() => setMessage({ type: '', text: '' })}>×</button>
        </div>
      )}

      {/* Settings Container */}
      <div className="settings-container">
        {/* Sidebar */}
        <div className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* General Settings */}
          {activeTab === 'general' && (
            <form onSubmit={handleGeneralSubmit} className="settings-form">
              <h2>General Settings</h2>
              
              <div className="form-section">
                <h3>Site Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Site Name *</label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Site URL *</label>
                    <input
                      type="url"
                      value={generalSettings.siteUrl}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})}
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Site Description</label>
                  <textarea
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Regional Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Timezone</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    >
                      <option value="Africa/Nairobi">Africa/Nairobi</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                    >
                      <option value="en">English</option>
                      <option value="sw">Swahili</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Currency</label>
                    <select
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                    >
                      <option value="KSH">KSH (Kenyan Shilling)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>System Status</h3>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={generalSettings.maintenanceMode}
                      onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                    />
                    Enable Maintenance Mode
                  </label>
                  <small>When enabled, the site will show a maintenance page to visitors</small>
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <LoadingDots text="Saving" size="small" color="#ffffff" />
                ) : (
                  'Save General Settings'
                )}
              </button>
            </form>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="settings-form">
              <h2>Email Settings</h2>
              
              <div className="form-section">
                <h3>SMTP Configuration</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>SMTP Host</label>
                    <input
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>SMTP Port</label>
                    <input
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Username</label>
                    <input
                      type="text"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="test-btn" onClick={testEmailConnection}>
                    Test Connection
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h3>Email Notifications</h3>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={emailSettings.orderConfirmation}
                      onChange={(e) => setEmailSettings({...emailSettings, orderConfirmation: e.target.checked})}
                    />
                    Order Confirmation
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={emailSettings.userRegistration}
                      onChange={(e) => setEmailSettings({...emailSettings, userRegistration: e.target.checked})}
                    />
                    User Registration
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={emailSettings.passwordReset}
                      onChange={(e) => setEmailSettings({...emailSettings, passwordReset: e.target.checked})}
                    />
                    Password Reset
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={emailSettings.newsletter}
                      onChange={(e) => setEmailSettings({...emailSettings, newsletter: e.target.checked})}
                    />
                    Newsletter
                  </label>
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <LoadingDots text="Saving" size="small" color="#ffffff" />
                ) : (
                  'Save Email Settings'
                )}
              </button>
            </form>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="settings-form">
              <h2>Payment Settings</h2>
              
              <div className="form-section">
                <h3>M-Pesa Settings</h3>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableMpesa}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableMpesa: e.target.checked})}
                    />
                    Enable M-Pesa Payments
                  </label>
                </div>
                {paymentSettings.enableMpesa && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Consumer Key</label>
                      <input
                        type="text"
                        value={paymentSettings.mpesaConsumerKey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, mpesaConsumerKey: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Consumer Secret</label>
                      <input
                        type="password"
                        value={paymentSettings.mpesaConsumerSecret}
                        onChange={(e) => setPaymentSettings({...paymentSettings, mpesaConsumerSecret: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Passkey</label>
                      <input
                        type="password"
                        value={paymentSettings.mpesaPasskey}
                        onChange={(e) => setPaymentSettings({...paymentSettings, mpesaPasskey: e.target.value})}
                      />
                    </div>
                    <div className="form-group">
                      <label>Shortcode</label>
                      <input
                        type="text"
                        value={paymentSettings.mpesaShortcode}
                        onChange={(e) => setPaymentSettings({...paymentSettings, mpesaShortcode: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h3>Other Payment Methods</h3>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enablePaypal}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enablePaypal: e.target.checked})}
                    />
                    Enable PayPal
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableStripe}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableStripe: e.target.checked})}
                    />
                    Enable Stripe
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableCod}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableCod: e.target.checked})}
                    />
                    Enable Cash on Delivery
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Pricing Settings</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Tax Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={paymentSettings.taxRate}
                      onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Standard Shipping Fee (KSH)</label>
                    <input
                      type="number"
                      min="0"
                      value={paymentSettings.shippingFee}
                      onChange={(e) => setPaymentSettings({...paymentSettings, shippingFee: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <LoadingDots text="Saving" size="small" color="#ffffff" />
                ) : (
                  'Save Payment Settings'
                )}
              </button>
            </form>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <form onSubmit={handleSecuritySubmit} className="settings-form">
              <h2>Security Settings</h2>
              
              <div className="form-section">
                <h3>Authentication</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Session Timeout (minutes)</label>
                    <input
                      type="number"
                      min="5"
                      max="1440"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Login Attempts</label>
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableTwoFactor}
                      onChange={(e) => setSecuritySettings({...securitySettings, enableTwoFactor: e.target.checked})}
                    />
                    Enable Two-Factor Authentication
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.enableCaptcha}
                      onChange={(e) => setSecuritySettings({...securitySettings, enableCaptcha: e.target.checked})}
                    />
                    Enable CAPTCHA
                  </label>
                </div>
              </div>

              <div className="form-section">
                <h3>Password Policy</h3>
                <div className="form-group">
                  <label>Minimum Password Length</label>
                  <input
                    type="number"
                    min="6"
                    max="32"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.requireUppercase}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireUppercase: e.target.checked})}
                    />
                    Require Uppercase Letters
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.requireNumbers}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireNumbers: e.target.checked})}
                    />
                    Require Numbers
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={securitySettings.requireSpecialChars}
                      onChange={(e) => setSecuritySettings({...securitySettings, requireSpecialChars: e.target.checked})}
                    />
                    Require Special Characters
                  </label>
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <LoadingDots text="Saving" size="small" color="#ffffff" />
                ) : (
                  'Save Security Settings'
                )}
              </button>
            </form>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <form onSubmit={handleSystemSubmit} className="settings-form">
              <h2>System Settings</h2>
              
              <div className="form-section">
                <h3>Performance & Caching</h3>
                <div className="checkbox-grid">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={systemSettings.cacheEnabled}
                      onChange={(e) => setSystemSettings({...systemSettings, cacheEnabled: e.target.checked})}
                    />
                    Enable Caching
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={systemSettings.enableCompression}
                      onChange={(e) => setSystemSettings({...systemSettings, enableCompression: e.target.checked})}
                    />
                    Enable Compression
                  </label>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="action-btn" onClick={clearCache}>
                    Clear Cache
                  </button>
                </div>
              </div>

              <div className="form-section">
                <h3>File Management</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Max File Size (MB)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={systemSettings.maxFileSize}
                      onChange={(e) => setSystemSettings({...systemSettings, maxFileSize: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Allowed File Types</label>
                    <input
                      type="text"
                      value={systemSettings.allowedFileTypes}
                      onChange={(e) => setSystemSettings({...systemSettings, allowedFileTypes: e.target.value})}
                      placeholder="jpg,png,pdf,doc"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Backup & Maintenance</h3>
                <div className="form-group">
                  <label>Backup Frequency</label>
                  <select
                    value={systemSettings.backupFrequency}
                    onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="form-actions">
                  <button type="button" className="action-btn" onClick={createBackup}>
                    Create Backup Now
                  </button>
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={loading}>
                {loading ? (
                  <LoadingDots text="Saving" size="small" color="#ffffff" />
                ) : (
                  'Save System Settings'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
