import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';
import c1 from '../images/cart1.jpg';
import c2 from '../images/cart2.jpg';
import c3 from '../images/cart3.jpg';
import c4 from '../images/cart4.jpg';

function HeroSection() {
  const images = [c1, c2, c3, c4];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true);
      }, 500); // Duration of fade-out
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="hero-section">
      <div
        className={`hero-image ${fade ? 'fade-in' : 'fade-out'}`}
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      ></div>
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1 className="hero-title">Chai Cart Rental</h1>
        <p className="hero-description">Bring the authentic chai experience to any event with our unique Chai Cart!</p>
        <Link to="/rent" className="cta-button">Rent Now</Link>
      </div>
    </div>
  );
}

export default HeroSection;
