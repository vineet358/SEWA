import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Search,
  Calendar,
  Building
} from 'lucide-react';
import '../../components/CSS/ngos/acceptedDonations.css';

const AcceptedDonations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [donations, setDonations] = useState([]);

  const ngoInfo = JSON.parse(localStorage.getItem('userInfo'));
  const ngoId = ngoInfo?.ngoId;
  const ngoName = ngoInfo?.ngoName || 'Unknown NGO';

  // Fetch donations accepted by this NGO
  const fetchDonations = async () => {
    if (!ngoId) {
      console.error("NGO ID not found in localStorage");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/api/food/ngo/history/${ngoId}`);
      const mappedDonations = res.data.map(donation => ({
        ...donation,
        id: donation._id
      }));
      setDonations(mappedDonations);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [ngoId]);

  // Accept donation
  const handleAccept = async (id) => {
    if (!ngoId) return;

    try {
      const res = await axios.put(`http://localhost:5000/api/food/${id}/accept`, { ngoId, ngoName });
      const updatedDonations = donations.map(d => d.id === id ? res.data.food : d);
      setDonations(updatedDonations);
    } catch (error) {
      console.error('Error accepting donation:', error);
    }
  };

  // Reject donation
  const handleReject = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/food/${id}/reject`);
      const updatedDonations = donations.map(d => d.id === id ? res.data.food : d);
      setDonations(updatedDonations);
    } catch (error) {
      console.error('Error rejecting donation:', error);
    }
  };

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          donation.foodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || donation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'taken': return <CheckCircle size={16} className="status-icon accepted" />;
      case 'pending': return <Clock size={16} className="status-icon pending" />;
      case 'distributed': return <Heart size={16} className="status-icon distributed" />;
      case 'expired': return <AlertCircle size={16} className="status-icon expired" />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'taken': return '#10b981';
      case 'pending': return '#3b82f6';
      case 'distributed': return '#8b5cf6';
      case 'expired': return '#ef4444';
      default: return '#64748b';
    }
  };
  const totalAccepted = donations.filter(d => d.status === 'taken' && d.acceptedByNgoId === ngoId).length;
  const totalServings = donations.reduce((sum, d) => sum + d.servesPeople, 0);

  return (
    <div className="accepted-donations">
      <div className="donations-header">
        <div className="header-content">
          <h1>Accepted Donations</h1>
          <p>Manage and track all food donations you've accepted</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{totalAccepted}</span>
            <span className="stat-label">Total Accepted</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{totalServings}</span>
            <span className="stat-label">Total Servings</span>
          </div>
        </div>
      </div>

      <div className="donations-controls">
        <div className="search-section">
          <div className="search-input">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="filter-section">
          <div className="filter-dropdown">
            <Filter size={16} />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="taken">Accepted</option>
              <option value="pending">Pending</option>
              <option value="distributed">Distributed</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div className="donations-grid">
        {filteredDonations.map((donation) => (
          <div key={donation.id} className="donation-card">
            <div className="donation-header">
              <div className="hotel-info">
                <Building size={20} />
                <div>
                  <h3>{donation.hotelName}</h3>
                  <p>{donation.foodType}</p>
                </div>
              </div>
              <div className="donation-status">
                {getStatusIcon(donation.status)}
                <span 
                  className="status-text"
                  style={{ color: getStatusColor(donation.status) }}
                >
                  {donation.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div className="donation-details">
              <div className="detail-row">
                <Users size={16} />
                <span>{donation.servesPeople} servings</span>
              </div>
              <div className="detail-row">
                <MapPin size={16} />
                <span>{donation.pickupAddress}</span>
              </div>
              <div className="detail-row">
                <Clock size={16} />
                <span>Pickup: {new Date(donation.preparedAt).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <Calendar size={16} />
                <span>Expires: {new Date(donation.expiryAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="donation-description">
              <p>{donation.description}</p>
            </div>

            <div className="donation-actions">
              {donation.status === 'pending' || donation.status === 'available' ? (
                <>
                  <button className="action-btn primary" onClick={() => handleAccept(donation.id)}>
                    Accept
                  </button>
                  <button className="action-btn secondary" onClick={() => handleReject(donation.id)}>
                    Reject
                  </button>
                </>
              ) : (
                <span className="processed-label">Processed</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDonations.length === 0 && (
        <div className="no-donations">
          <Heart size={48} />
          <h3>No donations found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default AcceptedDonations;
