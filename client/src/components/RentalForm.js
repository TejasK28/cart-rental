// client/src/components/RentalForm.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import emailjs from 'emailjs-com';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './RentalForm.css';



// Helper function to convert to EST
const formatToEST = (date) => {
  return new Date(date).toLocaleString('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

function RentalForm() {
  const [dates, setDates] = useState({ startDateTime: null, endDateTime: null });
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
  const [unavailableSlots, setUnavailableSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [signature, setSignature] = useState('');

  const fetchUnavailableSlots = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/unavailable-dates');
      setUnavailableSlots(response.data.unavailableSlots || []);
    } catch (error) {
      console.error("Error fetching unavailable slots:", error);
    }
  };

  useEffect(() => {
    fetchUnavailableSlots();
  }, []);

  useEffect(() => {
    if (message) {
      setShowPopup(true);
      const timeout = setTimeout(() => {
        setShowPopup(false);
        setMessage('');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  useEffect(() => {
    if (dates.startDateTime && dates.endDateTime) {
      const start = new Date(dates.startDateTime);
      const end = new Date(dates.endDateTime);
      const dayDifference = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setEstimatedCost(dayDifference * 100);
    } else {
      setEstimatedCost(0);
    }
  }, [dates.startDateTime, dates.endDateTime]);

  const isUnavailable = (selectedStart, selectedEnd) => {
    return unavailableSlots.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return (
        (selectedStart >= slotStart && selectedStart < slotEnd) || 
        (selectedEnd > slotStart && selectedEnd <= slotEnd) ||
        (selectedStart <= slotStart && selectedEnd >= slotEnd)
      );
    });
  };

  const filterUnavailableDates = (date) => {
    return !unavailableSlots.some(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);
      return (
        date >= slotStart.setHours(0, 0, 0, 0) &&
        date <= slotEnd.setHours(23, 59, 59, 999)
      );
    });
  };

  const filterUnavailableTimes = (time) => {
    if (!dates.startDateTime) return true;

    const selectedDate = new Date(dates.startDateTime);
    selectedDate.setHours(time.getHours(), time.getMinutes(), 0, 0);

    return unavailableSlots.every(slot => {
      const slotStart = new Date(slot.start);
      const slotEnd = new Date(slot.end);

      return (
        selectedDate.getDate() !== slotStart.getDate() || selectedDate >= slotEnd
      );
    });
  };

  const handleInputChange = (e) => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

  const handleSignatureChange = (e) => setSignature(e.target.value);

  const handleSubmit = async () => {

    console.log(isContractSigned)
    console.log(signature)

    if (!isContractSigned || !signature) {
      setMessage("Please sign and accept the contract before booking.");
      return;
    }

    const { startDateTime, endDateTime } = dates;


    if (!startDateTime || !endDateTime) {
      setMessage("Please select both start and end date-time.");
      return;
    }

    if (new Date(endDateTime) <= new Date(startDateTime)) {
      setMessage("End date and time must be after the start date and time.");
      return;
    }

    if (isUnavailable(new Date(startDateTime), new Date(endDateTime))) {
      setMessage("The selected time range overlaps with an existing booking.");
      return;
    }

    try {
      await axios.post('http://localhost:5001/api/rent', {
        ...formData,
        startDateTime,
        endDateTime
      });

      setMessage('Booking created successfully. You will be contacted with more information.');

      

      

      // Convert dates to EST before sending in email
      const estStartDate = formatToEST(startDateTime);
      const estEndDate = formatToEST(endDateTime);

      emailjs.send('service_tn4oh1k', 'template_r4qpagw', {
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        dropoffLocation: formData.dropoffLocation,
        startDate: estStartDate,
        endDate: estEndDate
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
      setDates({ startDateTime: null, endDateTime: null });
      setSignature('');
      setIsContractSigned(false);

      await fetchUnavailableSlots();

    } catch (error) {
      setMessage('Error submitting form. Please fill out all details.');
    }

    


  };

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
        <label>Start Date and Time:</label>
        <DatePicker
          selected={dates.startDateTime}
          onChange={(date) => setDates({ ...dates, startDateTime: date })}
          showTimeSelect
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          filterDate={filterUnavailableDates}
          filterTime={filterUnavailableTimes}
          minDate={new Date()}
          placeholderText="Select Start Date and Time"
        />

        <label>End Date and Time:</label>
        <DatePicker
          selected={dates.endDateTime}
          onChange={(date) => setDates({ ...dates, endDateTime: date })}
          showTimeSelect
          timeIntervals={30}
          timeCaption="Time"
          dateFormat="MMMM d, yyyy h:mm aa"
          filterDate={filterUnavailableDates}
          filterTime={filterUnavailableTimes}
          minDate={dates.startDateTime}
          placeholderText="Select End Date and Time"
        />
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
          <li className="total-cost"><span className="cost-label">Estimated Total (incl. tax):</span><span className="cost-amount">${((estimatedCost + 40) * 1.06625).toFixed(2)}</span></li>
        </ul>
        <p className="tax-note">*Includes estimated tax at 6.625%</p>
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

    
      <button onClick={handleSubmit} >Confirm Booking</button>

         
    </div>
  );
}

export default RentalForm;
