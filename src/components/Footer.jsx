import React from 'react';
import './styles/Footer.css';

const Footer = ({ personalInfo }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3>{personalInfo.name}</h3>
            <p>Aspiring Full Stack Developer eager to apply web development skills and gain hands-on experience through an OJT internship.</p>
            <div className="footer-social">
              <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={personalInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-facebook"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#about">About Me</a>
            <a href="#projects">Projects</a>
            <a href="#github-stats">Github Stats</a>
            <a href="#reviews">Reviews</a>
            <a href="#contact">Contact</a>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Info</h4>
            <p>
              <i className="fas fa-envelope"></i>
              {personalInfo.email}
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i>
              {personalInfo.location}
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {currentYear} {personalInfo.name}. All rights reserved.</p>
          <div className="built-with">
            <p>Built with <span><i className='fas fa-heart'></i></span> and Passion</p>
            <a href="#home" aria-label="Scroll to top">
              <i className="fas fa-arrow-up"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;