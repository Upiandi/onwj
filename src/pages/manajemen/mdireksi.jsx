import React, { useState, useEffect } from 'react';
import managementService from '../../services/managementService';

const Direksi = () => {
  const [directors, setDirectors] = useState([]);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const response = await managementService.getByType('director');
      if (response.success) {
        setDirectors(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching directors:', error);
      setDirectors([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (director) => setSelectedDirector(director);
  const closeModal = () => setSelectedDirector(null);

  if (loading) {
    return (
      <section className="py-12 bg-secondary-50">
        <div className="section-container">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-secondary-50">
      <div className="section-container">
        
        {/* Compact Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-heading font-bold text-secondary-900 mb-2">
            Dewan Direksi
          </h2>
          <div className="w-12 h-0.5 bg-primary-600"></div>
        </div>
        
        {/* Compact Card Grid */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          {directors.map((director) => (
            <div 
              key={director.id} 
              onClick={() => openModal(director)}
              className="group bg-white border border-secondary-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary-600 hover:shadow-md"
            >
              {/* Compact Image */}
              <div className="aspect-[4/4.5] overflow-hidden bg-secondary-50">
                <img
                  src={director.image_url || 'https://via.placeholder.com/300x350?text=No+Image'}
                  alt={director.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              
              {/* Compact Info */}
              <div className="p-4 border-t border-secondary-100">
                <p className="text-xs font-heading font-semibold text-primary-600 uppercase tracking-wide mb-1">
                  {director.position}
                </p>
                <h3 className="text-base font-heading font-bold text-secondary-900 leading-snug">
                  {director.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compact Modal */}
      {selectedDirector && (
        <div 
          className="fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto relative shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Compact Close Button */}
            <button 
              onClick={closeModal}
              className="absolute top-3 right-3 w-8 h-8 bg-secondary-100 hover:bg-secondary-200 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Close"
            >
              <svg className="w-4 h-4 text-secondary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Compact Content */}
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-2/5">
                <img
                  src={selectedDirector.image_url || 'https://via.placeholder.com/300x350?text=No+Image'}
                  alt={selectedDirector.name}
                  className="w-full h-48 sm:h-full object-cover"
                />
              </div>
              <div className="p-6 sm:w-3/5">
                <p className="text-xs font-heading font-semibold text-primary-600 uppercase tracking-wide mb-1.5">
                  {selectedDirector.position}
                </p>
                <h3 className="text-xl font-heading font-bold text-secondary-900 mb-4">
                  {selectedDirector.name}
                </h3>
                <p className="text-sm text-secondary-600 leading-relaxed">
                  {selectedDirector.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Direksi;