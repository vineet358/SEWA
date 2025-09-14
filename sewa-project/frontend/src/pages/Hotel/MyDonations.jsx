import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Eye,
  Download,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Package,
  Truck
} from 'lucide-react';
import '../../components/CSS/Hotel/MyDonations.css';

const MyDonations = () => {
  const [donations, setDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockDonations = [
      {
        id: 'DON001',
        date: '2025-09-12',
        time: '14:30',
        foodType: 'Vegetarian',
        quantity: 150,
        status: 'delivered',
        ngo: 'Hope Foundation',
        pickup: 'Grand Plaza Hotel, Main St',
        prepDate: '2025-09-12',
        expiry: '2025-09-13 18:00',
        description: 'Mixed vegetarian meals with rice, dal, vegetables',
        images: ['/api/placeholder/300/200', '/api/placeholder/300/200']
      },
      {
        id: 'DON002',
        date: '2025-09-11',
        time: '16:45',
        foodType: 'Non-Vegetarian',
        quantity: 200,
        status: 'picked-up',
        ngo: 'Care NGO',
        pickup: 'Grand Plaza Hotel, Main St',
        prepDate: '2025-09-11',
        expiry: '2025-09-12 20:00',
        description: 'Chicken curry, rice, bread and salad',
        images: ['/api/placeholder/300/200']
      },
      {
        id: 'DON003',
        date: '2025-09-10',
        time: '12:15',
        foodType: 'Vegan',
        quantity: 100,
        status: 'pending',
        ngo: 'Food Bank',
        pickup: 'Grand Plaza Hotel, Main St',
        prepDate: '2025-09-10',
        expiry: '2025-09-11 15:00',
        description: 'Vegan pasta with vegetables and salad',
        images: ['/api/placeholder/300/200', '/api/placeholder/300/200', '/api/placeholder/300/200']
      },
      {
        id: 'DON004',
        date: '2025-09-09',
        time: '19:20',
        foodType: 'Vegetarian',
        quantity: 75,
        status: 'expired',
        ngo: 'Local Shelter',
        pickup: 'Grand Plaza Hotel, Main St',
        prepDate: '2025-09-09',
        expiry: '2025-09-10 12:00',
        description: 'Traditional Indian thali meals',
        images: []
      },
      {
        id: 'DON005',
        date: '2025-09-08',
        time: '11:30',
        foodType: 'Non-Vegetarian',
        quantity: 120,
        status: 'delivered',
        ngo: 'Community Kitchen',
        pickup: 'Grand Plaza Hotel, Main St',
        prepDate: '2025-09-08',
        expiry: '2025-09-09 14:00',
        description: 'Grilled chicken with sides and dessert',
        images: ['/api/placeholder/300/200']
      }
    ];
    
    setDonations(mockDonations);
    setFilteredDonations(mockDonations);
  }, []);

  // Filter donations based on search and filters
  useEffect(() => {
    let filtered = donations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(donation =>
        donation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donation.foodType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(donation => donation.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(donation => {
        const donationDate = new Date(donation.date);
        const daysDiff = Math.floor((now - donationDate) / (1000 * 60 * 60 * 24));
        
        switch (dateFilter) {
          case 'today':
            return daysDiff === 0;
          case 'week':
            return daysDiff <= 7;
          case 'month':
            return daysDiff <= 30;
          default:
            return true;
        }
      });
    }

    setFilteredDonations(filtered);
  }, [donations, searchTerm, statusFilter, dateFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle size={16} className="status-icon delivered" />;
      case 'picked-up':
        return <Truck size={16} className="status-icon picked-up" />;
      case 'pending':
        return <Package size={16} className="status-icon pending" />;
      case 'expired':
        return <AlertTriangle size={16} className="status-icon expired" />;
      default:
        return <Package size={16} className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered to NGO';
      case 'picked-up':
        return 'Picked Up';
      case 'pending':
        return 'Pending Pickup';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const handleViewDetails = (donation) => {
    setSelectedDonation(donation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDonation(null);
  };

  const handleExport = () => {
    // In a real app, this would generate and download a CSV/Excel file
    console.log('Exporting donations data...');
  };

  return (
    <div className="my-donations-container">
      <div className="donations-header">
        <div className="header-content">
          <h1>Donation History</h1>
          <p>Track and manage all your food donations</p>
        </div>
        <button className="export-btn" onClick={handleExport}>
          <Download size={20} />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search by ID, NGO, or food type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending Pickup</option>
              <option value="picked-up">Picked Up</option>
              <option value="delivered">Delivered</option>
              <option value="expired">Expired</option>
            </select>
            <ChevronDown size={16} className="select-arrow" />
          </div>

          <div className="filter-group">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
            <ChevronDown size={16} className="select-arrow" />
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-item">
          <span className="stat-value">{donations.length}</span>
          <span className="stat-label">Total Donations</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{donations.filter(d => d.status === 'delivered').length}</span>
          <span className="stat-label">Delivered</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{donations.reduce((sum, d) => sum + d.quantity, 0)}</span>
          <span className="stat-label">Total Servings</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{new Set(donations.map(d => d.ngo)).size}</span>
          <span className="stat-label">NGOs Helped</span>
        </div>
      </div>

      {/* Donations Table */}
      <div className="donations-table-container">
        {filteredDonations.length === 0 ? (
          <div className="no-data">
            <Package size={48} />
            <h3>No donations found</h3>
            <p>Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="donations-table">
            <div className="table-header">
              <div className="th donation-id">ID</div>
              <div className="th date-time">Date & Time</div>
              <div className="th food-details">Food Details</div>
              <div className="th quantity">Quantity</div>
              <div className="th ngo">NGO</div>
              <div className="th status">Status</div>
              <div className="th actions">Actions</div>
            </div>

            <div className="table-body">
              {filteredDonations.map((donation) => (
                <div key={donation.id} className="table-row">
                  <div className="td donation-id">
                    <span className="donation-id-text">{donation.id}</span>
                  </div>
                  
                  <div className="td date-time">
                    <div className="date-time-content">
                      <Calendar size={14} />
                      <div>
                        <span className="date">{new Date(donation.date).toLocaleDateString()}</span>
                        <span className="time">{donation.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="td food-details">
                    <div className="food-type">{donation.foodType}</div>
                    <div className="food-description">{donation.description}</div>
                  </div>

                  <div className="td quantity">
                    <div className="quantity-content">
                      <Users size={14} />
                      <span>{donation.quantity} servings</span>
                    </div>
                  </div>

                  <div className="td ngo">
                    <span className="ngo-name">{donation.ngo}</span>
                  </div>

                  <div className="td status">
                    <div className={`status-badge ${donation.status}`}>
                      {getStatusIcon(donation.status)}
                      <span>{getStatusText(donation.status)}</span>
                    </div>
                  </div>

                  <div className="td actions">
                    <button 
                      className="view-btn"
                      onClick={() => handleViewDetails(donation)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for donation details */}
      {showModal && selectedDonation && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Donation Details - {selectedDonation.id}</h3>
              <button className="close-modal" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Food Type:</label>
                  <span>{selectedDonation.foodType}</span>
                </div>
                <div className="detail-item">
                  <label>Quantity:</label>
                  <span>{selectedDonation.quantity} servings</span>
                </div>
                <div className="detail-item">
                  <label>Preparation Date:</label>
                  <span>{new Date(selectedDonation.prepDate).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <label>Best Before:</label>
                  <span>{selectedDonation.expiry}</span>
                </div>
                <div className="detail-item">
                  <label>NGO Partner:</label>
                  <span>{selectedDonation.ngo}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <div className={`status-badge ${selectedDonation.status}`}>
                    {getStatusIcon(selectedDonation.status)}
                    <span>{getStatusText(selectedDonation.status)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <label>Description:</label>
                <p>{selectedDonation.description}</p>
              </div>

              <div className="detail-section">
                <label>Pickup Location:</label>
                <div className="location-info">
                  <MapPin size={16} />
                  <span>{selectedDonation.pickup}</span>
                </div>
              </div>

              {selectedDonation.images.length > 0 && (
                <div className="detail-section">
                  <label>Food Images:</label>
                  <div className="modal-images">
                    {selectedDonation.images.map((image, index) => (
                      <img 
                        key={index} 
                        src={image} 
                        alt={`Food ${index + 1}`}
                        className="modal-image"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDonations;