// /client/src/components/MediaGallery.js
import React from 'react';
import './MediaGallery.css';
import cartImage1 from '../images/cart1.jpg';
import cartImage2 from '../images/cart2.jpg';
import cartImage3 from '../images/cart3.jpg';
import cartImage4 from '../images/cart4.jpg';
import cartVideo1 from '../images/cartvid1.mp4';
const mediaItems = [
  { id: 1, type: 'image', src: cartImage1, alt: 'Product Image 1' },
  { id: 2, type: 'image', src: cartImage2, alt: 'Product Image 2' },
  { id: 3, type: 'video', src: cartVideo1, alt: 'Product Video 1' },
  { id: 4, type: 'image', src: cartImage3, alt: 'Product Image 3' },
  { id: 5, type: 'video', src: cartVideo1, alt: 'Product Video 2' },
];

function MediaGallery() {
  return (
    <div className="media-gallery" data-aos="fade-up">
      <h2 data-aos="fade-down">Gallery</h2>
      <div className="media-grid">
        {mediaItems.map((item) => (
          <div key={item.id} className="media-card" data-aos="zoom-in" data-aos-delay={item.id * 100}>
            {item.type === 'image' ? (
              <img src={item.src} alt={item.alt} className="media-image" />
            ) : (
              <video controls className="media-video">
                <source src={item.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MediaGallery;
