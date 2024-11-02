import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ReviewForm.css';

function ReviewForm({ onReviewSubmitted }) {
  const [name, setName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTimeout, setErrorTimeout] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    // Clear any existing error timeout
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/reviews`, { name , reviewText, rating });
      onReviewSubmitted();
      setName('');
      setReviewText('');
      setRating(5);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
      
      // Set a timeout to clear the error message after 3 seconds
      const timeout = setTimeout(() => setErrorMessage(''), 3000);
      setErrorTimeout(timeout);
    }
  };

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (errorTimeout) {
        clearTimeout(errorTimeout);
      }
    };
  }, [errorTimeout]);

  return (
    <div className="review-form-container">
      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name (must match booking name)"
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
        <button type="submit">Submit Review</button>
      </form>
      {errorMessage && <div className="error-popup">{errorMessage}</div>}
    </div>
  );
}

export default ReviewForm;
