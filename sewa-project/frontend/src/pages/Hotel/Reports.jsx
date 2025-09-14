import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Building, 
  Calendar,
  PieChart,
  BarChart3,
  Download,
  Filter,
  ChevronDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, BarChart, Bar } from 'recharts';
import '../../components/CSS/Hotel/Reports.css';

const Reports = () => {
  const [dateRange, setDateRange] = useState('6months');
  const [analyticsData, setAnalyticsData] = useState({
    totalDonations: 156,
    totalServings: 2340,
    ngosServed: 23,
    peopleFed: 1890,
    avgDonationSize: 87,
    impactScore: 92
  });

  // Monthly trend data
  const [monthlyData, setMonthlyData] = useState([
    { month: 'Mar', donations: 45, servings: 780, impact: 85 },
    { month: 'Apr', donations: 52, servings: 890, impact: 88 },
    { month: 'May', donations: 48, servings: 820, impact: 86 },
    { month: 'Jun', donations: 61, servings: 1050, impact: 90 },
    { month: 'Jul', donations: 55, servings: 940, impact: 89 },
    { month: 'Aug', donations: 67, servings: 1150, impact: 92 },
    { month: 'Sep', donations: 72, servings: 1240, impact: 94 }
  ]);

  // Food type distribution
  const [foodTypeData, setFoodTypeData] = useState([
    { name: 'Vegetarian', value: 45, color: '#10b981' },
    { name: 'Non-Vegetarian', value: 35, color: '#3b82f6' },
    { name: 'Vegan', value: 20, color: '#8b5cf6' }
  ]);

  // NGO partnerships
  const [ngoData, setNgoData] = useState([
    { name: 'Hope Foundation', donations: 28, servings: 450 },
    { name: 'Care NGO', donations: 24, servings: 380 },
    { name: 'Food Bank', donations: 22, servings: 340 },
    { name: 'Local Shelter', donations: 18, servings: 290 },
    { name: 'Community Kitchen', donations: 16, servings: 250 }
  ]);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    // In real app, this would fetch new data based on date range
  };

  const handleExportReport = () => {
    // In real app, this would generate and download a comprehensive report
    console.log('Exporting analytics report...');
  };

  const formatNumber = (num) => {
    return num.toLocaleString();
  };

  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="header-content">
          <h1>Analytics & Reports</h1>
          <p>Track your impact and donation performance over time</p>
        </div>
        
        <div className="header-actions">
          <div className="date-filter">
            <select 
              value={dateRange} 
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className="date-select"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <ChevronDown size={16} className="select-arrow" />
          </div>
          
          <button className="export-btn" onClick={handleExportReport}>
            <Download size={20} />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card primary">
          <div className="metric-icon">
            <Calendar size={24} />
          </div>
          <div className="metric-content">
            <h3>{formatNumber(analyticsData.totalDonations)}</h3>
            <p>Total Donations</p>
            <span className="growth positive">+12% vs last period</span>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="metric-content">
            <h3>{formatNumber(analyticsData.totalServings)}</h3>
            <p>Total Servings</p>
            <span className="growth positive">+8% vs last period</span>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">
            <Building size={24} />
          </div>
          <div className="metric-content">
            <h3>{analyticsData.ngosServed}</h3>
            <p>NGO Partners</p>
            <span className="growth positive">+3 new partners</span>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <h3>{formatNumber(analyticsData.peopleFed)}</h3>
            <p>People Fed</p>
            <span className="growth positive">+15% vs last period</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Monthly Trend Chart */}
        <div className="chart-card large">
          <div className="chart-header">
            <h3>Donation Trends</h3>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Donations</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#10b981' }}></div>
                <span>Servings</span>
              </div>
            </div>
          </div>
          
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="donations" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="servings" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Food Type Distribution */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Food Type Distribution</h3>
          </div>
          
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={foodTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {foodTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            <div className="pie-legend">
              {foodTypeData.map((item, index) => (
                <div key={index} className="pie-legend-item">
                  <div className="legend-color" style={{ backgroundColor: item.color }}></div>
                  <span>{item.name}</span>
                  <span className="percentage">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* NGO Performance Table */}
      <div className="performance-section">
        <div className="section-header">
          <h3>NGO Partnership Performance</h3>
          <p>Your top performing NGO partners</p>
        </div>
        
        <div className="performance-table">
          <div className="table-header">
            <div>NGO Name</div>
            <div>Donations Received</div>
            <div>Total Servings</div>
            <div>Avg. Response Time</div>
            <div>Performance</div>
          </div>
          
          <div className="table-body">
            {ngoData.map((ngo, index) => (
              <div key={index} className="table-row">
                <div className="ngo-info">
                  <div className="ngo-avatar">{ngo.name.charAt(0)}</div>
                  <span className="ngo-name">{ngo.name}</span>
                </div>
                
                <div className="donations-count">
                  <span className="count">{ngo.donations}</span>
                  <span className="label">donations</span>
                </div>
                
                <div className="servings-count">
                  <span className="count">{formatNumber(ngo.servings)}</span>
                  <span className="label">servings</span>
                </div>
                
                <div className="response-time">
                  <span className="time">2.5 hrs</span>
                  <span className="label">avg response</span>
                </div>
                
                <div className="performance-bar">
                  <div className="progress-container">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${85 + (index * 3)}%` }}
                    ></div>
                  </div>
                  <span className="performance-score">{85 + (index * 3)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="impact-summary">
        <div className="impact-header">
          <h3>Your Impact This Period</h3>
        </div>
        
        <div className="impact-stats">
          <div className="impact-stat">
            <div className="impact-number">2,340</div>
            <div className="impact-label">Meals Provided</div>
            <div className="impact-description">Equivalent to feeding a family of 4 for 6 months</div>
          </div>
          
          <div className="impact-stat">
            <div className="impact-number">420kg</div>
            <div className="impact-label">Food Waste Prevented</div>
            <div className="impact-description">Saved from ending up in landfills</div>
          </div>
          
          <div className="impact-stat">
            <div className="impact-number">23</div>
            <div className="impact-label">Organizations Helped</div>
            <div className="impact-description">NGOs and community kitchens supported</div>
          </div>
          
          <div className="impact-stat">
            <div className="impact-number">92%</div>
            <div className="impact-label">Success Rate</div>
            <div className="impact-description">Of donations successfully delivered</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;