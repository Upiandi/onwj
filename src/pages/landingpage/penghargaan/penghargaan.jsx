import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInView, useMotionValue, useSpring } from 'framer-motion';
import toast from 'react-hot-toast';
import './penghargaan.css';
import penghargaanService from '../../../services/penghargaanService';

// ============================================
// ASSETS (Fallback images)
// ============================================
import contoh1 from '../../../assets/contoh1.png';
import contoh2 from '../../../assets/contoh2.png';
import contoh3 from '../../../assets/contoh3.png';

// ============================================
// CONSTANTS
// ============================================
const FALLBACK_IMAGES = [contoh1, contoh2, contoh3];

const STATISTICS_DATA = [
  { id: 1, value: 20, suffix: '+', label: 'Tahun Pengalaman' },
  { id: 2, value: 35, suffix: '+', label: 'Penghargaan Diterima' },
  { id: 3, value: 1750, suffix: '+', label: 'Pelanggan Puas', separator: ',' },
  { id: 4, value: 120, suffix: '+', label: 'Staf Profesional' },
];

const CAROUSEL_CONFIG = {
  SPEED: 10000,
  CARD_WIDTH: 200,
  CARD_HEIGHT: 280,
  GAP: 40,
  UPDATE_INTERVAL: 100,
};

// ============================================
// CUSTOM HOOKS
// ============================================
const useCountUp = ({ to, from = 0, delay = 0, duration = 2, separator = '' }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(from);
  
  const springValue = useSpring(motionValue, {
    damping: 10 + 20 * (1 / duration),
    stiffness: 50 * (1 / duration),
  });

  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num) => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) return decimals.length;
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = String(from);
    }
  }, [from]);

  useEffect(() => {
    if (isInView) {
      const timeoutId = setTimeout(() => {
        motionValue.set(to);
      }, delay * 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [isInView, motionValue, to, delay]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const hasDecimals = maxDecimals > 0;
        const options = {
          useGrouping: !!separator,
          minimumFractionDigits: hasDecimals ?  maxDecimals : 0,
          maximumFractionDigits: hasDecimals ? maxDecimals : 0,
        };
        const formattedNumber = Intl.NumberFormat('en-US', options).format(latest);
        ref.current.textContent = separator 
          ? formattedNumber.replace(/,/g, separator) 
          : formattedNumber;
      }
    });
    return () => unsubscribe();
  }, [springValue, separator, maxDecimals]);

  return ref;
};

const useInfiniteCarousel = (itemsCount) => {
  const [duplicateCount, setDuplicateCount] = useState(2);
  const trackRef = useRef(null);

  useEffect(() => {
    if (trackRef.current) {
      const container = trackRef.current.parentElement;
      const logoSetWidth = trackRef.current.firstChild?.offsetWidth || 0;
      const containerWidth = container?.offsetWidth || 0;
      const setsNeeded = Math.ceil((containerWidth * 2) / logoSetWidth);
      setDuplicateCount(Math.max(2, setsNeeded));
    }
  }, [itemsCount]);

  return { trackRef, duplicateCount };
};

