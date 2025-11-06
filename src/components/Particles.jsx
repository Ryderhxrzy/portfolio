import React, { useEffect, useRef } from 'react';

const Particles = () => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Particle configuration
    const particleColor = 'rgba(108, 92, 231, 0.6)';
    const connectionColor = 'rgba(108, 92, 231, 0.2)';

    // Function to get device type and adjust settings
    const getDeviceSettings = () => {
      const isMobile = window.innerWidth <= 768;
      return {
        particleCount: isMobile ? 80 : 150,
        connectionDistance: isMobile ? 60 : 100,
        maxConnections: isMobile ? 3 : 8 // Limit connections on mobile
      };
    };

    class Particle {
      constructor(x, y) {
        this.x = x || Math.random() * canvas.width;
        this.y = y || Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * (window.innerWidth <= 768 ? 0.5 : 0.8);
        this.vy = (Math.random() - 0.5) * (window.innerWidth <= 768 ? 0.5 : 0.8);
        this.radius = Math.random() * 1.5 + 1;
        this.connections = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Keep particles within bounds
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
        
        // Reset connections count each frame
        this.connections = 0;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }

      canConnect() {
        const { maxConnections } = getDeviceSettings();
        return this.connections < maxConnections;
      }

      addConnection() {
        this.connections++;
      }
    }

    // Set canvas size and initialize particles
    const initializeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      const { particleCount } = getDeviceSettings();
      
      // Reinitialize particles centered on the canvas
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push(new Particle(x, y));
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const { connectionDistance } = getDeviceSettings();

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          // Check if both particles can still make more connections
          if (!particle.canConnect() || !otherParticle.canConnect()) {
            return;
          }

          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = 0.3 * (1 - distance / connectionDistance);
            ctx.beginPath();
            ctx.strokeStyle = connectionColor.replace('0.2', opacity.toFixed(2));
            ctx.lineWidth = 0.8;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
            
            // Count the connection for both particles
            particle.addConnection();
            otherParticle.addConnection();
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Initialize and start animation
    initializeCanvas();
    animate();

    // Handle window resize - reinitialize particles
    const handleResize = () => {
      initializeCanvas();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    />
  );
};

export default Particles;