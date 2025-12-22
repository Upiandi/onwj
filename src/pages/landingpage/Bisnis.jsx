import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// ============================================
// ASSETS
// ============================================
import bisnisBackground from '../../assets/contoh1.png';
import monitoringBackground from '../../assets/contoh2.png';
import lokasiBackground from '../../assets/contoh3.png';
import tjslBackground from '../../assets/contoh4.png';

import bisnisCard from '../../assets/contoh4.png';
import monitoringCard from '../../assets/contoh3.png';
import lokasiCard from '../../assets/contoh2.png';
import tjslCard from '../../assets/contoh1.png';

// ============================================
// CLEAN COLOR SYSTEM
// ============================================
const COLOR_SYSTEM = {
  overlay: {
    dark: 'from-slate-950/80 via-slate-900/85 to-slate-950/90',
  },
  accent: {
    primary: 'from-primary-600 to-primary-500',
  },
  glow: 'rgba(43, 115, 180, 0.3)',
  text: {
    primary: 'rgba(255, 255, 255, 0.98)',
    secondary: 'rgba(255, 255, 255, 0.85)',
  }
};

// ============================================
// CONSTANTS
// ============================================
const SLIDES_DATA = [
  {
    id: 'eksplorasi',
    backgroundImage: bisnisBackground,
    cardImage: bisnisCard,
    title: 'Eksplorasi & Produksi',
    description: 'Dari hulu ke hilir — menggali potensi energi dan menghadirkan nilai berkelanjutan untuk daerah.',
    link: '/eksplorasi-produksi',
  },
  {
    id: 'tjsl',
    backgroundImage: monitoringBackground,
    cardImage: monitoringCard,
    title: 'Program TJSL',
    description: 'Komitmen kami terhadap tanggung jawab sosial dan lingkungan demi masyarakat yang lebih mandiri.',
    link: '/tjsl',
  },
  {
    id: 'wilayah',
    backgroundImage: lokasiBackground,
    cardImage: lokasiCard,
    title: 'Wilayah Kerja',
    description: 'Area operasi kami di berbagai titik strategis yang mendukung ketahanan energi nasional.',
    link: '/wilayah-kerja',
  },
  {
    id: 'umkm',
    backgroundImage: tjslBackground,
    cardImage: tjslCard,
    title: 'UMKM Binaan',
    description: 'Profil dan perjalanan para pelaku usaha yang tumbuh bersama program pemberdayaan kami.',
    link: '/umkm-binaan',
  },
];

const ANIMATION_CONFIG = {
  AUTO_PLAY_DELAY: 7000,
  RESUME_AUTO_PLAY_DELAY: 12000,
  BACKGROUND_DURATION: 1200,
  CARD_DURATION: 1200,
  CONTENT_DURATION: 800,
  STAGGER_DELAY: 150,
};

// ============================================
// CUSTOM HOOKS
// ============================================
const useCarousel = (slidesCount) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const goToSlide = useCallback((index) => {
    if (isTransitioning || index === activeIndex) return;
    
    setIsTransitioning(true);
    setDirection(index > activeIndex ? 'next' : 'prev');
    setActiveIndex(index);
    setIsAutoPlay(false);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, ANIMATION_CONFIG.CARD_DURATION);
  }, [activeIndex, isTransitioning]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection('next');
    setActiveIndex((prev) => (prev === slidesCount - 1 ?  0 : prev + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, ANIMATION_CONFIG.CARD_DURATION);
  }, [isTransitioning, slidesCount]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setDirection('prev');
    setActiveIndex((prev) => (prev === 0 ? slidesCount - 1 : prev - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, ANIMATION_CONFIG.CARD_DURATION);
  }, [isTransitioning, slidesCount]);

  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlay(false);
  }, []);

  useEffect(() => {
    if (! isAutoPlay) {
      const timer = setTimeout(() => {
        setIsAutoPlay(true);
      }, ANIMATION_CONFIG.RESUME_AUTO_PLAY_DELAY);
      return () => clearTimeout(timer);
    }

    resetTimeout();
    timeoutRef.current = setTimeout(nextSlide, ANIMATION_CONFIG.AUTO_PLAY_DELAY);
    
    return () => resetTimeout();
  }, [activeIndex, isAutoPlay, nextSlide, resetTimeout]);

  return {
    activeIndex,
    direction,
    isTransitioning,
    goToSlide,
    nextSlide,
    prevSlide,
    pauseAutoPlay,
  };
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const getCardPosition = (cardIndex, activeIndex, totalCards, direction) => {
  const diff = cardIndex - activeIndex;
  
  // Normalize position (handle circular array)
  let normalizedDiff = diff;
  
  if (diff > totalCards / 2) {
    normalizedDiff = diff - totalCards;
  } else if (diff < -totalCards / 2) {
    normalizedDiff = diff + totalCards;
  }
  
  return normalizedDiff;
};

