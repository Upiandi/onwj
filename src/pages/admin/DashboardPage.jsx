import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../hooks/useAuth'; <--- INI BIANG KEROKNYA, KITA BUANG
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { 
    FaClock, FaCalendar, FaNewspaper, FaStore, FaQuoteLeft, 
    FaTrophy, FaFilePdf, FaMapMarkerAlt, FaChartBar, FaUsers,
    FaEye, FaArrowRight, FaUserCircle
} from 'react-icons/fa';

const DashboardPage = () => {
    // ==== GANTI useAuth DENGAN DATA PALSU ====
    const user = {
        name: "Admin Developer",
        email: "dev@mujonwj.co.id",
        last_login_at: new Date().toISOString() // Biar seolah-olah baru login
    };

    const [stats, setStats] = useState({
        totalBerita: 0,
        beritaPublished: 0,
        beritaDraft: 0,
        totalUMKM: 0,
        umkmFeatured: 0,
        totalTestimonial: 0,
        testimonialPublished: 0,
        totalPenghargaan: 0,
        totalLaporan: 0,
        totalWkTjsl: 0,
        totalWkTekkom: 0,
    });
    const [loading, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchAllStats();
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const fetchAllStats = async () => {
        try {
            setLoading(true);
            const API_URL = import.meta.env.VITE_API_URL;

            // Note: Karena gak ada backend, ini bakal error/kosong.
            // Tapi aku pasangin pengaman (.catch) biar gak crash websitenya.
            const [beritaRes, umkmRes, testimonialRes, laporanRes, penghargaanRes, wkTjslRes] = await Promise.all([
                fetch(`${API_URL}/v1/admin/berita?per_page=999`).then(r => r.json()).catch(() => ({ data: [] })),
                fetch(`${API_URL}/v1/admin/umkm?per_page=999`).then(r => r.json()).catch(() => ({ data: [] })),
                fetch(`${API_URL}/v1/admin/testimonial?per_page=999`).then(r => r.json()).catch(() => ({ data: [] })),
                fetch(`${API_URL}/v1/admin/laporan?per_page=999`).then(r => r.json()).catch(() => ({ data: [] })),
                fetch(`${API_URL}/v1/admin/penghargaan?per_page=999`).then(r => r.json()).catch(() => ({ data: [] })),
                fetch(`${API_URL}/v1/admin/wk-tjsl?per_page=999`).then(r => r.json()).catch(() => ({ data: [] })),
            ]);

            const berita = beritaRes.data || [];
            const umkm = umkmRes.data || [];
            const testimonial = testimonialRes.data || [];
            const laporan = laporanRes.data || [];
            const penghargaan = penghargaanRes.data || [];
            const wkTjsl = wkTjslRes.data || [];

            setStats({
                totalBerita: berita.length,
                beritaPublished: berita.filter(b => b.status === 'Published').length,
                beritaDraft: berita.filter(b => b.status === 'Draft').length,
                totalUMKM: umkm.length,
                umkmFeatured: umkm.filter(u => u.is_featured).length,
                totalTestimonial: testimonial.length,
                testimonialPublished: testimonial.filter(t => t.status === 'Published').length,
                totalPenghargaan: penghargaan.length,
                totalLaporan: laporan.length,
                totalWkTjsl: wkTjsl.length,
                totalWkTekkom: 0,
            });

        } catch (error) {
            console.error('Failed to fetch stats:', error);
            // Kalau error parah, set ke 0 semua biar ga blank
            setStats({
                totalBerita: 0, beritaPublished: 0, beritaDraft: 0,
                totalUMKM: 0, umkmFeatured: 0,
                totalTestimonial: 0, testimonialPublished: 0,
                totalPenghargaan: 0, totalLaporan: 0,
                totalWkTjsl: 0, totalWkTekkom: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Selamat Pagi';
        if (hour < 15) return 'Selamat Siang';
        if (hour < 18) return 'Selamat Sore';
        return 'Selamat Malam';
    };

    const dataModules = [
        {
            title: 'Berita',
            total: stats.totalBerita,
            icon: FaNewspaper,
            url: '/tukang-minyak-dan-gas/manage-berita',
            details: `${stats.beritaPublished} Published • ${stats.beritaDraft} Draft`
        },
        {
            title: 'UMKM Binaan',
            total: stats.totalUMKM,
            icon: FaStore,
            url: '/tukang-minyak-dan-gas/manage-umkm',
            details: `${stats.umkmFeatured} Featured`
        },
        {
            title: 'Testimonial',
            total: stats.totalTestimonial,
            icon: FaQuoteLeft,
            url: '/tukang-minyak-dan-gas/manage-testimonial',
            details: `${stats.testimonialPublished} Published`
        },
        {
            title: 'Penghargaan',
            total: stats.totalPenghargaan,
            icon: FaTrophy,
            url: '/tukang-minyak-dan-gas/manage-penghargaan',
            details: 'Awards & Achievements'
        },
        {
            title: 'Laporan Tahunan',
            total: stats.totalLaporan,
            icon: FaFilePdf,
            url: '/tukang-minyak-dan-gas/manage-laporan',
            details: 'Annual Reports'
        },
        {
            title: 'Wilayah Kerja TJSL',
            total: stats.totalWkTjsl,
            icon: FaMapMarkerAlt,
            url: '/tukang-minyak-dan-gas/manage-wk-tjsl',
            details: 'Program TJSL Mapping'
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header with Account Info & Clock */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Account Info */}
                <div className="lg:col-span-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md p-6 text-white">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white border-opacity-30">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-1">
                                {getGreeting()}, {user?.name}! 
                            </h1>
                            <p className="text-blue-100">
                                {user?.email}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                <span className="text-sm text-blue-100">Active</span>
                            </div>
                        </div>
                    </div>
                    
                    {user?.last_login_at && (
                        <div className="pt-4 border-t border-white border-opacity-20">
                            <div className="flex items-center gap-2 text-sm text-blue-100">
                                <FaCalendar className="w-4 h-4" />
                                <span>Last login: {format(new Date(user.last_login_at), 'dd MMMM yyyy, HH:mm', { locale: id })}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Live Clock */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 flex flex-col justify-center items-center">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                        <FaClock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-700">WAKTU SAAT INI</span>
                    </div>
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                        {format(currentTime, 'HH:mm:ss')}
                    </div>
                    <div className="text-sm text-gray-600 text-center">
                        {format(currentTime, 'EEEE, dd MMMM yyyy', { locale: id })}
                    </div>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <FaChartBar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {loading ? '...' : stats.totalBerita + stats.totalUMKM + stats.totalTestimonial}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Total Konten</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <FaNewspaper className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {loading ? '...' : stats.beritaPublished}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Berita Published</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <FaStore className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {loading ? '...' : stats.umkmFeatured}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">UMKM Featured</div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <FaQuoteLeft className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        {loading ? '...' : stats.testimonialPublished}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">Testimonial Published</div>
                </div>
            </div>

            {/* Data Modules Grid */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Kelola Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dataModules.map((module, index) => (
                        <a
                            key={index}
                            href={module.url}
                            className="group bg-white border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md hover:border-blue-300 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <module.icon className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">{module.title}</h3>
                                        <p className="text-xs text-gray-500">{module.details}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-bold text-gray-900">
                                        {loading ? '...' : module.total}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">Total Data</div>
                                </div>
                                <FaArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Content Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Status Konten</h2>
                
                <div className="space-y-4">
                    {/* Berita */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Berita</span>
                            <span className="text-sm font-bold text-gray-900">
                                {stats.beritaPublished}/{stats.totalBerita}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.totalBerita > 0 ? (stats.beritaPublished / stats.totalBerita * 100) : 0}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{stats.beritaPublished} Published</span>
                            <span>{stats.beritaDraft} Draft</span>
                        </div>
                    </div>

                    {/* UMKM */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">UMKM Featured</span>
                            <span className="text-sm font-bold text-gray-900">
                                {stats.umkmFeatured}/{stats.totalUMKM}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.totalUMKM > 0 ? (stats.umkmFeatured / stats.totalUMKM * 100) : 0}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {stats.umkmFeatured} dari {stats.totalUMKM} UMKM ditampilkan sebagai featured
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">Testimonial</span>
                            <span className="text-sm font-bold text-gray-900">
                                {stats.testimonialPublished}/{stats.totalTestimonial}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${stats.totalTestimonial > 0 ? (stats.testimonialPublished / stats.totalTestimonial * 100) : 0}%` }}
                            ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                            {stats.testimonialPublished} testimonial telah dipublish
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;