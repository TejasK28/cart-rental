const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({ origin: 'https://cart-rental-gqqj.vercel.app/' }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));


// BOOKING ----------------------------------------------------------------
const Booking = require('./models/Booking'); // Ensure the Booking model is updated with phoneNumber and dropoffLocation

app.post('/api/rent', async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber, // New field added for validation and saving
      street,
      city,
      state,
      zip,
      dropoffLocation,
      startDate,
      endDate
    } = req.body;

    // Check that all required fields are provided
    if (!name || !email || !phoneNumber || !street || !city || !state || !zip || !dropoffLocation || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBooking = new Booking({
      name,
      email,
      phoneNumber, // Save phone number along with other fields
      address: { street, city, state, zip },
      dropoffLocation,
      startDate,
      endDate,
      createdAt: new Date()
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: 'Booking creation failed' });
  }
});

// Endpoint to get the latest unavailable end date and time
app.get('/api/unavailable-dates', async (req, res) => {
  try {
    // Find the latest end date in bookings
    const latestBooking = await Booking.findOne().sort({ endDate: -1 });
    if (latestBooking) {
      return res.status(200).json({
        latestUnavailableDate: latestBooking.endDate,
      });
    } else {
      // No bookings found, no unavailable dates
      return res.status(200).json({
        latestUnavailableDate: null,
      });
    }
  } catch (error) {
    console.error("Error fetching unavailable dates:", error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});


//REVIEW ------------------------------
const Review = require('./models/Review'); // Include the Review model

app.post('/api/reviews', async (req, res) => {
  try {
    const { name, reviewText, rating } = req.body;

    // Check if the user has made a booking
    const bookingExists = await Booking.findOne({ name });

    if (!bookingExists) {
      return res.status(403).json({ message: 'Only customers with bookings can submit reviews.' });
    }

    const newReview = new Review({ name, reviewText, rating });
    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: 'Error submitting review' });
  }
});

// Endpoint to fetch top reviews
app.get('/api/reviews/top', async (req, res) => {
  try {
    const topReviews = await Review.find().sort({ rating: -1, createdAt: -1 }).limit(5);
    res.status(200).json(topReviews);
  } catch (error) {
    console.error("Error fetching top reviews:", error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
