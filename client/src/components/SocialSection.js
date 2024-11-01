// SocialSection.js
import React from 'react';
import './SocialSection.css';

function SocialSection() {
  return (
    <div className="social-section">
      <h2>Connect with Us</h2>
      <p>Follow us on social media for updates and promotions.</p>
      <div className="social-icons">
        <a href="https://www.instagram.com/woodsnap_rentals/" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://www.facebook.com/marketplace/item/575292608180338/?mibextid=6ojiHh" target="_blank" rel="noopener noreferrer">Facebook</a>
      </div>
    </div>
  );
}

export default SocialSection;
