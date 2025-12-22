import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  ZoomIn,
  Grid3x3,
  List,
  Filter
} from 'lucide-react';
import './GalleryPage.css';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);

  // Sample gallery data - Replace with your actual data source
  const galleryImages = [
    {
      id: 1,
      src: '/images/gallery/event1.jpg',
      title: 'Annual Community Gathering 2024',
      category: 'events',
      date: '2024-03-15',
      description: 'Our annual community gathering brought together members from across the region.',
      tags: ['community', 'gathering', 'annual']
    },
    {
      id: 2,
      src: '/images/gallery/education1.jpg',
      title: 'Youth Education Workshop',
      category: 'education',
      date: '2024-02-20',
      description: 'Interactive workshop focusing on skill development for young members.',
      tags: ['youth', 'education', 'workshop']
    },
    {
      id: 3,
      src: '/images/gallery/cultural1.jpg',
      title: 'Cultural Heritage Exhibition',
      category: 'cultural',
      date: '2024-01-10',
      description: 'Celebrating our rich cultural heritage through art and tradition.',
      tags: ['culture', 'heritage', 'exhibition']
    },
    {
      id: 4,
      src: '/images/gallery/charity1.jpg',
      title: 'Community Charity Drive',
      category: 'charity',
      date: '2024-04-05',
      description: 'Supporting local families in need through our charity initiative.',
      tags: ['charity', 'community', 'support']
    },
    {
      id: 5,
      src: '/images/gallery/event2.jpg',
      title: 'Iftar Gathering',
      category: 'events',
      date: '2024-03-28',
      description: 'Breaking fast together during the blessed month of Ramadan.',
      tags: ['ramadan', 'iftar', 'community']
    },
    {
      id: 6,
      src: '/images/gallery/education2.jpg',
      title: 'Islamic Studies Circle',
      category: 'education',
      date: '2024-02-15',
      description: 'Weekly study circle for deepening Islamic knowledge.',
      tags: ['education', 'islamic studies', 'learning']
    },
    {
      id: 7,
      src: '/images/gallery/cultural2.jpg',
      title: 'Traditional Arts Workshop',
      category: 'cultural',
      date: '2024-01-25',
      description: 'Learning traditional calligraphy and arts from master artisans.',
      tags: ['arts', 'calligraphy', 'workshop']
    },
    {
      id: 8,
      src: '/images/gallery/charity2.jpg',
      title: 'Food Bank Initiative',
      category: 'charity',
      date: '2024-04-12',
      description: 'Distributing essential food items to families in need.',
      tags: ['charity', 'food bank', 'community service']
    },
    {
      id: 9,
      src: '/images/gallery/event3.jpg',
      title: 'Eid Celebration',
      category: 'events',
      date: '2024-04-10',
      description: 'Celebrating Eid with prayer, food, and community fellowship.',
      tags: ['eid', 'celebration', 'festival']
    },
    {
      id: 10,
      src: '/images/gallery/education3.jpg',
      title: 'Youth Leadership Program',
      category: 'education',
      date: '2024-03-05',
      description: 'Empowering the next generation of community leaders.',
      tags: ['youth', 'leadership', 'development']
    },
    {
      id: 11,
      src: '/images/gallery/cultural3.jpg',
      title: 'Poetry Evening',
      category: 'cultural',
      date: '2024-02-28',
      description: 'An evening of inspirational poetry and spoken word.',
      tags: ['poetry', 'culture', 'arts']
    },
    {
      id: 12,
      src: '/images/gallery/charity3.jpg',
      title: 'Winter Clothing Drive',
      category: 'charity',
      date: '2024-01-15',
      description: 'Providing warm clothing to those in need during winter.',
      tags: ['charity', 'winter', 'clothing drive']
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: '🖼️' },
    { id: 'events', name: 'Events', icon: '🎉' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'cultural', name: 'Cultural', icon: '🎨' },
    { id: 'charity', name: 'Charity', icon: '❤️' }
  ];

  // Filter images based on category and search query
  const filteredImages = galleryImages.filter(image => {
    const matchesCategory = selectedCategory === 'all' || image.category === selectedCategory;
    const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Lazy loading effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      { rootMargin: '50px' }
    );

    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => observer.observe(img));

    return () => observer.disconnect();
  }, [filteredImages]);

  // Handle lightbox navigation
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  };

  const navigateImage = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentImageIndex + 1) % filteredImages.length
      : (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
    
    setCurrentImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateImage('next');
      if (e.key === 'ArrowLeft') navigateImage('prev');
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentImageIndex]);

  const handleDownload = (imageUrl, title) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = title.replace(/\s+/g, '-').toLowerCase() + '.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Photo Gallery
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Capturing moments from our community events, programs, and activities
          </motion.p>
        </div>
      </section>

      {/* Filters and Search Section */}
      <div className="gallery-controls">
        <div className="container">
          {/* Search Bar */}
          <div className="search-bar">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search photos by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filters */}
          <div className="filters-section">
            <button 
              className="filter-toggle mobile-only"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={20} />
              Filters
            </button>

            <div className={`category-filters ${isFilterOpen ? 'open' : ''}`}>
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="category-icon">{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="view-toggle">
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid3x3 size={20} />
              </button>
              <button
                className={viewMode === 'masonry' ? 'active' : ''}
                onClick={() => setViewMode('masonry')}
                title="Masonry View"
              >
                <List size={20} />
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="results-info">
            <p>Showing {filteredImages.length} {filteredImages.length === 1 ? 'photo' : 'photos'}</p>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <section className="gallery-section">
        <div className="container">
          <AnimatePresence mode="wait">
            {filteredImages.length > 0 ? (
              <motion.div 
                className={`gallery-grid ${viewMode}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="gallery-item"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    layout
                    onClick={() => openLightbox(image, index)}
                  >
                    <div className="image-wrapper">
                      <img
                        data-src={image.src}
                        alt={image.title}
                        loading="lazy"
                      />
                      <div className="image-overlay">
                        <div className="overlay-content">
                          <ZoomIn className="zoom-icon" />
                          <h3>{image.title}</h3>
                          <p className="image-date">{new Date(image.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>No photos found matching your criteria.</p>
                <button 
                  className="reset-btn"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="lightbox-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="lightbox-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button className="lightbox-close" onClick={closeLightbox}>
                <X size={24} />
              </button>

              {/* Navigation Buttons */}
              <button 
                className="lightbox-nav prev" 
                onClick={() => navigateImage('prev')}
                disabled={filteredImages.length <= 1}
              >
                <ChevronLeft size={32} />
              </button>

              <button 
                className="lightbox-nav next" 
                onClick={() => navigateImage('next')}
                disabled={filteredImages.length <= 1}
              >
                <ChevronRight size={32} />
              </button>

              {/* Image */}
              <div className="lightbox-image-wrapper">
                <img src={selectedImage.src} alt={selectedImage.title} />
              </div>

              {/* Image Info */}
              <div className="lightbox-info">
                <div className="info-content">
                  <h2>{selectedImage.title}</h2>
                  <p className="lightbox-date">
                    {new Date(selectedImage.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="lightbox-description">{selectedImage.description}</p>
                  <div className="lightbox-tags">
                    {selectedImage.tags.map(tag => (
                      <span key={tag} className="tag">#{tag}</span>
                    ))}
                  </div>
                </div>
                <button 
                  className="download-btn"
                  onClick={() => handleDownload(selectedImage.src, selectedImage.title)}
                  title="Download Image"
                >
                  <Download size={20} />
                  Download
                </button>
              </div>

              {/* Image Counter */}
              <div className="lightbox-counter">
                {currentImageIndex + 1} / {filteredImages.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryPage;
