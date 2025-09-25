import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Users,
  Heart,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import '../../components/CSS/ngos/reports.css';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  const reportData = {
    overview: {
      title: 'Overview Report',
      period: 'Last 30 Days',
      stats: [
      ],
    }
  };

  const currentReport = reportData[selectedReport];

  const getTrendIcon = (trend) => {
    return trend === 'up' ? 
      <TrendingUp size={16} className="trend-icon up" /> : 
      <TrendingDown size={16} className="trend-icon down" />;
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? '#10b981' : '#ef4444';
  };

  const handleExport = () => {
    console.log(`Exporting ${selectedReport} report for ${selectedPeriod}`);
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <div className="header-content">
          <h1>Reports & Analytics</h1>
          <p>Track your NGO's performance and impact metrics</p>
        </div>
        <div className="header-actions">
          <button className="export-btn" onClick={handleExport}>
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      <div className="reports-controls">
        <div className="report-type-selector">
          <label>Report Type:</label>
          <select 
            value={selectedReport} 
            onChange={(e) => setSelectedReport(e.target.value)}
          >
            <option value="overview">Overview</option>
            <option value="donations">Donations</option>
            <option value="requests">Requests</option>
            <option value="impact">Impact</option>
          </select>
        </div>
        
        <div className="period-selector">
          <label>Time Period:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 3 Months</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="report-content">
        <div className="report-header">
          <h2>{currentReport.title}</h2>
          <span className="report-period">{currentReport.period}</span>
        </div>

        <div className="stats-grid">
          {currentReport.stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <h3>{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</h3>
                <p>{stat.label}</p>
              </div>
              <div className="stat-trend">
                {getTrendIcon(stat.trend)}
                <span style={{ color: getTrendColor(stat.trend) }}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {selectedReport === 'overview' && (
          <div className="chart-section">
            <h3>Monthly Trends</h3>
            <div className="chart-container">
              <div className="chart-placeholder">
                <BarChart3 size={48} />
                <p>Monthly donations, requests, and distributions chart</p>
                <small>Chart visualization would be implemented with a charting library</small>
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'donations' && (
          <div className="top-list-section">
            <h3>Top Donors</h3>
            <div className="top-list">
              {currentReport.topDonors.map((donor, index) => (
                <div key={index} className="list-item">
                  <div className="item-rank">#{index + 1}</div>
                  <div className="item-info">
                    <h4>{donor.name}</h4>
                    <p>{donor.donations} donations • {donor.servings} servings</p>
                  </div>
                  <div className="item-badge">
                    <Heart size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReport === 'requests' && (
          <div className="top-list-section">
            <h3>Top Requesters</h3>
            <div className="top-list">
              {currentReport.topRequesters.map((requester, index) => (
                <div key={index} className="list-item">
                  <div className="item-rank">#{index + 1}</div>
                  <div className="item-info">
                    <h4>{requester.name}</h4>
                    <p>{requester.requests} requests • {requester.servings} servings</p>
                  </div>
                  <div className="item-badge">
                    <Users size={16} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReport === 'impact' && (
          <div className="distribution-section">
            <h3>Distribution by Area</h3>
            <div className="distribution-list">
              {currentReport.distributionByArea.map((area, index) => (
                <div key={index} className="distribution-item">
                  <div className="area-info">
                    <MapPin size={16} />
                    <span>{area.area}</span>
                  </div>
                  <div className="area-stats">
                    <span className="servings">{area.servings} servings</span>
                    <span className="percentage">{area.percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${area.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="insights-section">
          <h3>Key Insights</h3>
          <div className="insights-grid">
            <div className="insight-card positive">
              <CheckCircle size={20} />
              <div>
                <h4>Strong Performance</h4>
                <p>Your NGO has maintained a 94% distribution rate, exceeding the industry average of 85%.</p>
              </div>
            </div>
            <div className="insight-card neutral">
              <Clock size={20} />
              <div>
                <h4>Response Time</h4>
                <p>Average response time to food requests has improved by 15% this month.</p>
              </div>
            </div>
            <div className="insight-card positive">
              <TrendingUp size={20} />
              <div>
                <h4>Growth Trend</h4>
                <p>People served has increased by 15% compared to last month, showing strong community impact.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
