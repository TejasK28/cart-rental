const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

  // Define timeOptions array here
const timeOptions = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
  '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
];

// BOOKING ----------------------------------------------------------------
// Define the Booking schema
const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  dropoffLocation: String,
  startDateTime: Date,
  endDateTime: Date,
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model('Booking', bookingSchema);

// Endpoint to create a booking
app.post('/api/rent', async (req, res) => {
  try {
    const { name, email, phoneNumber, street, city, state, zip, dropoffLocation, startDateTime, endDateTime } = req.body;

    if (!name || !email || !phoneNumber || !street || !city || !state || !zip || !dropoffLocation || !startDateTime || !endDateTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBooking = new Booking({
      name,
      email,
      phoneNumber,
      address: { street, city, state, zip },
      dropoffLocation,
      startDateTime,
      endDateTime,
    });

    await newBooking.save();
    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ message: 'Booking creation failed' });
  }
});

// Endpoint to get unavailable date-time ranges
app.get('/api/unavailable-dates', async (req, res) => {
  try {
    const bookings = await Booking.find({}, 'startDateTime endDateTime');
    const unavailableSlots = bookings.map(booking => ({
      start: booking.startDateTime,
      end: booking.endDateTime,
    }));

    res.status(200).json({ unavailableSlots });
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
