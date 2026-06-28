import React, { useState, useEffect, useCallback } from 'react';

const DEFAULT_GRADIENT = 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.8) 100%)';
const FALLBACK_IMAGE = "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1600&q=80')";

const HeroCarousel = ({ images = [], interval = 5000, children }) => {
  const slides = images.length > 0 ? images : [FALLBACK_IMAGE];
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState('next');

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    setDir('next');
    setCurrent(prev => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setDir('prev');
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setDir('next');
      setCurrent(prev => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, slides.length]);

  return (
    <section className="relative text-white py-20 md:py-32 px-6 rounded-b-[30px] md:rounded-b-[40px] mb-12 shadow-lg overflow-hidden select-none">
      {slides.map((img, idx) => (
        <div
          key={idx}
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `${DEFAULT_GRADIENT}, url('${img}')`,
            opacity: idx === current ? 1 : 0,
            zIndex: idx === current ? 1 : 0,
            transform: idx === current ? 'scale(1)' : 'scale(1.05)',
          }}
        />
      ))}
      <div className="relative z-10">
        {children}
      </div>
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-950/30 hover:bg-slate-950/50 backdrop-blur-sm flex items-center justify-center text-xl md:text-2xl font-bold cursor-pointer transition-all duration-200 outline-none border border-white/10"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-950/30 hover:bg-slate-950/50 backdrop-blur-sm flex items-center justify-center text-xl md:text-2xl font-bold cursor-pointer transition-all duration-200 outline-none border border-white/10"
            aria-label="Next slide"
          >
            ›
          </button>
          <div className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer outline-none ${
                  idx === current
                    ? 'bg-accent w-6'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroCarousel;
