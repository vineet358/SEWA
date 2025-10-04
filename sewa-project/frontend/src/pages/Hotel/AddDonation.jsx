import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Upload, 
  MapPin, 
  Clock, 
  Utensils, 
  Camera, 
  X, 
  CheckCircle, 
  AlertCircle
} from 'lucide-react';
import '../../components/CSS/Hotel/AddDonations.css';

const AddDonation = ({ hotelName, licenseNo, onDonationAdded }) => {
  const [formData, setFormData] = useState({
    foodType: '',
    quantity: '',
    prepDate: '',
    prepTime: '',
    expiryDate: '',
    expiryTime: '',
    pickupLocation: '',
    description: '',
    images: []
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [hotelData, setHotelData] = useState({
    hotelId: null,
    hotelName: hotelName || null,
    licenseNo: licenseNo || null
  });

  useEffect(() => {
    const storedHotel = JSON.parse(localStorage.getItem('userInfo'));
    setHotelData({
      hotelId: storedHotel?.hotelId || null,
      hotelName: hotelName || storedHotel?.hotelName || null,
      licenseNo: licenseNo || storedHotel?.licenseNumber || null
    });
  }, [hotelName, licenseNo]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageUrls = files.map(file => URL.createObjectURL(file));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls].slice(0, 4)
    }));
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { foodType, quantity, prepDate, prepTime, expiryDate, expiryTime, pickupLocation } = formData;

    if (!foodType) newErrors.foodType = 'Food type is required';
    if (!quantity) newErrors.quantity = 'Quantity is required';
    if (!prepDate) newErrors.prepDate = 'Preparation date is required';
    if (!prepTime) newErrors.prepTime = 'Preparation time is required';
    if (!expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (!expiryTime) newErrors.expiryTime = 'Expiry time is required';
    if (!pickupLocation) newErrors.pickupLocation = 'Pickup location is required';

    if (prepDate && prepTime) {
      const prepDateTime = new Date(`${prepDate}T${prepTime}`);
      const now = new Date();

      if (prepDateTime > now) newErrors.prepDate = 'Preparation time cannot be in the future';

      if (expiryDate && expiryTime) {
        const expiryDateTime = new Date(`${expiryDate}T${expiryTime}`);
        if (expiryDateTime <= prepDateTime) newErrors.expiryDate = 'Expiry time must be after preparation time';
        if (expiryDateTime <= now) newErrors.expiryDate = 'Food has already expired';
      }
    }

    if (quantity && (isNaN(quantity) || Number(quantity) <= 0)) {
      newErrors.quantity = 'Quantity must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('Form validation failed:', errors);
      return;
    }

    const hotelId = hotelData.hotelId;
    const hotelNameFinal = hotelData.hotelName;

    if (!hotelId || !hotelNameFinal) {
      alert('Hotel credentials are missing. Please log in again.');
      console.error('Missing hotel credentials:', hotelData);
      return;
    }

    setIsSubmitting(true);

    try {
      const preparedAt = new Date(`${formData.prepDate}T${formData.prepTime}`).toISOString();
      const expiryAt = new Date(`${formData.expiryDate}T${formData.expiryTime}`).toISOString();

      const payload = {
        hotelId,
        hotelName: hotelNameFinal,
        foodType: formData.foodType,
        quantity: Number(formData.quantity),
        servesPeople: Number(formData.quantity),
        description: formData.description || '',
        preparedAt,
        expiryAt,
        pickupAddress: formData.pickupLocation,
        images: formData.images.map(img => img.split("/").pop())
      };

      console.log('Sending payload:', payload);

      const res = await axios.post("http://localhost:5000/api/food/add", payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Success response:', res.data);
      setSubmitSuccess(true);

      if (onDonationAdded && typeof onDonationAdded === 'function') {
        onDonationAdded();
      }

      // Reset form after success
      setTimeout(() => {
        setFormData({
          foodType: '',
          quantity: '',
          prepDate: '',
          prepTime: '',
          expiryDate: '',
          expiryTime: '',
          pickupLocation: '',
          description: '',
          images: []
        });
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting donation:', error);
      if (error.response?.data) {
        const errorMessage = error.response.data.message || 'Unknown server error';
        const errorDetails = error.response.data.errors?.join(', ') || '';
        alert(`Error: ${errorMessage}${errorDetails ? ` - ${errorDetails}` : ''}`);
      } else if (error.request) {
        alert('Network error: Unable to connect to server');
      } else {
        alert('Error submitting donation: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="add-donation-container">
        <div className="success-message">
          <CheckCircle size={64} />
          <h2>Donation Added Successfully!</h2>
          <p>Your food donation has been listed and NGOs will be notified. Thank you for helping reduce food waste!</p>
          <div className="success-stats">
            <div className="success-stat">
              <span className="stat-number">1</span>
              <span className="stat-label">Donation Added</span>
            </div>
            <div className="success-stat">
              <span className="stat-number">{formData.quantity}</span>
              <span className="stat-label">People Can Be Fed</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="add-donation-container">
      <div className="donation-header">
        <h1>Add New Donation</h1>
        <p>Help reduce food waste by sharing your excess food with those in need</p>
      </div>

      <form onSubmit={handleSubmit} className="donation-form">
        {/* Food Details Section */}
        <div className="form-section">
          <h3><Utensils size={20}/> Food Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="foodType">Food Type *</label>
              <select
                id="foodType"
                name="foodType"
                value={formData.foodType}
                onChange={handleInputChange}
                className={errors.foodType ? 'error' : ''}
              >
                <option value="">Select food type</option>
                <option value="veg">Vegetarian</option>
                <option value="non-veg">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
              {errors.foodType && <span className="error-text">{errors.foodType}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity (servings) *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Number of people it can serve"
                min="1"
                className={errors.quantity ? 'error' : ''}
              />
              {errors.quantity && <span className="error-text">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the food items..."
              rows="3"
            />
          </div>
        </div>

        {/* Timing Section */}
        <div className="form-section">
          <h3><Clock size={20}/> Timing Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prepDate">Preparation Date *</label>
              <input 
                type="date" 
                id="prepDate" 
                name="prepDate" 
                value={formData.prepDate} 
                onChange={handleInputChange} 
                className={errors.prepDate ? 'error' : ''}
              />
              {errors.prepDate && <span className="error-text">{errors.prepDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="prepTime">Preparation Time *</label>
              <input 
                type="time" 
                id="prepTime" 
                name="prepTime" 
                value={formData.prepTime} 
                onChange={handleInputChange} 
                className={errors.prepTime ? 'error' : ''}
              />
              {errors.prepTime && <span className="error-text">{errors.prepTime}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expiryDate">Best Before Date *</label>
              <input 
                type="date" 
                id="expiryDate" 
                name="expiryDate" 
                value={formData.expiryDate} 
                onChange={handleInputChange} 
                className={errors.expiryDate ? 'error' : ''}
              />
              {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="expiryTime">Best Before Time *</label>
              <input 
                type="time" 
                id="expiryTime" 
                name="expiryTime" 
                value={formData.expiryTime} 
                onChange={handleInputChange} 
                className={errors.expiryTime ? 'error' : ''}
              />
              {errors.expiryTime && <span className="error-text">{errors.expiryTime}</span>}
            </div>
          </div>
        </div>

        {/* Pickup Location Section */}
        <div className="form-section">
          <h3><MapPin size={20}/> Pickup Location</h3>
          <div className="form-group">
            <label htmlFor="pickupLocation">Address *</label>
            <textarea
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleInputChange}
              placeholder="Enter pickup address..."
              rows="3"
              className={errors.pickupLocation ? 'error' : ''}
            />
            {errors.pickupLocation && <span className="error-text">{errors.pickupLocation}</span>}
          </div>
        </div>

        {/* Images Section */}
        <div className="form-section">
          <h3><Camera size={20}/> Food Images (Optional)</h3>
          <div className="image-upload-section">
            <div className="image-grid">
              {formData.images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image} alt={`Food ${index + 1}`} />
                  <button type="button" className="remove-image" onClick={() => removeImage(index)}>
                    <X size={16}/>
                  </button>
                </div>
              ))}

              {formData.images.length < 4 && (
                <div className="upload-placeholder">
                  <input 
                    type="file" 
                    id="imageUpload" 
                    accept="image/*" 
                    multiple 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                  />
                  <label htmlFor="imageUpload" className="upload-label">
                    <Upload size={24}/>
                    <span>Add Photos</span>
                    <small>Up to 4 images</small>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-secondary">Save as Draft</button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Donation...' : 'Add Donation'}
          </button>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <AlertCircle size={20} />
          <div>
            <h4>Important Information</h4>
            <ul>
              <li>NGOs will be automatically notified about your donation</li>
              <li>Ensure food is properly stored and safe for consumption</li>
              <li>You'll receive updates on pickup status via email/SMS</li>
              <li>Pickup should be arranged within 2 hours of expiry time</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddDonation;
