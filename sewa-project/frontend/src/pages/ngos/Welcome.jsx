import React from 'react';
import { 
  Heart, 
  Users, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Building,
  Phone,
  Mail,
  Globe,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';
import '../../components/CSS/ngos/Welcome.css';

const Welcome = () => {
  const features = [
    {
      icon: Heart,
      title: 'Food Donations',
      description: 'Accept and manage food donations from hotels and restaurants',
      color: '#10b981'
    },
    {
      icon: Users,
      title: 'Request Management',
      description: 'Review and approve food requests from community organizations',
      color: '#3b82f6'
    },
    {
      icon: TrendingUp,
      title: 'Impact Tracking',
      description: 'Monitor your organization\'s impact with detailed reports',
      color: '#8b5cf6'
    },
    {
      icon: CheckCircle,
      title: 'Distribution',
      description: 'Efficiently distribute food to those in need',
      color: '#f59e0b'
    }
  ];

  const stats = [
    { label: 'Organizations Served', value: '150+', icon: Building },
    { label: 'Meals Distributed', value: '50K+', icon: Heart },
    { label: 'Active NGOs', value: '25+', icon: Users },
    { label: 'Cities Covered', value: '12+', icon: MapPin }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      organization: 'Community Center Downtown',
      text: 'SEWA has transformed how we manage food donations. The platform is intuitive and helps us serve more people efficiently.',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      organization: 'Homeless Shelter North',
      text: 'The real-time notifications and easy request management have made our operations so much smoother.',
      rating: 5
    },
    {
      name: 'Emily Chen',
      organization: 'Senior Center East',
      text: 'We can now track our impact and generate reports that help us secure more funding. Amazing platform!',
      rating: 5
    }
  ];

  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Welcome to SEWA NGO Dashboard</h1>
            <p className="hero-subtitle">
              Your comprehensive platform for managing food donations, requests, and community impact. 
              Join thousands of NGOs making a difference in their communities.
            </p>
            <div className="hero-actions">
              <button className="primary-btn">
                Get Started
                <ArrowRight size={20} />
              </button>
              <button className="secondary-btn">
                Learn More
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <Heart size={64} />
              <h3>Making a Difference</h3>
              <p>Together, we're reducing food waste and fighting hunger</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="stat-card">
                <div className="stat-icon">
                  <IconComponent size={24} />
                </div>
                <div className="stat-content">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="section-header">
          <h2>Everything You Need to Manage Food Donations</h2>
          <p>Our platform provides all the tools you need to efficiently manage donations and serve your community</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="feature-card">
                <div className="feature-icon" style={{ backgroundColor: `${feature.color}20`, color: feature.color }}>
                  <IconComponent size={32} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Simple steps to start making an impact in your community</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Accept Donations</h3>
              <p>Receive notifications when hotels and restaurants have surplus food available for donation</p>
            </div>
          </div>
          <div className="step-arrow">
            <ArrowRight size={24} />
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Review Requests</h3>
              <p>Community organizations submit food requests that you can review and approve</p>
            </div>
          </div>
          <div className="step-arrow">
            <ArrowRight size={24} />
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Distribute Food</h3>
              <p>Coordinate pickup and distribution to ensure food reaches those who need it most</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="section-header">
          <h2>What Our Partners Say</h2>
          <p>Hear from NGOs who are making a difference with SEWA</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="star-filled" />
                ))}
              </div>
              <p className="testimonial-text">"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.organization}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Make a Difference?</h2>
          <p>Join the SEWA community and start managing food donations more effectively</p>
          <div className="cta-actions">
            <button className="primary-btn large">
              Start Your Journey
              <ArrowRight size={20} />
            </button>
            <button className="secondary-btn large">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-content">
          <h2>Need Help Getting Started?</h2>
          <p>Our support team is here to help you make the most of the SEWA platform</p>
          <div className="contact-methods">
            <div className="contact-method">
              <Phone size={20} />
              <div>
                <h4>Phone Support</h4>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-method">
              <Mail size={20} />
              <div>
                <h4>Email Support</h4>
                <p>support@sewa.org</p>
              </div>
            </div>
            <div className="contact-method">
              <Globe size={20} />
              <div>
                <h4>Live Chat</h4>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;




