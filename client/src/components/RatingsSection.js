// /client/src/components/RatingsSection.js
import React, { useEffect } from 'react';
import './RatingsSection.css';

function RatingsSection() {
  useEffect(() => {
    // Scroll animation logic can go here if desired
  }, []);

  return (
    <div className="ratings-section">
      <h2>Customer Ratings</h2>
      <div className="rating-stars">
        <span>⭐⭐⭐⭐⭐</span>
        <p >"Amazing addition to our event!"</p>
        <p>"Best chai experience ever!"</p>
      </div>
    </div>
  );
}

export default RatingsSection;
