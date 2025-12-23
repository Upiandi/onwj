import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import profileImage from '../../assets/rectangle.png';
import PemegangSaham1 from '../../assets/PemegangSaham/MUJ.webp';
import PemegangSaham2 from '../../assets/PemegangSaham/Jakpro.png';
import PemegangSaham3 from '../../assets/PemegangSaham/Petrogas.png';
import PemegangSaham4 from '../../assets/PemegangSaham/PTbumi.png';
import PemegangSaham5 from '../../assets/PemegangSaham/subang.png';
import PemegangSaham6 from '../../assets/PemegangSaham/bbwm.png';

// ============================================
// CONSTANTS
// ============================================
const FEATURES = [
  'Inovasi berkelanjutan dalam teknologi energi',
  'Komitmen terhadap lingkungan dan keamanan',
  'Pemberdayaan masyarakat dan ekonomi lokal'
];

const STAKEHOLDER_LOGOS = [
  { 
    src: PemegangSaham1, 
    alt: 'MUJ', 
    href: 'https://www.muj.co.id', 
    title: 'MUJ - Partner Strategis' 
  },
  { 
    src: PemegangSaham2, 
    alt: 'Jakpro', 
    href: 'https://www.jakpro.co.id', 
    title: 'Jakpro - Partner Strategis' 
  },
  { 
    src: PemegangSaham3, 
    alt: 'Petrogas', 
    href: 'https://www.petrogas.co.id', 
    title: 'Petrogas - Partner Strategis' 
  },
  { 
    src: PemegangSaham4, 
    alt: 'PT Bumi', 
    href: 'https://www.ptbumi.co.id', 
    title: 'PT Bumi - Partner Strategis' 
  },
  { 
    src: PemegangSaham5, 
    alt: 'Subang', 
    href: 'https://www.subang.co.id', 
    title: 'Subang - Partner Strategis' 
  },
  { 
    src: PemegangSaham6, 
    alt: 'BBWM', 
    href: 'https://www.bbwm.co.id', 
    title: 'BBWM - Partner Strategis' 
  }
];

// ============================================
// CUSTOM HOOKS
// ============================================
const useScrollAnimation = (refs) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (! entry.isIntersecting) return;

          entry.target.classList.add('opacity-100');
          entry.target.classList.remove('opacity-0');

          // Animate specific refs
          refs.forEach(({ ref, animations }) => {
            if (entry.target === ref.current && ref.current) {
              animations.add.forEach(cls => ref.current.classList.add(cls));
              animations.remove.forEach(cls => ref.current.classList.remove(cls));
            }
          });

          // Stagger animation for logos
          const logos = entry.target.querySelectorAll('.stakeholder-logo');
          logos.forEach((logo, index) => {
            setTimeout(() => {
              logo.classList.add('opacity-100', 'translate-y-0');
              logo.classList.remove('opacity-0', 'translate-y-8');
            }, index * 100);
          });
        });
      },
      { threshold: 0.2 }
    );

    const elements = refs.map(({ ref }) => ref.current).filter(Boolean);
    elements.forEach(element => observer.observe(element));

    return () => {
      elements.forEach(element => observer.unobserve(element));
    };
  }, [refs]);
};

// ============================================
// SUB-COMPONENTS
// ============================================
const FeatureIcon = () => (
  <svg 
    className="w-4 h-4 text-primary-600 transition-smooth group-hover:scale-110" 
    fill="currentColor" 
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path 
      fillRule="evenodd" 
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
      clipRule="evenodd" 
    />
  </svg>
);

const ArrowIcon = () => (
  <svg 
    className="w-4 h-4" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M13 7l5 5m0 0l-5 5m5-5H6" 
    />
  </svg>
);

const StakeholderLogo = ({ src, alt, href, title }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={title}
    className="stakeholder-logo flex items-center justify-center p-grid-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-smooth opacity-0 translate-y-8 group h-28"
  >
    <img
      src={src}
      alt={alt}
      className="h-12 sm:h-14 w-auto max-w-full object-contain grayscale group-hover:grayscale-0 transition-smooth group-hover:scale-110 will-change-transform"
      loading="lazy"
    />
  </a>
);