// ============================================
// SUB-COMPONENTS
// ============================================
const CountUp = ({ to, from, delay, duration, separator }) => {
  const ref = useCountUp({ to, from, delay, duration, separator });
  return <span ref={ref} className="inline-block" />;
};

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const AwardCard = ({ award, onClick, fallbackImage }) => {
  const imageUrl = award.image_url || fallbackImage;
  
  return (
    <div
      className="award-item"
      onClick={() => onClick(award)}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(award);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View ${award.title} details`}
    >
      <img 
        src={imageUrl} 
        alt={award.title} 
        className="award-image" 
        loading="lazy"
        onError={(e) => {
          e.target.src = fallbackImage; // Fallback if image fails
        }}
      />
      <div className="award-year-badge">{award.year}</div>
    </div>
  );
};

const InfiniteCarousel = ({ items, onItemClick }) => {
  const { trackRef, duplicateCount } = useInfiniteCarousel(items.length);

  return (
    <div 
      className="award-carousel-track" 
      ref={trackRef}
      style={{
        '--speed': `${CAROUSEL_CONFIG.SPEED}ms`,
        '--gap': `${CAROUSEL_CONFIG.GAP}px`,
        '--card-width': `${CAROUSEL_CONFIG.CARD_WIDTH}px`,
        '--card-height': `${CAROUSEL_CONFIG.CARD_HEIGHT}px`,
        '--duplicate-count': duplicateCount,
      }}
    >
      {Array.from({ length: duplicateCount }).map((_, setIndex) => (
        <div key={setIndex} className="award-carousel-content">
          {items.map((award, index) => (
            <AwardCard 
              key={`${setIndex}-${award.id}`}
              award={award}
              onClick={onItemClick}
              fallbackImage={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const AwardModal = ({ award, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !award) return null;

  const imageUrl = award.image_url || FALLBACK_IMAGES[0];

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-secondary-900/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="relative bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-secondary-900 text-white flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 shadow-lg"
          aria-label="Close modal"
        >
          <CloseIcon />
        </button>

        <div className="flex flex-col md:flex-row overflow-y-auto custom-scrollbar max-h-[90vh]">
          <div className="relative w-full md:w-96 bg-secondary-50 p-8 flex items-center justify-center min-h-80 md:min-h-[500px]">
            <img
              src={imageUrl}
              alt={award.title}
              className="w-full h-auto max-h-96 object-contain rounded-lg shadow-md"
              onError={(e) => {
                e.target.src = FALLBACK_IMAGES[0];
              }}
            />
            <div className="absolute top-4 left-4 px-4 py-2 rounded-lg bg-primary-600 text-white font-heading font-bold text-sm shadow-lg">
              {award.year}
            </div>
          </div>

          <div className="flex-1 p-8">
            <h3 id="modal-title" className="font-heading font-bold text-2xl sm:text-3xl text-secondary-900 mb-3">
              {award.title}
            </h3>
            <p className="font-heading font-semibold text-xs uppercase tracking-wider text-primary-600 mb-4">
              {award.given_by} • {award.month} {award.year}
            </p>
            <div className="w-12 h-1 rounded-full bg-primary-600 mb-6" />
            <p className="text-base sm:text-lg text-secondary-700 leading-relaxed">
              {award.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatisticCard = ({ stat, index }) => (
  <div 
    className="statistic-card"
    role="article"
    aria-labelledby={`stat-label-${stat.id}`}
  >
    <div className="statistic-value">
      <CountUp to={stat.value} from={0} delay={index * 0.2} duration={2} separator={stat.separator || ''} />
      <span className="statistic-suffix">{stat.suffix}</span>
    </div>
    <p id={`stat-label-${stat.id}`} className="statistic-label">
      {stat.label}
    </p>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================
const Penghargaan = () => {
  const [selectedAward, setSelectedAward] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [awardsData, setAwardsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState(STATISTICS_DATA);
  const carouselRef = useRef(null);

  // ✅ Fetch penghargaan from API
  useEffect(() => {
    fetchPenghargaan();
  }, []);

  const fetchPenghargaan = async () => {
    setLoading(true);
    try {
      const response = await penghargaanService.getForLanding(6); // Limit 6 untuk landing page
      
      if (response.success && response.data.length > 0) {
        setAwardsData(response.data);
        
        // Update statistics - total penghargaan
        setStatistics(prev => prev.map(stat => 
          stat.id === 2 
            ? { ...stat, value: response.data.length } 
            : stat
        ));
      }
    } catch (error) {
      console.error('Error fetching penghargaan:', error);
      // Don't show error toast on landing page, just use fallback
    } finally {
      setLoading(false);
    }
  };

  const handleAwardClick = useCallback((award) => {
    setSelectedAward(award);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAward(null), 300);
  }, []);

  // Show loading skeleton
  if (loading) {
    return (
      <section 
        id="awards" 
        className="py-16 sm:py-20 lg:py-24 bg-white"
      >
        <div className="section-container">
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <span className="section-label">PENGHARGAAN</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-secondary-900 mt-2">
              Penghargaan & Pengakuan
            </h2>
            <p className="text-base sm:text-lg text-secondary-600 max-w-3xl mx-auto mt-4">
              Komitmen kami terhadap keunggulan telah diakui oleh para pemimpin industri
            </p>
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center py-24">
            <div className="spinner"></div>
          </div>
        </div>
      </section>
    );
  }

  // Show message if no data
  if (awardsData.length === 0) {
    return (
      <section 
        id="awards" 
        className="py-16 sm:py-20 lg:py-24 bg-white"
      >
        <div className="section-container">
          <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
            <span className="section-label">PENGHARGAAN</span>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-secondary-900 mt-2">
              Penghargaan & Pengakuan
            </h2>
            <p className="text-base sm:text-lg text-secondary-600 max-w-3xl mx-auto mt-4">
              Komitmen kami terhadap keunggulan telah diakui oleh para pemimpin industri
            </p>
          </div>

          <div className="text-center py-20">
            <p className="text-secondary-600 text-lg">Belum ada data penghargaan</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="awards" 
      className="py-16 sm:py-20 lg:py-24 bg-white"
      aria-labelledby="awards-heading"
    >
      <div className="section-container">
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <span className="section-label">PENGHARGAAN</span>
          <h2 
            id="awards-heading" 
            className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-secondary-900 mt-2"
          >
            Penghargaan & Pengakuan
          </h2>
          <p className="text-base sm:text-lg text-secondary-600 max-w-3xl mx-auto mt-4">
            Komitmen kami terhadap keunggulan telah diakui oleh para pemimpin industri
          </p>
        </div>

        {/* Carousel */}
        <div className="mb-6 sm:mb-8">
          <div 
            ref={carouselRef}
            className="award-carousel-wrapper"
            role="list"
            aria-label="Daftar penghargaan"
          >
            <InfiniteCarousel items={awardsData} onItemClick={handleAwardClick} />
          </div>
        </div>

        {/* Statistics */}
        <div className="pt-6 sm:pt-8 lg:pt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {statistics.map((stat, index) => (
              <StatisticCard key={stat.id} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>

      <AwardModal award={selectedAward} isOpen={isModalOpen} onClose={handleCloseModal} />
    </section>
  );
};

export default Penghargaan;