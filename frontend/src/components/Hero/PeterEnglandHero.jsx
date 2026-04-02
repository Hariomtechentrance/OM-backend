import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const slides = [
  {
    id: 1,
    title: "The Wedding Edition",
    subtitle: "NEW ARRIVALS",
    description: "Discover our exclusive range of premium wedding wear designed for the modern gentleman",
    image: "https://images.unsplash.com/photo-1594932224828-b4b05a832fe3?w=1600&q=80",
    ctaText: "SHOP NOW",
    ctaLink: "/products?collection=wedding"
  },
  {
    id: 2,
    title: "Business Essentials",
    subtitle: "OFFICE WEAR",
    description: "Elevate your professional wardrobe with our tailored office collection",
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=1600&q=80",
    ctaText: "EXPLORE COLLECTION",
    ctaLink: "/products?collection=office"
  },
  {
    id: 3,
    title: "The Weekend Vibe",
    subtitle: "CASUAL WEAR",
    description: "Premium casual shirts and chinos for your relaxed weekend looks",
    image: "https://images.unsplash.com/photo-1516257984877-a03a01ae1b89?w=1600&q=80",
    ctaText: "DISCOVER MORE",
    ctaLink: "/products?collection=casual"
  },
  {
    id: 4,
    title: "Junior Style",
    subtitle: "KIDS COLLECTION",
    description: "Comfortable and stylish outfits for young trendsetters",
    image: "https://images.unsplash.com/photo-1519457431-7571f018272b?w=1600&q=80",
    ctaText: "SHOP KIDS",
    ctaLink: "/products?category=Kids"
  },
  {
    id: 5,
    title: "Summer Breeze",
    subtitle: "LIMITED EDITION",
    description: "Stay cool and stylish with our breathable linen collection",
    image: "https://images.unsplash.com/photo-1523381235200-62947558d447?w=1600&q=80",
    ctaText: "SHOP SUMMER",
    ctaLink: "/products?collection=summer"
  }
];

const PeterEnglandHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[400px] lg:h-[700px] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent" />
          
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-8 lg:px-16">
              <div className="max-w-xl text-white">
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="block text-sm lg:text-base font-bold tracking-[0.3em] uppercase mb-4 text-[#C19A6B]"
                >
                  {slides[current].subtitle}
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-4xl lg:text-7xl font-bold mb-6 leading-[1.1]"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {slides[current].title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="text-lg lg:text-xl mb-10 text-gray-100/90 max-w-lg font-light leading-relaxed"
                >
                  {slides[current].description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Link 
                    to={slides[current].ctaLink}
                    className="inline-block px-10 py-4 bg-black text-white text-sm font-bold tracking-widest uppercase hover:bg-[#C19A6B] transition-all duration-300"
                  >
                    {slides[current].ctaText}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button 
        onClick={prev}
        className="absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black"
      >
        <FaChevronLeft />
      </button>
      <button 
        onClick={next}
        className="absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-black"
      >
        <FaChevronRight />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 transition-all duration-300 ${current === i ? 'w-10 bg-[#C19A6B]' : 'w-4 bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PeterEnglandHero;