// ============================================
// SECTION COMPONENTS
// ============================================
const ProfileSection = ({ sectionRef, imageRef, contentRef }) => (
  <section 
    ref={sectionRef}
    className="pt-grid-16 sm:pt-grid-20 lg:pt-grid-24 pb-grid-6 sm:pb-grid-8 bg-white opacity-0 transition-smart"
  >
    <div className="section-container">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-grid-12 lg:gap-grid-16">
        
        {/* Image */}
        <div 
          ref={imageRef}
          className="w-full lg:w-1/2 opacity-0 -translate-x-full transition-smart will-change-transform"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-xl h-[400px] sm:h-[480px] lg:h-[540px] group">
            <img
              src={profileImage}
              alt="Offshore Platform - Teknologi Energi Modern"
              className="w-full h-full object-cover transition-smart will-change-transform group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        <div 
          ref={contentRef}
          className="w-full lg:w-1/2 space-y-grid-2 opacity-0 translate-x-full transition-smart will-change-transform"
        >
          {/* Header */}
          <div className="mb-0">
            <span className="section-label">TENTANG KAMI</span>
            <h2 className="section-title mt-grid-2">MUJ ONWJ</h2>
          </div>
          
          {/* Description */}
          <div className="space-y-grid-2">
            <p className="text-body-md sm:text-body-lg text-secondary-600 leading-relaxed text-pretty">
              MUJ ONWJ adalah Badan Usaha Milik Daerah yang mengelola 10% hak Participating Interest di blok Offshore North West Java (ONWJ),
              dibentuk lewat mandat pemerintah daerah dan resmi beroperasi sejak 2019. Kami berdiri atas fondasi tata kelola transparan,
              profesionalisme tinggi, dan komitmen menghadirkan manfaat energi bagi masyarakat dan daerah pemegang saham.
            </p>
          </div>

          {/* CTA */}
          <div className="pt-grid-4">
            <Link 
              to="/tentang" 
              className="link-arrow inline-flex"
              aria-label="Pelajari lebih lanjut tentang visi dan misi kami"
            >
              <span>Pelajari Lebih Lanjut</span>
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const StakeholderSection = ({ stakeholderRef }) => (
  <section 
    ref={stakeholderRef}
    className="pt-grid-6 sm:pt-grid-8 pb-grid-16 sm:pb-grid-20 lg:pb-grid-24 bg-secondary-50 opacity-0 transition-smart"
  >
    <div className="section-container">
      {/* Header */}
      <div className="text-center mb-grid-10 sm:mb-grid-12">
        <h2 className="font-heading font-bold text-display-md sm:text-display-lg lg:text-display-xl text-secondary-900 mt-grid-3 text-center">
          Pemegang Saham
        </h2>
      </div>

      {/* Logos Grid - SEJAJAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-grid-6 sm:gap-grid-8">
        {STAKEHOLDER_LOGOS.map((logo, index) => (
          <StakeholderLogo key={index} {...logo} />
        ))}
      </div>
    </div>
  </section>
);

// ============================================
// MAIN COMPONENT
// ============================================
const Profile = () => {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const stakeholderRef = useRef(null);

  useScrollAnimation([
    { 
      ref: sectionRef, 
      animations: { add: [], remove: [] } 
    },
    { 
      ref: imageRef, 
      animations: { 
        add: ['translate-x-0', 'opacity-100'], 
        remove: ['-translate-x-full', 'opacity-0'] 
      } 
    },
    { 
      ref: contentRef, 
      animations: { 
        add: ['translate-x-0', 'opacity-100'], 
        remove: ['translate-x-full', 'opacity-0'] 
      } 
    },
    { 
      ref: stakeholderRef, 
      animations: { add: [], remove: [] } 
    }
  ]);

  return (
    <>
      <ProfileSection 
        sectionRef={sectionRef}
        imageRef={imageRef}
        contentRef={contentRef}
      />
      <StakeholderSection stakeholderRef={stakeholderRef} />
    </>
  );
};

export default Profile;