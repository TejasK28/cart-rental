import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';
import './RentalForm.css';

function RentalForm() {
  const [dates, setDates] = useState({ startDate: '', endDate: '', startTime: '', endTime: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    dropoffLocation: ''
  });
  const [message, setMessage] = useState('');
  const [dateOptions, setDateOptions] = useState([]);
  const [unavailableDate, setUnavailableDate] = useState(null);
  const [unavailableEndTime, setUnavailableEndTime] = useState(null);
  const messageRef = useRef(null);

  const timeOptions = [
    '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM',
    '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
  ];

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/unavailable-dates');
        setUnavailableDate(response.data.latestUnavailableDate);
        setUnavailableEndTime(response.data.latestUnavailableEndTime);

        const options = [];
        const today = new Date();

        for (let i = 0; i < 60; i++) {
          const futureDate = new Date(today);
          futureDate.setDate(today.getDate() + i);
          options.push(futureDate.toISOString().split('T')[0]);
        }

        setDateOptions(options);
      } catch (error) {
        console.error("Error fetching unavailable dates:", error);
      }
    };

    fetchUnavailableDates();
  }, []);

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message]);

  const convertTo24HourFormat = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (hours === '12') hours = '00';
    if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
    return `${hours}:${minutes}`;
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDates((prevDates) => ({ ...prevDates, [name]: value }));
    if (name === 'startDate' && value !== unavailableDate) {
      setUnavailableEndTime(null);
    }
  };

  const handleInputChange = (e) => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

  const handleSubmit = async () => {
    const { startDate, endDate, startTime, endTime } = dates;
    if (!startDate || !endDate || !startTime || !endTime) {
      setMessage("Please select both start and end dates and times.");
      return;
    }

    if (new Date(`${endDate}T${convertTo24HourFormat(endTime)}`) <= new Date(`${startDate}T${convertTo24HourFormat(startTime)}`)) {
      setMessage("End date and time must be after the start date and time.");
      return;
    }

    try {
      const formattedStartDate = new Date(`${startDate}T${convertTo24HourFormat(startTime)}:00`).toISOString();
      const formattedEndDate = new Date(`${endDate}T${convertTo24HourFormat(endTime)}:00`).toISOString();

      const response = await axios.post('http://localhost:5001/api/rent', {
        ...formData,
        startDate: formattedStartDate,
        endDate: formattedEndDate
      });

      setMessage(response.data.message);

      emailjs.send('service_tn4oh1k', 'template_r4qpagw', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        dropoffLocation: formData.dropoffLocation,
        startDate,
        endDate,
        startTime,
        endTime,
      }, 'E3a2a-M3qNeDc3tUs')
      .then((result) => {
          console.log('Email successfully sent!', result.text);
      }, (error) => {
          console.error('Failed to send email.', error.text);
      });

      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        dropoffLocation: ''
      });
      setDates({ startDate: '', endDate: '', startTime: '', endTime: '' });
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Error submitting form');
    }
  };

  const filteredDateOptions = dateOptions.filter((date) => new Date(date) >= new Date(unavailableDate));
  const filteredTimeOptions = dates.startDate === unavailableDate
    ? timeOptions.filter((time) => convertTo24HourFormat(time) >= convertTo24HourFormat(unavailableEndTime))
    : timeOptions;

  return (
    <div className="rental-form">
      <Link to="/" className="back-arrow">← Back</Link>

      <h2>Reserve the Chai Cart</h2>
      <div className="date-time-selection">
        <div className="date-time-group">
          <label>Start Date:</label>
          <select name="startDate" onChange={handleDateChange} value={dates.startDate}>
            <option value="">Select Start Date</option>
            {filteredDateOptions.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          <label>Start Time:</label>
          <select
            name="startTime"
            onChange={handleDateChange}
            value={dates.startTime}
            disabled={!dates.startDate}
          >
            <option value="">Select Start Time</option>
            {filteredTimeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        <div className="date-time-group">
          <label>End Date:</label>
          <select
            name="endDate"
            onChange={handleDateChange}
            value={dates.endDate}
            disabled={!dates.startDate}
          >
            <option value="">Select End Date</option>
            {dateOptions.map((date) => (
              <option key={date} value={date} disabled={new Date(date) < new Date(dates.startDate)}>
                {date}
              </option>
            ))}
          </select>

          <label>End Time:</label>
          <select name="endTime" onChange={handleDateChange} value={dates.endTime} disabled={!dates.endDate}>
            <option value="">Select End Time</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
      <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
      <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleInputChange} required />
      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
      <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required />
      <input type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleInputChange} required />
      <input type="text" name="dropoffLocation" placeholder="Dropoff Location" value={formData.dropoffLocation} onChange={handleInputChange} required />

      <button onClick={handleSubmit}>Confirm Booking</button>
      
      <div ref={messageRef}>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default RentalForm;
