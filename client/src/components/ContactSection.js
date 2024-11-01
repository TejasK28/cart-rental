import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import './ContactSection.css';

function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [messageStatus, setMessageStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send('service_tn4oh1k', 'template_nvvzizg', formData, 'E3a2a-M3qNeDc3tUs')
      .then(() => {
        setMessageStatus('Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      })
      .catch((error) => {
        console.error('Failed to send message:', error);
        setMessageStatus('Failed to send message. Please try again.');
      });
  };

  // Clear the message status after a delay
  useEffect(() => {
    if (messageStatus) {
      const timer = setTimeout(() => setMessageStatus(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [messageStatus]);

  return (
    <div className="contact-section">
      <h2>Contact Us</h2>
      <p>Let us know if you have any questions or feedback!</p>
      <form className="contact-form" onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="name" 
          placeholder="Your Name" 
          value={formData.name}
          onChange={handleChange}
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Your Email" 
          value={formData.email}
          onChange={handleChange}
          required 
        />
        <textarea 
          name="message" 
          placeholder="Your Message" 
          value={formData.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Message</button>
        {messageStatus && <div className="message-popup">{messageStatus}</div>}
      </form>
    </div>
  );
}

export default ContactSection;
