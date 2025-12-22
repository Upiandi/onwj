import React, { useState, useEffect } from 'react';
import managementService from '../../services/managementService';
import Cosmas from '../../assets/Manajemen/Cosmas.jpeg';

const Komisaris = () => {
  const [commissioners, setCommissioners] = useState([]);
  const [selectedCommissioner, setSelectedCommissioner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissioners();
  }, []);

  const fetchCommissioners = async () => {
    try {
      setLoading(true);
      const response = await managementService.getByType('commissioner');
      if (response.success) {
        setCommissioners(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching commissioners:', error);
      setCommissioners([]);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (commissioner) => setSelectedCommissioner(commissioner);
  const closeModal = () => setSelectedCommissioner(null);

  return (
    <section className="py-12 bg-white">
      <div className="section-container">
        
        {/* Compact Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl lg:text-3xl font-heading font-bold text-secondary-900 mb-2">
            Dewan Komisaris
          </h2>
          <div className="w-12 h-0.5 bg-primary-600"></div>
        </div>
        
        {/* Compact Card Grid */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          {loading ? (
            <div className="flex items-center justify-center h-64 col-span-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            commissioners.map((commissioner) => (
              <div 
                key={commissioner.id} 
                onClick={() => openModal(commissioner)}
                className="group bg-white border border-secondary-200 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary-600 hover:shadow-md"
              >
                {/* Compact Image */}
                <div className="aspect-[4/4.5] overflow-hidden bg-secondary-50">
                  {commissioner.image_url ? (
                    <img
                      src={commissioner.image_url}
                      alt={commissioner.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white text-6xl font-bold">{commissioner.name?.charAt(0)}</span>
                    </div>
                  )}
                </div>
                
                {/* Compact Info */}
                <div className="p-4 border-t border-secondary-100">
                  <p className="text-xs font-heading font-semibold text-primary-600 uppercase tracking-wide mb-1">
                    {commissioner.position}
                  </p>
                  <h3 className="text-base font-heading font-bold text-secondary-900 leading-snug">
                    {commissioner.name}
                  </h3>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Compact Modal */}
      {selectedCommissioner && (
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
                {selectedCommissioner.image_url ? (
                  <img
                    src={selectedCommissioner.image_url}
                    alt={selectedCommissioner.name}
                    className="w-full h-48 sm:h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-48 sm:h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white text-8xl font-bold">{selectedCommissioner.name?.charAt(0)}</span>
                  </div>
                )}
              </div>
              <div className="p-6 sm:w-3/5">
                <p className="text-xs font-heading font-semibold text-primary-600 uppercase tracking-wide mb-1.5">
                  {selectedCommissioner.position}
                </p>
                <h3 className="text-xl font-heading font-bold text-secondary-900 mb-4">
                  {selectedCommissioner.name}
                </h3>
                <p className="text-sm text-secondary-600 leading-relaxed">
                  {selectedCommissioner.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Komisaris;