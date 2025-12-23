import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaStore, FaBookOpen, FaPhone, FaWhatsapp, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import PageHero from '../components/PageHero';
import umkmService from '../services/umkmService';

// --- Aset Placeholder ---
import bannerImage from '../assets/hero-bg.png';
import featuredImage from '../assets/contoh1.png';
import productImage from '../assets/rectangle.png';

// --- SUB-KOMPONEN HALAMAN ---
const UmkmHero = () => (
    <PageHero
        title="UMKM Binaan"
        description="Etalase produk dan cerita sukses dari para mitra binaan UMKM kami yang berdaya dan mandiri."
        backgroundImage={bannerImage}
        heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
        breadcrumbs={[
            { label: 'Beranda', to: '/', icon: 'home' },
            { label: 'TJSL', to: '/tjsl' },
            { label: 'UMKM Binaan' },
        ]}
    />
);

const FeaturedUmkm = ({ item }) => {
    if (!item) return null;
    
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-8 lg:px-16">
                <div className="flex flex-col lg:flex-row items-center gap-12 bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl shadow-lg border border-blue-100">
                    <div className="lg:w-1/2">
                        <div className="rounded-2xl overflow-hidden shadow-xl">
                            <img 
                                src={item.full_image_url || item.image_url || featuredImage} 
                                alt={item.name} 
                                className="w-full h-full object-cover aspect-[4/3]" 
                                onError={(e) => {
                                    e.target.src = featuredImage;
                                }}
                            />
                        </div>
                    </div>
                    <div className="lg:w-1/2 space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                ⭐ Cerita Sukses Unggulan
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                {item.category}
                            </span>
                        </div>
                        <h2 className="text-4xl font-bold text-gray-900">{item.name}</h2>
                        
                        {item.testimonial && (
                            <blockquote className="text-lg italic text-gray-700 border-l-4 border-blue-500 pl-4 bg-white p-4 rounded-r-lg shadow-sm">
                                "{item.testimonial}"
                                <cite className="block not-italic text-base font-semibold text-gray-800 mt-3">
                                    - {item.owner}, {item.location}
                                </cite>
                            </blockquote>
                        )}

                        <div className="flex flex-wrap gap-3">
                            {item.shop_link && (
                                <a 
                                    href={item.shop_link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 bg-green-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-green-600 transition-colors"
                                >
                                    <FaStore /> Kunjungi Toko
                                </a>
                            )}
                            {item.contact_number && (
                                <a 
                                    href={`https://wa.me/${item.contact_number.replace(/\D/g, '')}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                                >
                                    <FaWhatsapp /> Hubungi via WhatsApp
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const UmkmCard = ({ item }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        <div className="h-48 overflow-hidden relative">
            <img 
                src={item.full_image_url || item.image_url || productImage} 
                alt={item.name} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                loading="lazy"
                onError={(e) => {
                    e.target.src = productImage;
                }}
            />
            {item.status && (
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'Aktif' 
                            ? 'bg-green-500 text-white' 
                            : item.status === 'Lulus Binaan'
                            ? 'bg-purple-500 text-white'
                            : 'bg-yellow-500 text-white'
                    }`}>
                        {item.status}
                    </span>
                </div>
            )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full self-start">
                {item. category}
            </span>
            <h3 className="text-lg font-bold text-gray-800 mt-3 mb-1 line-clamp-2">
                {item.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {item.description}
            </p>
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5. 05 4.05a7 7 0 119.9 9.9L10 18. 9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {item.location}
            </div>
            
            <div className="mt-auto flex flex-col gap-2">
                {item.shop_link && (
                    <a 
                        href={item.shop_link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                        <FaStore /> Kunjungi Toko
                    </a>
                )}
                {item.contact_number && (
                    <a 
                        href={`https://wa.me/${item.contact_number.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                        <FaWhatsapp /> WhatsApp
                    </a>
                )}
                {! item.shop_link && !item.contact_number && (
                    <div className="text-center py-2 text-gray-500 text-sm">
                        Informasi kontak tersedia
                    </div>
                )}
            </div>
        </div>
    </div>
);

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
        <button
            onClick={() => onCategoryChange('Semua')}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeCategory === 'Semua'
                    ?  'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
        >
            Semua ({categories.all || 0})
        </button>
        {Object.entries(categories).map(([cat, count]) => {
            if (cat === 'all') return null;
            return (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                        activeCategory === cat
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                >
                    {cat} ({count})
                </button>
            );
        })}
    </div>
);

// --- MAIN PAGE COMPONENT ---
const UmkmPage = () => {
    const [umkmData, setUmkmData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [categoryCounts, setCategoryCounts] = useState({});

    // Fetch data dari API Laravel
    useEffect(() => {
        const fetchUmkmData = async () => {
            try {
                setLoading(true);
                
                console.log('🔍 [UmkmPage] Fetching UMKM data...');
                console.log('📍 [UmkmPage] Active category:', activeCategory);
                
                const response = await umkmService.getAllUmkm({ 
                    category: activeCategory 
                });
                
                console.log('📥 [UmkmPage] Response received:', response);
                
                if (response.success) {
                    console.log('✅ [UmkmPage] Response success = true');
                    console.log('📊 [UmkmPage] Featured:', response.data.featured);
                    console.log('📊 [UmkmPage] UMKM list:', response.data.umkm);
                    console.log('📊 [UmkmPage] Categories:', response.data.categories);
                    
                    // Combine featured and regular UMKM
                    const allUmkm = response.data.featured 
                        ? [response.data.featured, ...response.data.umkm]
                        : response.data.umkm;
                    
                    console.log('📋 [UmkmPage] All UMKM combined:', allUmkm);
                    console.log('🔢 [UmkmPage] Total UMKM:', allUmkm.length);
                    
                    setUmkmData(allUmkm);
                    setCategoryCounts(response.data.categories || {});
                    
                    toast.success(`✅ ${allUmkm.length} UMKM berhasil dimuat!`);
                } else {
                    console.warn('⚠️ [UmkmPage] Response success = false');
                    throw new Error(response.message || 'Gagal memuat data');
                }
                
                setLoading(false);
            } catch (error) {
                console.error('❌ [UmkmPage] Error fetching UMKM:', error);
                console.error('Error details:', {
                    message: error.message,
                    response: error. response,
                    data: error.data,
                });
                
                setLoading(false);
                toast.error('Gagal memuat data UMKM.  Silakan refresh halaman.');
            }
        };

        fetchUmkmData();
    }, [activeCategory]);

    // Get featured UMKM
    const featuredUmkm = umkmData.find(item => item.is_featured);
    console.log('⭐ [UmkmPage] Featured UMKM:', featuredUmkm);

    // Filter UMKM by category (exclude featured from gallery)
    const filteredUmkm = umkmData.filter(item => ! item.is_featured);
    console.log('🎨 [UmkmPage] Filtered UMKM (without featured):', filteredUmkm. length);

    return (
        <div className="bg-gray-50 min-h-screen">
            <UmkmHero />
            
            {/* Featured UMKM */}
            {! loading && featuredUmkm && <FeaturedUmkm item={featuredUmkm} />}

            {/* Gallery Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-8 lg:px-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
                        Galeri UMKM Binaan
                    </h2>
                    <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Berbagai produk berkualitas dari UMKM binaan yang telah kami dampingi untuk berkembang dan mandiri
                    </p>

                    {/* Loading State */}
                    {loading && (
                        <div className="text-center py-12">
                            <FaSpinner className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 text-lg">Memuat data UMKM...</p>
                        </div>
                    )}

                    {/* Category Filter */}
                    {! loading && Object.keys(categoryCounts).length > 0 && (
                        <CategoryFilter 
                            categories={categoryCounts}
                            activeCategory={activeCategory}
                            onCategoryChange={setActiveCategory}
                        />
                    )}

                    {/* UMKM Cards Grid */}
                    {!loading && filteredUmkm.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredUmkm.map((item) => (
                                <UmkmCard key={item. id} item={item} />
                            ))}
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && umkmData.length === 0 && (
                        <div className="text-center py-12">
                            <FaStore className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg mb-2">
                                Belum ada UMKM binaan yang ditambahkan. 
                            </p>
                            <p className="text-gray-400 text-sm">
                                Data akan muncul setelah admin menambahkan UMKM pertama.
                            </p>
                        </div>
                    )}

                    {/* Empty Category State */}
                    {!loading && umkmData.length > 0 && filteredUmkm.length === 0 && ! featuredUmkm && (
                        <div className="text-center py-12">
                            <FaStore className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">
                                {activeCategory === 'Semua' 
                                    ? 'Tidak ada UMKM yang ditemukan.' 
                                    : `Belum ada UMKM di kategori ${activeCategory}. `}
                            </p>
                            <button
                                onClick={() => setActiveCategory('Semua')}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Lihat Semua Kategori
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default UmkmPage;