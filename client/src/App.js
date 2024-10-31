// /client/src/App.js
import React from 'react';
import { useEffect, useState } from 'react';
import HeroSection from './components/HeroSection.js';
import FeaturesSection from './components/FeaturesSection.js';
import RatingsSection from './components/RatingsSection.js';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="App">
      <HeroSection />
      <FeaturesSection />
      <RatingsSection />
    </div>
  );
}

export default App;
