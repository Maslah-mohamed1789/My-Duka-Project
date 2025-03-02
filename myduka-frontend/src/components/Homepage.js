// src/components/Homepage.js
import React from 'react';
import './Homepage.css';

const Homepage = () => {
  return (
    <div className="homepage">
      <header className="hero-section">
        <h1 className="homepage-title">Welcome to MyDuka</h1>
        <p className="homepage-description">
          Revolutionizing inventory management with ease. Streamline your operations, track sales, manage inventory, and generate reports all in one place.
        </p>
        <button className="cta-button">Get Started</button>
      </header>
      
      <section className="features-section">
        <h2 className="features-title">Key Features</h2>
        <div className="features-container">
          <div className="feature-item">
            <i className="feature-icon fas fa-box"></i>
            <h3>Manage Inventory</h3>
            <p>Easily manage your inventory with just a few clicks.</p>
          </div>
          <div className="feature-item">
            <i className="feature-icon fas fa-credit-card"></i>
            <h3>Track Sales</h3>
            <p>Monitor your sales in real time to stay on top of your business.</p>
          </div>
          <div className="feature-item">
            <i className="feature-icon fas fa-chart-line"></i>
            <h3>Generate Reports</h3>
            <p>Get insights into your business with automatic report generation.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Join the MyDuka community today and take your business to the next level.</p>
      </footer>
    </div>
  );
};

export default Homepage;
