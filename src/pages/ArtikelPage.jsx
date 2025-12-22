import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaArrowLeft, FaUsers, FaClock, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import bannerImage from '../assets/hero-bg.png';
import programImage from '../assets/rectangle.png';
import beritaApi from '../services/BeritaService';

const ArtikelPage = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentArticles, setRecentArticles] = useState([]);

    useEffect(() => {
        fetchArticleDetail();
        fetchRecentArticles();
        window.scrollTo(0, 0);
    }, [slug]);

    const fetchArticleDetail = async () => {
        try {
            setLoading(true);
            console.log('📰 Fetching article with slug:', slug);
            
            const response = await beritaApi.getBySlug(slug);
            
            console.log('📥 Article response:', response. data);
            
            if (response.data. success) {
                setArticle(response.data.data);
            } else {
                toast.error('Artikel tidak ditemukan');
            }
        } catch (error) {
            console.error('❌ Error fetching article:', error);
            
            if (error.response?.status === 404) {
                toast.error('Artikel tidak ditemukan');
            } else {
                toast.error('Gagal memuat artikel');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentArticles = async () => {
        try {
            const response = await beritaApi.getRecent(3);
            
            if (response.data.success) {
                setRecentArticles(response.data. data || []);
            }
        } catch (error) {
            console.error('❌ Error fetching recent articles:', error);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Memuat artikel...</p>
                </div>
            </div>
        );
    }

    // Not found state
    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Artikel Tidak Ditemukan
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Artikel yang Anda cari tidak ditemukan atau sudah dihapus.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                        >
                            <FaArrowLeft />
                            Kembali
                        </button>
                        <Link
                            to="/berita-tjsl"
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                        >
                            Lihat Semua Berita
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Banner */}
            <section className="relative h-64 w-full">
                <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center">
                    <div className="container mx-auto px-8 lg:px-16">
                        <div className="flex items-center gap-2 text-white text-sm mb-2">
                            <Link to="/" className="hover:underline">Home</Link>
                            <span>/</span>
                            <Link to="/berita-tjsl" className="hover:underline">Berita TJSL</Link>
                            <span>/</span>
                            <span className="font-semibold line-clamp-1">{article.title}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="container mx-auto px-8 lg:px-16 py-12">
                <Link 
                    to="/berita-tjsl" 
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
                >
                    <FaArrowLeft /> Kembali ke Berita
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Article */}
                    <article className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">
                        {/* Header */}
                        <div className="mb-6">
                            <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold mb-4">
                                {article. category}
                            </span>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                {article. title}
                            </h1>
                            
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-blue-600" />
                                    <span>
                                        {article.formatted_date || new Date(article.date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                
                                {article.author && (
                                    <div className="flex items-center gap-2">
                                        <FaUsers className="text-blue-600" />
                                        <span>{article.author}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        article.status === 'published' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {article.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Featured Image */}
                        {article.full_image_url && (
                            <div className="mb-8 rounded-lg overflow-hidden">
                                <img 
                                    src={article.full_image_url} 
                                    alt={article.title}
                                    className="w-full h-96 object-cover"
                                    onError={(e) => {
                                        e.target. src = programImage;
                                    }}
                                />
                            </div>
                        )}

                        {/* Short Description */}
                        {article.short_description && (
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
                                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                                    {article.short_description}
                                </p>
                            </div>
                        )}

                        {/* Description / Content */}
                        <div className="prose max-w-none mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel</h2>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {article.content}
                            </div>
                        </div>

                        {/* Article Footer */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    <p>Diterbitkan pada {article.formatted_date}</p>
                                    {article.views > 0 && (
                                        <p className="mt-1">Dibaca {article.views}x</p>
                                    )}
                                </div>
                                
                                {/* Social Share */}
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">Bagikan:</span>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => {
                                                const url = window.location.href;
                                                navigator.clipboard.writeText(url);
                                                toast.success('Link berhasil disalin! ');
                                            }}
                                            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                            title="Copy Link"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Recent Articles */}
                        {recentArticles.length > 0 && (
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">
                                    Berita Terkini
                                </h3>
                                <div className="space-y-5">
                                    {recentArticles.map((art) => (
                                        <Link 
                                            key={art.id} 
                                            to={`/artikel/${art.slug}`}
                                            className="flex items-start gap-4 group"
                                        >
                                            <img 
                                                src={art. full_image_url || programImage} 
                                                alt={art.title}
                                                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                                                onError={(e) => {
                                                    e. target.src = programImage;
                                                }}
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                    {art.title}
                                                </h4>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {art. formatted_date || new Date(art.date).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Call to Action */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-sm text-white">
                            <h3 className="text-xl font-bold mb-2">Tertarik dengan Program Kami?</h3>
                            <p className="text-blue-100 mb-4 text-sm">
                                Hubungi kami untuk informasi lebih lanjut mengenai program TJSL
                            </p>
                            <Link 
                                to="/kontak" 
                                className="inline-block bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                                Hubungi Kami
                            </Link>
                        </div>

                        {/* Back to List */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <Link 
                                to="/berita-tjsl"
                                className="flex items-center justify-center gap-2 w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors"
                            >
                                Lihat Semua Berita
                            </Link>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default ArtikelPage;