import React from 'react';
import { FaIndustry, FaBolt, FaWater } from 'react-icons/fa'; 
import WorkAreaImage from '../../assets/wilayah/area-map.webp';

const DeskripsiWK = () => {
  const workAreas = [
    {
      title: 'Wilayah Operasi ONWJ',
      description: 'MUJ ONWJ mengelola 10 persen Participating Interest di Blok ONWJ, yaitu wilayah laut seluas 8.300 km² yang membentang dari Kepulauan Seribu hingga utara Cirebon. Operasi mencakup lebih dari 220 platform lepas pantai, jaringan pipa bawah laut sepanjang 2.100 km, serta berbagai fasilitas pengolahan migas yang berperan dalam pemenuhan energi nasional.',
    }
  ];

  const keyFeatures = [
    { 
      icon: FaIndustry, 
      title: 'Fasilitas Produksi', 
      description: 'Memiliki berbagai fasilitas produksi strategis di sepanjang wilayah operasi',
      color: 'bg-primary-600'
    },
    { 
      icon: FaBolt, 
      title: 'Kapasitas Produksi', 
      description: 'Mampu memproduksi minyak dan gas dengan kapasitas yang signifikan',
      color: 'bg-amber-600'
    },
    { 
      icon: FaWater, 
      title: 'Offshore Operations', 
      description: 'Operasi lepas pantai dengan teknologi modern dan standar keamanan tinggi',
      color: 'bg-accent-600'
    }
  ];

  return (
    <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          
          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-10 items-center mb-12">
            
            {/* Text Content */}
            <div className="space-y-6">
              {workAreas.map((area, index) => (
                <div key={index}>
                  <h3 className="text-2xl lg:text-3xl font-heading font-bold text-secondary-900 mb-4 leading-tight">
                    {area.title}
                  </h3>
                  <p className="text-sm text-secondary-600 mb-5 leading-relaxed">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>

          {/* Key Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-secondary-50 border border-secondary-200 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary-600"
                >
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-base font-heading font-bold text-secondary-900 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-xs text-secondary-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeskripsiWK;