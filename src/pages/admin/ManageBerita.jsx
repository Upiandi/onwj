import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes, FaNewspaper, FaCalendar, FaUser, FaEye, FaSave, FaCheck, FaSearch, FaFilter, FaArrowLeft, FaFileExcel, FaSpinner, FaCog, FaGlobe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

const ManageBerita = () => {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    // 1. Tambahkan State untuk Preview Modal
    const [showPreview, setShowPreview] = useState(false); 
    
    // State untuk data dari API
    const [beritaList, setBeritaList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filteredBerita, setFilteredBerita] = useState([]);
    
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        tjsl: 0,
        pinned: 0,
    });
    
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        category: '',
        author: '',
        image: null,
        imagePreview: null,
        shortDescription: '',
        content: '',
        status: 'draft',
        displayOption: '',
        autoLink: 'none',
        showInTJSL: false,
        showInMediaInformasi: true,
        showInDashboard: false,
        pinToHomepage: false
    });

    const categories = [
        'Sosial',
        'Lingkungan', 
        'Energi',
        'Teknologi',
        'CSR',
        'Pendidikan',
        'Kegiatan Internal'
    ];

    // ===== FETCH DATA FROM API =====
    useEffect(() => {
        fetchBerita();
        fetchStatistics();
    }, []);

    const fetchBerita = async () => {
        try {
            setLoading(true);
            console.log('📥 Fetching berita from admin API...');
            
            const response = await beritaAdminApi.getAll({
                per_page: 999,
                sort_by: 'created_at',
                sort_order: 'desc'
            });
            
            console.log('📊 Berita response:', response.data);
            
            if (response.data.success) {
                console.log('✅ Berita loaded:', response.data.data.length, 'items');
                setBeritaList(response.data.data);
            } else {
                console.warn('⚠️ Response success = false');
                setBeritaList([]);
            }
        } catch (error) {
            console.error('❌ Error fetching berita:', error);
            toast.error('Gagal memuat data berita');
            setBeritaList([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            console.log('📊 Fetching statistics...');
            const response = await beritaAdminApi.getStatistics();
            
            console.log('📈 Statistics response:', response.data);
            
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('❌ Error fetching statistics:', error);
        }
    };

    // ===== FILTERING =====
    useEffect(() => {
        let result = [...beritaList];

        if (searchTerm) {
            result = result.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCategory) {
            result = result.filter(item => item.category === filterCategory);
        }

        if (filterStatus) {
            result = result.filter(item => item.status.toLowerCase() === filterStatus.toLowerCase());
        }

        setFilteredBerita(result);
    }, [searchTerm, filterCategory, filterStatus, beritaList]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStatus('');
    };

    // ===== EXPORT TO EXCEL =====
    const exportToExcel = () => {
        try {
            if (filteredBerita.length === 0) {
                toast.error('⚠️ Tidak ada data untuk diexport! ');
                return;
            }

            const exportData = filteredBerita.map((item, index) => ({
                'No': index + 1,
                'Judul': item.title || '-',
                'Kategori': item.category || '-',
                'Tanggal': item.date ? new Date(item.date).toLocaleDateString('id-ID') : '-',
                'Penulis': item.author || '-',
                'Status': item.status || '-',
                'Tampil di TJSL': item.show_in_tjsl ? 'Ya' : 'Tidak',
                'Tampil di Media Informasi': item.show_in_media_informasi ? 'Ya' : 'Tidak',
                'Tampil di Dashboard': item.show_in_dashboard ? 'Ya' : 'Tidak',
                'Pinned ke Homepage': item.pin_to_homepage ? 'Ya' : 'Tidak',
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);

            ws['!cols'] = [
                { wch: 5 }, { wch: 50 }, { wch: 15 }, { wch: 20 },
                { wch: 20 }, { wch: 12 }, { wch: 18 }, { wch: 25 },
                { wch: 20 }, { wch: 22 }
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Data Berita');

            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `Data_Berita_MHJ_ONWJ_${timestamp}.xlsx`;

            XLSX.writeFile(wb, filename);

            toast.success(`✅ Data berhasil diexport!\n\nTotal: ${filteredBerita.length} berita`);

        } catch (error) {
            console.error('❌ Error exporting to Excel:', error);
            toast.error('❌ Gagal export ke Excel! ');
        }
    };

    // ===== FORM HANDLERS =====
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Ukuran file terlalu besar! Maksimal 5MB');
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                image: file,
                imagePreview: URL.createObjectURL(file)
            }));
        }
    };

    const removeImage = () => {
        if (formData.imagePreview) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: null
        }));
    };

    const resetForm = () => {
        if (formData.imagePreview) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData({
            title: '',
            date: '',
            category: '',
            author: '',
            image: null,
            imagePreview: null,
            shortDescription: '',
            content: '',
            status: 'draft',
            displayOption: '',
            autoLink: 'none',
            showInTJSL: false,
            showInMediaInformasi: true,
            showInDashboard: false,
            pinToHomepage: false
        });
        setEditingId(null);
    };

    // ===== SUBMIT FORM (CREATE/UPDATE) =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.date || !formData.category || !formData.content) {
            toast.error('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        if (!formData.image && !editingId && !formData.imagePreview) { // Cek imagePreview untuk kasus edit tanpa ganti gambar
            toast.error('Mohon upload foto berita!');
            return;
        }

        try {
            setSubmitting(true);

            // Prepare FormData
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('date', formData.date);
            submitData.append('category', formData.category);
            submitData.append('author', formData.author || '');
            submitData.append('short_description', formData.shortDescription || '');
            submitData.append('content', formData.content);
            submitData.append('status', formData.status);
            submitData.append('display_option', formData.displayOption || '');
            submitData.append('auto_link', formData.autoLink || 'none');
            submitData.append('show_in_tjsl', formData.showInTJSL ? '1' : '0');
            submitData.append('show_in_media_informasi', formData.showInMediaInformasi ? '1' : '0');
            submitData.append('show_in_dashboard', formData.showInDashboard ? '1' : '0');
            submitData.append('pin_to_homepage', formData.pinToHomepage ? '1' : '0');

            if (formData.image) {
                submitData.append('image', formData.image);
            }
            
            // Tambahkan method PUT/PATCH untuk Laravel (jika menggunakan POST untuk file upload)
            if (editingId) {
                submitData.append('_method', 'POST'); 
            }

            let response;
            if (editingId) {
                // Gunakan POST jika backend di-handle dengan post() untuk update file, seperti di rute backend Laravel Anda
                response = await beritaAdminApi.update(editingId, submitData); 
                toast.success('✅ Berita berhasil diupdate! ');
            } else {
                response = await beritaAdminApi.create(submitData);
                toast.success('✅ Berita berhasil ditambahkan!');
            }

            // Refresh data
            await fetchBerita();
            await fetchStatistics();

            setShowForm(false);
            resetForm();

        } catch (error) {
            console.error('Error submitting berita:', error);
            const errorMsg = error.response?.data?.message || 'Gagal menyimpan berita';
            toast.error(`❌ ${errorMsg}`);
        } finally {
            setSubmitting(false);
        }
    };

    // ===== EDIT =====
    const handleEdit = (id) => {
        const berita = beritaList.find(b => b.id === id);
        if (berita) {
            setFormData({
                title: berita.title,
                date: berita.date,
                category: berita.category,
                author: berita.author || '',
                image: null,
                imagePreview: berita.full_image_url || null, // Menggunakan URL penuh dari API
                shortDescription: berita.short_description || '',
                content: berita.content || '',
                status: berita.status,
                displayOption: berita.display_option || '',
                autoLink: berita.auto_link || 'none',
                showInTJSL: berita.show_in_tjsl,
                showInMediaInformasi: berita.show_in_media_informasi,
                showInDashboard: berita.show_in_dashboard,
                pinToHomepage: berita.pin_to_homepage
            });
            setEditingId(id);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // ===== DELETE =====
    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus berita ini?')) {
            try {
                await beritaAdminApi.delete(id);
                toast.success('✅ Berita berhasil dihapus!');
                
                // Refresh data
                await fetchBerita();
                await fetchStatistics();
            } catch (error) {
                console.error('Error deleting berita:', error);
                toast.error('❌ Gagal menghapus berita! ');
            }
        }
    };

    const handleCancel = () => {
        if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang. ')) {
            setShowForm(false);
            resetForm();
        }
    };

    // 2. Update handlePreview Function
    const handlePreview = () => {
        if (!formData.title || !formData.content) {
            toast.error('Mohon isi minimal judul dan konten untuk preview!');
            return;
        }
        setShowPreview(true); // ✅ Buka modal preview
    };

    // ===== RENDER =====
    if (loading && !showForm) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div>
            {/* Tombol Kembali */}
            {showForm && (
                <button
                    onClick={() => {
                        handleCancel(); // Memanggil handleCancel agar ada konfirmasi
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-all mb-6"
                >
                    <FaArrowLeft />
                    Kembali
                </button>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Berita</h1>
                    <p className="text-gray-600 mt-1">Manajemen berita dan artikel perusahaan</p>
                </div>
                
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                    >
                        <FaPlus />
                        Tambah Berita Baru
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            {!showForm && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaNewspaper className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.total}</div>
                        <div className="text-sm text-blue-100">Total Berita</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaCheck className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.published}</div>
                        <div className="text-sm text-green-100">Published</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaNewspaper className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.tjsl}</div>
                        <div className="text-sm text-purple-100">Berita TJSL</div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaNewspaper className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.pinned}</div>
                        <div className="text-sm text-orange-100">Pinned</div>
                    </div>
                </div>
            )}

            {/* Search & Filter + Export Button */}
            {!showForm && (
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <FaFilter className="text-gray-500" />
                            <h3 className="text-lg font-semibold text-gray-900">Pencarian & Filter</h3>
                        </div>

                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            <FaFileExcel className="w-5 h-5" />
                            Export ke Excel
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari judul, penulis, kategori..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Kategori</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Status</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>

                    {(searchTerm || filterCategory || filterStatus) && (
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-blue-600">{filteredBerita.length}</span> dari {beritaList.length} berita
                            </p>
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
                            >
                                <FaTimes />
                                Hapus Filter
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ========== FORM INPUT BERITA ========== */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? 'Edit Berita' : 'Tambah Berita Baru'}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Lengkapi formulir di bawah ini untuk mengelola konten berita
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Basic Information */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FaNewspaper className="w-4 h-4 text-blue-600" />
                                </div>
                                Informasi Dasar
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Judul Berita <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Masukkan judul berita yang menarik dan informatif"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaCalendar className="w-4 h-4 text-gray-500" />
                                            Tanggal Publikasi <span className="text-red-500">*</span>
                                        </div>
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Kategori <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="w-4 h-4 text-gray-500" />
                                            Penulis / Sumber
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        name="author"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Nama penulis atau sumber berita"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Media Upload */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FaImage className="w-4 h-4 text-purple-600" />
                                </div>
                                Media & Gambar
                            </h3>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all bg-gray-50">
                                {!formData.imagePreview ? (
                                    <div>
                                        <input
                                            type="file"
                                            id="image-upload"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="image-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4">
                                                <FaImage className="w-8 h-8 text-blue-600" />
                                            </div>
                                            <span className="text-blue-600 font-semibold hover:text-blue-700 mb-2 text-lg">
                                                Klik untuk upload gambar
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                Format: PNG, JPG, atau WEBP (Maksimal 5MB)
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative inline-block">
                                        <img
                                            src={formData.imagePreview}
                                            alt="Preview"
                                            className="max-h-80 rounded-xl shadow-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-xl transition-all transform hover:scale-110"
                                        >
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Section 3: Content */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FaNewspaper className="w-4 h-4 text-green-600" />
                                </div>
                                Konten Berita
                            </h3>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Deskripsi Singkat
                                </label>
                                <textarea
                                    name="shortDescription"
                                    value={formData.shortDescription}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Ringkasan berita yang akan ditampilkan di daftar (maksimal 200 karakter)"
                                    maxLength="200"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-gray-500">
                                        Ringkasan ini akan muncul pada preview card berita
                                    </p>
                                    <p className="text-sm font-medium text-gray-600">
                                        {formData.shortDescription.length}/200
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Konten Lengkap <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    rows="12"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm"
                                    placeholder="Tulis konten berita lengkap di sini..."
                                    required
                                />
                                <p className="text-sm text-gray-500 mt-2">
                                    Gunakan paragraf pendek dan bahasa yang mudah dipahami
                                </p>
                            </div>
                        </div>

                        {/* Section 4: Settings (Pengaturan Publikasi) */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <FaCog className="w-4 h-4 text-orange-600" />
                                </div>
                                Pengaturan Publikasi
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status Publikasi <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="draft">Draft (Belum Dipublikasi)</option>
                                        <option value="published">Published (Tampilkan di Website)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Auto-Link Konten
                                    </label>
                                    <select
                                        name="autoLink"
                                        value={formData.autoLink}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <option value="none">Tidak ada link</option>
                                        <option value="program">Hubungkan dengan Program TJSL</option>
                                        <option value="umkm">Hubungkan dengan UMKM Binaan</option>
                                        <option value="penghargaan">Hubungkan dengan Penghargaan</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 5: Distribution (Distribusi Konten) */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                    <FaGlobe className="w-4 h-4 text-indigo-600" />
                                </div>
                                Distribusi Konten
                            </h3>
                            
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                                <p className="text-sm text-gray-700 mb-4 font-medium">
                                    Pilih di mana berita ini akan ditampilkan
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-transparent hover:border-blue-400 transition-all">
                                        <input
                                            type="checkbox"
                                            name="showInTJSL"
                                            checked={formData.showInTJSL}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 block">Berita TJSL</span>
                                            <span className="text-xs text-gray-600">Tampil di /berita-tjsl</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-transparent hover:border-blue-400 transition-all">
                                        <input
                                            type="checkbox"
                                            name="showInMediaInformasi"
                                            checked={formData.showInMediaInformasi}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 block">Media & Informasi</span>
                                            <span className="text-xs text-gray-600">Tampil di /media-informasi</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-transparent hover:border-blue-400 transition-all">
                                        <input
                                            type="checkbox"
                                            name="showInDashboard"
                                            checked={formData.showInDashboard}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 block">Statistik Dashboard</span>
                                            <span className="text-xs text-gray-600">Masuk ke hitungan statistik</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-transparent hover:border-orange-400 transition-all">
                                        <input
                                            type="checkbox"
                                            name="pinToHomepage"
                                            checked={formData.pinToHomepage}
                                            onChange={handleInputChange}
                                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 mt-0.5"
                                        />
                                        <div>
                                            <span className="text-sm font-semibold text-gray-900 block flex items-center gap-2">
                                                Pin ke Homepage
                                                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">FEATURED</span>
                                            </span>
                                            <span className="text-xs text-gray-600">Tampil di landing page</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                disabled={submitting}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handlePreview}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all"
                                disabled={submitting}
                            >
                                <FaEye />
                                Preview
                            </button>
                            <button
                                type="submit"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <FaSave />
                                        {editingId ? 'Update Berita' : 'Simpan Berita'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ========== TABLE LIST BERITA ========== */}
            {!showForm && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Judul
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Tanggal
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Ditampilkan Di
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBerita.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-semibold text-gray-900 line-clamp-2">{item.title}</div>
                                            <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                <FaUser className="w-3 h-3" />
                                                {item.author || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {item.formatted_date || new Date(item.date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.status === 'published' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status === 'published' ? 'Published' : 'Draft'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {item.show_in_tjsl && (
                                                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-md font-semibold">
                                                        TJSL
                                                    </span>
                                                )}
                                                {item.show_in_media_informasi && (
                                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-semibold">
                                                        Media
                                                    </span>
                                                )}
                                                {item.show_in_dashboard && (
                                                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-md font-semibold">
                                                        Dashboard
                                                    </span>
                                                )}
                                                {item.pin_to_homepage && (
                                                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-md font-semibold">
                                                        PINNED
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(item.id)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                    title="Hapus"
                                                >
                                                    <FaTrash className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {filteredBerita.length === 0 && !loading && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <FaNewspaper className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                {searchTerm || filterCategory || filterStatus
                                    ? 'Tidak ada berita yang sesuai dengan filter'
                                    : 'Belum ada berita'}
                            </p>
                            <p className="text-gray-400 text-sm mb-4">
                                {searchTerm || filterCategory || filterStatus
                                    ? 'Coba ubah kriteria pencarian atau filter'
                                    : 'Mulai tambahkan berita pertama Anda'}
                            </p>
                            {!(searchTerm || filterCategory || filterStatus) && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    Tambah Berita Pertama
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
            
            {/* 3. Tambahkan Preview Modal Component */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header Modal */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <FaEye className="text-blue-600" />
                                Preview Berita
                            </h3>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <FaTimes className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>

                        {/* Content Modal */}
                        <div className="p-8">
                            {/* Header Berita */}
                            <div className="mb-6">
                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                                        {formData.category}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaCalendar className="w-4 h-4" />
                                        {new Date(formData.date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month:  'long',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    {formData.author && (
                                        <span className="flex items-center gap-1">
                                            <FaUser className="w-4 h-4" />
                                            {formData.author}
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full font-semibold text-xs ${
                                        formData.status === 'published' 
                                            ? 'bg-green-100 text-green-700' 
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {formData.status === 'published' ? 'Published' : 'Draft'}
                                    </span>
                                </div>

                                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                    {formData.title || 'Judul Berita'}
                                </h1>

                                {formData.shortDescription && (
                                    <p className="text-lg text-gray-600 italic border-l-4 border-blue-500 pl-4">
                                        {formData.shortDescription}
                                    </p>
                                )}
                            </div>

                            {/* Gambar */}
                            {formData.imagePreview && (
                                <div className="mb-8">
                                    <img
                                        src={formData.imagePreview}
                                        alt={formData.title}
                                        className="w-full rounded-xl shadow-lg"
                                    />
                                </div>
                            )}

                            {/* Konten */}
                            <div className="prose prose-lg max-w-none">
                                <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                                    {formData.content || 'Konten berita... '}
                                </div>
                            </div>

                            {/* Tags/Badges */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Distribusi Konten: </h4>
                                <div className="flex flex-wrap gap-2">
                                    {formData.showInTJSL && (
                                        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                                            Berita TJSL
                                        </span>
                                    )}
                                    {formData.showInMediaInformasi && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                                            Media & Informasi
                                        </span>
                                    )}
                                    {formData.showInDashboard && (
                                        <span className="text-xs bg-teal-100 text-teal-700 px-3 py-1 rounded-full font-semibold">
                                            Dashboard
                                        </span>
                                    )}
                                    {formData.pinToHomepage && (
                                        <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">
                                            PINNED - Homepage
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-6 py-2 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    setShowPreview(false);
                                    // Auto scroll ke form
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
                            >
                                Edit Berita
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBerita;