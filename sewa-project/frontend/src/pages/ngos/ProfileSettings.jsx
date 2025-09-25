import React, { useState } from 'react';
import { 
  User, 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Save,
  Edit,
  Camera,
  Shield,
  Bell,
  Settings,
  Heart
} from 'lucide-react';
import '../../components/CSS/ngos/profileSettings.css';

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    organizationName: 'SEWA Community Foundation',
    contactPerson: 'Dr. Sarah Johnson',
    email: 'sarah@sewacommunity.org',
    phone: '+1 (555) 123-4567',
    website: 'www.sewacommunity.org',
    address: '123 Community Street, Downtown',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    description: '',
    establishedYear: '2018',
    registrationNumber: 'NGO-2018-001',
    taxExemptStatus: '501(c)(3)',
    operatingHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
    emergencyContact: '+1 (555) 987-6543',
    capacity: 500,
    specialties: ['Food Distribution', 'Community Outreach', 'Emergency Relief'],
    certifications: ['Food Safety Certified', 'Non-Profit Management']
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      newDonations: true,
      newRequests: true,
      urgentRequests: true,
      weeklyReports: true,
      monthlyReports: false
    },
    privacy: {
      showContactInfo: true,
      allowDirectContact: true,
      shareStatistics: true
    }
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving profile data:', profileData);
    console.log('Saving preferences:', preferences);
    setIsEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderProfileTab = () => (
    <div className="profile-tab">
      <div className="profile-header">
        <div className="avatar-section">
          <div className="avatar">
            <Heart size={32} />
          </div>
          <button className="avatar-edit-btn">
            <Camera size={16} />
          </button>
        </div>
        <div className="profile-info">
          <h2>{profileData.organizationName}</h2>
          <p>Established in {profileData.establishedYear}</p>
        </div>
      </div>

      <div className="form-sections">
        <div className="form-section">
          <h3>Organization Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>
                <Building size={16} />
                Organization Name
              </label>
              <input
                type="text"
                value={profileData.organizationName}
                onChange={(e) => handleInputChange('organizationName', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>
                <User size={16} />
                Contact Person
              </label>
              <input
                type="text"
                value={profileData.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>
                <Phone size={16} />
                Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>
                <Globe size={16} />
                Website
              </label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>
                <Phone size={16} />
                Emergency Contact
              </label>
              <input
                type="tel"
                value={profileData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Address Information</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>
                <MapPin size={16} />
                Street Address
              </label>
              <input
                type="text"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                value={profileData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                value={profileData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                value={profileData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Organization Details</h3>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={profileData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!isEditing}
              rows={4}
            />
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>Established Year</label>
              <input
                type="number"
                value={profileData.establishedYear}
                onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Registration Number</label>
              <input
                type="text"
                value={profileData.registrationNumber}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Tax Exempt Status</label>
              <input
                type="text"
                value={profileData.taxExemptStatus}
                onChange={(e) => handleInputChange('taxExemptStatus', e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="form-group">
              <label>Daily Capacity</label>
              <input
                type="number"
                value={profileData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="notifications-tab">
      <h3>Notification Preferences</h3>
      <div className="preference-sections">
        {Object.entries(preferences.notifications).map(([key, value]) => (
          <div key={key} className="preference-item">
            <div className="preference-info">
              <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
              <p>Receive notifications for {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="privacy-tab">
      <h3>Privacy Settings</h3>
      <div className="preference-sections">
        {Object.entries(preferences.privacy).map(([key, value]) => (
          <div key={key} className="preference-item">
            <div className="preference-info">
              <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
              <p>Allow {key.replace(/([A-Z])/g, ' $1').toLowerCase()}</p>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handlePreferenceChange('privacy', key, e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="settings-tab">
      <h3>Account Settings</h3>
      <div className="settings-sections">
        <div className="setting-item">
          <div className="setting-info">
            <h4>Change Password</h4>
            <p>Update your account password</p>
          </div>
          <button className="action-btn secondary">Change Password</button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Export Data</h4>
            <p>Download your organization's data</p>
          </div>
          <button className="action-btn secondary">Export Data</button>
        </div>
        <div className="setting-item">
          <div className="setting-info">
            <h4>Delete Account</h4>
            <p>Permanently delete your organization account</p>
          </div>
          <button className="action-btn danger">Delete Account</button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'privacy':
        return renderPrivacyTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="profile-settings">
      <div className="settings-header">
        <div className="header-content">
          <h1>Profile Settings</h1>
          <p>Manage your organization's profile and preferences</p>
        </div>
        <div className="header-actions">
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>
              <Save size={16} />
              Save Changes
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <Edit size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-sidebar">
          <nav className="settings-nav">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <IconComponent size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="settings-main">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

