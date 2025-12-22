import React, { useState } from 'react';

/**
 * PVisiMisi Component - COMPLETE REDESIGN
 * 
 * Konsep: Card-based dengan fokus yang jelas
 * - Visi sebagai hero statement
 * - Misi dengan visual yang distinct
 * - Nilai sebagai supporting element
 */

const PVisiMisi = () => {
  const [activeValue, setActiveValue] = useState(0);

  const values = [
    { 
      name: "Integritas", 
      icon: "🛡️",
      desc: "Menjunjung tinggi kejujuran dan etika dalam setiap tindakan" 
    },
    { 
      name: "Profesionalisme", 
      icon: "⭐",
      desc: "Bekerja dengan standar tertinggi dan kompetensi terbaik" 
    },
    { 
      name: "Inovasi", 
      icon: "💡",
      desc: "Terus berinovasi untuk solusi yang lebih baik" 
    },
    { 
      name: "Kolaborasi", 
      icon: "🤝",
      desc: "Membangun kemitraan yang saling menguntungkan" 
    },
    { 
      name: "Berkelanjutan", 
      icon: "🌱",
      desc: "Bertanggung jawab terhadap lingkungan dan generasi mendatang" 
    },
  ];

  const missions = [
    {
      number: "01",
      title: "Optimalisasi Manfaat",
      content: "Mengoptimalkan manfaat PI 10% kepada masyarakat terutama pada area WK ONWJ dengan fokus pada pembangunan infrastruktur dan program pemberdayaan."
    },
    {
      number: "02", 
      title: "Pengelolaan Aktif",
      content: "Berperan aktif dalam pengelolaan WK ONWJ sebagai pemegang hak PI daerah dengan mengedepankan transparansi dan akuntabilitas."
    },
    {
      number: "03",
      title: "Kontribusi Optimal",
      content: "Memberikan kontribusi optimal kepada Pemegang Saham melalui pengelolaan aset yang efisien dan peningkatan nilai tambah berkelanjutan."
    },
  ];

  return (
    <section className="py-grid-12 lg:py-grid-16" aria-labelledby="visimisi-title">
      <div className="section-container">
        
        {/* ===== VISI - Hero Statement ===== */}
        <div className="text-center mb-grid-16 lg:mb-grid-20">
          <span className="text-label-sm text-primary-600 uppercase tracking-wider">
            Visi Kami
          </span>
          
          <h2 
            id="visimisi-title"
            className="text-display-lg lg:text-display-xl xl:text-display-2xl 
                       font-bold text-secondary-900 mt-grid-4 mb-grid-6
                       max-w-4xl mx-auto leading-tight"
          >
            Menjadi Perusahaan{' '}
            <span className="text-primary-600">Terbaik</span>{' '}
            di Indonesia dalam Bidang Pengelolaan PI 10% Daerah
          </h2>
          
          <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full" />
        </div>

        {/* ===== MISI - 3 Column Cards ===== */}
        <div className="mb-grid-16 lg:mb-grid-20">
          <div className="text-center mb-grid-8">
            <h3 className="text-display-md font-bold text-secondary-900">
              Misi Kami
            </h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-grid-6">
            {missions.map((mission, index) => (
              <article 
                key={index}
                className="group relative bg-white rounded-2xl p-grid-6 lg:p-grid-8
                           border border-secondary-100
                           hover:border-primary-200 hover:shadow-lg
                           transition-all duration-base"
              >
                {/* Number Badge */}
                <div 
                  className="w-14 h-14 rounded-2xl bg-primary-50 
                             flex items-center justify-center mb-grid-5
                             group-hover:bg-primary-600 transition-colors duration-base"
                >
                  <span 
                    className="text-display-sm font-bold text-primary-600
                               group-hover:text-white transition-colors duration-base"
                  >
                    {mission.number}
                  </span>
                </div>
                
                <h4 className="text-display-xs font-bold text-secondary-900 mb-grid-3">
                  {mission.title}
                </h4>
                
                <p className="text-body-md text-secondary-600 leading-relaxed">
                  {mission.content}
                </p>
                
                {/* Decorative corner */}
                <div 
                  className="absolute top-0 right-0 w-20 h-20 
                             bg-gradient-to-br from-primary-50 to-transparent
                             rounded-tr-2xl rounded-bl-full opacity-0
                             group-hover:opacity-100 transition-opacity duration-base"
                  aria-hidden="true"
                />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PVisiMisi;