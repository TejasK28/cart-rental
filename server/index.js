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

const Booking = require('./models/Booking'); // Define this model with the required fields

app.post('/api/rent', async (req, res) => {
  try {
    const {
      name,
      email,
      street,
      city,
      state,
      zip,
      dropoffLocation, // Ensure it matches client side naming
      startDate,
      endDate
    } = req.body;

    if (!name || !email || !street || !city || !state || !zip || !dropoffLocation || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newBooking = new Booking({
      name,
      email,
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
