import React from 'react';
import companyImage from '../../assets/company/Peta.png';
import { FaBuilding, FaUsers, FaMapMarkerAlt, FaBolt, FaArrowRight } from 'react-icons/fa';

/**
 * PProfile Component - Balanced Visual Hierarchy
 * 
 * Konsep: "Natural Reading Flow"
 * - Top-down information flow
 * - Balanced 3-column layout
 * - Clear visual grouping
 */
const PProfile = () => {
  const keyStats = [
    { icon: FaBuilding, value: "2017", label: "Didirikan" },
    { icon: FaMapMarkerAlt, value: "1", label: "Provinsi" },
    { icon: FaMapMarkerAlt, value: "5", label: "Kota" },
  ];

  return (
    <section className="relative bg-white py-grid-10" aria-labelledby="profile-title">
      
      <div className="section-container">
        
        {/* Header Section - Centered */}
        <div className="max-w-4xl mx-auto text-center mb-grid-8">
          <span className="inline-block px-grid-3 py-grid-1 bg-secondary-100 text-secondary-700 rounded text-body-xs font-semibold mb-grid-2 uppercase tracking-wide">
            Siapa Kami
          </span>
          
          <h2 id="profile-title" className="text-display-md lg:text-display-lg font-heading font-bold text-secondary-900 mb-grid-3">
            Migas Hulu Jabar ONWJ
          </h2>
          
          <p className="text-body-md lg:text-body-lg font-semibold text-primary-600 mb-grid-3">
            Pengelola Partisipasi Indonesia 10% Daerah
          </p>
        </div>

        {/* Main Content - 3 Column Balanced Layout */}
        <div className="max-w-6xl mx-auto">
          
          {/* Stats Bar - Horizontal */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-grid-4 mb-grid-6">
            {keyStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-white border border-secondary-200 rounded p-grid-4 text-center hover:border-primary-600 hover:shadow-sm transition-all"
                >
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-secondary-100 text-secondary-700 mb-grid-2">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <p className="text-display-sm font-heading font-bold text-secondary-900 mb-grid-0.5">
                    {stat.value}
                  </p>
                  <p className="text-body-xs text-secondary-600">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Content Grid - Image + Info Side by Side */}
          <div className="grid lg:grid-cols-3 gap-grid-5">
            
            {/* Image - Takes 2 columns */}
            <div className="lg:col-span-2">
              <div className="relative h-full rounded overflow-hidden border border-secondary-200">
                <img 
                  src={companyImage}
                  alt="Operasional Migas Hulu Jabar ONWJ"
                  className="w-full h-full object-cover min-h-[300px]"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-secondary-900/90 to-transparent p-grid-4">
                  <p className="text-body-sm text-white font-medium">
                    Lapangan Migas Hulu Jabar ONWJ
                  </p>
                </div>
              </div>
            </div>

            {/* Info Column - Takes 1 column */}
            <div className="space-y-grid-4">
              
              {/* Fokus Utama Card */}
              <div className="bg-secondary-50 border border-secondary-200 rounded p-grid-5">
                <h3 className="font-heading font-bold text-body-md text-secondary-900 mb-grid-3">
                  Fokus Utama
                </h3>
                <ul className="space-y-grid-2 text-body-sm text-secondary-700">
                  <li className="flex items-start gap-grid-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5"></span>
                    <span>Pengelolaan Partisipasi Indonesia 10%</span>
                  </li>
                  <li className="flex items-start gap-grid-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5"></span>
                    <span>Optimalisasi nilai aset energi daerah</span>
                  </li>
                  <li className="flex items-start gap-grid-2">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-600 mt-1.5"></span>
                    <span>Kontribusi pembangunan berkelanjutan</span>
                  </li>
                </ul>
              </div>

              {/* Perjalanan Card */}
              <div className="bg-white border border-secondary-200 rounded p-grid-5">
                <h3 className="font-heading font-bold text-body-md text-secondary-900 mb-grid-3">
                  Perjalanan Kami
                </h3>
                
                <div className="flex items-center gap-grid-3 mb-grid-3">
                  <div className="flex-1">
                    <p className="text-body-sm text-secondary-700 leading-relaxed">
                      Sejak 2017, kami telah berkembang menjadi perusahaan terdepan dalam pengelolaan aset energi
                    </p>
                  </div>
                </div>

                <a 
                  href="#sejarah" 
                  className="inline-flex items-center gap-grid-2 text-primary-600 hover:text-primary-700 font-semibold text-body-sm group transition-colors"
                >
                  Lihat Perjalanan Lengkap
                  <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default PProfile;