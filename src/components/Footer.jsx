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
            <p>Full Stack Developer creating amazing web experiences</p>
            <div className="footer-social">
              <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <a href="#home">Home</a>
            <a href="#projects">Projects</a>
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
          <p>Built with React ❤️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;