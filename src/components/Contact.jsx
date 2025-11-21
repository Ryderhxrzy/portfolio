import React, { useState, useRef, useEffect } from 'react';
import './styles/Contact.css';
import { showAlerts } from '../utils/sweetAlertConfig';
import ReCAPTCHA from 'react-google-recaptcha';

const Contact = ({ personalInfo }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const onRecaptchaExpired = () => {
    setRecaptchaToken(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    // Check if reCAPTCHA is configured
    if (!import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
      // If no reCAPTCHA, allow submission without verification
      try {
        const apiUrl = import.meta.env.VITE_APP_API_BASE || 'http://localhost:4000';
        
        const response = await fetch(`${apiUrl}/api/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            email: formData.email,
            message: formData.message,
            recaptchaToken: null
          })
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.ok) {
          showAlerts.success(
            'Message Sent Successfully!',
            'Thank you for considering me for an OJT position. I will review your message and get back to you soon.'
          );

          setFormData({
            full_name: '',
            email: '',
            message: ''
          });
          setStatus('');
        }
      } catch (err) {
        showAlerts.error(
          'Submission Failed',
          err.message || 'Something went wrong. Please try again later.'
        );
        setStatus('');
      }
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      showAlerts.warning(
        'Verification Required',
        'Please complete the reCAPTCHA verification before submitting.'
      );
      setStatus('');
      return;
    }

    try {
      // Send form data to server
      const apiUrl = import.meta.env.VITE_APP_API_BASE || 'http://localhost:4000';
      
      const response = await fetch(`${apiUrl}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          message: formData.message,
          recaptchaToken
        })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.ok) {
        // Show success message
        showAlerts.success(
          'Message Sent Successfully!',
          'Thank you for considering me for an OJT position. I will review your message and get back to you soon.'
        );

        // Reset form
        setFormData({
          full_name: '',
          email: '',
          message: ''
        });

        // Reset reCAPTCHA
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setRecaptchaToken(null);
        setStatus('');
      } else {
        throw new Error(data.error || 'Failed to submit form');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      showAlerts.error(
        'Submission Failed',
        err.message || 'Something went wrong. Please try again later or contact us directly.'
      );
      setStatus('');
    }
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="page-header">
          <h2>Hire Me for OJT</h2>
          <p>Looking for a motivated OJT intern? Let's discuss how I can contribute to your team.</p>
        </div>

        <div className="contact-content">
          {/* Contact Info Section */}
          <div className="contact-info">
            <div className="info-card">
              <h2>Why Hire Me?</h2>
              <p className="info-description">
                As a dedicated IT student, I'm eager to apply my skills in a professional 
                environment and contribute to your team's success during my OJT period.
              </p>

              <div className="contact-details">
                <h4>Contact Information</h4>
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-text">
                    <h5>Email</h5>
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-text">
                    <h5>Location</h5>
                    <span>{personalInfo.location}</span>
                  </div>
                </div>
                
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-text">
                    <h5>Phone</h5>
                    <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-text">
                    <h5>Response Time</h5>
                    <span>Within 24 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employer Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>Hiring Inquiry</h3>
              <p>Interested in having me as an OJT intern? Please fill out this form</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Your Name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Company/Personal Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@company.com"
                />
              </div>
            </div>
            
            <div className="form-group reveal-item">
              <label htmlFor="message">Tell me about the OJT opportunity *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Tell me about your company and the OJT position..."
              ></textarea>
              <div className="char-count">
                {formData.message.length}/500 characters
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="recaptcha-container">
              <div className="recaptcha">
                {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                    onChange={onRecaptchaChange}
                    onExpired={onRecaptchaExpired}
                    theme={document.documentElement.classList.contains('theme-dark') ? 'dark' : 'light'}
                  />
                ) : (
                  <div className="recaptcha-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    reCAPTCHA configuration missing. Please check environment variables.
                  </div>
                )}
                {!recaptchaToken && status === 'error' && (
                  <div className="recaptcha-error">
                    <i className="fas fa-exclamation-triangle"></i>
                    Please complete the reCAPTCHA verification
                  </div>
                )}
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary submit-btn ${status === 'sending' ? 'loading' : ''}`}
              disabled={status === 'sending' || (!recaptchaToken && import.meta.env.VITE_RECAPTCHA_SITE_KEY)}
            >
              {status === 'sending' ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending Message...
                </>
              ) : (
                <>
                  <i className={`fas ${recaptchaToken || !import.meta.env.VITE_RECAPTCHA_SITE_KEY ? 'fa-check-circle' : 'fa-paper-plane'}`}></i>
                  {recaptchaToken || !import.meta.env.VITE_RECAPTCHA_SITE_KEY ? 'Send Message' : 'Complete reCAPTCHA to Send'}
                </>
              )}
            </button>

            <div className="form-footer">
              <p>
                {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                  <>
                    <i className="fas fa-shield-alt"></i>
                    Protected by reCAPTCHA. Your information is secure and will only be used to contact you about OJT opportunities.
                  </>
                ) : (
                  <>
                    <i className="fas fa-envelope"></i>
                    Your information will only be used to contact you about OJT opportunities.
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;