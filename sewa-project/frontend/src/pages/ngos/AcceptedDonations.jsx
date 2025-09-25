import React, { useState } from 'react';
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
  const [donations] = useState([
    {
      id: 1,
      hotelName: 'Hotel Paradise',
      foodType: 'Fresh Meals',
      quantity: 150,
      servings: 150,
      pickupTime: '2024-01-15T10:00:00Z',
      status: 'accepted',
      location: 'Downtown Area',
      contact: '+1 234-567-8900',
      description: 'Fresh vegetarian meals prepared this morning',
      expiryDate: '2024-01-16T18:00:00Z'
    },
    {
      id: 2,
      hotelName: 'Grand Plaza Hotel',
      foodType: 'Bread & Pastries',
      quantity: 200,
      servings: 200,
      pickupTime: '2024-01-14T14:30:00Z',
      status: 'picked-up',
      location: 'Central District',
      contact: '+1 234-567-8901',
      description: 'Freshly baked bread and pastries from breakfast service',
      expiryDate: '2024-01-15T12:00:00Z'
    },
    {
      id: 3,
      hotelName: 'Sunset Resort',
      foodType: 'Buffet Items',
      quantity: 300,
      servings: 300,
      pickupTime: '2024-01-13T16:00:00Z',
      status: 'distributed',
      location: 'Beach Area',
      contact: '+1 234-567-8902',
      description: 'Leftover buffet items from lunch service',
      expiryDate: '2024-01-14T20:00:00Z'
    },
    {
      id: 4,
      hotelName: 'City Center Hotel',
      foodType: 'Sandwiches',
      quantity: 100,
      servings: 100,
      pickupTime: '2024-01-12T11:00:00Z',
      status: 'expired',
      location: 'Business District',
      contact: '+1 234-567-8903',
      description: 'Pre-made sandwiches from conference catering',
      expiryDate: '2024-01-12T18:00:00Z'
    }
  ]);

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = donation.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.foodType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || donation.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle size={16} className="status-icon accepted" />;
      case 'picked-up':
        return <Clock size={16} className="status-icon picked-up" />;
      case 'distributed':
        return <Heart size={16} className="status-icon distributed" />;
      case 'expired':
        return <AlertCircle size={16} className="status-icon expired" />;
      default:
        return <Clock size={16} className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return '#10b981';
      case 'picked-up':
        return '#3b82f6';
      case 'distributed':
        return '#8b5cf6';
      case 'expired':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="accepted-donations">
      <div className="donations-header">
        <div className="header-content">
          <h1>Accepted Donations</h1>
          <p>Manage and track all food donations you've accepted</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{donations.length}</span>
            <span className="stat-label">Total Donations</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {donations.reduce((sum, d) => sum + d.servings, 0)}
            </span>
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
              <option value="accepted">Accepted</option>
              <option value="picked-up">Picked Up</option>
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
                <span>{donation.servings} servings</span>
              </div>
              <div className="detail-row">
                <MapPin size={16} />
                <span>{donation.location}</span>
              </div>
              <div className="detail-row">
                <Clock size={16} />
                <span>Pickup: {new Date(donation.pickupTime).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <Calendar size={16} />
                <span>Expires: {new Date(donation.expiryDate).toLocaleString()}</span>
              </div>
            </div>

            <div className="donation-description">
              <p>{donation.description}</p>
            </div>

            <div className="donation-actions">
              <button className="action-btn primary">
                View Details
              </button>
              <button className="action-btn secondary">
                Contact Hotel
              </button>
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
