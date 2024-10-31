// /client/src/components/FeaturesSection.js
import React from 'react';
import './FeaturesSection.css';

function FeaturesSection() {
  return (
    <div className="features-section" data-aos="fade-up">
  <h2>Why Rent the Chai Cart?</h2>
  <ul className="features-list">
    <li data-aos="fade-right">Authentic Chai Experience</li>
    <li data-aos="fade-right" data-aos-delay="200">Perfect for Weddings and Events</li>
    <li data-aos="fade-right" data-aos-delay="400">Premium Quality Ingredients</li>
    <li data-aos="fade-right" data-aos-delay="600">Eye-catching Design</li>
  </ul>
</div>

  );
}

export default FeaturesSection;
