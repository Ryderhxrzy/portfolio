import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import './styles/Contact.css';

const Contact = ({ personalInfo }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    budget: '',
    timeline: '',
    projectType: '',
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
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
      return;
    }

    // Validate reCAPTCHA
    if (!recaptchaToken) {
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
      return;
    }

    try {
      // Send form data to server
      const response = await fetch('http://localhost:4000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken
        })
      });

      const data = await response.json();

      if (data.ok) {
        setStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          budget: '',
          timeline: '',
          projectType: '',
          message: ''
        });

        // Reset reCAPTCHA
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setRecaptchaToken(null);
      } else {
        throw new Error(data.error || 'Failed to submit form');
      }

      setTimeout(() => setStatus(''), 5000);
    } catch (err) {
      console.error('Form submission error:', err);
      setStatus('error');
      setTimeout(() => setStatus(''), 5000);
    }
  };

  const projectTypes = [
    'Web Development',
    'Mobile Development',
    'Desktop Application',
    'Vector Art',
    'Other'
  ];

  const budgetRanges = [
    '₱500 - ₱1,000',
    '₱1,000 - ₱2,500',
    '₱2,500 - ₱5,000',
    '₱5,000 - ₱10,000',
    '₱10,000+',
    'To be discussed'
  ];

  const timelines = [
    'Urgent (1-2 weeks)',
    'Standard (3-4 weeks)',
    'Flexible (1-2 months)',
    'Long-term (3+ months)'
  ];

  return (
    <div className="contact-page">
      <div className="container">
        <div className="page-header reveal-item">
          <h2>Let's Work Together</h2>
          <p>Ready to bring your project to life? Get in touch for a free consultation</p>
        </div>

        <div className="contact-content">
          {/* Contact Info Section */}
          <div className="contact-info reveal-item">
            <div className="info-card reveal-item">
              <h2>Start Your Project</h2>
              <p className="info-description">
                I specialize in creating custom web solutions that drive results. 
                Let's discuss how we can turn your ideas into reality.
              </p>
              
              <div className="services-highlight">
                <h4>Services I Offer:</h4>
                <div className="services-list">
                  <div className="service-item reveal-item">
                    <i className="fas fa-laptop-code"></i>
                    <span>Full-Stack Development</span>
                  </div>
                  <div className="service-item reveal-item">
                    <i className="fas fa-mobile-alt"></i>
                    <span>Mobile Development</span>
                  </div>
                  <div className="service-item reveal-item">
                    <i className="fas fa-computer"></i>
                    <span>Desktop Application</span>
                  </div>
                  <div className="service-item reveal-item">
                    <i className="fas fa-palette"></i>
                    <span>Vector Art</span>
                  </div>

                </div>
              </div>

              <div className="contact-details">
                <h4>Get In Touch</h4>
                <div className="contact-item reveal-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-text">
                    <h5>Email</h5>
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                  </div>
                </div>
                
                <div className="contact-item reveal-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-text">
                    <h5>Location</h5>
                    <span>{personalInfo.location}</span>
                  </div>
                </div>
                
                <div className="contact-item reveal-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-text">
                    <h5>Phone</h5>
                    <a href={`tel:${personalInfo.phone}`}>{personalInfo.phone}</a>
                  </div>
                </div>

                <div className="contact-item reveal-item">
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

          {/* Project Inquiry Form */}
          <form className="contact-form reveal-item" onSubmit={handleSubmit}>
            <div className="form-header reveal-item">
              <h3>Project Inquiry Form</h3>
              <p>Fill out the form below and I'll get back to you soon</p>
            </div>

            <div className="form-row">
              <div className="form-group reveal-item">
                <label htmlFor="name">Your Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group reveal-item">
                <label htmlFor="email">Your Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="form-group reveal-item">
              <label htmlFor="company">Company / Organization</label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your company name (optional)"
              />
            </div>

            <div className="form-row">
              <div className="form-group reveal-item">
                <label htmlFor="projectType">Project Type *</label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select project type</option>
                  {projectTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="form-group reveal-item">
                <label htmlFor="budget">Estimated Budget *</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select budget range</option>
                  {budgetRanges.map((range, index) => (
                    <option key={index} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group reveal-item">
              <label htmlFor="timeline">Project Timeline *</label>
              <select
                id="timeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                required
              >
                <option value="">Select timeline</option>
                {timelines.map((timeline, index) => (
                  <option key={index} value={timeline}>{timeline}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group reveal-item">
              <label htmlFor="message">Project Details *</label>
              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Please describe your project requirements, goals, and any specific features you need..."
              ></textarea>
              <div className="char-count">
                {formData.message.length}/500 characters
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="recaptcha-container reveal-item">
              <div className="recaptcha reveal-item">
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
              className={`btn btn-primary submit-btn reveal-item ${status === 'sending' ? 'loading' : ''}`}
              disabled={status === 'sending' || !recaptchaToken || !import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            >
              {status === 'sending' ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Sending Inquiry...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  Send Project Inquiry
                </>
              )}
            </button>
            
            {status === 'success' && (
              <div className="status-message success reveal-item">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Thank You!</h4>
                  <p>Your project inquiry has been sent successfully. I'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="status-message error reveal-item">
                <i className="fas fa-exclamation-circle"></i>
                <div>
                  <h4>
                    {!import.meta.env.VITE_RECAPTCHA_SITE_KEY
                      ? 'Configuration Error'
                      : !recaptchaToken
                      ? 'Verification Required'
                      : 'Something went wrong'
                    }
                  </h4>
                  <p>
                    {!import.meta.env.VITE_RECAPTCHA_SITE_KEY
                      ? 'reCAPTCHA is not properly configured. Please contact the administrator.'
                      : !recaptchaToken
                      ? 'Please complete the reCAPTCHA verification before submitting.'
                      : `Please try again or contact me directly at ${personalInfo.email}`
                    }
                  </p>
                </div>
              </div>
            )}

            <div className="form-footer reveal-item">
              <p>
                <i className="fas fa-shield-alt"></i>
                Protected by reCAPTCHA. Your info is secure and will only be used to contact you about your projects.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;