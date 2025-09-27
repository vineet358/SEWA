import React from 'react';
import { Users, Building, Heart } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <section className="about-sewa">
      <div className="container">
        <div className="header">
          <h2 className="main-heading">About SEWA</h2>
          <p className="intro-text">
            SEWA bridges the gap between abundance and need by connecting hotels and restaurants 
            with local NGOs to reduce food waste while feeding those who need it most. Our mission 
            is to create sustainable food distribution networks that transform surplus meals into 
            hope for communities across the region. We envision a community where no meal goes 
            wasted and every person has access to nutritious food.
          </p>
        </div>

        <div className="impact-cards">
          <div className="card">
            <div className="card-icon">
              <Heart className="icon" />
            </div>
            <h3 className="card-number">12,000+</h3>
            <p className="card-label">Meals Served</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <Building className="icon" />
            </div>
            <h3 className="card-number">50+</h3>
            <p className="card-label">Partnered Hotels</p>
          </div>

          <div className="card">
            <div className="card-icon">
              <Users className="icon" />
            </div>
            <h3 className="card-number">20+</h3>
            <p className="card-label">Communities Helped</p>
          </div>
        </div>

        <div className="cta-section">
          <button className="cta-button">
            Join Our Mission
          </button>
          <button className="cta-button secondary">
            Support Our Cause
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;