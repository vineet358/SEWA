import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Users, 
  Eye, 
  EyeOff, 
  Mail, 
  Phone, 
  MapPin, 
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import './AuthSystem.css';
import bgImage from '../../assets/food4.jpeg'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthSystem = ({ initialUserType = 'individual', onBack }) => {
  console.log('AuthSystem rendered with initialUserType:', initialUserType);
  const [authMode, setAuthMode] = useState('login');
  const [userType, setUserType] = useState(initialUserType);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // Individual fields
    name: '',
    
    // NGO fields
    organizationName: '',
    contactPerson: '',
    address: '',
    licenseNumber: '',
    
    // Hotel fields
    hotelName: '',
    managerName: '', 
    address: '',
    licenseNumber: '',
    
    // Optional
    profilePicture: null,
    documents: null
  });

  const userTypes = [
    {
      id: 'individual',
      name: 'Individual',
      icon: User,
      description: 'Personal food donors',
      color: '#3b82f6'
    },
    {
      id: 'ngo',
      name: 'NGO',
      icon: Users,
      description: 'Non-profit organizations',
      color: '#10b981'
    },
    {
      id: 'hotel',
      name: 'Hotel',
      icon: Building,
      description: 'Hotels & restaurants',
      color: '#8b5cf6'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
  
    if (errors.form) {
      setErrors(prev => ({
        ...prev,
        form: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0] || null
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Common validations
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      }

      // User type specific validations for registration
      if (userType === 'individual') {
        if (!formData.name) {
          newErrors.name = 'Name is required';
        }
      } else if (userType === 'ngo') {
        if (!formData.organizationName) {
          newErrors.organizationName = 'Organization name is required';
        }
        if (!formData.contactPerson) {
          newErrors.contactPerson = 'Contact person is required';
        }
        if (!formData.address) {
          newErrors.address = 'Address is required';
        }
        if (!formData.licenseNumber) {
          newErrors.licenseNumber = 'License number is required';
        }
      } else if (userType === 'hotel') {
        if (!formData.hotelName) {
          newErrors.hotelName = 'Hotel name is required';
        }
        if (!formData.managerName) {
          newErrors.managerName = 'Manager name is required';
        }
        if (!formData.address) {
          newErrors.address = 'Address is required';
        }
        if (!formData.licenseNumber) {
          newErrors.licenseNumber = 'License number is required';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    setIsLoading(true);
    setErrors({});
  
    try {
      let url = '';
      let payload = {};
  
      if (authMode === 'login') {
        url = `http://localhost:5000/api/auth/${userType}/login`;
        payload = {
          email: formData.email,
          password: formData.password,
        };
      } else if (authMode === 'register') {
        url = `http://localhost:5000/api/auth/${userType}/signup`;
  
        // Payload based on user type
        if (userType === 'individual') {
          payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          };
        } else if (userType === 'ngo') {
          payload = {
            organizationName: formData.organizationName,
            contactPerson: formData.contactPerson,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            licenseNumber: formData.licenseNumber,
          };
        } else if (userType === 'hotel') {
          payload = {
            hotelName: formData.hotelName,
            managerName: formData.managerName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            licenseNumber: formData.licenseNumber,
          };
        }
      }
  
      const response = await axios.post(url, payload);
      console.log('Response:', response.data);
  
    // ----------------------------
// LOGIN SUCCESS HANDLING
// ----------------------------
if (authMode === 'login' && response.data.token) {
  // Store token and user type
  localStorage.setItem('authToken', response.data.token);
  localStorage.setItem('userType', userType);

  if (userType === 'hotel') {
    const hotel = response.data.hotel;

    // Store minimal info for general auth
    localStorage.setItem('userId', hotel.hotelId);

    // Store full hotel info for donation or other components
    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        hotelId: hotel.hotelId,
        hotelName: hotel.hotelName,
        licenseNumber: hotel.licenseNumber
      })
    );

    // Redirect to hotel dashboard
    Navigate('/hotel');

  } else if (userType === 'ngo') {
    const ngo = response.data.ngo;

    localStorage.setItem('userId', ngo.id);

    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        ngoId: ngo.id,
        ngoName: ngo.name,
        email: ngo.email
      })
    );

    Navigate('/ngo');

  } else {
    // Regular user
    const user = response.data.user;

    localStorage.setItem('userId', user.id);

    localStorage.setItem(
      'userInfo',
      JSON.stringify({
        userId: user.id,
        name: user.name,
        email: user.email
      })
    );

    Navigate('/user-dashboard'); // change as needed
  }
}