const getCardStyle = (position, direction) => {
  const isMovingNext = direction === 'next';
  
  // Center card (active)
  if (position === 0) {
    return {
      transform: 'translateX(0%) translateZ(0px) scale(1) rotateY(0deg)',
      opacity: 1,
      zIndex: 30,
      filter: 'brightness(1.05) contrast(1.05) blur(0px)',
      pointerEvents: 'auto',
    };
  }
  
  // Right side card (next)
  if (position === 1) {
    return {
      transform: 'translateX(90%) translateZ(-200px) scale(0.8) rotateY(-15deg)',
      opacity: 0.5,
      zIndex: 20,
      filter: 'brightness(0.6) contrast(0.95) blur(0px)',
      pointerEvents: 'none',
    };
  }
  
  // Left side card (prev)
  if (position === -1) {
    return {
      transform: 'translateX(-90%) translateZ(-200px) scale(0.8) rotateY(15deg)',
      opacity: 0.5,
      zIndex: 20,
      filter: 'brightness(0.6) contrast(0.95) blur(0px)',
      pointerEvents: 'none',
    };
  }
  
  // Far right (entering from right or exiting to right)
  if (position === 2 || position > 2) {
    return {
      transform: 'translateX(180%) translateZ(-400px) scale(0.5) rotateY(-30deg)',
      opacity: 0,
      zIndex: 10,
      filter: 'brightness(0.3) contrast(0.9) blur(2px)',
      pointerEvents: 'none',
    };
  }
  
  // Far left (entering from left or exiting to left)
  if (position === -2 || position < -2) {
    return {
      transform: 'translateX(-180%) translateZ(-400px) scale(0.5) rotateY(30deg)',
      opacity: 0,
      zIndex: 10,
      filter: 'brightness(0.3) contrast(0.9) blur(2px)',
      pointerEvents: 'none',
    };
  }
  
  return {
    transform: 'translateX(0%) translateZ(-500px) scale(0.3)',
    opacity: 0,
    zIndex: 1,
    filter: 'brightness(0.2) blur(4px)',
    pointerEvents: 'none',
  };
};

