import React, { useState } from 'react';
import ONWJ from '../../assets/bisnis/LOGO-HD.webp';
import PHE from '../../assets/bisnis/logo-pertamina.webp';
import { FaBuilding, FaHandshake, FaLandmark, FaArrowRight, FaChartLine, FaUsers, FaCheckCircle, FaMapMarkerAlt } from 'react-icons/fa';

const Bbisnis = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredShareholder, setHoveredShareholder] = useState(null);
  
  // Combined Business Flow + Operational Pillars
  const businessOperations = {
    flow: [
      {
        name: 'PERTAMINA PHE ONWJ',
        logo: PHE,
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
        <section className="py-grid-12 text-center">
          <div className="max-w-3xl mx-auto animate-slide-up">
            <div className="inline-flex items-center gap-grid-2 px-grid-5 py-grid-2.5 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-full mb-grid-4 shadow-sm">
              <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></div>
              <span className="text-body-sm font-bold text-primary-700 tracking-wide">
                Alur Bisnis Kami
              </span>
            </div>
            <h2 className="text-display-lg sm:text-display-xl font-heading font-bold text-secondary-900 leading-tight">
              Bagaimana Kami Beroperasi
            </h2>
          </div>
        </section>

        {/* ===== UNIFIED SECTION: Business Flow + Operations ===== */}
        <section className="py-grid-3">
          
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
              <div className="relative z-10 grid lg:grid-cols-2 gap-grid-6 lg:gap-grid-10 mb-grid-10">
                {businessOperations.flow.map((item, index) => {
                  const IconComponent = item.icon;
                  const isHovered = hoveredCard === index;
                  
                  return (
                    <article 
                      key={index}
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className="group relative bg-gradient-to-br from-white to-secondary-50/30 border-2 border-secondary-200 rounded-2xl p-grid-6 hover:border-primary-400 hover:shadow-2xl transition-all duration-500 ease-smart cursor-pointer overflow-hidden"
                      style={{
                        transform: isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                      }}
                      tabIndex={0}
                    >
                      {/* Background Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
                      
                      {/* Step Number Badge */}
                      <div className="absolute -top-3 -right-3 w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <span className="text-white font-bold text-display-xs">{index + 1}</span>
                      </div>

                      {/* Header Row */}
                      <div className="relative z-10 flex items-start gap-grid-4 mb-grid-5">
                        <div className="flex-shrink-0 w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center p-2 border border-secondary-100 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                          <img 
                            src={item.logo} 
                            alt={item.name}
                            className="max-w-full max-h-full object-contain"
                            loading="lazy"
                          />
                        </div>
                      </div>


                      {/* Content */}
                      <div className="relative z-10">
                        <h3 className="font-heading font-bold text-body-xl text-secondary-900 mb-grid-2 leading-tight group-hover:text-primary-700 transition-colors duration-300">
                          {item.name}
                        </h3>
                        
                        <div className="inline-flex items-center gap-grid-2 px-grid-3 py-grid-1 bg-accent-100 rounded-full mb-grid-3">
                          <div className="w-1.5 h-1.5 bg-accent-600 rounded-full"></div>
                          <span className="text-body-xs font-bold text-accent-700">
                            {item.description}
                          </span>
                        </div>
                        
                        <p className="text-body-md text-secondary-600 leading-relaxed">
                          {item.role}
                        </p>
                      </div>
                      
                      {/* Decorative Corner */}
                      <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary-100/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
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
              <div className="grid lg:grid-cols-2 gap-grid-6">
                {businessOperations.operations.map((point, index) => {
                  const IconComponent = point.icon;
                  return (
                    <article 
                      key={index}
                      className="group relative bg-white border-2 border-secondary-200 rounded-2xl p-grid-6 hover:bg-gradient-to-br hover:from-white hover:to-accent-50/30 hover:border-accent-400 hover:shadow-xl transition-all duration-500 ease-smart cursor-pointer overflow-hidden"
                      tabIndex={0}
                    >
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                           style={{
                             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                             backgroundSize: '30px 30px'
                           }}
                      ></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-grid-3 mb-grid-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <span className="inline-block px-grid-3 py-grid-1 bg-secondary-100 text-secondary-600 rounded-full text-body-xs font-bold">
                              Pilar {index + 1}
                            </span>
                          </div>
                        </div>
                        
                        <h4 className="font-heading font-bold text-body-xl text-secondary-900 mb-grid-2 group-hover:text-accent-700 transition-colors duration-300">
                          {point.title}
                        </h4>
                        
                        <div className="flex items-start gap-grid-2 mb-grid-3">
                          <FaCheckCircle className="w-4 h-4 text-accent-600 flex-shrink-0 mt-0.5" />
                          <p className="text-body-sm font-bold text-accent-700">
                            {point.subtitle}
                          </p>
                        </div>

                        <p className="text-body-md text-secondary-600 leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                      
                      {/* Corner Accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent-100/40 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </article>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* ===== SHAREHOLDERS - Modern & Visual ===== */}
        <section className="bg-gradient-to-b from-white via-secondary-50/50 to-white">
          
          <div className="text-center mb-grid-10">
            <div className="inline-flex items-center gap-grid-2 px-grid-5 py-grid-2.5 bg-gradient-to-r from-primary-50 to-warm-50 border border-primary-200 rounded-full mb-grid-4 shadow-sm">
              <FaChartLine className="w-3.5 h-3.5 text-primary-600" />
              <span className="text-body-sm font-bold text-primary-700 tracking-wide">
                Struktur Kepemilikan
              </span>
            </div>
            <h2 className="text-display-md sm:text-display-lg font-heading font-bold text-secondary-900 mb-grid-3">
              Pemegang Saham
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            
            {/* Donut Chart Visualization */}
            <div className="mb-grid-12 bg-white rounded-2xl border-2 border-secondary-200 p-grid-8 shadow-lg">
              <div className="grid lg:grid-cols-2 gap-grid-10 items-center">
                
                {/* Left: Donut Chart */}
                <div className="flex flex-col items-center">
                  <div className="relative w-64 h-64 mb-grid-6">
                    {/* Donut Chart using conic-gradient */}
                    <div 
                      className="w-full h-full rounded-full relative shadow-2xl"
                      style={{
                        background: `conic-gradient(
                          from 0deg,
                          #2973b4 0% ${shareholders[0].percentage}%,
                          #0d9488 ${shareholders[0].percentage}% ${shareholders[0].percentage + shareholders[1].percentage}%,
                          #57534e ${shareholders[0].percentage + shareholders[1].percentage}% ${shareholders[0].percentage + shareholders[1].percentage + shareholders[2].percentage}%,
                          #78716c ${shareholders[0].percentage + shareholders[1].percentage + shareholders[2].percentage}% ${shareholders[0].percentage + shareholders[1].percentage + shareholders[2].percentage + shareholders[3].percentage}%,
                          #a8a29e ${shareholders[0].percentage + shareholders[1].percentage + shareholders[2].percentage + shareholders[3].percentage}% ${shareholders[0].percentage + shareholders[1].percentage + shareholders[2].percentage + shareholders[3].percentage + shareholders[4].percentage}%,
                          #d6d3d1 ${shareholders[0].percentage + shareholders[1].percentage + shareholders[2].percentage + shareholders[3].percentage + shareholders[4].percentage}% 100%
                        )`
                      }}
                    >
                      {/* Center Hole */}
                      <div className="absolute inset-0 m-auto w-36 h-36 bg-white rounded-full shadow-inner flex flex-col items-center justify-center">
                        <span className="text-body-xs text-secondary-500 font-semibold mb-grid-1">Total</span>
                        <span className="text-display-lg font-bold text-primary-600">100%</span>
                        <span className="text-body-xs text-secondary-500 mt-grid-1">{shareholders.length} Pihak</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Chart Legend */}
                  <div className="grid grid-cols-2 gap-x-grid-4 gap-y-grid-2 w-full max-w-md">
                    {shareholders.map((shareholder, index) => {
                      const colors = ['#2973b4', '#0d9488', '#57534e', '#78716c', '#a8a29e', '#d6d3d1'];
                      return (
                        <div key={index} className="flex items-center gap-grid-2">
                          <div 
                            className="w-3 h-3 rounded-sm flex-shrink-0"
                            style={{ backgroundColor: colors[index] }}
                          ></div>
                          <span className="text-body-xs text-secondary-700 font-medium truncate">
                            {shareholder.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Right: Horizontal Bar Chart */}
                <div className="space-y-grid-4">
                  <h3 className="font-heading font-bold text-body-xl text-secondary-900 mb-grid-4">
                    Distribusi Kepemilikan
                  </h3>
                  
                  {shareholders.map((shareholder, index) => {
                    const colors = [
                      { bg: 'bg-primary-600', text: 'text-primary-700', light: 'bg-primary-50' },
                      { bg: 'bg-accent-600', text: 'text-accent-700', light: 'bg-accent-50' },
                      { bg: 'bg-secondary-600', text: 'text-secondary-700', light: 'bg-secondary-100' },
                      { bg: 'bg-secondary-500', text: 'text-secondary-600', light: 'bg-secondary-50' },
                      { bg: 'bg-secondary-400', text: 'text-secondary-500', light: 'bg-secondary-50' },
                      { bg: 'bg-secondary-300', text: 'text-secondary-400', light: 'bg-secondary-50' }
                    ];
                    const color = colors[index];
                    
                    return (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-grid-1.5">
                          <div className="flex items-center gap-grid-2">
                            <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-body-xs font-bold text-white ${color.bg}`}>
                              {index + 1}
                            </span>
                            <span className="text-body-sm font-semibold text-secondary-900">
                              {shareholder.name}
                            </span>
                          </div>
                          <span className={`text-body-md font-bold ${color.text}`}>
                            {shareholder.percentage}%
                          </span>
                        </div>
                        
                        {/* Animated Bar */}
                        <div className={`relative h-3 ${color.light} rounded-full overflow-hidden`}>
                          <div 
                            className={`h-full ${color.bg} rounded-full transition-all duration-1000 ease-out group-hover:opacity-90`}
                            style={{ 
                              width: `${shareholder.percentage}%`,
                              animation: `slideFromLeft 1s ease-out ${index * 100}ms forwards`,
                              transformOrigin: 'left'
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Visual Donut Chart Alternative - Modern Cards Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-grid-5 mb-grid-10">
              {shareholders.map((shareholder, index) => {
                const isHovered = hoveredShareholder === index;
                const isMajor = index === 0;
                
                return (
                  <article 
                    key={index}
                    onMouseEnter={() => setHoveredShareholder(index)}
                    onMouseLeave={() => setHoveredShareholder(null)}
                    className={`group relative bg-white border-2 rounded-2xl p-grid-5 transition-all duration-500 ease-smart cursor-pointer overflow-hidden ${
                      isMajor 
                        ? 'border-primary-300 hover:border-primary-500 hover:shadow-2xl' 
                        : 'border-secondary-200 hover:border-accent-300 hover:shadow-xl'
                    }`}
                    style={{
                      transform: isHovered ? 'translateY(-8px) scale(1.03)' : 'translateY(0) scale(1)',
                    }}
                    tabIndex={0}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isMajor 
                        ? 'bg-gradient-to-br from-primary-50 to-primary-100/50' 
                        : 'bg-gradient-to-br from-accent-50/50 to-secondary-50'
                    }`}></div>
                    
                    {/* Rank Badge */}
                    <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-body-md shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ${
                      isMajor 
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white' 
                        : 'bg-gradient-to-br from-secondary-700 to-secondary-800 text-white'
                    }`}>
                      {shareholder.rank}
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h4 className={`font-heading font-bold text-body-lg mb-grid-3 leading-tight pr-8 ${
                        isMajor ? 'text-primary-900' : 'text-secondary-900'
                      }`}>
                        {shareholder.name}
                      </h4>
                      
                      {/* Percentage Display */}
                      <div className="mb-grid-4">
                        <div className="flex items-baseline gap-grid-2 mb-grid-2">
                          <span className={`font-bold text-display-md ${
                            isMajor ? 'text-primary-600' : 'text-accent-600'
                          }`}>
                            {shareholder.percentage}%
                          </span>
                          <span className="text-body-xs text-secondary-500 font-medium">kepemilikan</span>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="relative h-2.5 bg-secondary-100 rounded-full overflow-hidden">
                          <div 
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                              isMajor 
                                ? 'bg-gradient-to-r from-primary-600 to-primary-500' 
                                : 'bg-gradient-to-r from-accent-600 to-accent-500'
                            }`}
                            style={{ 
                              width: isHovered ? `${shareholder.percentage}%` : '0%',
                              transitionDelay: `${index * 50}ms`
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      {isMajor && (
                        <div className="inline-flex items-center gap-grid-2 px-grid-3 py-grid-1.5 bg-primary-100 border border-primary-200 rounded-full">
                          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full animate-pulse"></div>
                          <span className="text-body-xs font-bold text-primary-700">Pemegang Saham Mayoritas</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Corner Decoration */}
                    <div className={`absolute bottom-0 right-0 w-20 h-20 rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      isMajor 
                        ? 'bg-gradient-to-tl from-primary-100/30 to-transparent' 
                        : 'bg-gradient-to-tl from-accent-100/30 to-transparent'
                    }`}></div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Bbisnis;