import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import beritaImage from '../../assets/rectangle.png';

// ============================================
// CONSTANTS
// ============================================
const NEWS_ITEMS = [
  {
    id: 1,
    title: "Inovasi Terbaru dalam Eksplorasi Energi Terbarukan di Indonesia",
    image: beritaImage,
    date: "10 Oct 2025",
    category: "Energi",
  },
  {
    id: 2,
    title: "Pengembangan Teknologi Migas Ramah Lingkungan",
    image: beritaImage,
    date: "10 Oct 2025",
    category: "Teknologi",
  },
  {
    id: 3,
    title: "Kerjasama Internasional dalam Pengembangan Energi Bersih",
    image: beritaImage,
    date: "10 Oct 2025",
    category: "Kerjasama",
  },
  {
    id: 4,
    title: "Implementasi Smart Technology dalam Industri Migas",
    image: beritaImage,
    date: "10 Oct 2025",
    category: "Inovasi",
  }
];

const FEATURED_NEWS = {
  title: "Terobosan Teknologi Migas untuk Masa Depan Berkelanjutan",
  description: "Inovasi terbaru dalam industri migas menunjukkan perkembangan signifikan dalam upaya mencapai keseimbangan antara produktivitas dan kelestarian lingkungan.",
  image: beritaImage,
  date: "10 Oktober 2025",
  category: "Berita Utama",
};

// ============================================
// CUSTOM HOOK
// ============================================
const useScrollAnimation = (ref, delay = 0) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            element.classList.add('opacity-100', 'translate-y-0');
            element.classList.remove('opacity-0', 'translate-y-8');
          }, delay);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.unobserve(element);
  }, [ref, delay]);
};

// ============================================
// COMPONENTS
// ============================================
const NewsCard = ({ title, image, date, category, delay }) => {
  const cardRef = useRef(null);
  useScrollAnimation(cardRef, delay);

  return (
    <article 
      ref={cardRef}
      className="group cursor-pointer opacity-0 translate-y-8 transition-all duration-700"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl mb-4 shadow-md">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 font-heading font-bold text-xs uppercase tracking-wide rounded-full">
            {category}
          </span>
          <span className="text-sm text-secondary-500">{date}</span>
        </div>
        <h3 className="font-heading text-lg font-bold text-secondary-900 group-hover:text-primary-600 transition-colors duration-300 line-clamp-2 leading-snug">
          {title}
        </h3>
      </div>
    </article>
  );
};

const FeaturedNews = () => {
  const featuredRef = useRef(null);
  useScrollAnimation(featuredRef);

  return (
    <div 
      ref={featuredRef}
      className="section-container mb-16 sm:mb-20 opacity-0 translate-y-8 transition-all duration-700"
    >
      <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        
        {/* Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-xl group">
            <img
              src={FEATURED_NEWS.image}
              alt={FEATURED_NEWS.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"/>
          </div>
        </div>

        {/* Content */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-500 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-secondary-500 font-medium">{FEATURED_NEWS.category}</p>
              <p className="text-primary-600 font-heading font-bold">{FEATURED_NEWS.date}</p>
            </div>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-secondary-900 leading-tight">
            {FEATURED_NEWS.title}
          </h2>

          <p className="text-base sm:text-lg text-secondary-600 leading-relaxed">
            {FEATURED_NEWS.description}
          </p>

          {/* FIXED: Use link-arrow style (consistent with "Lihat Semua") */}
          <Link to="/media-informasi" className="link-arrow inline-flex">
            <span>Baca Selengkapnya</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

const NewsGrid = () => {
  const newsGridRef = useRef(null);
  useScrollAnimation(newsGridRef);

  return (
    <div 
      ref={newsGridRef}
      className="section-container opacity-0 translate-y-8 transition-all duration-700"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
        <div>
          <span className="section-label">Update Terkini</span>
        </div>
        <Link to="/media-informasi" className="link-arrow">
          <span>Lihat Semua</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {NEWS_ITEMS.map((item, index) => (
          <NewsCard key={item.id} {...item} delay={index * 150} />
        ))}
      </div>
    </div>
  );
};

// ============================================
// MAIN
// ============================================
const Berita = () => {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white">
      <FeaturedNews />
      <NewsGrid />
    </section>
  );
};

export default Berita;