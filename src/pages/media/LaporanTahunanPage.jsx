import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaDownload, FaEye, FaFilePdf } from 'react-icons/fa'; 
import PageHero from '../../components/PageHero';
import MediaSubNav from '../../components/MediaSubNav';
import bannerImage from '../../assets/hero-bg.png';
import reportCover2022 from '../../assets/contoh1.png';
import reportCover2021 from '../../assets/contoh2.png';
import reportCover2020 from '../../assets/contoh3.png'; 
import reportCover2019 from '../../assets/contoh4.png'; 
import reportCover2018 from '../../assets/rectangle.png'; 
import reportCover2017 from '../../assets/contoh1.png'; 

const annualReportsData = [
  { 
    year: 2022, 
    title: 'Energi Untuk Bertumbuh dan Berdaya', 
    image: reportCover2022, 
    pdfLink: '/reports/annual-report-2022.pdf',
    fileSize: '12.5 MB'
  },
  { 
    year: 2021, 
    title: 'Progresif & Kolaborasi', 
    image: reportCover2021, 
    pdfLink: '/reports/annual-report-2021.pdf',
    fileSize: '10.8 MB'
  },
  { 
    year: 2020, 
    title: 'Tumbuh Bersama dengan Ketangguhan', 
    image: reportCover2020, 
    pdfLink: '/reports/annual-report-2020.pdf',
    fileSize: '11.2 MB'
  },
  { 
    year: 2019, 
    title: 'Memperkuat Kolaborasi untuk Kontribusi Optimal', 
    image: reportCover2019, 
    pdfLink: '/reports/annual-report-2019.pdf',
    fileSize: '9.7 MB'
  },
  { 
    year: 2018, 
    title: 'Mempercepat Sinergi, Menjadi Pelopor dan Meraih Juara', 
    image: reportCover2018, 
    pdfLink: '/reports/annual-report-2018.pdf',
    fileSize: '8.9 MB'
  },
  { 
    year: 2017, 
    title: 'Energi Untuk Kemakmuran Daerah', 
    image: reportCover2017, 
    pdfLink: '/reports/annual-report-2017.pdf',
    fileSize: '7.5 MB'
  },
];

const ReportHero = () => (
  <PageHero
    title="Laporan Tahunan"
    description="Transparansi kinerja dan pencapaian kami dari tahun ke tahun."
    backgroundImage={bannerImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'Laporan Tahunan' },
    ]}
  />
);

const ReportCard = ({ report }) => {
  const handleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const link = document.createElement('a');
    link.href = report.pdfLink;
    link.download = `Laporan_Tahunan_${report.year}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (e) => {
    e.preventDefault();
    window.open(report.pdfLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-secondary-200">
      <div className="aspect-[3/4] overflow-hidden bg-secondary-50 relative">
        <img
          src={report.image}
          alt={`Laporan Tahunan ${report.year}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        
        <div className="absolute inset-0 bg-secondary-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleView}
            className="px-4 py-2 bg-white text-secondary-900 rounded-lg font-semibold text-sm hover:bg-secondary-100 transition-colors flex items-center gap-2"
          >
            <FaEye className="w-4 h-4" />
            Lihat
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <FaDownload className="w-4 h-4" />
            Unduh
          </button>
        </div>

        <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-sm rounded-lg">
          <p className="text-sm font-bold text-primary-600">{report.year}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <FaFilePdf className="w-4 h-4 text-red-500" />
          <p className="text-xs text-secondary-500">PDF • {report.fileSize}</p>
        </div>
        <h3 className="text-lg font-heading font-bold text-secondary-900 group-hover:text-primary-600 transition-colors leading-snug mb-4 min-h-[3rem] line-clamp-3">
          {report.title}
        </h3>
        
        <div className="flex gap-2 lg:hidden">
          <button
            onClick={handleView}
            className="flex-1 px-3 py-2 bg-secondary-100 text-secondary-700 rounded-lg font-semibold text-sm hover:bg-secondary-200 transition-colors flex items-center justify-center gap-2"
          >
            <FaEye className="w-4 h-4" />
            Lihat
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 px-3 py-2 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <FaDownload className="w-4 h-4" />
            Unduh
          </button>
        </div>
      </div>
    </div>
  );
};

const LaporanTahunanPage = () => {
  return (
    <div className="bg-secondary-50 min-h-screen">
      <ReportHero />
      <MediaSubNav />
      
      <div className="container mx-auto px-8 lg:px-16 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary-900 mb-4">
            Laporan Tahunan
          </h2>
          <p className="text-base text-secondary-600 max-w-2xl mx-auto mb-8">
            Koleksi laporan tahunan kami yang menunjukkan komitmen terhadap transparansi dan akuntabilitas
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {annualReportsData.map((report) => (
            <ReportCard key={report.year} report={report} />
          ))}
        </div>

        <div className="mt-12 p-6 bg-white border border-secondary-200 rounded-xl text-center">
          <p className="text-body-sm text-secondary-600">
            <span className="font-semibold text-secondary-900">Catatan:</span> Laporan tahunan tersedia dalam format PDF. Pastikan Anda memiliki PDF reader untuk membuka file.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LaporanTahunanPage;