import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaChevronDown, FaFileDownload, FaFileAlt, FaInfoCircle } from 'react-icons/fa';
import PageHero from '../../components/PageHero';
import officeImage from '../../assets/contoh3.png';

const TataKelola = () => {
  const [openSection, setOpenSection] = useState(null);

  const governanceData = [
    {
      title: "Pedoman Kerja Dewan Komisaris dan Direksi",
      shortTitle: "Pedoman Dewan Komisaris & Direksi",
      description: "Panduan komprehensif mengenai tugas, wewenang, dan tanggung jawab Dewan Komisaris dan Direksi dalam menjalankan fungsi pengawasan dan pengelolaan perusahaan.",
      details: [
        "Struktur dan komposisi dewan",
        "Mekanisme rapat dan pengambilan keputusan",
        "Evaluasi kinerja dewan",
        "Kode etik dan perilaku anggota dewan"
      ],
      pdfUrl: "/documents/pedoman-dewan-komisaris-direksi.pdf",
      fileSize: "2.5 MB",
      lastUpdated: "30 Juni 2020"
    },
    {
      title: "Kode Etik Perusahaan",
      shortTitle: "Kode Etik",
      description: "Standar etika dan perilaku yang harus dipatuhi oleh seluruh insan perusahaan dalam menjalankan tugas dan tanggung jawabnya sehari-hari.",
      details: [
        "Integritas dan kejujuran dalam bekerja",
        "Pencegahan konflik kepentingan",
        "Perlindungan aset dan informasi perusahaan",
        "Kepatuhan terhadap regulasi"
      ],
      pdfUrl: "/documents/kode-etik-perusahaan.pdf",
      fileSize: "1.8 MB",
      lastUpdated: "15 Januari 2023"
    },
    {
      title: "Kebijakan K3LL",
      shortTitle: "Kebijakan K3LL",
      description: "Kebijakan Keselamatan, Kesehatan Kerja, dan Lindung Lingkungan yang menjadi komitmen perusahaan dalam menjaga keselamatan dan kelestarian lingkungan.",
      details: [
        "Standar keselamatan operasional",
        "Program kesehatan dan keselamatan karyawan",
        "Pengelolaan dampak lingkungan",
        "Prosedur tanggap darurat"
      ],
      pdfUrl: "/documents/kebijakan-k3ll.pdf",
      fileSize: "3.2 MB",
      lastUpdated: "10 Maret 2023"
    }
  ];

  const principles = [
    { 
      title: "Transparansi", 
      desc: "Keterbukaan dalam proses pengambilan keputusan dan penyampaian informasi" 
    },
    { 
      title: "Akuntabilitas", 
      desc: "Kejelasan fungsi, pelaksanaan, dan pertanggungjawaban organ perusahaan" 
    },
    { 
      title: "Responsibilitas", 
      desc: "Kesesuaian pengelolaan perusahaan dengan peraturan dan prinsip korporasi" 
    },
    { 
      title: "Independensi", 
      desc: "Pengelolaan perusahaan secara profesional tanpa benturan kepentingan" 
    }
  ];

  const toggleSection = (index) => {
    setOpenSection(openSection === index ? null : index);
  };

  const handleDownload = (pdfUrl, fileName) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <PageHero
        title="Kebijakan Tata Kelola Perusahaan"
        description="Komitmen kami dalam menjalankan praktik tata kelola perusahaan yang baik untuk mencapai pertumbuhan berkelanjutan"
        backgroundImage={officeImage}
        heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
        breadcrumbs={[
          { label: 'Beranda', to: '/', icon: 'home' },
          { label: 'Tata Kelola' },
        ]}
      />

      {/* Main Content */}
      <div className="section-container py-12">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Column - Main Text */}
          <div className="space-y-8">
            
            {/* Main Content */}
            <div>
              <h2 className="text-xl lg:text-2xl font-heading font-bold text-secondary-900 mb-5 leading-tight">
                Tujuan dan Komitmen Penerapan Tata Kelola Perusahaan
              </h2>
              
              <div className="space-y-4 text-sm text-secondary-600 leading-relaxed">
                <p>
                  <span className="font-semibold text-secondary-900">Pedoman Tata Kelola Perusahaan</span> <span className="text-xs">(code of Corporate Governance)</span> disahkan pada tanggal 30 Juni 2020
                </p>
                
                <p>
                  Memahami pentingnya Tata Kelola Perusahaan yang baik (Good Corporate Governance/GCG), 
                  PT Migas Hulu Jabar ONWJ berkomitmen untuk terus meningkatkan kualitas penerapan GCG 
                  secara konsisten dan berkesinambungan yang sejalan dengan nilai-nilai yang dianut Perseroan.
                </p>
                
                <p>
                  Penerapan prinsip-prinsip GCG yang bermutu akan mendukung peningkatan kinerja Perseroan 
                  melalui terciptanya proses pengambilan keputusan yang lebih baik, peningkatan efisiensi 
                  operasional, serta peningkatan pelayanan kepada pemangku kepentingan Perseroan.
                </p>
              </div>
            </div>

            {/* Governance Principles - Compact Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              {principles.map((principle) => (
                <div 
                  key={principle.title} 
                  className="bg-secondary-50 border border-secondary-200 p-4 rounded-lg transition-all duration-200 hover:border-primary-600 hover:bg-primary-50"
                >
                  <h3 className="text-sm font-heading font-bold text-secondary-900 mb-2 leading-tight">
                    {principle.title}
                  </h3>
                  <p className="text-xs text-secondary-600 leading-relaxed">
                    {principle.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Document Cards */}
          <div className="lg:sticky lg:top-24">
            <h3 className="text-lg font-heading font-bold text-secondary-900 mb-5">
              Dokumen Terkait
            </h3>
            
            <div className="space-y-4">
              {governanceData.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white border border-secondary-200 rounded-lg overflow-hidden transition-all duration-300 hover:border-primary-600 hover:shadow-md"
                >
                  {/* Header with Icon Indicator */}
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full px-5 py-4 flex items-start gap-3 text-left hover:bg-secondary-50 transition-all duration-300 group"
                  >
                    {/* Document Icon with Badge */}
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        openSection === index 
                          ? 'bg-primary-100 text-primary-600' 
                          : 'bg-secondary-100 text-secondary-600 group-hover:bg-primary-50 group-hover:text-primary-600'
                      }`}>
                        <FaFileAlt className="w-4 h-4" />
                      </div>
                      
                      {/* Content Indicator Badge */}
                      <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        openSection === index
                          ? 'bg-primary-600 text-white scale-100'
                          : 'bg-secondary-400 text-white scale-90 group-hover:bg-primary-600 group-hover:scale-100'
                      }`}>
                        <FaInfoCircle className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Title Section */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-heading font-bold text-secondary-900 mb-1 leading-tight group-hover:text-primary-600 transition-colors duration-300">
                        {item.shortTitle}
                      </h4>
                      <p className="text-xs text-secondary-500">
                        Terakhir diperbarui: {item.lastUpdated}
                      </p>
                      
                      {/* Hint Text */}
                      <p className={`text-xs mt-1 transition-all duration-300 ${
                        openSection === index
                          ? 'text-primary-600 opacity-100'
                          : 'text-secondary-400 opacity-0 group-hover:opacity-100'
                      }`}>
                        {openSection === index ? 'Klik untuk tutup' : 'Klik untuk melihat detail'}
                      </p>
                    </div>

                    {/* Chevron Icon */}
                    <FaChevronDown 
                      className={`w-4 h-4 flex-shrink-0 mt-1 transition-all duration-500 ease-out ${
                        openSection === index 
                          ? 'rotate-180 text-primary-600' 
                          : 'rotate-0 text-secondary-600 group-hover:text-primary-600'
                      }`}
                    />
                  </button>

                  {/* Expandable Content with Smooth Fade */}
                  <div
                    className={`transition-all duration-700 ease-out ${
                      openSection === index 
                        ? 'max-h-[800px] opacity-100' 
                        : 'max-h-0 opacity-0'
                    }`}
                    style={{
                      transitionProperty: 'max-height, opacity',
                      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <div className="px-5 pb-5 border-t border-secondary-100">
                      
                      {/* Content with Staggered Fade-in */}
                      <div className="pt-4 space-y-4">
                        
                        {/* Description - Fade in first */}
                        <div 
                          className={`transition-all duration-700 delay-100 ${
                            openSection === index
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{
                            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          <p className="text-sm text-secondary-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Details List - Fade in second */}
                        <div 
                          className={`transition-all duration-700 delay-200 ${
                            openSection === index
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{
                            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          <p className="text-xs font-heading font-semibold text-secondary-700 uppercase tracking-wide mb-2">
                            Mencakup:
                          </p>
                          <ul className="space-y-1.5">
                            {item.details.map((detail, idx) => (
                              <li 
                                key={idx} 
                                className={`flex items-start gap-2 text-xs text-secondary-600 transition-all duration-500 ${
                                  openSection === index
                                    ? 'opacity-100 translate-x-0'
                                    : 'opacity-0 -translate-x-2'
                                }`}
                                style={{
                                  transitionDelay: `${300 + (idx * 100)}ms`,
                                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                              >
                                <span className="w-1 h-1 rounded-full bg-primary-600 mt-1.5 flex-shrink-0"></span>
                                <span className="leading-relaxed">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Download Section - Fade in last */}
                        <div 
                          className={`pt-3 border-t border-secondary-100 transition-all duration-700 delay-500 ${
                            openSection === index
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-2'
                          }`}
                          style={{
                            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="text-xs text-secondary-500">
                              <p>Format: PDF</p>
                              <p>Ukuran: {item.fileSize}</p>
                            </div>
                            <button
                              onClick={() => handleDownload(item.pdfUrl, `${item.shortTitle}.pdf`)}
                              className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-heading font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                            >
                              <FaFileDownload className="w-3.5 h-3.5" />
                              <span>Unduh PDF</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TataKelola;