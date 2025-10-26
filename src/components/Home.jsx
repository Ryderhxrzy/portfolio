import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Home.css';

const Home = ({ projects, personalInfo }) => {
  const featuredProjects = projects.filter(project => project.featured).slice(0, 3);

  // Function to handle image errors
  const handleImageError = (e) => {
    e.target.src = `https://via.placeholder.com/400x200/2563eb/ffffff?text=Project+Image`;
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in-up">
            <h1>Hi, I'm <span className="highlight">{personalInfo.name}</span></h1>
            <p className="hero-subtitle">{personalInfo.title}</p>
            <p className="hero-description">
              I create beautiful, functional web applications that solve real-world problems 
              and deliver exceptional user experiences.
            </p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn btn-primary">
                <i className="fas fa-briefcase"></i>
                View My Work
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                <i className="fas fa-paper-plane"></i>
                Get In Touch
              </Link>
            </div>
            <div className="hero-social">
              <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-github"></i>
              </a>
              <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href={personalInfo.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
          <div className="hero-image">
            <div className="image-placeholder">
              <i className="fas fa-code"></i>
              <div className="placeholder-text">Your Photo</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about section">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>{personalInfo.about}</p>
              <div className="about-details">
                <div className="detail-item">
                  <i className="fas fa-envelope"></i>
                  <span>{personalInfo.email}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{personalInfo.location}</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-phone"></i>
                  <span>{personalInfo.phone}</span>
                </div>
              </div>
            </div>
            <div className="skills">
              <h3>Technologies I Work With</h3>
              <div className="skills-list">
                {personalInfo.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    <i className="fas fa-check"></i>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects section">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {featuredProjects.map(project => (
              <div key={project.id} className="project-card fade-in-up">
                <div className="project-image">
                  <img 
                    src={`https://via.placeholder.com/400x200/2563eb/ffffff?text=${encodeURIComponent(project.title)}`} 
                    alt={project.title}
                    onError={handleImageError}
                  />
                  <div className="project-overlay">
                    <div className="project-links">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="View Code">
                          <i className="fab fa-github"></i>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo">
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                      )}
                    </div>
                  </div>
                  {project.featured && (
                    <div className="featured-badge">
                      <i className="fas fa-star"></i>
                      Featured
                    </div>
                  )}
                </div>
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-technologies">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="view-all">
            <Link to="/projects" className="btn btn-primary">
              <i className="fas fa-eye"></i>
              View All Projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;