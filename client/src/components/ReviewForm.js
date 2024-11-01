// /client/src/components/ReviewForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './ReviewForm.css';

function ReviewForm({ onReviewSubmitted }) {
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear any previous error messages
    try {
      await axios.post('https://cart-rental-gqqj.vercel.app/api/reviews', { name, reviewText, rating });
      onReviewSubmitted();
      setName('');
      setReviewText('');
      setRating(5);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage(error.response.data.message);
      } else {
        console.error("Error submitting review:", error);
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="review-form-container">
          

      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Your review"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          required
        />
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
          ))}
        </select>
        <button type="submit">Submit</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
}

export default ReviewForm;
