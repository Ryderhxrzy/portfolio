import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import GitHubStats from './GitHubStats';
import Reviews from './Reviews';
import Contact from './Contact';
import { personalInfo, fetchGitHubRepositories } from '../data/projects';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching GitHub repositories...');
        const projects = await fetchGitHubRepositories();
        
        if (projects.length === 0) {
          throw new Error('No repositories found');
        }
        
        setFeaturedProjects(projects);
        console.log('Loaded projects:', projects);
      } catch (err) {
        console.error('Error loading projects:', err);
        setError('Failed to load projects from GitHub. Showing sample projects instead.');
        const fallbackProjects = await fetchGitHubRepositories();
        setFeaturedProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isValidDeployment = (url) => {
    if (!url) return false;
    return !url.includes('github.com') && !url.includes('github.io');
  };

  // Function to get color for a specific language
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      Python: '#3572A5',
      Java: '#b07219',
      'C++': '#f34b7d',
      C: '#555555',
      'C#': '#178600',
      PHP: '#4F5D95',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      Swift: '#ffac45',
      Kotlin: '#F18E33',
      HTML: '#e34c26',
      CSS: '#563d7c',
      SCSS: '#c6538c',
      React: '#61dafb',
      Vue: '#41b883',
      Angular: '#dd0031',
      NodeJS: '#339933',
      Express: '#000000',
      MongoDB: '#47a248',
      PostgreSQL: '#336791',
      MySQL: '#4479a1',
      SQLite: '#003b57',
      Docker: '#2496ed',
      Shell: '#89e051',
      Bash: '#4eaa25',
      Markdown: '#083fa1',
      YAML: '#cb171e',
      JSON: '#000000',
      XML: '#0060ac',
      SVG: '#ff9900'
    };
    return colors[language] || '#6e7681';
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <div className="hero-content fade-in-up">
            <h1>Hi, I'm <span className="highlight">{personalInfo.name}</span></h1>
            <p className="hero-aka">AKA <span className="aka-name">{personalInfo.aka}</span></p>
            <p className="hero-subtitle">{personalInfo.title}</p>
            <p className="hero-description">
              Freelance Developer since 2023 | 4th Year Computer Science Student
              <br />
              I create beautiful, functional web applications that solve real-world problems 
              and deliver exceptional user experiences.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
              >
                <i className="fas fa-briefcase"></i>
                View My Work
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              >
                <i className="fas fa-paper-plane"></i>
                Get In Touch
              </button>
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
      <section id="about" className="about section">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <div className="about-text">
              <p>{personalInfo.about}</p>
              <div className="education-info">
                <div className="education-item">
                  <i className="fas fa-graduation-cap"></i>
                  <div>
                    <h4>4th Year Information Technology Student</h4>
                    <p>Currently pursuing Bachelor's degree in Information Technology</p>
                  </div>
                </div>
                <div className="education-item">
                  <i className="fas fa-briefcase"></i>
                  <div>
                    <h4>Freelance Developer</h4>
                    <p>Providing development services since 2023</p>
                  </div>
                </div>
              </div>
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
              <h3>Technologies & Skills</h3>
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

      {/* Projects Section */}
      <section id="projects" className="featured-projects section">
        <div className="container">
          <h2 className="section-title">My Pinned GitHub Projects</h2>
          <p className="section-subtitle">Featured repositories from my GitHub profile</p>
          
          {error && (
            <div className="warning-message">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <strong>Note:</strong> {error}
              </div>
            </div>
          )}

          {loading ? (
            <div className="loading-projects">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading pinned projects from GitHub...</p>
              <small>Fetching your latest repositories</small>
            </div>
          ) : (
            <>
              <div className="projects-grid">
                {featuredProjects.map(project => (
                  <div key={project.id} className="project-card fade-in-up">
                    <div className="project-image">
                      <img 
                        src={project.image}
                        alt={project.title}
                        loading="eager"
                      />
                      <div className="project-overlay">
                        <div className="project-links">
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="View Code">
                            <i className="fab fa-github"></i>
                          </a>
                          {isValidDeployment(project.liveUrl) && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo">
                              <i className="fas fa-external-link-alt"></i>
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="project-stats">
                        <span className="stat">
                          <i className="fas fa-star"></i>
                          {project.stars || 0}
                        </span>
                        <span className="stat">
                          <i className="fas fa-code-branch"></i>
                          {project.forks || 0}
                        </span>
                        {project.language && (
                          <span className="stat language">
                            <i className="fas fa-circle" style={{ color: getLanguageColor(project.language) }}></i>
                            {project.language}
                          </span>
                        )}
                      </div>
                      {project.isPinned && (
                        <div className="project-pinned-badge">
                          <i className="fas fa-thumbtack"></i>
                          Pinned
                        </div>
                      )}
                    </div>
                    <div className="project-content">
                      <h3>{project.title}</h3>
                      <p className="project-description">{project.description}</p>
                      
                      {/* Multiple Languages Display */}
                      {project.languages && project.languages.length > 0 && (
                        <div className="project-languages">
                          <strong>Languages: </strong>
                          <div className="languages-list">
                            {project.languages.map((lang, index) => (
                              <span 
                                key={index} 
                                className="language-tag"
                                style={{ 
                                  backgroundColor: getLanguageColor(lang) + '20',
                                  color: getLanguageColor(lang),
                                  border: `1px solid ${getLanguageColor(lang)}40`
                                }}
                              >
                                <i 
                                  className="fas fa-circle" 
                                  style={{ color: getLanguageColor(lang) }}
                                ></i>
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Deployment Link */}
                      {isValidDeployment(project.liveUrl) && (
                        <div className="project-deployment">
                          <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="deployment-link"
                          >
                            <i className="fas fa-rocket"></i>
                            View Live Project
                          </a>
                        </div>
                      )}
                      
                      <div className="project-topics">
                        {project.topics && project.topics.slice(0, 4).map((topic, index) => (
                          <span key={index} className="topic-tag">
                            {topic}
                          </span>
                        ))}
                      </div>
                      <div className="project-technologies">
                        {project.technologies && project.technologies.slice(0, 5).map((tech, index) => (
                          <span key={index} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="project-footer">
                        <div className="project-updated">
                          <i className="fas fa-clock"></i>
                          Updated {formatDate(project.updated_at)}
                        </div>
                        <div className="project-stars">
                          <i className="fas fa-star"></i>
                          {project.stars || 0} stars
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="view-all">
                <a 
                  href={personalInfo.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <i className="fab fa-github"></i>
                  View All Repositories on GitHub
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      {/* GitHub Stats Section */}
      <section id="github-stats" className="github-stats-section section">
        <div className="container">
          <GitHubStats />
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="reviews-section section">
        <div className="container">
          <Reviews />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section section">
        <div className="container">
          <Contact personalInfo={personalInfo} />
        </div>
      </section>
    </div>
  );
};

export default Home;