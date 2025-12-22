import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTrophy } from 'react-icons/fa';
import PageHero from '../../components/PageHero';
import MediaSubNav from '../../components/MediaSubNav';
import bannerImage from '../../assets/hero-bg.png';
import awardImage from '../../assets/rectangle.png';
import toast from 'react-hot-toast';
import penghargaanService from '../../services/penghargaanService';

const AwardCard = ({ award, index, visible }) => {
  // Get image URL or fallback to default
  const imageUrl = award.image_url || awardImage;

  return (
    <div
      className="transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${index * 50}ms`,
      }}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden rounded-lg mb-5 group">
        <img
          src={imageUrl}
          alt={award.title}
          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.target.src = awardImage;
          }}
        />
        
        {/* Year Badge */}
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-primary-600 text-white rounded text-xs font-heading font-bold shadow-lg">
          {award.year}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="space-y-3 pb-5 border-b-2 border-secondary-200 transition-colors duration-300 hover:border-primary-600 group cursor-pointer">
        <div>
          <p className="text-xs font-heading font-semibold text-secondary-500 uppercase tracking-wider mb-1">
            {award.month} {award.year}
          </p>
          <h3 className="text-lg font-heading font-bold text-secondary-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-300">
            {award.title}
          </h3>
        </div>
        
        <p className="text-sm text-secondary-600 line-clamp-2">
          {award.given_by}
        </p>
      </div>
    </div>
  );
};

const MediaHero = () => (
  <PageHero
    title="Penghargaan Kami"
    description="Penghargaan dan prestasi yang kami raih sebagai bukti komitmen terhadap keunggulan dalam bisnis dan tanggung jawab sosial."
    backgroundImage={bannerImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'Penghargaan' },
    ]}
  />
);

const PenghargaanPage = () => {
  const [visible, setVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');
  const [awardsData, setAwardsData] = useState([]);
  const [years, setYears] = useState(['all']);
  const [loading, setLoading] = useState(true);

  // Fetch penghargaan data from API
  useEffect(() => {
    fetchPenghargaan();
    fetchYears();
  }, []);

  const fetchPenghargaan = async () => {
    setLoading(true);
    try {
      const response = await penghargaanService.getAllPenghargaan();
      if (response.success) {
        setAwardsData(response.data);
      }
    } catch (error) {
      console.error('Error fetching penghargaan:', error);
      toast.error('Gagal memuat data penghargaan');
    } finally {
      setLoading(false);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await penghargaanService.getYears();
      if (response.success && response.data.length > 0) {
        const yearsArray = ['all', ...response.data].sort((a, b) => {
          if (a === 'all') return -1;
          if (b === 'all') return 1;
          return b - a;
        });
        setYears(yearsArray);
      }
    } catch (error) {
      console.error('Error fetching years:', error);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  // Filter awards by year
  const filteredAwards = selectedYear === 'all' 
    ? awardsData 
    : awardsData.filter(award => award.year === parseInt(selectedYear));

  return (
    <div className="min-h-screen bg-white">
      <MediaHero />
      <MediaSubNav />
      
      <div className="section-container py-16">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-secondary-900 mb-4">
            Penghargaan & Prestasi
          </h2>
          <p className="text-base text-secondary-600 mb-8">
            Koleksi penghargaan yang kami terima sebagai bukti dedikasi dan keunggulan
          </p>

          {/* Year Filter */}
          <div className="flex items-center justify-center gap-2.5 flex-wrap">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-4 py-2 text-sm font-heading font-semibold rounded transition-all duration-300 border-b-2 ${
                  selectedYear === year
                    ? 'text-primary-600 border-primary-600 bg-primary-50'
                    : 'text-secondary-600 border-transparent hover:text-primary-600 hover:border-primary-300'
                }`}
              >
                {year === 'all' ? 'Semua' : year}
              </button>
            ))}
          </div>
        </div>

        {/* Awards Grid */}
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
              <p className="text-secondary-600 text-base">Memuat penghargaan...</p>
            </div>
          ) : filteredAwards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {filteredAwards.map((award, index) => (
                <AwardCard key={award.id} award={award} index={index} visible={visible} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <FaTrophy className="w-16 h-16 text-secondary-200 mb-4" />
              <p className="text-secondary-600 text-base font-heading font-semibold">
                {selectedYear === 'all' 
                  ? 'Belum ada data penghargaan' 
                  : `Tidak ada penghargaan untuk tahun ${selectedYear}`
                }
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PenghargaanPage;