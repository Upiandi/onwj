import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import contoh1 from '../../assets/contoh1.png';
import contoh2 from '../../assets/contoh2.png';
import contoh3 from '../../assets/contoh3.png';
import contoh4 from '../../assets/contoh4.png';

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
  const [progress, setProgress] = useState(0); // 0-100 across ALL slides
  
  const animationFrameRef = useRef(null);
  const autoAdvanceTimeoutRef = useRef(null);
  
  const images = useMemo(() => [contoh1, contoh2, contoh3, contoh4], []);
  
  const timelineData = useMemo(() => [
    {
      year: 2010,
      title: "Fondasi Awal",
      description: "Persiapan strategis dan studi kelayakan untuk pengelolaan aset energi daerah",
      image: images[0]
    },
    {
      year: 2011,
      title: "Pembentukan Struktur",
      description: "Pembentukan struktur organisasi dan tim manajemen profesional",
      image: images[1]
    },
    {
      year: 2012,
      title: "Pengembangan Kapasitas",
      description: "Investasi dalam pengembangan SDM dan infrastruktur operasional",
      image: images[2]
    },
    {
      year: 2013,
      title: "Ekspansi Regional",
      description: "Perluasan jangkauan operasional ke provinsi-provinsi strategis",
      image: images[3]
    },
    {
      year: 2014,
      title: "Kemitraan Strategis",
      description: "Membangun kolaborasi dengan stakeholder pemerintah dan industri",
      image: images[0]
    },
    {
      year: 2015,
      title: "Optimalisasi Proses",
      description: "Implementasi sistem manajemen modern dan best practices",
      image: images[1]
    },
    {
      year: 2016,
      title: "Pendirian Resmi",
      description: "Pendirian resmi perusahaan sebagai pengelola Partisipasi Indonesia 10%",
      highlight: true,
      image: images[2]
    },
    {
      year: 2017,
      title: "Operasional Penuh",
      description: "Memulai operasional penuh dengan tim 1.000+ profesional",
      image: images[3]
    },
    {
      year: 2018,
      title: "Diversifikasi Portofolio",
      description: "Diversifikasi portofolio aset energi untuk keberlanjutan",
      image: images[0]
    },
    {
      year: 2019,
      title: "Inovasi Digital",
      description: "Transformasi digital dan adopsi teknologi dalam operasional",
      image: images[1]
    },
    {
      year: 2020,
      title: "Resiliensi",
      description: "Mempertahankan operasional optimal di tengah tantangan global",
      image: images[2]
    },
    {
      year: 2021,
      title: "Pertumbuhan Berkelanjutan",
      description: "Fokus pada pembangunan berkelanjutan dan ESG",
      image: images[3]
    },
    {
      year: 2022,
      title: "Masa Depan Energi",
      description: "Komitmen menuju transisi energi bersih dan net-zero emission",
      image: images[0]
    }
  ], [images]);

  const totalSlides = timelineData.length;

  // Continuous progress animation (0-100% linear)
  useEffect(() => {
    const totalDuration = AUTO_INTERVAL * totalSlides; // Total time for all slides
    const startTime = Date.now();
    const initialProgress = (activeIndex / totalSlides) * 100;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progressIncrement = (elapsed / AUTO_INTERVAL) * (100 / totalSlides);
      const newProgress = Math.min(initialProgress + progressIncrement, 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [activeIndex, totalSlides]);

  // Auto-advance to next slide
  useEffect(() => {
    autoAdvanceTimeoutRef.current = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % totalSlides;
      
      // Smooth transition
      setIsTransitioning(true);
      
      setTimeout(() => {
        setActiveIndex(nextIndex);
        setIsTransitioning(false);
        
        // Set progress to exact next slide position
        const nextProgress = (nextIndex / totalSlides) * 100;
        setProgress(nextProgress);
      }, TRANSITION_DURATION / 2);
      
    }, AUTO_INTERVAL);
    
    return () => {
      if (autoAdvanceTimeoutRef.current) {
        clearTimeout(autoAdvanceTimeoutRef.current);
      }
    };
  }, [activeIndex, totalSlides]);

  // Manual navigation
  const goToSlide = useCallback((targetIndex) => {
    if (targetIndex === activeIndex || isTransitioning) return;
    
    // Cancel animations
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setActiveIndex(targetIndex);
      setIsTransitioning(false);
      
      // Set progress to exact target position
      const targetProgress = (targetIndex / totalSlides) * 100;
      setProgress(targetProgress);
    }, TRANSITION_DURATION / 2);
    
  }, [activeIndex, isTransitioning, totalSlides]);

  const goToPrev = () => {
    const prevIndex = activeIndex === 0 ? totalSlides - 1 : activeIndex - 1;
    goToSlide(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % totalSlides;
    goToSlide(nextIndex);
  };

  const currentItem = timelineData[activeIndex];
  
  // Calculate current slide progress (0-100 for current slide only)
  const currentSlideProgress = ((progress * totalSlides) % 100);

  return (
    <section 
      id="sejarah"
      className="py-grid-10 relative overflow-hidden"
      aria-labelledby="sejarah-title"
    >
      {/* Animated Flowing Waves Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1929] via-[#0d2847] to-[#1a2332]">
        
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
      <div className="section-container relative z-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-grid-6">
          <div>
            <span className="inline-block px-grid-3 py-grid-1 bg-white/5 backdrop-blur-sm text-primary-400 rounded text-body-xs font-semibold mb-grid-2 uppercase tracking-wide border border-white/10">
              Perjalanan Kami
            </span>
            <h2 id="sejarah-title" className="text-display-md lg:text-display-lg font-heading font-bold text-white">
              Sejarah Perusahaan
            </h2>
          </div>
          
          {/* Navigation */}
          <div className="flex items-center gap-grid-3">
            <button
              onClick={goToPrev}
              className="w-9 h-9 rounded bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/10"
              aria-label="Sebelumnya"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-body-sm text-white/80 min-w-[60px] text-center tabular-nums font-medium">
              {activeIndex + 1} / {totalSlides}
            </span>
            
            <button
              onClick={goToNext}
              className="w-9 h-9 rounded bg-white/5 hover:bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-all border border-white/10"
              aria-label="Selanjutnya"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar - Absolute Progress */}
        <div className="mb-grid-8">
          <div className="relative h-1.5 bg-white/5 backdrop-blur-sm rounded-full overflow-hidden border border-white/10">
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
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-600 to-primary-500"
              style={{ 
                width: `${progress}%`,
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
                transition: 'none' // Pure requestAnimationFrame, no CSS transition
              }}
            />
          </div>
          
          {/* Year markers */}
          <div className="flex justify-between mt-grid-2 px-1">
            {timelineData.filter((_, i) => i % 2 === 0).map((item) => (
              <button
                key={item.year}
                onClick={() => goToSlide(timelineData.findIndex(d => d.year === item.year))}
                className={`text-body-xs transition-all ${
                  item.year === currentItem.year 
                    ? 'text-primary-400 font-bold' 
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                {item.year}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-5 gap-grid-6 items-center">
          
          {/* Image */}
          <div className="lg:col-span-3 order-2 lg:order-1">
            <div 
              className={`
                relative rounded overflow-hidden border border-white/10 shadow-2xl
                transition-all duration-500
                ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
              `}
            >
              <img
                src={currentItem.image}
                alt={currentItem.title}
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/50 via-transparent to-transparent" />
              
              <div className={`
                absolute top-4 right-4 px-grid-4 py-grid-2 rounded backdrop-blur-md shadow-xl border
                ${currentItem.highlight 
                  ? 'bg-primary-600 border-primary-400/30' 
                  : 'bg-white/90 border-white/30'
                }
              `}>
                <span className={`text-body-lg font-bold ${currentItem.highlight ? 'text-white' : 'text-secondary-900'}`}>
                  {currentItem.year}
                </span>
              </div>

              {/* Current slide progress on image */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <div 
                  className="h-full bg-primary-500"
                  style={{ 
                    width: `${currentSlideProgress}%`,
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)',
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
                transition-all duration-500
                ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
              `}
            >
              {currentItem.highlight && (
                <div className="inline-flex items-center gap-grid-2 px-grid-3 py-grid-1 bg-primary-600/20 backdrop-blur-sm rounded border border-primary-500/30 mb-grid-3">
                  <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                  <span className="text-body-xs font-semibold text-primary-300 uppercase tracking-wide">
                    Milestone Penting
                  </span>
                </div>
              )}
              
              <h3 className="text-display-sm lg:text-display-md font-heading font-bold text-white mb-grid-3 leading-tight">
                {currentItem.title}
              </h3>
              
              <p className="text-body-md text-white/85 leading-relaxed mb-grid-4">
                {currentItem.description}
              </p>

              {/* Navigation dots */}
              <div className="flex items-center gap-grid-2">
                {timelineData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`
                      h-1.5 rounded-full transition-all duration-300
                      ${index === activeIndex 
                        ? 'w-8 bg-primary-500' 
                        : 'w-1.5 bg-white/25 hover:bg-white/50'
                      }
                    `}
                    style={index === activeIndex ? { boxShadow: '0 0 8px rgba(59, 130, 246, 0.6)' } : {}}
                    aria-label={`Tahun ${timelineData[index].year}`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Auto-play indicator */}
        <div className="mt-grid-6 flex items-center justify-center gap-grid-2 text-white/50 text-body-xs">
          <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" style={{ boxShadow: '0 0 6px rgba(59, 130, 246, 0.6)' }} />
          <span>Otomatis berpindah setiap {AUTO_INTERVAL / 1000} detik</span>
        </div>

      </div>
    </section>
  );
};

export default PSejarah;