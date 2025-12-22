import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bannerImage from '../assets/hero-bg.png';
import programImage from '../assets/rectangle.png';
import logo from '../assets/logo.webp';
import { FaRegCalendarAlt, FaChartBar, FaUsers, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import programService from '../services/programService';
import testimonialApi from '../services/testimonialService';


// ✅ Avatar Component with Fallback
const Avatar = ({ name, imageUrl, size = 48 }) => {
  const [imageError, setImageError] = useState(false);
  
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getColor = (name) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = name ? name. charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  if (imageUrl && ! imageError) {
    return (
      <img 
        src={imageUrl}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: `${size}px`, height: `${size}px` }}
        onError={() => setImageError(true)}
      />
    );
  }

  return (
    <div 
      className={`rounded-full ${getColor(name)} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size / 2.5}px` }}
    >
      {getInitials(name)}
    </div>
  );
};

const HorizontalProgramCard = ({ program }) => (
  <article className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row">
    <div className="md:w-2/5 h-48 md:h-auto">
      <Link to={`/artikel/${program.slug}`}>
        <img 
          src={program.image || programImage} 
          alt={program.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          loading="lazy"
          onError={(e) => {
            e.target.src = programImage;
          }}
        />
      </Link>
    </div>
    <div className="md:w-3/5 p-6 flex flex-col justify-between">
      <div>
        <p className="text-sm mb-2">
          <span className="font-semibold text-blue-600">{program.category}</span>
          <time dateTime={program.date} className="text-gray-400 ml-3">{program.date}</time>
        </p>
        <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
          <Link to={`/artikel/${program.slug}`} className="hover:text-blue-600 transition-colors">
            {program.title}
          </Link>
        </h2>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
      </div>
      <Link 
        to={`/artikel/${program.slug}`} 
        className="font-semibold text-blue-600 flex items-center group self-start mt-auto" 
        aria-label={`Read more about ${program.title}`}
      >
        Read More <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  </article>
);

const SidebarCard = ({ title, children, ariaId }) => (
  <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100" aria-labelledby={ariaId}>
    {title && <h3 id={ariaId} className="font-bold text-xl mb-6">{title}</h3>}
    {children}
  </section>
);

const RecentProgramItem = ({ program }) => (
  <div className="flex items-start space-x-4">
    <img 
      src={program.image || programImage} 
      alt={program.title} 
      className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
      loading="lazy"
      onError={(e) => {
        e.target.src = programImage;
      }}
    />
    <div className="flex-1 min-w-0">
      <Link 
        to={`/artikel/${program.slug}`} 
        className="font-semibold text-sm leading-tight text-gray-800 hover:text-blue-600 transition-colors block" 
        title={program.title}
      >
        {program.title}
      </Link>
      <p className="text-xs text-gray-400 mt-1">
        <time dateTime={program.date}>{program.date}</time>
      </p>
    </div>
  </div>
);

const QuickStats = ({ stats }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="bg-red-100 p-2 rounded-md">
        <FaChartBar className="w-6 h-6 text-red-600"/>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{stats.totalPrograms}+</p>
        <p className="text-sm text-gray-500">Program Aktif</p>
      </div>
    </div>
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="bg-blue-100 p-2 rounded-md">
        <FaUsers className="w-6 h-6 text-blue-600"/>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">10,000+</p>
        <p className="text-sm text-gray-500">Penerima Manfaat</p>
      </div>
    </div>
  </div>
);

const EventItem = ({ event }) => (
  <li className="flex items-start space-x-4">
    <strong className="text-blue-600 text-3xl font-black flex-shrink-0 w-12 text-center">
      {event. day}
      <span className="block text-sm font-normal text-gray-500">{event.month}</span>
    </strong>
    <div className="flex-1 min-w-0">
      <h4 className="font-bold text-gray-800 mb-1">{event.title}</h4>
      <p className="text-xs text-gray-400">{event.description}</p>
    </div>
  </li>
);

const SearchInput = ({ value, onChange, onSearch }) => (
  <div className="relative">
    <input 
      type="search" 
      placeholder="Search Programs..." 
      className="w-full pl-4 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      aria-label="Search programs"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyPress={(e) => {
        if (e.key === 'Enter') {
          onSearch();
        }
      }}
    />
    <button
      onClick={onSearch}
      className="absolute right-4 top-1/2 -translate-y-1/2"
      aria-label="Search"
    >
      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </button>
  </div>
);

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center space-x-2 pt-8" aria-label="Pagination">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
          aria-label="Previous page"
        >
          ‹
        </button>
      )}
      
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md font-bold transition-colors ${
            currentPage === page
              ? 'bg-gray-200 text-gray-800'
              : 'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < lastPage && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
          aria-label="Next page"
        >
          ›
        </button>
      )}
    </nav>
  );
};

