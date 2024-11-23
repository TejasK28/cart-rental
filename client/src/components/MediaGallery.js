// /client/src/components/MediaGallery.js
import React from 'react';
import './MediaGallery.css';
import cartVideo1 from '../images/cartvid1.mp4';
import cartVideo2 from '../images/cartvid2.mov';
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
import c13 from '../images/cart13.jpeg';

const mediaItems = [
  { id: 1, type: 'image', src: c1, alt: 'Product Image 1' },
  { id: 2, type: 'image', src: c2, alt: 'Product Image 2' },
  { id: 3, type: 'video', src: cartVideo1, alt: 'Product Video 1' },
  { id: 4, type: 'image', src: c3, alt: 'Product Image 3' },
  { id: 5, type: 'image', src: c13, alt: 'Product Image 4' },
  { id: 6, type: 'video', src: cartVideo2, alt: 'Product Image 5' },
  { id: 7, type: 'image', src: c6, alt: 'Product Image 6' },
  { id: 8, type: 'image', src: c7, alt: 'Product Image 7' },
  { id: 9, type: 'image', src: c8, alt: 'Product Image 8' },
  { id: 10, type: 'image', src: c9, alt: 'Product Image 9' }
];

function MediaGallery() {
  return (
    <div className="media-gallery" data-aos="fade-up">
      <h2 data-aos="fade-down">Gallery</h2>
      <div className="media-grid">
        {mediaItems.map((item) => (
          <div key={item.id} className="media-card" data-aos="zoom-in" data-aos-delay={item.id * 3}>
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
