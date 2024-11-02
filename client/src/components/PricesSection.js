// client/src/components/PricesSection.js

import React from 'react';
import './PricesSection.css';

function PricesSection() {
  return (
    <div className="prices-section" data-aos="fade-up">
      <h2 className="prices-title">Dessert Cart Rental Rates</h2>
      <p className="price-detail">📅 <strong>$100 Per Day</strong> - Cart Rental (Down Payment needed when the cart is dropped off)</p>
      <p className="price-detail">💸 <strong>$40 Refundable Security Deposit</strong> - returned with undamaged cart</p>
      <p className="price-detail">☕ <strong>$35 Per Coffee Chafer Rental</strong></p>
      <p className="price-highlight">⭐️ Discounts on Multi-Cart, Multi-Day, and Package Deals ⭐️</p>
      
      <h3 className="prices-subtitle">Delivery & Pickup</h3>
      <p className="price-detail">🚚 We deliver and pick up from events! Delivery fee is calculated based on distance from Piscataway, NJ, with fixed rates based on travel time.</p>
      <p className="price-detail">⚡ Quick drop-off and pick-up available!</p>
      <p className="note">*Rental does not include decor*</p>

      <h3 className="prices-subtitle">Availability</h3>
      <p className="price-detail"> 🛒 <strong>2</strong> identical carts available!</p>
    </div>
  );
}

export default PricesSection;
