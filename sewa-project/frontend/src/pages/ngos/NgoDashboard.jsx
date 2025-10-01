import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  Users, 
  BarChart3, 
  User, 
  Menu, 
  X,
  CheckCircle,
  Building
} from 'lucide-react';
import '../../components/CSS/ngos/NgoDashboard.css';
import AcceptedDonations from "./AcceptedDonations";
import FoodRequests from "./FoodRequests";
import Reports from "./Reports";
import ProfileSettings from "./ProfileSettings";
import axios from 'axios';

const NgoDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalDonations: 0,
    totalRequests: 0,
    totalDistributions: 0,
    peopleServed: 0,
  });

  // Fetch from localStorage
  const ngoInfo = JSON.parse(localStorage.getItem('userInfo'));
  const ngoId = JSON.parse(localStorage.getItem('userInfo'))?.ngoId;
  const ngoName = ngoInfo?.organizationName || 'Unknown NGO';

  useEffect(() => {
    setSidebarOpen(false); 
    if (ngoId) fetchDashboardData();
  }, [ngoId]);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/food/ngo/history/${ngoId}`);
      const donations = res.data;

      const totalDonations = donations.length;
      const totalDistributions = donations.filter(d => d.status === 'taken' || d.status === 'distributed').length;
      const peopleServed = donations.reduce((sum, d) => sum + (d.servesPeople || 0), 0);

      setDashboardData({
        totalDonations,
        totalRequests: 0, 
        totalDistributions,
        peopleServed,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'donations', label: 'Accepted Donations', icon: Heart },
    { id: 'requests', label: 'Food Requests', icon: Users },
    { id: 'analytics', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile Settings', icon: User },
  ];

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);


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
          </div>
        </div>
        
        <div className="ngo-stat-card">
          <div className="ngo-stat-icon requests">
            <Users size={24} />
          </div>
          <div className="ngo-stat-content">
            <h3>{dashboardData.totalRequests}</h3>
            <p>Food Requests</p>
          </div>
        </div>
        
        <div className="ngo-stat-card">
          <div className="ngo-stat-icon distributions">
            <CheckCircle size={24} />
          </div>
          <div className="ngo-stat-content">
            <h3>{dashboardData.totalDistributions}</h3>
            <p>Distributions</p>
          </div>
        </div>
        
        <div className="ngo-stat-card">
          <div className="ngo-stat-icon people">
            <Building size={24} />
          </div>
          <div className="ngo-stat-content">
            <h3>{dashboardData.peopleServed.toLocaleString()}</h3>
            <p>People Served</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboardOverview();
      case 'donations': return <AcceptedDonations />;
      case 'requests': return <FoodRequests />;
      case 'analytics': return <Reports />;
      case 'profile': return <ProfileSettings />;
      default: return renderDashboardOverview();
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
              <span>{ngoName}</span>
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
