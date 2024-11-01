// SocialSection.js
import React from 'react';
import './SocialSection.css';
import { FaInstagram, FaFacebookSquare } from 'react-icons/fa';

function SocialSection() {
  return (
    <div className="social-section">
      <h2>Connect with Us</h2>
      <p>Follow us on social media for the latest updates and exclusive promotions.</p>
      <div className="social-icons">
        <a href="https://www.instagram.com/woodsnap_rentals/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <FaInstagram className="social-icon" />
        </a>
        <a href="https://www.facebook.com/marketplace/item/575292608180338/?mibextid=6ojiHh" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <FaFacebookSquare className="social-icon" />
        </a>
      </div>
    </div>
  );
}

export default SocialSection;
