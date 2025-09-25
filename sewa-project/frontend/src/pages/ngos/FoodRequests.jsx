import React, { useState } from 'react';
import { 
  Users, 
  MapPin, 
  Clock, 
  Heart, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Calendar,
  Phone,
  Mail,
  User
} from 'lucide-react';
import '../../components/CSS/ngos/foodRequests.css';

const FoodRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [requests] = useState([
    
  ]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.foodType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} className="status-icon pending" />;
      case 'approved':
        return <CheckCircle size={16} className="status-icon approved" />;
      case 'fulfilled':
        return <Heart size={16} className="status-icon fulfilled" />;
      case 'rejected':
        return <XCircle size={16} className="status-icon rejected" />;
      default:
        return <Clock size={16} className="status-icon" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'approved':
        return '#10b981';
      case 'fulfilled':
        return '#8b5cf6';
      case 'rejected':
        return '#ef4444';
      default:
        return '#64748b';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  const handleStatusChange = (requestId, newStatus) => {
    // In a real app, this would make an API call
    console.log(`Changing request ${requestId} status to ${newStatus}`);
  };

  return (
    <div className="food-requests">
      <div className="requests-header">
        <div className="header-content">
          <h1>Food Requests</h1>
          <p>Review and manage food requests from community organizations</p>
        </div>
        <div className="header-stats">
          <div className="stat-item">
            <span className="stat-number">{requests.length}</span>
            <span className="stat-label">Total Requests</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {requests.filter(r => r.status === 'pending').length}
            </span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {requests.reduce((sum, r) => sum + r.servings, 0)}
            </span>
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="requests-grid">
        {filteredRequests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-header">
              <div className="requester-info">
                <User size={20} />
                <div>
                  <h3>{request.requesterName}</h3>
                  <p>Contact: {request.contactPerson}</p>
                </div>
              </div>
              <div className="request-status">
                {getStatusIcon(request.status)}
                <span 
                  className="status-text"
                  style={{ color: getStatusColor(request.status) }}
                >
                  {request.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="request-details">
              <div className="detail-row">
                <Heart size={16} />
                <span>{request.foodType} - {request.servings} servings</span>
              </div>
              <div className="detail-row">
                <MapPin size={16} />
                <span>{request.location}</span>
              </div>
              <div className="detail-row">
                <Clock size={16} />
                <span>Needed by: {new Date(request.neededBy).toLocaleString()}</span>
              </div>
              <div className="detail-row">
                <Calendar size={16} />
                <span>Requested: {new Date(request.requestDate).toLocaleString()}</span>
              </div>
            </div>

            <div className="request-description">
              <p>{request.description}</p>
              {request.dietaryRequirements && (
                <div className="dietary-requirements">
                  <strong>Dietary Requirements:</strong> {request.dietaryRequirements}
                </div>
              )}
            </div>

            <div className="contact-info">
              <div className="contact-item">
                <Phone size={14} />
                <span>{request.phone}</span>
              </div>
              <div className="contact-item">
                <Mail size={14} />
                <span>{request.email}</span>
              </div>
            </div>

            <div className="urgency-badge">
              <AlertCircle size={14} />
              <span style={{ color: getUrgencyColor(request.urgency) }}>
                {request.urgency.toUpperCase()} PRIORITY
              </span>
            </div>

            {request.status === 'pending' && (
              <div className="request-actions">
                <button 
                  className="action-btn approve"
                  onClick={() => handleStatusChange(request.id, 'approved')}
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button 
                  className="action-btn reject"
                  onClick={() => handleStatusChange(request.id, 'rejected')}
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            )}

            {request.status === 'approved' && (
              <div className="request-actions">
                <button 
                  className="action-btn fulfill"
                  onClick={() => handleStatusChange(request.id, 'fulfilled')}
                >
                  <Heart size={16} />
                  Mark as Fulfilled
                </button>
                <button className="action-btn secondary">
                  Contact Requester
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
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default FoodRequests;

