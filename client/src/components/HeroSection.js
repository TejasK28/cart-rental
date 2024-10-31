// /client/src/components/HeroSection.js
import React from 'react';
import './HeroSection.css';

function HeroSection() {
  return (
    <div className="hero-section">
      <img src="your-chai-cart-image-url.jpg" alt="Chai Cart" className="hero-image" />
      <div className="hero-content">
        <h1>Chai Cart Rental</h1>
        <p>Bring the authentic chai experience to any event with our unique Chai Cart!</p>
        <a href="#rent-now" className="cta-button">Rent Now</a>
      </div>
    </div>
  );
}

export default HeroSection;
