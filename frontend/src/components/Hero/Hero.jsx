import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  const allSlides = [
    {
      id: 1,
      image: '/images/hero/15.jpg',
      title: 'ELEVATE YOUR STYLE',
      subtitle: 'Premium clothing for the modern individual',
      cta: 'Shop Collection',
      link: '/shop-collection'
    },
    {
      id: 2,
      image: '/images/hero/16.jpg',
      title: 'NEW ARRIVALS',
      subtitle: 'Discover our latest fashion collection',
      cta: 'View New Arrivals',
      link: '/new-arrivals'
    },
    {
      id: 3,
      image: '/images/hero/18.jpg',
      title: 'TRENDING NOW',
      subtitle: 'Stay ahead with our latest styles',
      cta: 'Shop Now',
      link: '/shop-collection'
    },
    {
      id: 4,
      image: '/images/hero/19.jpg',
      title: 'EXCLUSIVE COLLECTION',
      subtitle: 'Limited edition pieces you won\'t find anywhere else',
      cta: 'Explore',
      link: '/shop-collection'
    }
  ];

  // Create multiple copies for continuous scrolling
  const createContinuousSlides = (slides) => {
    return [...slides, ...slides, ...slides]; // Triple for seamless loop
  };

  // Determine slides based on screen size
  const slides = isMobile 
    ? createContinuousSlides(allSlides) // Apply continuous scroll to mobile too
    : createContinuousSlides(allSlides); // Desktop continuous scroll

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section className="hero">
      <div className={`hero-slides ${isMobile ? 'mobile' : 'desktop'}`}>
        <div className="hero-slides-container">
          {slides.map((slide, index) => (
            <div
              key={`${slide.id}-${index}`}
              className={`hero-slide ${isMobile ? 'mobile-slide' : 'desktop-slide'}`}
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-subtitle">{slide.subtitle}</p>
                <Link to={slide.link} className="hero-cta-link">
                  <button className="hero-cta">{slide.cta}</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;