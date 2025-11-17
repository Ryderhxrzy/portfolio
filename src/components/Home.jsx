import React, { useState, useEffect, useRef } from 'react';
import ScrollReveal from 'scrollreveal';
import './styles/Home.css';
import GithubStats from './GithubStats.jsx';
import Reviews from './Reviews.jsx';
import Contact from './Contact.jsx';
import { personalInfo, fetchGitHubRepositories, fetchCertificates } from '../data/projects.js';
import profileImage from '/profile_v2.png';
import useWindowSize from '../hooks/useWindowSize.js';
import Particles from './Particles.jsx';

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const projectsRef = useRef(null);
  const heroRef = useRef(null);
  const scrollRevealRef = useRef(null);
  
  const { width } = useWindowSize();
  const isMobile = width <= 480;

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        setIsHeroVisible(heroRect.bottom > 0 && heroRect.top < window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
      scrollRevealRef.current = null;
      return;
    }

    const srInstance = ScrollReveal({
      distance: '40px',
      duration: 700,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      reset: false,
      viewFactor: 0.2,
      mobile: true
    });

    scrollRevealRef.current = srInstance;

    return () => {
      if (scrollRevealRef.current) {
        scrollRevealRef.current.destroy();
        scrollRevealRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching GitHub repositories and certificates...');
        
        const [projects, certs] = await Promise.all([
          fetchGitHubRepositories(),
          fetchCertificates()
        ]);
        
        if (projects.length === 0) {
          throw new Error('No repositories found');
        }
        
        setFeaturedProjects(projects);
        setCertificates(certs);
        
        console.log('Loaded projects:', projects);
        console.log('Loaded certificates:', certs);
      } catch (err) {
        console.error('Error loading data:', err);
        
        const fallbackProjects = await fetchGitHubRepositories();
        const fallbackCerts = await fetchCertificates();
        setFeaturedProjects(fallbackProjects);
        setCertificates(fallbackCerts);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    setShowAll(false);
  }, [filter]);

  useEffect(() => {
    if (!showAll && projectsRef.current) {
      // Removed auto-scroll to hash
    }
  }, [showAll]);

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

  const filterCounts = {
    all: featuredProjects.length + certificates.length,
    web: featuredProjects.filter(project => project.topics.includes('web-development')).length,
    app: featuredProjects.filter(project => project.topics.includes('app-development')).length,
    desktop: featuredProjects.filter(project => project.topics.includes('desktop-application')).length,
    vector: featuredProjects.filter(project => project.topics.includes('vector-art')).length,
    certificate: certificates.length,
  };

  const getFilteredData = () => {
    if (filter === 'certificate') {
      return { type: 'certificate', data: certificates };
    }
    
    if (filter === 'all') {
      const combined = [
        ...featuredProjects.map(project => ({ ...project, itemType: 'project' })),
        ...certificates.map(cert => ({ ...cert, itemType: 'certificate' }))
      ];
      return { type: 'mixed', data: combined };
    }
    
    const filtered = featuredProjects.filter(project => {
      if (filter === 'web') return project.topics.includes('web-development');
      if (filter === 'app') return project.topics.includes('app-development');
      if (filter === 'desktop') return project.topics.includes('desktop-application');
      if (filter === 'vector') return project.topics.includes('vector-art');
      return false;
    });
    
    return { type: 'project', data: filtered };
  };

  const { type, data: filteredData } = getFilteredData();

  useEffect(() => {
    if (!scrollRevealRef.current || loading) return;

    const sr = scrollRevealRef.current;
    const revealConfigs = [
      { selector: '.sr-hero .reveal-item', options: { origin: 'bottom', interval: 120 } },
      { selector: '.sr-about .reveal-item', options: { origin: 'bottom', interval: 90 } },
      { selector: '.sr-projects .reveal-item:not(.project-card)', options: { origin: 'bottom', interval: 90 } },
      { selector: '.sr-projects .project-card', options: { origin: 'bottom', interval: 0, viewFactor: 0.45 } },
      { selector: '.sr-github .reveal-item', options: { origin: 'bottom', interval: 120 } },
      { selector: '.sr-reviews .reveal-item', options: { origin: 'bottom', interval: 120 } },
      { selector: '.sr-contact .reveal-item', options: { origin: 'bottom', interval: 120 } },
    ];

    const animationFrame = requestAnimationFrame(() => {
      revealConfigs.forEach(({ selector, options }) => {
        sr.clean(selector);
        sr.reveal(selector, {
          distance: '40px',
          duration: 700,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: 0,
          viewFactor: 0.2,
          mobile: true,
          cleanup: true,
          ...options,
        });
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [loading, filter, showAll, type, featuredProjects.length, certificates.length, isMobile]);

  const handleToggle = () => {
    const wasShowingAll = showAll;
    setShowAll(!showAll);

    if (wasShowingAll) {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleDescription = (itemId) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const truncateDescription = (description, itemId, maxLength = 80) => {
    if (!description) return '';
    const isExpanded = expandedDescriptions[itemId];
    
    if (description.length <= maxLength) {
      return description;
    }
    
    if (isExpanded) {
      return (
        <>
          {description}{' '}
          <button 
            className="see-more-btn"
            onClick={() => toggleDescription(itemId)}
          >
            See less
          </button>
        </>
      );
    }
    
    return (
      <>
        {description.substring(0, maxLength)}...{' '}
        <button 
          className="see-more-btn"
          onClick={() => toggleDescription(itemId)}
        >
          See more
        </button>
      </>
    );
  };

  const scrollToAbout = () => {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home">
      <section id="home" className="hero sr-section sr-hero" ref={heroRef}>
        <Particles />
        <div className="container">
          <div className="hero-content">
            <div className="hero-intro reveal-item">
              <p className="hero-greeting">Hello, I'm</p>
              <h1>
                <span className="highlight">{personalInfo.name}</span>
              </h1>
              <p className="hero-aka">Also known as <span className="aka-name">{personalInfo.aka}</span></p>
            </div>

            <div className="hero-professional reveal-item">
              <p className="hero-subtitle">{personalInfo.title}</p>
              <div className="hero-badges">
                <span className="badge">
                  <i className="fas fa-laptop-code"></i>
                  Freelance Developer
                </span>
                <span className="badge">
                  <i className="fas fa-rocket"></i>
                  Since 2023
                </span>
                <span className="badge">
                  <i className="fas fa-graduation-cap"></i>
                  IT Student
                </span>
              </div>
            </div>

            <div className="hero-description reveal-item">
             <p>
                I’m an <strong>Information Technology student</strong> passionate about creating 
                <strong> modern, responsive, and user-friendly web applications</strong>. 
                I focus on building projects that are functional, clean, and visually engaging. 
                I’m currently seeking an opportunity to apply my skills and gain hands-on experience through an 
                <strong> On-the-Job Training program</strong>.
              </p>
            </div>

            <div className="hero-stats reveal-item">
              <div className="stats">
                <div className="stat-number">2+</div>
                <div className="stat-label">Years Experience</div>
              </div>
              <div className="stats">
                <div className="stat-number">10+</div>
                <div className="stat-label">Projects Completed</div>
              </div>
              <div className="stats">
                <div className="stat-number">100%</div>
                <div className="stat-label">Client Satisfaction</div>
              </div>
            </div>
          </div>
          <div className="hero-image reveal-item">
            <div className="profile-container">
              <div className="profile-image">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="profile-photo"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div className="hero-actions">
              <div className="hero-buttons reveal-item">
                <button 
                  className="btn btn-primary"
                  onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fas fa-sparkles"></i>
                  View My Work
                  <i className="fas fa-arrow-down"></i>
                </button>
                
                <button 
                  className="btn btn-outline"
                  onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
                >
                  <i className="fas fa-download"></i>
                  Download Resume
                </button>
              </div>

              <div className="hero-social reveal-item">
                <p className="social-label">Follow my journey</p>
                <div className="social-links">
                  <a href={personalInfo.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                    <i className="fab fa-github"></i>
                    <span>GitHub</span>
                  </a>
                  <a href={personalInfo.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                    <i className="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                  </a>
                  <a href={personalInfo.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="social-link" aria-label="Facebook">
                    <i className="fab fa-facebook"></i>
                    <span>Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          {isHeroVisible && (
            <div className="mouse-indicator" onClick={scrollToAbout}>
              <div className="mouse">
                <div className="wheel"></div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="about" className="about section sr-section sr-about">
        
        <div className="container">
          <h2 className="section-title reveal-item">About Me</h2>
          <div className="about-content">
            <div className="about-text reveal-item">
              <p>{personalInfo.about}</p>
              <div className="education-info">
                <div className="education-item reveal-item">
                  <i className="fas fa-graduation-cap"></i>
                  <div>
                    <h4>4th Year Information Technology Student</h4>
                    <p>Currently pursuing Bachelor's degree in Information Technology</p>
                  </div>
                </div>
                <div className="education-item reveal-item">
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
            <div className="skills reveal-item">
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

      <section id="projects" className="projects-section sr-section sr-projects" ref={projectsRef}>
        <div className="container">
          {loading ? (
            <div className="loading-projects reveal-item">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading projects and certificates...</p>
            </div>
          ) : (
            <React.Fragment>
              <div className="page-header reveal-item">
                <h2>My Projects & Certificates</h2>
                <p>
                  {filter === 'all' 
                    ? `Featured: ${filterCounts.all} projects and certificates`
                    : 'Featured repositories from my GitHub profile and professional certifications'
                  }
                </p>
              </div>

              <div className="filters reveal-item">
                <button 
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
                  onClick={() => setFilter('all')}
                >
                  All <span className="project-count">({filterCounts.all})</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'web' ? 'active' : ''}`} 
                  onClick={() => setFilter('web')}
                >
                  Web Development <span className="project-count">({filterCounts.web})</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'app' ? 'active' : ''}`} 
                  onClick={() => setFilter('app')}
                >
                  App Development <span className="project-count">({filterCounts.app})</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'desktop' ? 'active' : ''}`} 
                  onClick={() => setFilter('desktop')}
                >
                  Desktop Application <span className="project-count">({filterCounts.desktop})</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'vector' ? 'active' : ''}`} 
                  onClick={() => setFilter('vector')}
                >
                  Vector Art <span className="project-count">({filterCounts.vector})</span>
                </button>
                <button 
                  className={`filter-btn ${filter === 'certificate' ? 'active' : ''}`} 
                  onClick={() => setFilter('certificate')}
                >
                  Certificates <span className="project-count">({filterCounts.certificate})</span>
                </button>
              </div>

              {filteredData.length === 0 ? (
                <div className="no-results reveal-item">
                  <i className="fas fa-folder-open"></i>
                  <h3>No {type === 'certificate' ? 'certificates' : 'projects'} found</h3>
                  <p>Try selecting a different filter</p>
                </div>
              ) : (
                <React.Fragment>
                  <div className="projects-grid">
                    {filteredData.slice(0, showAll ? filteredData.length : (isMobile ? 1 : 3)).map(item => (
                      type === 'mixed' ? (
                        item.itemType === 'certificate' ? (
                          <div key={item.id} className="project-card reveal-item">
                            <div className="project-image">
                              <img 
                                src={item.image}
                                alt={item.title}
                                loading="eager"
                              />
                              <div className="project-overlay">
                                <div className="project-links">
                                  <a href={item.certificateUrl} target="_blank" rel="noopener noreferrer" title="View Certificate">
                                    <i className="fas fa-certificate"></i>
                                  </a>
                                </div>
                              </div>
                              <div className="certificate-badge">
                                <i className="fas fa-award"></i>
                                Certificate
                              </div>
                            </div>
                            <div className="project-content">
                              <h3>{item.title}</h3>
                              <p className="project-description">
                                {truncateDescription(item.description, item.id)}
                              </p>
                              
                              <div className="project-topics">
                                {item.tags.map((tag, index) => (
                                  <span key={index} className="topic-tag certificate-tag">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="certificate-action">
                                <a 
                                  href={item.certificateUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn-view-certificate"
                                >
                                  <i className="fas fa-external-link-alt"></i>
                                  View Certificate
                                </a>
                              </div>
                              
                              <div className="certificate-footer">
                                <div className="certificate-date">
                                  <i className="fas fa-calendar"></i>
                                  Held on {formatDate(item.date)}
                                </div>
                                <div className="certificate-issuer">
                                  <i className="fas fa-building"></i>
                                  Issuer is {item.issuer}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={item.id} className="project-card reveal-item">
                            <div className="project-image">
                              <img 
                                src={item.image}
                                alt={item.title}
                                loading="eager"
                              />
                              <div className="project-overlay">
                                <div className="project-links">
                                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" title="View Code">
                                    <i className="fab fa-github"></i>
                                  </a>
                                  {isValidDeployment(item.liveUrl) && (
                                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo">
                                      <i className="fas fa-external-link-alt"></i>
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div className="project-stats">
                                <span className="stat">
                                  <i className="fas fa-star"></i>
                                  {item.stars || 0}
                                </span>
                                <span className="stat">
                                  <i className="fas fa-code-branch"></i>
                                  {item.forks || 0}
                                </span>
                                {item.language && (
                                  <span className="stat language">
                                    <i className="fas fa-circle" style={{ color: getLanguageColor(item.language) }}></i>
                                    {item.language}
                                  </span>
                                )}
                              </div>
                              {item.isPinned && (
                                <div className="project-pinned-badge">
                                  <i className="fas fa-thumbtack"></i>
                                  Pinned
                                </div>
                              )}
                            </div>
                            <div className="project-content">
                              <h3>{item.title}</h3>
                              <p className="project-description">
                                {truncateDescription(item.description, item.id)}
                              </p>
                              
                              {item.languages && item.languages.length > 0 && (
                                <div className="project-languages">
                                  <strong>Languages: </strong>
                                  <div className="languages-list">
                                    {item.languages.map((lang, index) => (
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
                              
                              {(isValidDeployment(item.liveUrl) || item.githubUrl) && (
                                <div className="project-actions">
                                  <div className="project-buttons-row">
                                    {isValidDeployment(item.liveUrl) && (
                                      <a 
                                        href={item.liveUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="deployment-link"
                                      >
                                        <i className="fas fa-rocket"></i>
                                        Live Project
                                      </a>
                                    )}
                                    
                                    {item.githubUrl && (
                                      <a 
                                        href={`${item.githubUrl}/blob/main/Sample_Output.pdf`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="sample-output-link"
                                      >
                                        <i className="fas fa-file-pdf"></i>
                                        Sample Output
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              <div className="project-topics">
                                {item.topics && item.topics.slice(0, 8).map((topic, index) => (
                                  <span key={index} className="topic-tag">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                              <div className="project-technologies">
                                {item.technologies && item.technologies.slice(0, 5).map((tech, index) => (
                                  <span key={index} className="tech-tag">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                              <div className="project-footer">
                                <div className="project-updated">
                                  <i className="fas fa-clock"></i>
                                  Updated {formatDate(item.updated_at)}
                                </div>
                                <div className="project-stars">
                                  <i className="fas fa-star"></i>
                                  {item.stars || 0} stars
                                </div>
                              </div>
                              
                              {item.githubUrl && (
                                <p className="project-note">
                                  <i className="fas fa-info-circle"></i>
                                  If the live site is unavailable or slow to load, view the Sample Output for project screenshots.
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      ) : (
                        type === 'certificate' ? (
                          <div key={item.id} className="project-card certificate-card reveal-item">
                            <div className="project-image certificate-image">
                              <img 
                                src={item.image}
                                alt={item.title}
                                loading="eager"
                              />
                              <div className="project-overlay">
                                <div className="project-links">
                                  <a href={item.certificateUrl} target="_blank" rel="noopener noreferrer" title="View Certificate">
                                    <i className="fas fa-certificate"></i>
                                  </a>
                                </div>
                              </div>
                              <div className="certificate-badge">
                                <i className="fas fa-award"></i>
                                Certificate
                              </div>
                            </div>
                            <div className="project-content">
                              <h3>{item.title}</h3>
                              <p className="project-description">
                                {truncateDescription(item.description, item.id)}
                              </p>
                              
                              <div className="certificate-action">
                                <div className="project-buttons-row">
                                  <a 
                                    href={item.certificateUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="btn-view-certificate"
                                  >
                                    <i className="fas fa-external-link-alt"></i>
                                    View Certificate
                                  </a>
                                </div>
                              </div>
                              
                              <div className="project-topics">
                                {item.tags.map((tag, index) => (
                                  <span key={index} className="topic-tag certificate-tag">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="certificate-footer">
                                <div className="certificate-date">
                                  <i className="fas fa-calendar"></i>
                                  Held on {formatDate(item.date)}
                                </div>
                                <div className="certificate-issuer">
                                  <i className="fas fa-building"></i>
                                  Issuer is {item.issuer}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div key={item.id} className="project-card reveal-item">
                            <div className="project-image">
                              <img 
                                src={item.image}
                                alt={item.title}
                                loading="eager"
                              />
                              <div className="project-overlay">
                                <div className="project-links">
                                  <a href={item.githubUrl} target="_blank" rel="noopener noreferrer" title="View Code">
                                    <i className="fab fa-github"></i>
                                  </a>
                                  {isValidDeployment(item.liveUrl) && (
                                    <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" title="Live Demo">
                                      <i className="fas fa-external-link-alt"></i>
                                    </a>
                                  )}
                                </div>
                              </div>
                              <div className="project-stats">
                                <span className="stat">
                                  <i className="fas fa-star"></i>
                                  {item.stars || 0}
                                </span>
                                <span className="stat">
                                  <i className="fas fa-code-branch"></i>
                                  {item.forks || 0}
                                </span>
                                {item.language && (
                                  <span className="stat language">
                                    <i className="fas fa-circle" style={{ color: getLanguageColor(item.language) }}></i>
                                    {item.language}
                                  </span>
                                )}
                              </div>
                              {item.isPinned && (
                                <div className="project-pinned-badge">
                                  <i className="fas fa-thumbtack"></i>
                                  Pinned
                                </div>
                              )}
                            </div>
                            <div className="project-content">
                              <h3>{item.title}</h3>
                              <p className="project-description">
                                {truncateDescription(item.description, item.id)}
                              </p>
                              
                              {item.languages && item.languages.length > 0 && (
                                <div className="project-languages">
                                  <strong>Languages: </strong>
                                  <div className="languages-list">
                                    {item.languages.map((lang, index) => (
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
                              
                              {(isValidDeployment(item.liveUrl) || item.githubUrl) && (
                                <div className="project-actions">
                                  <div className="project-buttons-row">
                                    {isValidDeployment(item.liveUrl) && (
                                      <a 
                                        href={item.liveUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="deployment-link"
                                      >
                                        <i className="fas fa-rocket"></i>
                                        Live Project
                                      </a>
                                    )}
                                    
                                    {item.githubUrl && (
                                      <a 
                                        href={`${item.githubUrl}/blob/main/Sample_Output.pdf`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="sample-output-link"
                                      >
                                        <i className="fas fa-file-pdf"></i>
                                        Sample Output
                                      </a>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              <div className="project-topics">
                                {item.topics && item.topics.slice(0, 8).map((topic, index) => (
                                  <span key={index} className="topic-tag">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                              <div className="project-technologies">
                                {item.technologies && item.technologies.slice(0, 5).map((tech, index) => (
                                  <span key={index} className="tech-tag">
                                    {tech}
                                  </span>
                                ))}
                              </div>
                              <div className="project-footer">
                                <div className="project-updated">
                                  <i className="fas fa-clock"></i>
                                  Updated {formatDate(item.updated_at)}
                                </div>
                                <div className="project-stars">
                                  <i className="fas fa-star"></i>
                                  {item.stars || 0} stars
                                </div>
                              </div>
                              
                              {item.githubUrl && (
                                <p className="project-note">
                                  <i className="fas fa-info-circle"></i>
                                  If the live site is unavailable or slow to load, view the Sample Output for project screenshots.
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      )
                    ))}
                  </div>
                  {filteredData.length > (isMobile ? 1 : 3) && (
                    <div className="show-more-container reveal-item">
                      <button 
                        className="btn btn-show-more"
                        onClick={handleToggle}
                        aria-label={showAll ? 'Show Less' : 'Show More'}
                      >
                        <i className={`fas ${showAll ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
                        <span className="tooltip-text">{showAll ? 'Show Less' : 'Show More'}</span>
                      </button>
                    </div>
                  )}
                </React.Fragment>
              )}
              <div className="view-all reveal-item">
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
            </React.Fragment>
          )}
        </div>
      </section>

      <section id="github-stats" className="github-stats-section section sr-section sr-github">
        <div className="container">
          <div className="github-stats-wrapper reveal-item">
            <GithubStats />
          </div>
        </div>
      </section>

      <section id="reviews" className="reviews-section section sr-section sr-reviews">
        <div className="container">
          <div className="reviews-wrapper reveal-item">
            <Reviews />
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section section sr-section sr-contact">
        <div className="container">
          <div className="contact-wrapper reveal-item">
            <Contact personalInfo={personalInfo} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;