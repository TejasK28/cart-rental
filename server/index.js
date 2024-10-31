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
  const { name, email, street, city, state, zip, startDate, endDate } = req.body;

  // Basic validation to make sure required fields are not empty
  if (!name || !email || !street || !city || !state || !zip || !startDate || !endDate) {
    return res.status(400).json({ message: 'Please fill in all fields' });
  }

  try {
    // Check if the dates are available
    const existingBooking = await Booking.findOne({
      $or: [
        { startDate: { $lte: endDate, $gte: startDate } },
        { endDate: { $lte: endDate, $gte: startDate } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'Selected dates are unavailable' });
    }

    // Save booking if dates are available
    const booking = new Booking({
      name,
      email,
      address: { street, city, state, zip },
      startDate,
      endDate
    });

    await booking.save();
    res.status(200).json({ message: 'Booking confirmed' });

  } catch (error) {
    console.error("Booking error:", error); // Log the exact error to console
    res.status(500).json({ message: 'Server error, please try again' });
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
