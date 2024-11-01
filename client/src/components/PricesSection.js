import React from 'react';
import './PricesSection.css';

function PricesSection() {
  return (
    <div className="prices-section" data-aos="fade-up">
      <h2>Chai Packages</h2>
      <p>Security Deposit: <strong>$40</strong></p>
      <p>Per Day: <strong>$100</strong></p>
      <h3>Delivery Prices</h3>
      <ul>
        <li>1-15 Miles: <strong>$35</strong></li>
        <li>16-30 Miles: <strong>$45</strong></li>
        <li>31-45 Miles: <strong>$55</strong></li>
        <li>45-60 Miles: <strong>$65</strong></li>
      </ul>
      <p><strong>Contact Us for Pickup</strong></p>
    </div>
  );
}

export default PricesSection;