// ✅ Testimonial Card with Avatar Component
const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300">
    {/* Rating Stars */}
    <div className="flex items-center gap-1 mb-4">
      {[...Array(5)].map((_, index) => (
        <FaStar 
          key={index} 
          className={index < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300'} 
        />
      ))}
    </div>

    {/* Testimonial Text */}
    <blockquote className="text-gray-600 italic mb-6 line-clamp-4">
      "{testimonial.testimonial_text}"
    </blockquote>

    {/* Author Info with Avatar Component */}
    <div className="flex items-center gap-4">
      <Avatar 
        name={testimonial.name} 
        imageUrl={testimonial.avatar_url} 
        size={48} 
      />
      <div>
        <cite className="font-bold text-gray-800 not-italic block">
          {testimonial.name}
        </cite>
        {testimonial.location && (
          <p className="text-sm text-gray-500">{testimonial.location}</p>
        )}
        {testimonial.program && (
          <p className="text-xs text-blue-600 mt-1">Program: {testimonial.program}</p>
        )}
      </div>
    </div>

    {/* Featured Badge */}
    {testimonial.is_featured && (
      <div className="mt-4 pt-4 border-t border-gray-100">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
          <FaStar className="w-3 h-3" />
          Featured Testimonial
        </span>
      </div>
    )}
  </div>
);

const AllProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [recentPrograms, setRecentPrograms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [statistics, setStatistics] = useState({ totalPrograms: 0, activePrograms: 0 });
  const [loading, setLoading] = useState(true);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 6,
    total: 0
  });

  const events = [
    { id: 1, day: '15', month: 'Dec', title: 'Evaluasi Program Tahunan 2025', description: 'December 15, 2025' },
    { id: 2, day: '05', month: 'Jan', title: 'Peluncuran Program Energi 2026', description: 'January 05, 2026' },
  ];

  useEffect(() => {
    fetchPrograms();
    fetchRecentPrograms();
    fetchStatistics();
    fetchTestimonials();
  }, [currentPage, searchQuery]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: 6,
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await programService. getAllPrograms(params);
      
      if (response.success) {
        setPrograms(response.data.data || []);
        setPagination({
          current_page: response. data.current_page,
          last_page: response.data. last_page,
          per_page: response.data.per_page,
          total: response. data.total
        });
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      toast.error('Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentPrograms = async () => {
    try {
      const response = await programService.getRecentPrograms(3);
      if (response.success) {
        setRecentPrograms(response. data || []);
      }
    } catch (error) {
      console.error('Error fetching recent programs:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await programService.getStatistics();
      if (response.success) {
        setStatistics({
          totalPrograms: response. data.total_programs || 0,
          activePrograms: response.data.active_programs || 0
        });
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setTestimonialsLoading(true);
      const response = await testimonialService.getFeatured();
      
      if (response.data.success) {
        const featuredTestimonials = response. data.data. slice(0, 3);
        setTestimonials(featuredTestimonials);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setTestimonials([
        { 
          id: 1, 
          name: 'Budi Santoso', 
          testimonial_text: 'Programnya sangat membantu desa kami, terima kasih! ',
          rating: 5,
          location: 'Jakarta'
        },
        { 
          id: 2, 
          name: 'Siti Aminah', 
          testimonial_text: 'Dukungan pendidikan ini sangat berarti bagi anak-anak kami.',
          rating: 5,
          location: 'Bandung'
        },
        { 
          id:  3, 
          name:  'Joko Susilo', 
          testimonial_text: 'Semoga program seperti ini bisa terus berlanjut dan berkembang.',
          rating: 5,
          location: 'Surabaya'
        },
      ]);
    } finally {
      setTestimonialsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPrograms();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Banner Section */}
      <section className="relative h-72 md:h-80 w-full">
        <img src={bannerImage} alt="Banner Program Berkelanjutan" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-8 lg:px-16 h-full flex items-center justify-start">
          <h1 className="text-white text-5xl font-bold relative inline-block pb-4">
            Program Berkelanjutan
            <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></span>
          </h1>
        </div>
        <img src={logo} alt="Logo" className="h-10 absolute top-8 right-8 lg:right-16" />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Programs List */}
          <main className="lg:col-span-2 space-y-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading programs...</p>
              </div>
            ) : programs.length > 0 ? (
              <>
                {programs.map((prog) => (
                  <HorizontalProgramCard key={prog.id} program={prog} />
                ))}
                
                {pagination.last_page > 1 && (
                  <Pagination
                    currentPage={pagination.current_page}
                    lastPage={pagination.last_page}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No programs found. </p>
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      fetchPrograms();
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Sidebar */}
          <aside className="space-y-8">
            <SidebarCard ariaId="search-programs">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
              />
            </SidebarCard>

            {recentPrograms.length > 0 && (
              <SidebarCard title="Recently Added" ariaId="recent-programs">
                <div className="space-y-5">
                  {recentPrograms.map((prog) => (
                    <RecentProgramItem key={prog.id} program={prog} />
                  ))}
                </div>
              </SidebarCard>
            )}

            <SidebarCard ariaId="quick-stats-programs">
              <QuickStats stats={statistics} />
            </SidebarCard>

            <SidebarCard title="Upcoming Events" ariaId="program-events">
              <ul className="space-y-6" role="list">
                {events.map((event) => (
                  <EventItem key={event.id} event={event} />
                ))}
              </ul>
            </SidebarCard>
          </aside>
        </div>
      </div>

      {/* Testimonials Section */}
      <section className="bg-white py-20" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-gray-900 mb-3">
              Voices From The Community
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Testimoni dari masyarakat yang merasakan manfaat langsung dari program-program kami
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : testimonials.length > 0 ?  (
            <div className="grid grid-cols-1 md: grid-cols-2 lg: grid-cols-3 gap-8">
              {testimonials. map((testimonial) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Belum ada testimoni tersedia.</p>
            </div>
          )}

          {testimonials.length > 0 && (
            <div className="text-center mt-12">
              <Link 
                to="/testimonials" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                View All Testimonials
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AllProgramsPage;