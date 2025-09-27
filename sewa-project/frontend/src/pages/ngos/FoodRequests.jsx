import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  MapPin, 
  Clock, 
  Heart, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  Calendar,
  Phone,
  Mail,
  AlertCircle,
  User
} from 'lucide-react';
import '../../components/CSS/ngos/foodRequests.css';

const FoodRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [requests, setRequests] = useState([]);

  const ngoName = JSON.parse(localStorage.getItem('userInfo'))?.organizationName || 'Unknown NGO';

  // Fetch all available donations (food requests)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/food/available');
        const mappedRequests = res.data.donations.map(donation => {
          const expiryDate = new Date(donation.expiryAt);
          const currentDate = new Date();
          let urgency = 'low';
          const hoursLeft = (expiryDate - currentDate) / (1000 * 60 * 60);
          if (hoursLeft <= 2) urgency = 'high';
          else if (hoursLeft <= 12) urgency = 'medium';

          return {
            id: donation._id,
            hotelName: donation.hotelName,
            foodType: donation.foodType,
            servings: donation.servesPeople,
            description: donation.description,
            location: donation.pickupAddress,
            preparedAt: donation.preparedAt,
            expiryAt: donation.expiryAt,
            requestDate: donation.createdAt,
            status: donation.status, // available / taken / expired
            phone: donation.phone || 'N/A',
            email: donation.email || 'N/A',
            contactPerson: donation.contactPerson || 'N/A',
            urgency,
            images: donation.images || []
          };
        });
        setRequests(mappedRequests);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleAcceptDonation = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/food/${requestId}/accept`, { ngoName });
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'taken' } : r));
    } catch (error) {
      console.error('Error accepting donation:', error);
    }
  };

  const handleRejectDonation = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/food/${requestId}/reject`);
      setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'expired' } : r));
    } catch (error) {
      console.error('Error rejecting donation:', error);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || r.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#f59e0b';
      case 'taken': return '#10b981';
      case 'expired': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#64748b';
    }
  };

  return (
    <div className="food-requests">
      <div className="requests-header">
        <div className="header-content">
          <h1>Food Requests</h1>
          <p>Review and manage food requests from hotels</p>
        </div>

        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{requests.length}</span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{requests.filter(r => r.status === 'available').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{requests.reduce((sum, r) => sum + r.servings, 0)}</span>
            <span className="stat-label">Total Servings</span>
          </div>
        </div>
      </div>

      <div className="requests-controls">
        <div className="search-section">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-dropdown">
            <Filter size={16} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="taken">Accepted</option>
              <option value="expired">Rejected/Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div className="requests-grid">
        {filteredRequests.map(r => (
          <div key={r.id} className="request-card">
            <div className="request-header">
              <div className="requester-info">
                <User size={20} />
                <div>
                  <h3>{r.hotelName}</h3>
                  <p>Contact: {r.contactPerson}</p>
                </div>
              </div>
              <div className="request-status">
                <span className="status-text" style={{ color: getStatusColor(r.status) }}>
                  {r.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="request-details">
              <div className="detail-row">
                <Heart size={16} />
                <span>{r.foodType} - {r.servings} servings</span>
              </div>
              <div className="detail-row">
                <MapPin size={16} />
                <span>{r.location}</span>
              </div>
              <div className="detail-row">
                <Clock size={16} />
                <span>Pickup: {new Date(r.preparedAt).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <Calendar size={16} />
                <span>Expires: {new Date(r.expiryAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="request-description">
              <p>{r.description}</p>
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <Phone size={14} />
                <span>{r.phone}</span>
              </div>
              <div className="contact-item">
                <Mail size={14} />
                <span>{r.email}</span>
              </div>
            </div>

            <div className="urgency-badge">
              <AlertCircle size={14} />
              <span style={{ color: getUrgencyColor(r.urgency) }}>
                {r.urgency.toUpperCase()} PRIORITY
              </span>
            </div>

            {r.status === 'available' && (
              <div className="request-actions">
                <button className="action-btn approve" onClick={() => handleAcceptDonation(r.id)}>
                  <CheckCircle size={16} /> Accept
                </button>
                <button className="action-btn reject" onClick={() => handleRejectDonation(r.id)}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="no-requests">
          <Users size={48} />
          <h3>No requests found</h3>
          <p>Try adjusting search or filters</p>
        </div>
      )}
    </div>
  );
};

export default FoodRequests;
