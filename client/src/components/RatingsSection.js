// /client/src/components/RatingsSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RatingsSection.css';
import ReviewForm from './ReviewForm';

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
  }, []);

  // Refresh reviews after a new review is submitted
  const handleReviewSubmitted = () => {
    fetchTopReviews();
  };

  return (
    <div className="ratings-section">
      <h2>Customer Ratings</h2>
      <div className="rating-stars">
        {topReviews.map((review, index) => (
          <div key={index} className="review">
            <p><strong>{review.name}</strong></p>
            <p>{'⭐'.repeat(review.rating)}</p>
            <p>{review.reviewText}</p>
          </div>
        ))}
      </div>
      <ReviewForm onReviewSubmitted={handleReviewSubmitted} />
    </div>
  );
}

export default RatingsSection;
