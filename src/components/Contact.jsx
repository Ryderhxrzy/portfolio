import React, { useState } from 'react';
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
      setFormData({ 
        name: '', 
        email: '', 
        company: '', 
        budget: '', 
        timeline: '', 
        projectType: '', 
        message: '' 
      });
      
      setTimeout(() => setStatus(''), 5000);
    }, 2000);
  };

  const projectTypes = [
    'Web Application',
    'Mobile App',
    'E-commerce Website',
    'Portfolio Website',
    'API Development',
    'Database Design',
    'UI/UX Design',
    'Maintenance & Support',
    'Other'
  ];

  const budgetRanges = [
    '$500 - $1,000',
    '$1,000 - $2,500',
    '$2,500 - $5,000',
    '$5,000 - $10,000',
    '$10,000+',
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
        <div className="page-header">
          <h1>Let's Work Together</h1>
          <p>Ready to bring your project to life? Get in touch for a free consultation</p>
        </div>

        <div className="contact-content">
          {/* Contact Info Section */}
          <div className="contact-info">
            <div className="info-card">
              <h2>Start Your Project</h2>
              <p className="info-description">
                I specialize in creating custom web solutions that drive results. 
                Let's discuss how we can turn your ideas into reality.
              </p>
              
              <div className="services-highlight">
                <h4>Services I Offer:</h4>
                <div className="services-list">
                  <div className="service-item">
                    <i className="fas fa-laptop-code"></i>
                    <span>Full-Stack Development</span>
                  </div>
                  <div className="service-item">
                    <i className="fas fa-mobile-alt"></i>
                    <span>Responsive Web Design</span>
                  </div>
                  <div className="service-item">
                    <i className="fas fa-shopping-cart"></i>
                    <span>E-commerce Solutions</span>
                  </div>
                  <div className="service-item">
                    <i className="fas fa-database"></i>
                    <span>API & Database Design</span>
                  </div>
                </div>
              </div>

              <div className="contact-details">
                <h4>Get In Touch</h4>
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

              <div className="social-links">
                <h4>Follow My Work</h4>
                <div className="social-icons">
                  <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" title="GitHub">
                    <i className="fab fa-github"></i>
                    <span>GitHub</span>
                  </a>
                  <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                  </a>
                  <a href={personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" title="Twitter">
                    <i className="fab fa-twitter"></i>
                    <span>Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Project Inquiry Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-header">
              <h3>Project Inquiry Form</h3>
              <p>Fill out the form below and I'll get back to you soon</p>
            </div>

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
                  placeholder="John Doe"
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
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="form-group">
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
              <div className="form-group">
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
              <div className="form-group">
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

            <div className="form-group">
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
            
            <div className="form-group">
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
            
            <button 
              type="submit" 
              className={`btn btn-primary submit-btn ${status === 'sending' ? 'loading' : ''}`}
              disabled={status === 'sending'}
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
              <div className="status-message success">
                <i className="fas fa-check-circle"></i>
                <div>
                  <h4>Thank You!</h4>
                  <p>Your project inquiry has been sent successfully. I'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}
            
            {status === 'error' && (
              <div className="status-message error">
                <i className="fas fa-exclamation-circle"></i>
                <div>
                  <h4>Oops! Something went wrong</h4>
                  <p>Please try again or contact me directly at {personalInfo.email}</p>
                </div>
              </div>
            )}

            <div className="form-footer">
              <p>
                <i className="fas fa-lock"></i>
                Your information is secure and will only be used to contact you about your project.
              </p>
            </div>
          </form>
        </div>

        {/* Process Section */}
        <div className="process-section">
          <h2>My Working Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Consultation</h4>
                <p>We discuss your project requirements and goals</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Planning</h4>
                <p>I create a detailed project plan and timeline</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Development</h4>
                <p>I build your project with regular updates</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h4>Delivery</h4>
                <p>Final review, deployment, and support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;