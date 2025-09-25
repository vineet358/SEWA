import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  History, 
  BarChart3, 
  User, 
  Menu, 
  X,
  TrendingUp,
  Users,
  Building,
  Calendar
} from 'lucide-react';
import '../../components/CSS/Hotel/Dashboard.css';
import AddDonation from "./AddDonation";
import MyDonations from "./MyDonations";
import Reports from "./Reports";


const HotelDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalDonations: 0,
    totalServings: 0,
    ngosServed: 0,
    peopleFed: 0,
    monthlyDonations: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 78, 85],
    recentDonations: [
     
    ]
  });
  useEffect(() => {
    setSidebarOpen(false); 
  }, []);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donate', label: 'Donate Food', icon: Plus },
    { id: 'history', label: 'Donation History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderDashboardOverview = () => (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1>Hotel Dashboard</h1>
        <p>Manage your food donations and track your community impact</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon donations">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{dashboardData.totalDonations}</h3>
            <p>Total Donations</p>
            <span className="stat-trend"></span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon servings">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{dashboardData.totalServings.toLocaleString()}</h3>
            <p>Total Servings</p>
            <span className="stat-trend"></span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon ngos">
            <Building size={24} />
          </div>
          <div className="stat-content">
            <h3>{dashboardData.ngosServed}</h3>
            <p>NGOs Served</p>
            <span className="stat-trend"></span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon people">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{dashboardData.peopleFed.toLocaleString()}</h3>
            <p>People Fed</p>
            <span className="stat-trend"></span>
          </div>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card recent-activity">
          <h3>Recent Donations</h3>
          <div className="activity-list">
            {dashboardData.recentDonations.map((donation) => (
              <div key={donation.id} className="activity-item">
                <div className="activity-info">
                  <p className="activity-title">Donation #{donation.id}</p>
                  <p className="activity-details">{donation.quantity} servings • {donation.ngo}</p>
                </div>
                <div className="activity-meta">
                  <span className={`status ${donation.status.toLowerCase().replace(' ', '-')}`}>
                    {donation.status}
                  </span>
                  <span className="activity-date">{new Date(donation.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => setActiveTab('donate')}
            >
              <Plus size={20} />
              New Donation
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => setActiveTab('history')}
            >
              <History size={20} />
              View History
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={20} />
              View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardOverview();
      case 'donate':
        return <AddDonation  />; 
      case 'history':
        return <MyDonations />;
      case 'analytics':
        return <Reports />; // since Reports.jsx is already there
    
      default:
        return renderDashboardOverview();
    }
  };
  
  

  return (
    <div className="hotel-dashboard">
      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <Building size={32} />
            <span>SEWA Hotel</span>
          </div>
          <button className="sidebar-close" onClick={handleSidebarToggle}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="main-content">
        <div className="topbar">
          <button className="menu-toggle" onClick={handleSidebarToggle}>
            <Menu size={24} />
          </button>
          <div className="topbar-actions">
            <div className="user-profile">
              <div className="user-avatar">H</div>
              <span>Hotel Partner</span>
            </div>
          </div>
        </div>

        <div className="content-area">
          {renderContent()}
        </div>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={handleSidebarToggle}></div>
      )}
    </div>
  );
};

export default HotelDashboard;