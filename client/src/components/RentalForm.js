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

    // Ignore time by setting hours to midnight
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Calculate absolute day difference and ensure it's a number
    let dayDifference = Math.abs(Number(end.toString().split(' ')[2]) - Number(start.toString().split(' ')[2]));
    if(dayDifference === 0)
        dayDifference++;
    setEstimatedCost(Number(dayDifference * 100));


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

const TAX_RATE = 1.06625; // 6.625% tax rate

const handleSubmit = async () => {
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

  // Calculate the total cost after tax
  const totalCost = (estimatedCost + 40) * TAX_RATE;

  try {
    await axios.post('http://localhost:5001/api/rent', {
      ...formData,
      startDateTime,
      endDateTime,
      estimatedTotalCost: (Number(totalCost).toFixed(2))
    });

    setMessage('Booking created successfully. You will be contacted with more information.');

    // Send email confirmation (as before)
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
      endDate: estEndDate,
      estimatedTotalCost: totalCost.toFixed(2), // Include cost in email template
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
          <li className="total-cost"><span className="cost-label">Estimated Total (incl. tax):</span><span className="cost-amount">${ ((estimatedCost + 40) * TAX_RATE).toFixed(2)}</span></li>
        </ul>
        <p className="tax-note">*Includes estimated tax at 6.625%</p>
      </div>

      <button onClick={() => setIsModalOpen(!isModalOpen)}>Review & Accept Contract</button>

      {isModalOpen && (
  <div className="modal-overlay" style={{ 
    position: 'fixed', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)', 
    width: '90vw', 
    maxWidth: '500px', 
    height: '80vh', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: '8px'
  }}>
    <div className="modal-content" style={{ 
      backgroundColor: '#fff', 
      padding: '20px', 
      borderRadius: '8px', 
      width: '100%', 
      maxHeight: '100%', 
      overflowY: 'auto', 
      textAlign: 'center', 
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    }}>
      <h3>Rental Agreement</h3>
      <p>This Rental Agreement is entered into between Shivam Patel, referred to as the "Owner," and the "Renter," regarding the rental of the Chai/Candy Cart (White, 4ft by 2ft by 8ft).</p>
      
      <h4>Rental Terms</h4>
      <p>The rental term shall commence on a specified date and time, and the decor piece must be returned on or before the end date. The Renter shall return the decor piece in the same condition as rented, with normal wear and tear excepted.</p>

      <h4>Rental Fee</h4>
      <p>The Renter agrees to pay a rental fee of $100 per day, payable at delivery. Accepted payment methods include CASH, ZELLE, and VENMO.</p>

      <h4>Security Deposit</h4>
      <p>A security deposit of $40 is required, refundable within the same day of the rental's end, provided the decor piece is returned in the same condition.</p>

      <h4>Care and Maintenance</h4>
      <p>The Renter agrees to handle the decor piece carefully, use it only for its intended purpose, and avoid spilling liquids or exposing it to rain. Cover with a tarp if rain is expected.</p>

      <h4>Delivery and Return</h4>
      <p>Delivery and pickup will incur an additional fee based on distance. The decor piece remains the property of the Owner.</p>

      <h4>Signatures</h4>
      <p>By signing, the Renter agrees to abide by these terms.</p>

      <label>Signature (type your name): 
        <input type="text" value={signature} onChange={handleSignatureChange} required />
      </label>
      
      <button onClick={() => { setIsContractSigned(!!signature.trim()); setIsModalOpen(false); }}>
        Accept & Close
      </button>
    </div>
  </div>
)}




    
      <button onClick={handleSubmit} >Confirm Booking</button>

         
    </div>
  );
}

export default RentalForm;
