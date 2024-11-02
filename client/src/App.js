import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HeroSection from './components/HeroSection.js';
import FeaturesSection from './components/FeaturesSection.js';
import RatingsSection from './components/RatingsSection.js';
import PricesSection from './components/PricesSection.js';
import ContactSection from './components/ContactSection.js';
import SocialSection from './components/SocialSection.js';
import RentalForm from './components/RentalForm.js';
import MediaGallery from './components/MediaGallery.js';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Analytics } from "@vercel/analytics/react"

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <HeroSection />
            <FeaturesSection />
            <MediaGallery />
            <PricesSection />            
            <ContactSection />
            <RatingsSection />
            <SocialSection /> 
            {/* Analytics */}
            <Analytics />
          </div>
        } />
        <Route path="/rent" element={<RentalForm />} />
      </Routes>
    </Router>
  );
}

export default App;
