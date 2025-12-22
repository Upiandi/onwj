import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import platformImage from '../assets/contoh1.png';
import programImage from '../assets/rectangle.png';
import carouselImg1 from '../assets/contoh2.png';
import carouselImg2 from '../assets/contoh3.png';
import carouselImg3 from '../assets/contoh4.png';
import logo from '../assets/logo.webp';
import { FaHome, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import testimonialApi from '../services/testimonialService';
import { dummyStatistik, dummyUnggulanPrograms, dummyBeritaList, dummyTestimonialsList } from '../utils/dummyData';

const TJSLHero = () => (
  <PageHero
    title="Tanggung Jawab Sosial & Lingkungan"
    description="Komitmen PT Migas Hulu Jabar ONWJ untuk tumbuh bersama masyarakat dan menjaga kelestarian lingkungan demi masa depan yang berkelanjutan."
    backgroundImage={platformImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'TJSL' },
    ]}
  />
);

const TJSLProfile = ({ quickFacts }) => (
  <div className="container mx-auto px-8 lg:px-16 py-16 bg-white">
    <div className="max-w-4xl mx-auto text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">Fokus Utama TJSL Kami</h2>
      <p className="text-gray-600 leading-relaxed">
        Kami percaya bahwa kesuksesan bisnis harus sejalan dengan kesejahteraan masyarakat dan kelestarian lingkungan untuk menciptakan dampak positif yang berkelanjutan.
      </p>
    </div>

    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {quickFacts.slice(0, 3).map((fact, index) => (
          <div key={index} className={`${fact.bgColor} p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-white shadow-md rounded-lg mb-3">
                {fact.icon}
              </div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">{fact.title}</h4>
              {fact.subtitle && (
                <p className="text-xs text-gray-600 mb-2">{fact.subtitle}</p>
              )}
              <p className="text-3xl font-extrabold text-gray-900">{fact.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {quickFacts.slice(3, 5).map((fact, index) => (
          <div key={index} className={`${fact.bgColor} p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-white shadow-md rounded-lg mb-3">
                {fact.icon}
              </div>
              <h4 className="font-semibold text-gray-800 text-sm mb-1">{fact. title}</h4>
              {fact.subtitle && (
                <p className="text-xs text-gray-600 mb-2">{fact.subtitle}</p>
              )}
              <p className="text-3xl font-extrabold text-gray-900">{fact.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProgramUnggulan = ({ slides }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  
  useEffect(() => { 
    if (slides.length === 0) return;
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, 7000); 
    return () => clearTimeout(timer); 
  }, [activeSlide, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative py-20 overflow-hidden bg-gray-50">
        <div className="container mx-auto px-8 lg:px-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">Program Unggulan Kami</h2>
          <p className="text-gray-600">Data program sedang dimuat...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 overflow-hidden bg-gray-50">
      <div className="container mx-auto px-8 lg:px-16">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Program Unggulan Kami</h2>
        <div className="relative h-[450px]">
          {slides. map((item, index) => (
            <div key={index} className={`absolute inset-0 w-full transition-opacity duration-1000 ease-in-out ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.content}</p>
                  <Link to={item.link} className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition">Pelajari Lebih Lanjut</Link>
                </div>
                <div className="relative h-full hidden lg:block">
                  <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-xl">
                    <img src={item.image} alt={item. title} className="w-full h-full object-cover"/>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-3 mt-8">
          {slides.map((_, index) => ( 
            <button 
              key={index} 
              onClick={() => setActiveSlide(index)} 
              className={`w-3 h-3 rounded-full transition-colors ${activeSlide === index ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'}`}
            /> 
          ))}
        </div>
      </div>
    </section>
  );
};

const NewsCard = ({ news, delay }) => {
  const cardRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add('opacity-100', 'translate-y-0');
    }, { threshold: 0.1 });
    if (cardRef.current) observer. observe(cardRef.current);
    return () => { if (cardRef.current) observer.unobserve(cardRef.current) };
  }, []);

  return (
    <div ref={cardRef} className="group cursor-pointer opacity-0 translate-y-10 transition-all duration-500 ease-out" style={{ transitionDelay: `${delay}ms` }}>
      <div className="rounded-2xl overflow-hidden mb-4 transform transition-all duration-300 group-hover:shadow-xl hover:-translate-y-1">
        <Link to={`/artikel/${news.slug}`}>
          <div className="relative aspect-[5/3] overflow-hidden">
            <img src={news.image} alt={news.title} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
          </div>
        </Link>
      </div>
      <div className="space-y-2 px-1">
        <div className="flex items-center gap-3">
          <span className="text-sm text-blue-600 font-medium">{news.category}</span>
          <span className="text-sm text-gray-400">{news.date}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link to={`/artikel/${news.slug}`}>{news.title}</Link>
        </h3>
      </div>
    </div>
  );
};

const TJSLBeritaSection = ({ featuredNews, latestNews }) => (
  <section className="bg-gray-100 py-24">
    <div className="container mx-auto px-8 lg:px-16">
      {featuredNews && (
        <div className="mb-20">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <Link to={`/artikel/${featuredNews.slug}`}>
                  <div className="relative aspect-[4/3]">
                    <img src={featuredNews.image} alt="Featured News" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"/>
                  </div>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 space-y-6 px-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9. 5a2 2 0 00-2-2h-2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Featured Story</p>
                  <p className="text-blue-600 font-medium">{featuredNews.date}</p>
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                <Link to={`/artikel/${featuredNews.slug}`} className="hover:text-blue-700 transition-colors">{featuredNews.title}</Link>
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">{featuredNews.description}</p>
              <Link to={`/artikel/${featuredNews.slug}`} className="group inline-flex items-center gap-3 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                <span>Baca Selengkapnya</span>
                <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h4 className="text-blue-600 font-medium mb-1 text-sm uppercase tracking-wider">Update Terkini</h4>
          <h2 className="text-3xl font-bold text-gray-900">Berita Terbaru</h2>
        </div>
        <Link to="/berita-tjsl" className="group inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors text-sm">
          <span>Lihat Semua</span>
          <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
          </svg>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {latestNews.length > 0 ? (
          latestNews.map((item, index) => (<NewsCard key={item.id} news={item} delay={index * 100} />))
        ) : (
          <div className="col-span-4 text-center py-12 text-gray-500">
            Belum ada berita terbaru
          </div>
        )}
      </div>
    </div>
  </section>
);

const TJSLVoicesSection = ({ testimonials }) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrev = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  if (testimonials.length === 0) {
    return (
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16">
        <div className="container mx-auto px-8 lg:px-16 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Voices From The Community</h2>
          <p className="text-blue-100">Testimoni sedang dimuat...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-16 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-8 lg:px-16 relative z-10">
        <h2 className="text-3xl font-bold text-center mb-3 text-white">
          Voices From The Community
        </h2>
        <p className="text-center text-blue-100 mb-12 max-w-2xl mx-auto text-sm">
          Dengarkan langsung testimoni dari masyarakat yang merasakan dampak positif program TJSL kami
        </p>

        <div className="max-w-3xl mx-auto relative">
          <div className="relative h-[280px] md:h-[240px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === activeTestimonial
                    ? 'opacity-100 translate-x-0 scale-100'
                    : index < activeTestimonial
                    ? 'opacity-0 -translate-x-full scale-95'
                    : 'opacity-0 translate-x-full scale-95'
                }`}
              >
                <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 h-full flex flex-col justify-between">
                  <div className="mb-4">
                    <svg className="w-10 h-10 text-blue-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432. 917-3.995 3.638-3.995 5.849h4v10h-9. 983zm-14.017 0v-7. 391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433. 917-3.996 3. 638-3.996 5. 849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <blockquote className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 flex-grow">
                    "{testimonial.testimonial}"
                  </blockquote>
                  <div className="flex items-center gap-3">
                    {testimonial.full_avatar_url ?  (
                      <img 
                        src={testimonial. full_avatar_url} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full border-4 border-blue-100 shadow-md object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling. style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ display: testimonial.full_avatar_url ?  'none' : 'flex' }}
                    >
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <cite className="font-bold text-gray-900 text-base not-italic block">
                        {testimonial. name}
                      </cite>
                      <p className="text-blue-600 text-xs font-medium">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-10 bg-white text-blue-600 p-3 rounded-full shadow-xl hover:bg-blue-50 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Previous testimonial"
          >
            <FaChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-10 bg-white text-blue-600 p-3 rounded-full shadow-xl hover:bg-blue-50 transition-all hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
            aria-label="Next testimonial"
          >
            <FaChevronRight className="w-4 h-4" />
          </button>

          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activeTestimonial === index
                    ? 'bg-white w-6'
                    : 'bg-blue-300 hover:bg-blue-200'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-blue-100 text-xs uppercase tracking-wider">
            Testimonial {activeTestimonial + 1} dari {testimonials.length}
          </p>
        </div>
      </div>
    </section>
  );
};

const TJSLPage = () => {
  const [quickFacts, setQuickFacts] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // ✅ Use services and dummy data (frontend-only)
        const testimonialsRes = await testimonialApi.getFeatured(4);

        // Set statistics (use dummy data directly)
        setQuickFacts(transformStatistik(dummyStatistik));

        // Set testimonials
        if (testimonialsRes.success) {
          setTestimonials(testimonialsRes.data);
        } else {
          setTestimonials(dummyTestimonialsList || []);
        }

        // Use dummy data for programs & news
        setPrograms(dummyUnggulanPrograms);
        setNewsItems(dummyBeritaList.slice(0, 5));

      } catch (error) {
        console.error('Error fetching TJSL data:', error);
        // Fallback to all dummy data
        setQuickFacts(transformStatistik(dummyStatistik));
        setPrograms(dummyUnggulanPrograms);
        setNewsItems(dummyBeritaList.slice(0, 5));
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const transformStatistik = (data) => {
    const iconMap = {
      // ✅ FIXED: Remove all spaces in SVG path d attribute
      penerimaan_manfaat: (
        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4. 354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      infrastruktur: (
        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      ebtke: (
        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      paket_pendidikan: (
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18. 477 18.246 18 16.5 18c-1.747 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      kelompok_binaan: (
        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5. 356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-. 656.126-1.283. 356-1.857m0 0a5.002 5. 002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    };

    const bgColorMap = {
      penerimaan_manfaat: 'bg-orange-50',
      infrastruktur: 'bg-blue-50',
      ebtke: 'bg-green-50',
      paket_pendidikan: 'bg-purple-50',
      kelompok_binaan: 'bg-orange-50',
    };

    return Object.entries(data).map(([key, item]) => ({
      title: item.label,
      subtitle: item.unit || '',
      value: `${item.value. toLocaleString('id-ID')}+`,
      bgColor: bgColorMap[key] || 'bg-gray-50',
      icon: iconMap[key] || null,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Memuat data TJSL...</p>
        </div>
      </div>
    );
  }

  const featuredNews = newsItems.length > 0 ? newsItems[0] : null;
  const latestNews = newsItems.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <TJSLHero />
      <TJSLProfile quickFacts={quickFacts} />
      <ProgramUnggulan slides={programs} />
      <TJSLBeritaSection featuredNews={featuredNews} latestNews={latestNews} />
      <TJSLVoicesSection testimonials={testimonials} />
    </div>
  );
};

export default TJSLPage;