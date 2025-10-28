import React, { useState } from 'react';
import './styles/Reviews.css';

const Reviews = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Confidential testimonials data
  const testimonials = [
    {
      id: 1,
      initials: "SJ",
      name: "S**** J*******",
      project: "E-commerce Platform",
      rating: 5,
      text: "Working with the developer was an absolute pleasure. He delivered our e-commerce platform ahead of schedule and exceeded our expectations. His attention to detail and technical expertise are remarkable.",
      category: "web"
    },
    {
      id: 2,
      initials: "MC",
      name: "M*** C***",
      project: "Data Visualization Dashboard",
      rating: 5,
      text: "The developer transformed our complex data into an intuitive and beautiful dashboard. His ability to understand our business needs and translate them into technical solutions is impressive.",
      category: "data"
    },
    {
      id: 3,
      initials: "ER",
      name: "E**** R********",
      project: "Portfolio Website",
      rating: 5,
      text: "Outstanding work! The developer created a stunning portfolio that perfectly represents our brand. The website is fast, responsive, and exactly what we envisioned.",
      category: "web"
    },
    {
      id: 4,
      initials: "DK",
      name: "D**** K**",
      project: "Mobile App Development",
      rating: 5,
      text: "The developer developed our mobile app from concept to deployment. His problem-solving skills and dedication to quality made the entire process smooth and successful.",
      category: "mobile"
    },
    {
      id: 5,
      initials: "LT",
      name: "L*** T*******",
      project: "Custom CRM System",
      rating: 5,
      text: "Professional, reliable, and highly skilled. The developer built a custom CRM that streamlined our operations. His communication throughout the project was excellent.",
      category: "web"
    },
    {
      id: 6,
      initials: "JW",
      name: "J**** W******",
      project: "API Integration",
      rating: 5,
      text: "The developer seamlessly integrated multiple third-party APIs into our system. His technical knowledge and clean code made future maintenance easy for our team.",
      category: "web"
    },
    {
      id: 7,
      initials: "AS",
      name: "A*** S****",
      project: "Student Management System",
      rating: 5,
      text: "Perfect solution for our academic needs. The system handles student data securely and efficiently. Highly recommended for educational institutions.",
      category: "web"
    },
    {
      id: 8,
      initials: "KR",
      name: "K*** R*****",
      project: "Learning Mobile App",
      rating: 5,
      text: "The educational app developed exceeded our expectations. Smooth performance and excellent user experience for students.",
      category: "mobile"
    },
    {
      id: 9,
      initials: "TP",
      name: "T*** P******",
      project: "Thesis Data Analysis",
      rating: 5,
      text: "Excellent help with data analysis for my research project. Professional and timely delivery of results.",
      category: "data"
    }
  ];

  const categories = [
    { key: 'all', label: 'All Projects', count: testimonials.length },
    { key: 'web', label: 'Web Development', count: testimonials.filter(t => t.category === 'web').length },
    { key: 'mobile', label: 'Mobile Apps', count: testimonials.filter(t => t.category === 'mobile').length },
    { key: 'data', label: 'Data Solutions', count: testimonials.filter(t => t.category === 'data').length },
    { key: 'other', label: 'Others', count: testimonials.filter(t => t.category === 'other').length }
  ];

  const filteredTestimonials = activeFilter === 'all' 
    ? testimonials 
    : testimonials.filter(testimonial => testimonial.category === activeFilter);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index} 
        className={`fas fa-star ${index < rating ? 'filled' : ''}`}
      ></i>
    ));
  };

  return (
    <div className="reviews-page">
      <div className="container">
        <div className="page-header">
          <h1>Client Testimonials</h1>
          <p>See what my clients say about working with me</p>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-number">{testimonials.length}+</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">5.0</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
        </div>

        {/* Confidential Notice */}
        <div className="confidential-notice">
          <i className="fas fa-shield-alt"></i>
          <span>Client identities are kept confidential to protect privacy</span>
        </div>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {categories.map(category => (
            <button
              key={category.key}
              className={`filter-btn ${activeFilter === category.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(category.key)}
            >
              {category.label}
              <span className="project-count">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {filteredTestimonials.map(testimonial => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="client-info">
                  <h4 className="client-name">{testimonial.name}</h4>
                  <p className="client-project">
                    <i className="fas fa-briefcase"></i>
                    {testimonial.project}
                  </p>
                </div>
              </div>
              
              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
                <span className="rating-text">{testimonial.rating}.0/5.0</span>
              </div>
              
              <p className="testimonial-text">"{testimonial.text}"</p>
              
              <div className="testimonial-category">
                <span className={`category-tag ${testimonial.category}`}>
                  {testimonial.category === 'web' && <i className="fas fa-globe"></i>}
                  {testimonial.category === 'mobile' && <i className="fas fa-mobile-alt"></i>}
                  {testimonial.category === 'data' && <i className="fas fa-chart-bar"></i>}
                  {testimonial.category === 'other' && <i className="fas fa-cogs"></i>}
                  {categories.find(c => c.key === testimonial.category)?.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="reviews-cta">
          <div className="cta-content">
            <h2>Ready to Start Your Project?</h2>
            <p>Join my satisfied clients and let's create something amazing together</p>
            <a href="#contact" className="btn btn-primary">
              <i className="fas fa-paper-plane"></i>
              Start Your Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;