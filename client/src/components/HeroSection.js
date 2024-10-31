// /client/src/components/HeroSection.js
import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className="hero-section">
      <img src="your-chai-cart-image-url.jpg" alt="Chai Cart" className="hero-image" />
      <div className="hero-content">
        <h1>Chai Cart Rental</h1>
        <p>Bring the authentic chai experience to any event with our unique Chai Cart!</p>
        <Link to="/rent" className="cta-button">Rent Now</Link>
      </div>
    </div>
  );
}

export default HeroSection;
