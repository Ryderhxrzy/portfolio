// src/components/Contact.js
import React, { useState } from 'react';
import './styles/Contact.css';

const Contact = ({ personalInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate form submission
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset status after 3 seconds
      setTimeout(() => setStatus(''), 3000);
    }, 1500);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="page-header">
          <h1>Get In Touch</h1>
          <p>Have a project in mind? Let's work together!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h2>Let's Connect</h2>
            <p>
              I'm always interested in new opportunities and collaborations. 
              Whether you have a project in mind or just want to say hello, 
              feel free to reach out!
            </p>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-text">
                  <h4>Email</h4>
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-text">
                  <h4>Location</h4>
                  <span>{personalInfo.location}</span>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-text">
                  <h4>Phone</h4>
                  <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                </div>
              </div>
            </div>

            <div className="social-links">
              <h4>Follow Me</h4>
              <div className="social-icons">
                <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                  <i className="fab fa-github"></i>
                </a>
                <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href={personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Your Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="What's this about?"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell me about your project..."
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary submit-btn ${status === 'sending' ? 'loading' : ''}`}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
            
            {status === 'success' && (
              <div className="status-message success">
                <i className="fas fa-check-circle"></i>
                Thank you! Your message has been sent successfully.
              </div>
            )}
            
            {status === 'error' && (
              <div className="status-message error">
                <i className="fas fa-exclamation-circle"></i>
                Sorry, there was an error sending your message. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;