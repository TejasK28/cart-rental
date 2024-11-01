// /client/src/components/RatingsSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RatingsSection.css';
import ReviewForm from './ReviewForm';
import AOS from 'aos';
import 'aos/dist/aos.css';

function RatingsSection() {
  const [topReviews, setTopReviews] = useState([]);

  // Fetch top reviews function
  const fetchTopReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/reviews/top');
      setTopReviews(response.data);
    } catch (error) {
      console.error("Error fetching top reviews:", error);
    }
  };

  useEffect(() => {
    fetchTopReviews();

    // Initialize AOS
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Refresh reviews after a new review is submitted
  const handleReviewSubmitted = () => {
    fetchTopReviews();
  };

  return (
    <div className="ratings-section" data-aos="fade-up">
      <h2 data-aos="fade-down">Customer Ratings</h2>
      <div className="rating-stars" data-aos="fade-up" data-aos-delay="200">
        {topReviews.map((review, index) => (
          <div key={index} className="review" data-aos="fade-up" data-aos-delay={index * 100}>
            <p><strong>{review.name}</strong></p>
            <p>{'⭐'.repeat(review.rating)}</p>
            <p>{review.reviewText}</p>
          </div>
        ))}
      </div>
      <ReviewForm onReviewSubmitted={handleReviewSubmitted} data-aos="fade-up" data-aos-delay="300" />
    </div>
  );
}

export default RatingsSection;
