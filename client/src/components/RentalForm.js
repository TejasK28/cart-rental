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
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [dateOptions, setDateOptions] = useState([]);
  const [unavailableDate, setUnavailableDate] = useState(null);
  const [unavailableEndTime, setUnavailableEndTime] = useState(null);
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signature, setSignature] = useState('');

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
    if (message) {
      setShowPopup(true); // Show popup when message changes
      const timeout = setTimeout(() => {
        setShowPopup(false); // Hide popup after 3 seconds
        setMessage(''); // Clear message
      }, 3000);
      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [message]);

  useEffect(() => {
    if (dates.startDate && dates.endDate) {
      const start = new Date(dates.startDate);
      const end = new Date(dates.endDate);
      let dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setEstimatedCost(dayDifference * 100);
    } else {
      setEstimatedCost(0);
    }
  }, [dates.startDate, dates.endDate]);

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

  const handleSignatureChange = (e) => setSignature(e.target.value);

  const handleSubmit = async () => {
    const { startDate, endDate, startTime, endTime } = dates;

    if (!isContractSigned || !signature) {
      setMessage("Please sign and accept the contract before booking.");
      return;
    }

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
      setSignature('');
      setIsContractSigned(false);
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
      
      {showPopup && (
        <div className="error-popup">
          <span>{message}</span>
        </div>
      )}

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
          <select name="startTime" onChange={handleDateChange} value={dates.startTime} disabled={!dates.startDate}>
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
          <select name="endDate" onChange={handleDateChange} value={dates.endDate} disabled={!dates.startDate}>
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

      <div className="contact-info">
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
        <input type="text" name="phoneNumber" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleInputChange} required />
        <input type="text" name="street" placeholder="Street Address" value={formData.street} onChange={handleInputChange} required />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleInputChange} required />
        <input type="text" name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleInputChange} required />
        <input type="text" name="dropoffLocation" placeholder="Dropoff Location" value={formData.dropoffLocation} onChange={handleInputChange} required />
      </div>

      <div className="cost-summary">
        <h3>Cost Breakdown</h3>
        <ul className="cost-details">
          <li><span className="cost-label">Security Deposit (Refundable):</span><span className="cost-amount">$40.00</span></li>
          <li><span className="cost-label">Estimated Rental Cost:</span><span className="cost-amount">${estimatedCost.toFixed(2)}</span></li>
          <li><span className="cost-label">Estimated Shipping Cost:</span><span className="cost-amount">TBD</span>
            <small className="cost-note">(based on delivery location and distance & will be charged upon delivery)</small>
          </li>
          <li className="total-cost"><span className="cost-label">Estimated Total (incl. tax):</span><span className="cost-amount">${(estimatedCost + 40 * 1.0625).toFixed(2)}</span></li>
        </ul>
        <p className="tax-note">*Includes estimated tax at 6.25%</p>
      </div>

      <button onClick={() => setIsModalOpen(!isModalOpen)}>Review & Accept Contract</button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Rental Agreement</h3>
            <p>Please don't mess up the cart :(</p>
            <p>More contract details go here...</p>
            <label>Signature (type your name): 
              <input type="text" value={signature} onChange={handleSignatureChange} required />
            </label>
            <button onClick={() => { setIsContractSigned(!!signature.trim()); setIsModalOpen(false); }}>Accept & Close</button>
          </div>
        </div>
      )}

      <button onClick={handleSubmit} disabled={!isContractSigned}>Confirm Booking</button>
    </div>
  );
}

export default RentalForm;
