import React, { useState } from 'react';
import './styles/Reviews.css';

const Reviews = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Sample testimonials data - replace with your actual client testimonials
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      company: "TechStart Inc.",
      project: "E-commerce Platform",
      rating: 5,
      text: "Working with Alex was an absolute pleasure. He delivered our e-commerce platform ahead of schedule and exceeded our expectations. His attention to detail and technical expertise are remarkable.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      category: "web"
    },
    {
      id: 2,
      name: "Mike Chen",
      company: "DataFlow Analytics",
      project: "Data Visualization Dashboard",
      rating: 5,
      text: "Alex transformed our complex data into an intuitive and beautiful dashboard. His ability to understand our business needs and translate them into technical solutions is impressive.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      category: "data"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      company: "CreativeMinds Agency",
      project: "Portfolio Website",
      rating: 5,
      text: "Outstanding work! Alex created a stunning portfolio that perfectly represents our brand. The website is fast, responsive, and exactly what we envisioned.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      category: "web"
    },
    {
      id: 4,
      name: "David Kim",
      company: "StartUp Ventures",
      project: "Mobile App Development",
      rating: 5,
      text: "Alex developed our mobile app from concept to deployment. His problem-solving skills and dedication to quality made the entire process smooth and successful.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      category: "mobile"
    },
    {
      id: 5,
      name: "Lisa Thompson",
      company: "Global Solutions Ltd.",
      project: "Custom CRM System",
      rating: 5,
      text: "Professional, reliable, and highly skilled. Alex built a custom CRM that streamlined our operations. His communication throughout the project was excellent.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
      category: "web"
    },
    {
      id: 6,
      name: "James Wilson",
      company: "InnovateTech",
      project: "API Integration",
      rating: 5,
      text: "Alex seamlessly integrated multiple third-party APIs into our system. His technical knowledge and clean code made future maintenance easy for our team.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      category: "web"
    }
  ];

  const categories = [
    { key: 'all', label: 'All Projects', count: testimonials.length },
    { key: 'web', label: 'Web Development', count: testimonials.filter(t => t.category === 'web').length },
    { key: 'mobile', label: 'Mobile Apps', count: testimonials.filter(t => t.category === 'mobile').length },
    { key: 'data', label: 'Data Solutions', count: testimonials.filter(t => t.category === 'data').length }
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
            <div className="stat-number">{testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length}</div>
            <div className="stat-label">Average Rating</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support</div>
          </div>
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
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="client-avatar"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150/2563eb/ffffff?text=Client';
                  }}
                />
                <div className="client-info">
                  <h4 className="client-name">{testimonial.name}</h4>
                  <p className="client-company">{testimonial.company}</p>
                  <p className="client-project">{testimonial.project}</p>
                </div>
              </div>
              
              <div className="testimonial-rating">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="testimonial-text">"{testimonial.text}"</p>
              
              <div className="testimonial-category">
                <span className={`category-tag ${testimonial.category}`}>
                  {testimonial.category === 'web' && <i className="fas fa-globe"></i>}
                  {testimonial.category === 'mobile' && <i className="fas fa-mobile-alt"></i>}
                  {testimonial.category === 'data' && <i className="fas fa-chart-bar"></i>}
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
            <a href="/contact" className="btn btn-primary">
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