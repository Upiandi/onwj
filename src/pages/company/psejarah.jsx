import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import contoh1 from '../../assets/company/Image1.png';
import contoh2 from '../../assets/company/Image2.png';
import contoh3 from '../../assets/company/Image3.png';
import contoh5 from '../../assets/company/Image5.png';
import contoh6 from '../../assets/company/Image6.png';
import contoh7 from '../../assets/company/Image7.png';
import contoh8 from '../../assets/company/Image8.png';
import contoh9 from '../../assets/company/Image9.png';
import contoh10 from '../../assets/company/Image10.png';
import contoh11 from '../../assets/company/Image11.png';
import contoh12 from '../../assets/company/Image12.png';

/**
 * Constants
 */
const AUTO_INTERVAL = 5000;
const TRANSITION_DURATION = 600;

/**
 * PSejarah Component - Truly Smooth Progress
 * 
 * Fixed: No jumping, pure linear progression
 */
const PSejarah = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [, forceUpdate] = useState(0);
  
  const animationFrameRef = useRef(null);
  const autoAdvanceTimeoutRef = useRef(null);
  const progressStartTimeRef = useRef(Date.now());
  const targetIndexRef = useRef(0);
  
  const images = useMemo(() => [contoh1, contoh2, contoh3, contoh5, contoh6, contoh7, contoh8, contoh9, contoh10, contoh11, contoh12], []);
  
  const timelineData = useMemo(() => [
    {
      year: 2017,
      title: "Fondasi Awal",
      description: "Persiapan strategis dan studi kelayakan untuk pengelolaan aset energi daerah",
      image: images[0]
    },
    {
      title: "Pembentukan Struktur",
      description: "Pembentukan struktur organisasi dan tim manajemen profesional",
      image: images[1]
    },
    {
      title: "Pengembangan Kapasitas",
      description: "Investasi dalam pengembangan SDM dan infrastruktur operasional",
      image: images[2]
    },
    {
      title: "Ekspansi Regional",
      description: "Perluasan jangkauan operasional ke provinsi-provinsi strategis",
      image: images[3]
    },
    {
      title: "Kemitraan Strategis",
      description: "Membangun kolaborasi dengan stakeholder pemerintah dan industri",
      image: images[4]
    },
    {
      title: "Optimalisasi Proses",
      description: "Implementasi sistem manajemen modern dan best practices",
      image: images[5]
    },
    {
      title: "Pendirian Resmi",
      description: "Pendirian resmi perusahaan sebagai pengelola Partisipasi Indonesia 10%",
      highlight: true,
      image: images[6]
    },
    {
      title: "Operasional Penuh",
      description: "Memulai operasional penuh dengan tim 1.000+ profesional",
      image: images[7]
    },
    {
      year: 2018,
      title: "Diversifikasi Portofolio",
      description: "Diversifikasi portofolio aset energi untuk keberlanjutan",
      image: images[8]
    },
    {
      title: "Inovasi Digital",
      description: "Transformasi digital dan adopsi teknologi dalam operasional",
      image: images[9]
    },
    {
      year: 2019,
      title: "Resiliensi",
      description: "Mempertahankan operasional optimal di tengah tantangan global",
      image: images[10]
    },
    {
      title: "Pertumbuhan Berkelanjutan",
      description: "Fokus pada pembangunan berkelanjutan dan ESG",
      image: images[11]
    },
    {
      year: 2020,
      title: "Masa Depan Energi",
      description: "Komitmen menuju transisi energi bersih dan net-zero emission",
      image: images[12]
    }
  ], [images]);

  const totalSlides = timelineData.length;

  // Single source of truth for progress calculation
  const getProgress = useCallback(() => {
    const elapsed = Date.now() - progressStartTimeRef.current;
    const slideProgress = Math.min(elapsed / AUTO_INTERVAL, 1);
    const baseProgress = (activeIndex / totalSlides) * 100;
    const nextProgress = ((activeIndex + 1) / totalSlides) * 100;
    
    return baseProgress + (slideProgress * (nextProgress - baseProgress));
  }, [activeIndex, totalSlides]);

  // Single animation loop for smooth progress
  useEffect(() => {
    const animate = () => {
      forceUpdate(n => n + 1); // Force re-render to show progress animation
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Auto-advance to next slide
  useEffect(() => {
    progressStartTimeRef.current = Date.now();
    
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % totalSlides;
      
      setIsTransitioning(true);
      
      setTimeout(() => {
        setActiveIndex(nextIndex);
        targetIndexRef.current = nextIndex;
        progressStartTimeRef.current = Date.now();
        setIsTransitioning(false);
      }, TRANSITION_DURATION / 2);
      
    }, AUTO_INTERVAL);
    
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, [activeIndex, totalSlides]);

  // Manual navigation with instant progress reset
  const goToSlide = useCallback((targetIndex) => {
    if (targetIndex === activeIndex || isTransitioning) return;
    
    // Cancel auto-advance
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    targetIndexRef.current = targetIndex;
    
    setTimeout(() => {
      setActiveIndex(targetIndex);
      progressStartTimeRef.current = Date.now();
      setIsTransitioning(false);
    }, TRANSITION_DURATION / 2);
    
  }, [activeIndex, isTransitioning]);

  const currentItem = timelineData[activeIndex];
  
  // Calculate progress on each render
  const progress = getProgress();
  
  // Calculate current slide progress (0-100 for current slide only)
  const currentSlideProgress = ((progress * totalSlides) % 100);

  return (
    <section 
      id="sejarah"
      className="py-16 lg:py-24 relative overflow-hidden"
      aria-labelledby="sejarah-title"
    >
      {/* Animated Flowing Waves Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900">
        
        {/* Wave Layer 1 */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1e40af" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#1e40af" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            <path 
              fill="url(#wave1)" 
              d="M0,400 C320,300 420,500 720,400 C1020,300 1120,500 1440,400 L1440,800 L0,800 Z"
            >
              <animate
                attributeName="d"
                dur="20s"
                repeatCount="indefinite"
                values="
                  M0,400 C320,300 420,500 720,400 C1020,300 1120,500 1440,400 L1440,800 L0,800 Z;
                  M0,450 C320,350 420,550 720,450 C1020,350 1120,550 1440,450 L1440,800 L0,800 Z;
                  M0,400 C320,300 420,500 720,400 C1020,300 1120,500 1440,400 L1440,800 L0,800 Z"
              />
            </path>
          </svg>
        </div>

        {/* Wave Layer 2 */}
        <div className="absolute inset-0 opacity-15">
          <svg className="absolute w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path 
              fill="url(#wave2)" 
              d="M0,500 C360,400 540,600 900,500 C1260,400 1380,600 1440,500 L1440,800 L0,800 Z"
            >
              <animate
                attributeName="d"
                dur="15s"
                repeatCount="indefinite"
                values="
                  M0,500 C360,400 540,600 900,500 C1260,400 1380,600 1440,500 L1440,800 L0,800 Z;
                  M0,550 C360,450 540,650 900,550 C1260,450 1380,650 1440,550 L1440,800 L0,800 Z;
                  M0,500 C360,400 540,600 900,500 C1260,400 1380,600 1440,500 L1440,800 L0,800 Z"
              />
            </path>
          </svg>
        </div>

        {/* Wave Layer 3 */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute w-full h-full" viewBox="0 0 1440 800" preserveAspectRatio="none">
            <defs>
              <linearGradient id="wave3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <path 
              fill="url(#wave3)" 
              d="M0,600 C480,520 600,680 960,600 C1320,520 1380,680 1440,600 L1440,800 L0,800 Z"
            >
              <animate
                attributeName="d"
                dur="10s"
                repeatCount="indefinite"
                values="
                  M0,600 C480,520 600,680 960,600 C1320,520 1380,680 1440,600 L1440,800 L0,800 Z;
                  M0,640 C480,560 600,720 960,640 C1320,560 1380,720 1440,640 L1440,800 L0,800 Z;
                  M0,600 C480,520 600,680 960,600 C1320,520 1380,680 1440,600 L1440,800 L0,800 Z"
              />
            </path>
          </svg>
        </div>

        <div className="absolute inset-0 bg-gradient-radial from-primary-600/5 via-transparent to-transparent" />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        
        {/* Header */}
        <div className="mb-12 lg:mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/5 backdrop-blur-sm text-primary-400 rounded-lg text-xs font-heading font-semibold mb-3 uppercase tracking-wider border border-white/10">
            Perjalanan Kami
          </span>
          <h2 id="sejarah-title" className="text-3xl lg:text-5xl font-heading font-bold text-white leading-tight">
            Sejarah Perusahaan
          </h2>
        </div>

        {/* Progress Bar - Absolute Progress */}
        <div className="mb-12 lg:mb-16">
          <div className="relative h-2 bg-white/5 backdrop-blur-sm rounded-full overflow-hidden border border-white/10">
            {/* Background segments */}
            <div className="absolute inset-0 flex">
              {timelineData.map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 ${index < activeIndex ? 'bg-primary-500/50' : ''}`}
                  style={{ marginRight: index < totalSlides - 1 ? '2px' : '0' }}
                />
              ))}
            </div>
            
            {/* Smooth continuous progress - NO JUMPING */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)',
                transition: 'none' // Pure requestAnimationFrame, no CSS transition
              }}
            />
          </div>
          
          {/* Year markers */}
          <div className="flex justify-between mt-3 px-1">
            {timelineData.filter((_, i) => i % 2 === 0).map((item) => (
              <button
                key={item.year}
                onClick={() => goToSlide(timelineData.findIndex(d => d.year === item.year))}
                className={`text-xs font-heading transition-all duration-300 ${
                  item.year === currentItem.year 
                    ? 'text-primary-400 font-bold scale-110' 
                    : 'text-white/50 hover:text-white/80 hover:scale-105'
                }`}
              >
                {item.year}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          
          {/* Image */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div 
              className={`
                relative rounded-xl overflow-hidden border border-white/10 shadow-2xl
                transition-all duration-500 ease-out
                ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
              `}
            >
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/60 via-transparent to-transparent" />
              
              <div className={`
                absolute top-4 right-4 px-5 py-2 rounded-lg backdrop-blur-md shadow-xl border transition-all duration-300
                ${currentItem.highlight 
                  ? 'bg-primary-600 border-primary-400/30 scale-105' 
                  : 'bg-white/90 border-white/30'
                }
              `}>
                <span className={`text-lg font-heading font-bold ${currentItem.highlight ? 'text-white' : 'text-secondary-900'}`}>
                  {currentItem.year}
                </span>
              </div>

              {/* Current slide progress on image */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div 
                  className="h-full bg-primary-500"
                  style={{ 
                    width: `${currentSlideProgress}%`,
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.7)',
                    transition: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div 
              className={`
                transition-all duration-500 ease-out
                ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
              `}
            >
              {currentItem.highlight && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-600/20 backdrop-blur-sm rounded-lg border border-primary-500/30 mb-4">
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse shadow-lg shadow-primary-400/50" />
                  <span className="text-xs font-heading font-semibold text-primary-300 uppercase tracking-wide">
                    Milestone Penting
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl lg:text-4xl font-heading font-bold text-white mb-4 leading-tight">
                {currentItem.title}
              </h3>
              
              <p className="text-base lg:text-lg text-white/90 leading-relaxed mb-6">
                {currentItem.description}
              </p>

              {/* Navigation dots */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {timelineData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    disabled={isTransitioning}
                    className={`
                      h-2.5 rounded-full transition-all duration-300 disabled:cursor-not-allowed
                      ${index === activeIndex 
                        ? 'w-12 bg-primary-500' 
                        : 'w-2.5 bg-white/30 hover:bg-white/60 hover:w-4'
                      }
                    `}
                    style={index === activeIndex ? { boxShadow: '0 0 12px rgba(59, 130, 246, 0.8)' } : {}}
                    aria-label={`Slide ${index + 1}`}
                    aria-current={index === activeIndex ? 'true' : 'false'}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PSejarah;