// ============================================
// SUB-COMPONENTS
// ============================================
const ChevronIcon = ({ direction }) => (
  <svg 
    className="w-6 h-6" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    strokeWidth={2.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d={direction === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
    />
  </svg>
);

const ArrowIcon = () => (
  <svg 
    className="w-5 h-5 transition-transform duration-base group-hover:translate-x-1" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    strokeWidth={2.5}
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      d="M13 7l5 5m0 0l-5 5m5-5H6" 
    />
  </svg>
);

const BackgroundSlide = ({ slide, isActive }) => (
  <div
    className={`absolute inset-0 transition-all duration-[1200ms] ease-smooth ${
      isActive 
        ? 'opacity-100 scale-100' 
        : 'opacity-0 scale-105'
    }`}
    style={{
      backgroundImage: `url(${slide.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${COLOR_SYSTEM.overlay.dark}`} />
    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30" />
  </div>
);

const SlideContent = ({ slide, isActive }) => (
  <div className="text-white space-y-grid-6">
    <div 
      className={`transition-all duration-[800ms] ease-smooth ${
        isActive 
          ? 'opacity-100 translate-y-0 delay-[200ms]' 
          : 'opacity-0 translate-y-12'
      }`}
    >
      <h2 
        className="font-heading font-bold text-display-lg sm:text-display-xl lg:text-display-2xl mb-grid-3"
        style={{ 
          color: COLOR_SYSTEM.text.primary,
          textShadow: '0 4px 20px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.4)',
        }}
      >
        {slide.title}
      </h2>
      
      <div 
        className={`h-1 rounded-full bg-gradient-to-r ${COLOR_SYSTEM.accent.primary} transition-all duration-[600ms] ${
          isActive ?  'w-20 delay-[600ms]' : 'w-0'
        }`}
        style={{
          boxShadow: `0 0 15px ${COLOR_SYSTEM.glow}`,
        }}
      />
    </div>

    <p 
      className={`text-body-lg sm:text-body-xl max-w-xl leading-relaxed text-pretty transition-all duration-[800ms] ease-smooth ${
        isActive 
          ? 'opacity-100 translate-y-0 delay-[400ms]' 
          : 'opacity-0 translate-y-12'
      }`}
      style={{ 
        color: COLOR_SYSTEM.text.secondary,
        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
      }}
    >
      {slide.description}
    </p>

    <div
      className={`transition-all duration-[800ms] ease-smooth ${
        isActive 
          ? 'opacity-100 translate-y-0 delay-[600ms]' 
          : 'opacity-0 translate-y-12'
      }`}
    >
      <Link 
        to={slide.link} 
        className="inline-flex items-center gap-grid-3 px-grid-8 py-grid-4 rounded-xl font-heading font-semibold text-body-lg bg-white text-secondary-900 hover:bg-white/95 shadow-xl hover:shadow-2xl hover:shadow-primary-500/20 transition-all duration-base hover:scale-105 group"
      >
        <span>Explore Now</span>
        <ArrowIcon />
      </Link>
    </div>
  </div>
);

const CarouselCard = ({ slide, cardIndex, activeIndex, direction }) => {
  const position = getCardPosition(cardIndex, activeIndex, SLIDES_DATA.length, direction);
  const style = getCardStyle(position, direction);

  return (
    <div
      className="absolute w-3/4 max-w-sm h-full rounded-2xl overflow-hidden shadow-2xl preserve-3d will-change-transform transition-all duration-[1200ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
      style={{
        ...style,
        boxShadow: position === 0
          ? `0 25px 60px -15px rgba(0, 0, 0, 0.6), 0 0 30px ${COLOR_SYSTEM.glow}` 
          : '0 15px 40px -10px rgba(0, 0, 0, 0.4)',
      }}
    >
      <img 
        src={slide.cardImage} 
        alt={slide.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      
      <div 
        className={`absolute inset-0 bg-gradient-to-t transition-all duration-[1200ms] ${
          position === 0
            ? 'from-slate-950/70 via-slate-900/20 to-transparent'
            : 'from-slate-950/90 via-slate-900/60 to-slate-900/40'
        }`}
      />
      
      {position === 0 && (
        <div 
          className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-[1200ms]"
          style={{
            boxShadow: `inset 0 0 40px ${COLOR_SYSTEM.glow}`,
            opacity: 0.2,
          }}
        />
      )}
    </div>
  );
};

const NavigationButton = ({ direction, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="group disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-base hover:scale-110"
    aria-label={`${direction === 'left' ? 'Previous' : 'Next'} slide`}
  >
    <div 
      className="p-grid-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 group-hover:border-white/30 transition-all duration-base text-white shadow-lg"
      style={{
        boxShadow: `0 4px 15px ${COLOR_SYSTEM.glow}`,
      }}
    >
      <ChevronIcon direction={direction} />
    </div>
  </button>
);

const DotIndicator = ({ index, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`h-2.5 rounded-full transition-all duration-base ease-smooth disabled:cursor-not-allowed ${
      isActive 
        ?  'w-10 bg-white' 
        : 'w-2.5 bg-white/40 hover:bg-white/60 hover:w-6'
    }`}
    style={{
      boxShadow: isActive ? `0 0 15px ${COLOR_SYSTEM.glow}` : 'none',
    }}
    aria-label={`Go to slide ${index + 1}`}
    aria-current={isActive ? 'true' : 'false'}
  />
);

// ============================================
// MAIN COMPONENT
// ============================================
const Bisnis = () => {
  const {
    activeIndex,
    direction,
    isTransitioning,
    goToSlide,
    nextSlide,
    prevSlide,
    pauseAutoPlay,
  } = useCarousel(SLIDES_DATA.length);

  const handlePrevClick = () => {
    prevSlide();
    pauseAutoPlay();
  };

  const handleNextClick = () => {
    nextSlide();
    pauseAutoPlay();
  };

  const handleDotClick = (index) => {
    goToSlide(index);
    pauseAutoPlay();
  };

  return (
    <section 
      className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-slate-950"
      aria-label="Business areas carousel"
    >
      {/* Background Slides */}
      <div className="absolute inset-0 w-full h-full">
        {SLIDES_DATA.map((slide, index) => (
          <BackgroundSlide 
            key={slide.id}
            slide={slide}
            isActive={index === activeIndex}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 section-container w-full py-grid-20 sm:py-grid-24 lg:py-grid-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-grid-16 lg:gap-grid-24 items-center">
          
          {/* Text Content */}
          <SlideContent 
            slide={SLIDES_DATA[activeIndex]}
            isActive={true}
          />

          {/* 3D Card Carousel - ALL CARDS RENDERED */}
          <div 
            className="relative h-[55vh] sm:h-[60vh] lg:h-[65vh] flex items-center justify-center"
            style={{ perspective: '1800px' }}
          >
            {SLIDES_DATA.map((slide, index) => (
              <CarouselCard 
                key={slide.id}
                slide={slide}
                cardIndex={index}
                activeIndex={activeIndex}
                direction={direction}
              />
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-grid-12 left-1/2 -translate-x-1/2 flex items-center gap-grid-8 z-30">
          <NavigationButton 
            direction="left"
            onClick={handlePrevClick}
            disabled={isTransitioning}
          />
          
          <div className="flex gap-grid-3 px-grid-6 py-grid-3 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-xl">
            {SLIDES_DATA.map((slide, index) => (
              <DotIndicator 
                key={slide.id}
                index={index}
                isActive={activeIndex === index}
                onClick={() => handleDotClick(index)}
                disabled={isTransitioning}
              />
            ))}
          </div>

          <NavigationButton 
            direction="right"
            onClick={handleNextClick}
            disabled={isTransitioning}
          />
        </div>
      </div>
    </section>
  );
};

export default Bisnis;