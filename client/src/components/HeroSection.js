import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';
import c1 from '../images/cart1.jpeg';
import c2 from '../images/cart2.jpeg';
import c3 from '../images/cart3.jpeg';
import c4 from '../images/cart4.jpeg';
import c5 from '../images/cart5.jpeg';
import c6 from '../images/cart6.jpeg';
import c7 from '../images/cart7.jpeg';
import c8 from '../images/cart8.jpeg';
import c9 from '../images/cart9.jpeg';
import c10 from '../images/cart10.jpeg';
import c11 from '../images/cart11.jpeg';
import c12 from '../images/cart12.jpeg';

function HeroSection() {
  const images = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12];
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
        <h1 className="hero-title">Dessert Cart Rental</h1>
        <p className="hero-description">Bring the authentic Dessert experience to any event with our unique Dessert Cart!</p>
        <Link to="/rent" className="cta-button">Rent Now</Link>
      </div>
    </div>
  );
}

export default HeroSection;
