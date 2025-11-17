// src/components/Projects.js
import React, { useState } from 'react';
import './styles/Projects.css';

const Projects = ({ projects }) => {
  const [filter, setFilter] = useState('all');
  const [visibleProjects, setVisibleProjects] = useState(6);

  const categories = ['all', ...new Set(projects.map(project => project.category))];

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.category === filter);

  const projectsToShow = filteredProjects.slice(0, visibleProjects);

  const loadMore = () => {
    setVisibleProjects(prev => prev + 6);
  };

  return (
    <div className="projects-page">
      <div className="container">
        <div className="page-header">
          <h1>My Projects</h1>
          <p>A collection of my recent work and side projects</p>
        </div>
        
        {/* Filter Buttons */}
        <div className="filter-buttons">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => {
                setFilter(category);
                setVisibleProjects(6);
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              <span className="project-count">
                ({category === 'all' ? projects.length : projects.filter(p => p.category === category).length})
              </span>
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-grid">
          {projectsToShow.map(project => (
            <div key={project.id} className="project-card fade-in-up">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
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

        {/* Load More Button */}
        {visibleProjects < filteredProjects.length && (
          <div className="load-more">
            <button className="btn btn-secondary" onClick={loadMore}>
              Load More Projects
            </button>
          </div>
        )}

        {/* No Projects Message */}
        {filteredProjects.length === 0 && (
          <div className="no-projects">
            <i className="fas fa-inbox"></i>
            <h3>No projects found</h3>
            <p>No projects match the selected category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;