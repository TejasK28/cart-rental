// client/src/components/FeaturesSection.js

import React from 'react';
import './FeaturesSection.css';

function FeaturesSection() {
  return (
    <div className="features-section" data-aos="fade-up">
      <h2 className="features-title">Why Rent the Dessert Cart?</h2>
      <p className="features-intro">Great attraction for parties, get-togethers, and celebrations. Made fully out of wood, very sturdy, and equipped with a convenient shelf for holding small items like cups, utensils, or decor.</p>
      <ul className="features-list">
        <li data-aos="fade-right" data-aos-delay="100">☕ Authentic Dessert Experience</li>
        <li data-aos="fade-right" data-aos-delay="300">🎉 Ideal for Weddings and Events</li>
        <li data-aos="fade-right" data-aos-delay="700">✨ Eye-catching and Sturdy Design</li>
      </ul>
    </div>
  );
}

export default FeaturesSection;
