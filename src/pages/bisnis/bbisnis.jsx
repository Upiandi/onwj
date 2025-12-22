import React from 'react';
import ONWJ from '../../assets/bisnis/LOGO-HD.webp';
import { FaBuilding, FaHandshake, FaLandmark, FaArrowRight, FaChartLine, FaUsers } from 'react-icons/fa';

const Bbisnis = () => {
  // Combined Business Flow + Operational Pillars
  const businessOperations = {
    flow: [
      {
        name: 'PERTAMINA PHE ONWJ',
        logo: ONWJ,
        description: 'Operator Lapangan',
        role: 'Pengelola operasional harian lapangan migas',
        icon: FaBuilding
      },
      {
        name: 'MIGAS HULU JABAR ONWJ',
        logo: ONWJ,
        description: 'Pengelola Participating Interest',
        role: 'Manajemen aset strategis dan corporate governance',
        icon: FaHandshake
      }
    ],
    operations: [
      {
        title: 'Fungsi Korporasi',
        subtitle: 'Mengelola Participating Interest 10%',
        description: 'Pengelolaan participating interest untuk optimalisasi nilai aset energi',
        icon: FaHandshake
      },
      {
        title: 'Dividen & CSR',
        subtitle: 'Tanggung Jawab Sosial Perusahaan',
        description: 'Kontribusi berkelanjutan untuk masyarakat dan stakeholder regional',
        icon: FaLandmark
      }
    ]
  };

  const shareholders = [
    { name: 'MIGAS UTAMA JABAR', percentage: 62.13, rank: 1 },
    { name: 'JAKPRO', percentage: 20.29, rank: 2 },
    { name: 'BUMD PETROGAS', percentage: 8.24, rank: 3 },
    { name: 'PT SUBANG SEJAHTERA', percentage: 2.93, rank: 4 },
    { name: 'BWI', percentage: 4.71, rank: 5 },
    { name: 'BBWM', percentage: 1.70, rank: 6 }
  ];

  const stakeholderGroups = [
    {
      title: 'Pemerintah Provinsi Jawa Barat',
      count: 4,
      departments: [
        'Dinas Energi dan Sumber Daya Mineral',
        'Dinas Lingkungan Hidup Jawa Barat',
        'Dinas Penanaman Modal dan Perizinan Terpadu',
        'Dinas Satu Pintu Jawa Barat'
      ]
    },
    {
      title: 'Pemerintah Provinsi DKI Jakarta',
      count: 1,
      departments: ['Dinas terkait koordinasi regional']
    },
    {
      title: 'Pemerintah Kabupaten',
      count: 4,
      departments: ['Bekasi', 'Subang', 'Karawang', 'Indramayu']
    }
  ];

  return (
    <div className="relative bg-white">
      {/* Minimal Background Pattern */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h1v1H0z' fill='%23000'/%3E%3C/svg%3E")`,
             backgroundSize: '20px 20px'
           }}
      />

      <div className="section-container relative">
        
        {/* ===== INTRO ===== */}
        <section className="py-grid-10 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-grid-4 py-grid-2 bg-secondary-100 text-secondary-700 rounded text-body-sm font-semibold mb-grid-3">
              Alur Bisnis Kami
            </span>
            <h2 className="text-display-lg sm:text-display-xl font-heading font-bold text-secondary-900 mb-grid-3">
              Bagaimana Kami Beroperasi
            </h2>
            <p className="text-body-md text-secondary-600 leading-relaxed">
              Memahami struktur operasional dan kolaborasi strategis dalam pengelolaan aset energi untuk menciptakan nilai berkelanjutan
            </p>
          </div>
        </section>

        {/* ===== UNIFIED SECTION: Business Flow + Operations ===== */}
        <section className="py-grid-8">
          
          <div className="max-w-6xl mx-auto">
            
            {/* Business Flow */}
            <div className="relative mb-grid-10">
              
              {/* Connection Line */}
              <div className="hidden lg:block absolute top-[72px] left-0 right-0 z-0" aria-hidden="true">
                <div className="flex items-center justify-center px-24">
                  <div className="flex-1 h-px bg-secondary-200"></div>
                  <div className="px-4">
                    <FaArrowRight className="w-5 h-5 text-secondary-400" />
                  </div>
                  <div className="flex-1 h-px bg-secondary-200"></div>
                </div>
              </div>

              {/* Flow Cards */}
              <div className="relative z-10 grid lg:grid-cols-2 gap-grid-5 lg:gap-grid-8 mb-grid-8">
                {businessOperations.flow.map((item, index) => {
                  const IconComponent = item.icon;
                  
                  return (
                    <article 
                      key={index}
                      className="group relative bg-white border border-secondary-200 rounded p-grid-5 hover:border-primary-600 hover:shadow-sm transition-all duration-300"
                      tabIndex={0}
                    >
                      {/* Header Row */}
                      <div className="flex items-center gap-grid-3 mb-grid-4">
                        <span className="flex-shrink-0 w-7 h-7 rounded bg-secondary-900 text-white flex items-center justify-center font-bold text-body-sm">
                          {index + 1}
                        </span>
                        
                        <div className="flex-shrink-0 w-12 h-12 bg-secondary-50 rounded flex items-center justify-center p-1.5 border border-secondary-100">
                          <img 
                            src={item.logo} 
                            alt={item.name}
                            className="max-w-full max-h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                        
                        <div className="ml-auto flex-shrink-0 w-9 h-9 rounded bg-secondary-100 flex items-center justify-center text-secondary-700">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="font-heading font-bold text-body-lg text-secondary-900 mb-1.5 leading-tight">
                        {item.name}
                      </h3>
                      
                      <p className="text-body-xs font-medium text-secondary-600 mb-2">
                        {item.description}
                      </p>
                      
                      <p className="text-body-sm text-secondary-600 leading-relaxed">
                        {item.role}
                      </p>
                    </article>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-grid-4 my-grid-6">
                <div className="flex-1 h-px bg-secondary-200"></div>
                <span className="px-grid-4 py-grid-1 bg-secondary-100 text-secondary-700 rounded text-body-xs font-semibold">
                  Fokus Operasional
                </span>
                <div className="flex-1 h-px bg-secondary-200"></div>
              </div>

              {/* Operations Cards */}
              <div className="grid lg:grid-cols-2 gap-grid-5">
                {businessOperations.operations.map((point, index) => {
                  const IconComponent = point.icon;
                  return (
                    <article 
                      key={index}
                      className="group bg-secondary-50 border border-secondary-200 rounded p-grid-5 hover:bg-white hover:border-primary-600 hover:shadow-sm transition-all duration-300"
                      tabIndex={0}
                    >
                      <div className="flex items-center gap-grid-3 mb-grid-3">
                        <div className="flex-shrink-0 w-9 h-9 rounded bg-secondary-900 text-white flex items-center justify-center">
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-body-xs font-medium text-secondary-500">
                          Pilar {index + 1}
                        </span>
                      </div>
                      
                      <h4 className="font-heading font-bold text-body-lg text-secondary-900 mb-1.5">
                        {point.title}
                      </h4>
                      
                      <p className="text-body-sm font-semibold text-primary-600 mb-2">
                        {point.subtitle}
                      </p>

                      <p className="text-body-sm text-secondary-600 leading-relaxed">
                        {point.description}
                      </p>
                    </article>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ===== SHAREHOLDERS - Professional & Clean ===== */}
        <section className="py-grid-10 bg-secondary-50">
          
          <div className="text-center mb-grid-6">
            <span className="inline-block px-grid-4 py-grid-2 bg-white border border-secondary-200 text-secondary-700 rounded text-body-sm font-semibold mb-grid-2">
              Struktur Kepemilikan
            </span>
            <h2 className="text-display-md sm:text-display-lg font-heading font-bold text-secondary-900 mb-grid-2">
              Komposisi Shareholder
            </h2>
            <p className="text-body-md text-secondary-600 max-w-2xl mx-auto">
              Distribusi kepemilikan saham yang menunjukkan kolaborasi multi-stakeholder
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            
            {/* Total Overview - Single Bar */}
            <div className="mb-grid-8 bg-white rounded p-grid-6 border border-secondary-200">
              <div className="flex items-center justify-between mb-grid-3">
                <h3 className="font-heading font-bold text-body-md text-secondary-900">Total Kepemilikan Saham</h3>
                <div className="flex items-center gap-grid-2 text-body-sm">
                  <FaChartLine className="w-4 h-4 text-primary-600" />
                  <span className="font-bold text-primary-600">100%</span>
                </div>
              </div>
              
              {/* Single Stacked Bar - 2 Colors Only */}
              <div className="relative h-12 bg-secondary-100 rounded overflow-hidden">
                {/* Major Shareholder - Primary Color */}
                <div 
                  className="absolute inset-y-0 left-0 bg-primary-600 flex items-center justify-center"
                  style={{ width: `${shareholders[0].percentage}%` }}
                >
                  <span className="text-white font-bold text-body-sm">{shareholders[0].percentage}%</span>
                </div>
                
                {/* Others - Gray Shades */}
                {shareholders.slice(1).map((shareholder, index) => {
                  const previousWidth = shareholders.slice(0, index + 1).reduce((sum, s) => sum + s.percentage, 0);
                  const opacity = 100 - (index * 15);
                  
                  return (
                    <div
                      key={index}
                      className="absolute inset-y-0 bg-secondary-600 flex items-center justify-center"
                      style={{ 
                        left: `${previousWidth}%`,
                        width: `${shareholder.percentage}%`,
                        opacity: `${opacity}%`
                      }}
                    >
                      {shareholder.percentage > 5 && (
                        <span className="text-white font-bold text-body-xs">{shareholder.percentage}%</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend - Clean List */}
              <div className="mt-grid-4 pt-grid-4 border-t border-secondary-100 grid grid-cols-2 md:grid-cols-3 gap-x-grid-6 gap-y-grid-2">
                {shareholders.map((shareholder, index) => (
                  <div key={index} className="flex items-center gap-grid-2">
                    <div className={`w-3 h-3 rounded-sm ${index === 0 ? 'bg-primary-600' : 'bg-secondary-600'}`} style={{ opacity: index === 0 ? 1 : `${100 - (index - 1) * 15}%` }}></div>
                    <span className="text-body-xs text-secondary-700 font-medium">{shareholder.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Individual Cards - Minimalist Table-like Design */}
            <div className="bg-white rounded border border-secondary-200 overflow-hidden">
              {shareholders.map((shareholder, index) => (
                <article 
                  key={index}
                  className={`group flex items-center gap-grid-4 p-grid-4 hover:bg-secondary-50 transition-colors ${index !== shareholders.length - 1 ? 'border-b border-secondary-100' : ''}`}
                  tabIndex={0}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 h-8 rounded bg-secondary-100 text-secondary-700 flex items-center justify-center font-bold text-body-xs group-hover:bg-secondary-900 group-hover:text-white transition-colors">
                    {shareholder.rank}
                  </div>

                  {/* Name */}
                  <h4 className="flex-1 font-semibold text-body-sm text-secondary-900">
                    {shareholder.name}
                  </h4>

                  {/* Percentage - Large */}
                  <div className={`flex-shrink-0 font-bold text-body-xl ${index === 0 ? 'text-primary-600' : 'text-secondary-900'}`}>
                    {shareholder.percentage}%
                  </div>

                  {/* Mini Bar - Subtle Indicator */}
                  <div className="flex-shrink-0 w-24 h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${index === 0 ? 'bg-primary-600' : 'bg-secondary-600'}`}
                      style={{ width: `${shareholder.percentage}%` }}
                    ></div>
                  </div>
                </article>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-grid-5 text-center">
              <div className="inline-flex items-center gap-grid-2 px-grid-5 py-grid-2 bg-white border border-secondary-200 rounded text-body-sm">
                <FaUsers className="w-4 h-4 text-secondary-600" />
                <span className="text-secondary-600">
                  <span className="font-bold text-secondary-900">{shareholders.length}</span> Pemegang Saham
                </span>
              </div>
            </div>

          </div>
        </section>
      </div>
    </div>
  );
};

export default Bbisnis;