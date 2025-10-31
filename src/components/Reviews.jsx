import React, { useState, useEffect } from 'react';
import './styles/Reviews.css';

const Reviews = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // ✅ Vite environment variables
  const API_BASE_URL = import.meta.env.VITE_APP_API_BASE || 'http://localhost:4000';
  const ENVIRONMENT = import.meta.env.MODE || 'development';

  // Fetch testimonials from API with retry logic
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🌐 Environment:', ENVIRONMENT);
        console.log('🔗 Fetching from:', `${API_BASE_URL}/api/reviews`);
        
        // ✅ Add timeout to fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const response = await fetch(`${API_BASE_URL}/api/reviews`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from API');
        }
        
        setTestimonials(data);
        setLoading(false);
        setRetryCount(0); // Reset retry count on success
        
      } catch (err) {
        console.error('❌ Error fetching testimonials:', err);
        
        let errorMessage = 'Failed to load testimonials';
        
        if (err.name === 'AbortError') {
          errorMessage = 'Request timeout - The server is taking too long to respond. It might be waking up (Render free tier). Please wait 30 seconds and try again.';
        } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          errorMessage = 'Cannot connect to server. Please check if the backend is running at: ' + API_BASE_URL;
        } else {
          errorMessage = err.message;
        }
        
        setError(errorMessage);
        setLoading(false);
        
        // ✅ Auto-retry up to 3 times for Render wake-up
        if (retryCount < 3 && (err.name === 'AbortError' || err.message.includes('Failed to fetch'))) {
          console.log(`🔄 Auto-retrying... (${retryCount + 1}/3)`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 5000); // Wait 5 seconds before retry
        }
      }
    };

    fetchTestimonials();
  }, [API_BASE_URL, ENVIRONMENT, retryCount]);

  // Map category names to keys
  const getCategoryKey = (category) => {
    const mapping = {
      'Web Development': 'web',
      'Mobile Development': 'mobile',
      'Desktop Application': 'desktop'
    };
    return mapping[category] || 'other';
  };

  // Transform testimonials with category keys
  const transformedTestimonials = testimonials.map(item => ({
    id: item._id,
    initials: item.full_name.split(' ').map(n => n[0]).join(''),
    name: item.full_name.split(' ').map(n => n[0] + '*'.repeat(n.length - 1)).join(' '),
    project: item.task,
    rating: parseInt(item.star),
    text: item.comment,
    category: getCategoryKey(item.categories)
  }));

  const categories = [
    { key: 'all', label: 'All Projects', count: transformedTestimonials.length },
    { key: 'web', label: 'Web Development', count: transformedTestimonials.filter(t => t.category === 'web').length },
    { key: 'mobile', label: 'Mobile Development', count: transformedTestimonials.filter(t => t.category === 'mobile').length },
    { key: 'desktop', label: 'Desktop Application', count: transformedTestimonials.filter(t => t.category === 'desktop').length }
  ];

  const filteredTestimonials = activeFilter === 'all' 
    ? transformedTestimonials 
    : transformedTestimonials.filter(testimonial => testimonial.category === activeFilter);

  // Carousel configuration - 3 cards per slide
  const slidesPerView = 3;
  const totalSlides = Math.ceil(filteredTestimonials.length / slidesPerView);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || filteredTestimonials.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide, totalSlides, filteredTestimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentSlide(0);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index} 
        className={`fas fa-star ${index < rating ? 'filled' : ''}`}
      ></i>
    ));
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="reviews-page">
        <div className="container">
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading testimonials...</p>
            {retryCount > 0 && (
              <p className="retry-info">Retry attempt {retryCount}/3 - Server might be waking up...</p>
            )}
            <p className="api-url">From: {API_BASE_URL}</p>
            <p className="environment">Environment: {ENVIRONMENT}</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="reviews-page">
        <div className="container">
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <h3>Unable to Load Testimonials</h3>
            <p className="error-message">{error}</p>
            <div className="error-details">
              <p className="api-url"><strong>API URL:</strong> {API_BASE_URL}/api/reviews</p>
              <p className="environment"><strong>Environment:</strong> {ENVIRONMENT}</p>
              {retryCount > 0 && (
                <p className="retry-count">Retry attempts: {retryCount}</p>
              )}
            </div>
            <div className="error-actions">
              <button 
                onClick={handleRetry} 
                className="btn btn-primary"
              >
                <i className="fas fa-redo"></i>
                Try Again
              </button>
              <a 
                href={`${API_BASE_URL}/api/health`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <i className="fas fa-heartbeat"></i>
                Check Server Status
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (transformedTestimonials.length === 0) {
    return (
      <div className="reviews-page">
        <div className="container">
          <div className="empty-state">
            <i className="fas fa-comment-slash"></i>
            <p>No testimonials available yet.</p>
            <p className="api-url">API URL: {API_BASE_URL}</p>
          </div>
        </div>
      </div>
    );
  }

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
            <div className="stat-number">{transformedTestimonials.length}+</div>
            <div className="stat-label">Happy Clients</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">100%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">
              {transformedTestimonials.length > 0 
                ? (transformedTestimonials.reduce((sum, t) => sum + t.rating, 0) / transformedTestimonials.length).toFixed(1)
                : '5.0'}
            </div>
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
              onClick={() => handleFilterChange(category.key)}
            >
              {category.label}
              <span className="project-count">({category.count})</span>
            </button>
          ))}
        </div>

        {/* Carousel Section */}
        {filteredTestimonials.length > 0 && (
          <div className="carousel-container">
            <div className="carousel-wrapper">
              {/* Previous Button */}
              <button 
                className="carousel-btn carousel-btn-prev"
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                <i className="fas fa-chevron-left"></i>
              </button>

              {/* Carousel Content */}
              <div className="carousel-content">
                <div 
                  className="carousel-track"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                    const slideTestimonials = filteredTestimonials.slice(
                      slideIndex * slidesPerView,
                      slideIndex * slidesPerView + slidesPerView
                    );
                    
                    return (
                      <div key={slideIndex} className="carousel-slide">
                        {slideTestimonials.map((testimonial) => (
                          <div key={testimonial.id} className="testimonial-card">
                            <div className="testimonial-header">
                              <div className="client-avatar">
                                {testimonial.initials}
                              </div>
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
                                {testimonial.category === 'desktop' && <i className="fas fa-desktop"></i>}
                                {testimonial.category === 'other' && <i className="fas fa-cogs"></i>}
                                {categories.find(c => c.key === testimonial.category)?.label}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Button */}
              <button 
                className="carousel-btn carousel-btn-next"
                onClick={nextSlide}
                aria-label="Next slide"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>

            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Slide Counter */}
            <div className="slide-counter">
              <span className="current-slide">{currentSlide + 1}</span>
              <span className="divider">/</span>
              <span className="total-slides">{totalSlides}</span>
            </div>
          </div>
        )}

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