import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  Users, 
  BarChart3, 
  User, 
  Menu, 
  X,
  TrendingUp,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';
import '../../components/CSS/ngos/NgoDashboard.css';
import AcceptedDonations from "./AcceptedDonations";
import FoodRequests from "./FoodRequests";
import Reports from "./Reports";
import ProfileSettings from "./ProfileSettings";

const NgoDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalDonations: 0,
    totalRequests: 0,
    totalDistributions: 0,
    peopleServed: 0,
    monthlyStats: [45, 52, 48, 61, 55, 67, 72, 68, 75, 82, 78, 85],
    recentActivities: [
      {
        id: 1,
        type: 'donation',
        title: 'Food Donation from Hotel Paradise',
        details: '150 servings • Fresh meals',
        status: 'accepted',
        date: new Date().toISOString()
      },
      {
        id: 2,
        type: 'request',
        title: 'Food Request from Community Center',
        details: '200 servings • Lunch for children',
        status: 'pending',
        date: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 3,
        type: 'distribution',
        title: 'Food Distribution to Shelter',
        details: '100 servings • Evening meal',
        status: 'distributed',
        date: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  });

  useEffect(() => {
    setSidebarOpen(false); 
  }, []);

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donations', label: 'Accepted Donations', icon: Heart },
    { id: 'requests', label: 'Food Requests', icon: Users },
    { id: 'analytics', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderDashboardOverview = () => (
    <div className="ngo-dashboard-content">
      <div className="ngo-dashboard-header">
        <h1>NGO Dashboard</h1>
        <p>Manage food donations, requests, and track your community impact</p>
      </div>

      <div className="ngo-stats-grid">
        <div className="ngo-stat-card">
          <div className="ngo-stat-icon donations">
            <Heart size={24} />
          </div>
          <div className="ngo-stat-content">
            <h3>{dashboardData.totalDonations}</h3>
            <p>Accepted Donations</p>
            <span className="ngo-stat-trend"></span>
          </div>
        </div>
        
        <div className="ngo-stat-card">
          <div className="ngo-stat-icon requests">
            <Users size={24} />
          </div>
          <div className="ngo-stat-content">
            <h3>{dashboardData.totalRequests}</h3>
            <p>Food Requests</p>
            <span className="ngo-stat-trend"></span>
          </div>
        </div>
        
        <div className="ngo-stat-card">
          <div className="ngo-stat-icon distributions">
            <CheckCircle size={24} />
          </div>
          <div className="ngo-stat-content">
            <h3>{dashboardData.totalDistributions}</h3>
            <p>Distributions</p>
            <span className="ngo-stat-trend"></span>
          </div>
        </div>
        
        <div className="ngo-stat-card">
          <div className="ngo-stat-icon people">
            <Building size={24} />
          </div>
          <div className="ngo-stat-content">
            <h3>{dashboardData.peopleServed.toLocaleString()}</h3>
            <p>People Served</p>
            <span className="ngo-stat-trend"></span>
          </div>
        </div>
      </div>

      <div className="ngo-dashboard-cards">
        <div className="ngo-dashboard-card recent-activity">
          <h3>Recent Activities</h3>
          <div className="ngo-activity-list">
            {dashboardData.recentActivities.map((activity) => (
              <div key={activity.id} className="ngo-activity-item">
                <div className="ngo-activity-info">
                  <p className="ngo-activity-title">{activity.title}</p>
                  <p className="ngo-activity-details">{activity.details}</p>
                </div>
                <div className="ngo-activity-meta">
                  <span className={`ngo-status ${activity.status}`}>
                    {activity.status}
                  </span>
                  <span className="ngo-activity-date">{new Date(activity.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ngo-dashboard-card quick-actions">
          <h3>Quick Actions</h3>
          <div className="ngo-action-buttons">
            <button 
              className="ngo-action-btn primary"
              onClick={() => setActiveTab('donations')}
            >
              <Heart size={20} />
              View Donations
            </button>
            <button 
              className="ngo-action-btn secondary"
              onClick={() => setActiveTab('requests')}
            >
              <Users size={20} />
              Manage Requests
            </button>
            <button 
              className="ngo-action-btn secondary"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 size={20} />
              View Reports
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
      case 'donations':
        return <AcceptedDonations />;
      case 'requests':
        return <FoodRequests />;
      case 'analytics':
        return <Reports />;
      case 'profile':
        return <ProfileSettings />;
      default:
        return renderDashboardOverview();
    }
  };

  return (
    <div className="ngo-dashboard">
      <div className={`ngo-sidebar ${sidebarOpen ? 'ngo-sidebar-open' : ''}`}>
        <div className="ngo-sidebar-header">
          <div className="ngo-logo">
            <Heart size={32} />
            <span>SEWA NGO</span>
          </div>
          <button className="ngo-sidebar-close" onClick={handleSidebarToggle}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="ngo-sidebar-nav">
          {sidebarItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                className={`ngo-nav-item ${activeTab === item.id ? 'active' : ''}`}
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

      <div className="ngo-main-content">
        <div className="ngo-topbar">
          <button className="ngo-menu-toggle" onClick={handleSidebarToggle}>
            <Menu size={24} />
          </button>
          <div className="ngo-topbar-actions">
            <div className="ngo-user-profile">
              <div className="ngo-user-avatar">N</div>
              <span>NGO Partner</span>
            </div>
          </div>
        </div>

        <div className="ngo-content-area">
          {renderContent()}
        </div>
      </div>

      {sidebarOpen && (
        <div className="ngo-sidebar-overlay" onClick={handleSidebarToggle}></div>
      )}
    </div>
  );
};

export default NgoDashboard;