// Show success message and reset form
setSuccess(true);
setTimeout(() => {
  setSuccess(false);
  if (authMode === 'register') setAuthMode('login');

  setFormData({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
    organizationName: '',
    contactPerson: '',
    managerName: '',
    address: '',
    licenseNumber: '',
    hotelName: '',
    profilePicture: null,
    documents: null,
  });
}, 3000);
    } catch (err) {
      console.error('Error during auth:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setErrors({ form: err.response.data.message });
      } else {
        setErrors({ form: 'An error occurred. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  
  const renderUserTypeSelector = () => (
    <div className="user-type-selector">
      <h3>Select User Type</h3>
      <div className="user-type-grid">
        {userTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              className={`user-type-card ${userType === type.id ? 'active' : ''}`}
              onClick={() => setUserType(type.id)}
              style={{ '--type-color': type.color }}
            >
              <IconComponent size={24} />
              <span className="type-name">{type.name}</span>
              <span className="type-description">{type.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderFormFields = () => {
    if (authMode === 'login') {
      return (
        <div className="form-fields">
          {/* Show global form error for login */}
          {errors.form && (
            <div className="error-message" style={{ color: "red", marginBottom: "10px", padding: "10px", backgroundColor: "#ffeaea", borderRadius: "5px" }}>
              {errors.form}
            </div>
          )}
          
          <div className="input-group">
            <Mail size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>
        </div>
      );
    }

    return (
      <div className="form-fields">
        {/* Show global form error for registration */}
        {errors.form && (
          <div className="error-message" style={{ color: "red", marginBottom: "10px", padding: "10px", backgroundColor: "#ffeaea", borderRadius: "5px" }}>
            {errors.form}
          </div>
        )}
    
        {userType === 'individual' && (
          <div className="input-group">
            <User size={20} />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}  
          </div>
        )}
    
        {(userType === 'ngo' || userType === 'hotel') && (
          <>
            <div className="input-group">
              <Building size={20} />
              <input
                type="text"
                name={userType === 'ngo' ? 'organizationName' : 'hotelName'}
                placeholder={userType === 'ngo' ? 'Organization Name' : 'Hotel Name'}
                value={userType === 'ngo' ? formData.organizationName : formData.hotelName}
                onChange={handleInputChange}
                className={errors[userType === 'ngo' ? 'organizationName' : 'hotelName'] ? 'error' : ''}
              />
              {errors[userType === 'ngo' ? 'organizationName' : 'hotelName'] && (
                <span className="error-text">
                  {errors[userType === 'ngo' ? 'organizationName' : 'hotelName']}
                </span>
              )}
            </div>
    
            <div className="input-group">
              <User size={20} />
              <input
                type="text"
                name={userType === 'ngo' ? 'contactPerson' : 'managerName'}
                placeholder={userType === 'ngo' ? 'Contact Person' : 'Manager Name'}
                value={userType === 'ngo' ? formData.contactPerson : formData.managerName}
                onChange={handleInputChange}
                className={errors[userType === 'ngo' ? 'contactPerson' : 'managerName'] ? 'error' : ''}
              />
              {errors[userType === 'ngo' ? 'contactPerson' : 'managerName'] && (
                <span className="error-text">
                  {errors[userType === 'ngo' ? 'contactPerson' : 'managerName']}
                </span>
              )}
            </div>
    
            <div className="input-group">
              <MapPin size={20} />
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleInputChange}
                className={errors.address ? 'error' : ''}
                rows="3"
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
            
            <div className="input-group">
              <FileText size={20} />
              <input
                type="text"
                name="licenseNumber"
                placeholder="License Number"
                value={formData.licenseNumber}
                onChange={handleInputChange}
                className={errors.licenseNumber ? 'error' : ''}
              />
              {errors.licenseNumber && <span className="error-text">{errors.licenseNumber}</span>}
            </div>
          </>
        )}

        <div className="input-group">
          <Mail size={20} />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="input-group">
          <Phone size={20} />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            value={formData.phone}
            onChange={handleInputChange}
            className={errors.phone ? 'error' : ''}
          />
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        <div className="input-group">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            className={errors.password ? 'error' : ''}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="input-group">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={errors.confirmPassword ? 'error' : ''}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        {(userType === 'ngo' || userType === 'hotel') && (
          <div className="file-upload-section">
            <label className="file-upload-label">
              <input
                type="file"
                name="documents"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <FileText size={20} />
              <span>Upload Documents (Optional)</span>
              <small>License, registration certificates, etc.</small>
            </label>
          </div>
        )}
      </div>
    );
  };

  if (success) {
    return (
      <div
        className="auth-container"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="auth-overlay"></div>
        
        <div className="auth-card success-card">
          <CheckCircle size={64} className="success-icon" />
          <h2>Success!</h2>
          <p>
            {authMode === "register"
              ? `Your ${userType} account has been created successfully!`
              : "Login successful!"}
          </p>
          <p>Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }    

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <div className="auth-header">
          {onBack && (
            <button className="back-btn" onClick={onBack}>
              <ArrowLeft size={20} />
              Back to Home
            </button>
          )}
          <h1>SEWA Food Portal</h1>
          <p>Join the fight against food waste</p>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${authMode === "login" ? "active" : ""}`}
            onClick={() => setAuthMode("login")}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab ${authMode === "register" ? "active" : ""}`}
            onClick={() => setAuthMode("register")}
          >
            Register
          </button>
        </div>

        {authMode === "register" && renderUserTypeSelector()}

        <form onSubmit={handleSubmit} className="auth-form">
          {renderFormFields()}

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="loading">
                <div className="spinner"></div>
                {authMode === "login" ? "Signing in..." : "Creating account..."}
              </span>
            ) : (
              <>
                {authMode === "login" ? "Sign In" : "Create Account"}
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          {authMode === "login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                className="auth-link"
                onClick={() => setAuthMode("register")}
              >
                Register here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="auth-link"
                onClick={() => setAuthMode("login")}
              >
                Sign in here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;