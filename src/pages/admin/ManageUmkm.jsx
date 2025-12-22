import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Ditambahkan
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes, FaStore, FaStar, FaSearch, FaFilter, FaLink, FaPhone, FaMapMarkerAlt, FaUser, FaCalendar, FaTrophy, FaArrowLeft, FaFileExcel } from 'react-icons/fa';
import { umkmService } from '../../services/umkmService';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const ManageUmkm = () => {
    const navigate = useNavigate(); // <-- Ditambahkan: Inisialisasi useNavigate
    const [umkmList, setUmkmList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // Tambahkan state Submitting
    
    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterFeatured, setFilterFeatured] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        owner: '',
        location: '',
        description: '',
        testimonial: '',
        shop_link: '',
        contact_number: '',
        status: 'Aktif',
        year_started: new Date().getFullYear(),
        achievement: '',
        is_featured: false,
        image: null,
        imagePreview: null
    });

    const categories = [
        'Kuliner',
        'Kerajinan',
        'Agribisnis',
        'Fashion',
        'Jasa',
        'Lainnya'
    ];

    const statusOptions = ['Aktif', 'Lulus Binaan', 'Dalam Proses'];

    // Fetch UMKM data from API
    useEffect(() => {
        fetchUmkmData();
    }, []);

    // Filter & Search Logic (kode ini tetap)
    useEffect(() => {
        let result = [...umkmList];

        // Search
        if (searchTerm) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by Category
        if (filterCategory) {
            result = result.filter(item => item.category === filterCategory);
        }

        // Filter by Status
        if (filterStatus) {
            result = result.filter(item => item.status === filterStatus);
        }

        // Filter by Featured
        if (filterFeatured === 'true') {
            result = result.filter(item => item.is_featured === true);
        } else if (filterFeatured === 'false') {
            result = result.filter(item => item.is_featured === false);
        }

        setFilteredList(result);
    }, [searchTerm, filterCategory, filterStatus, filterFeatured, umkmList]);

    const fetchUmkmData = async () => {
        try {
            setLoading(true);
            const response = await umkmService.adminGetAllUmkm();
            
            if (response && response.success) { // <-- Penanganan Response 200 OK
                setUmkmList(response.data);
                setFilteredList(response.data);
            } else {
                throw new Error(response?.message || 'Gagal memuat data UMKM: Respon API tidak valid.');
            }
        } catch (error) {
            console.error('Error fetching UMKM:', error);
            
            // Penanganan Error 401 (Unauthorized)
            if (error.response && error.response.status === 401) {
                toast.error('Sesi Anda berakhir. Mohon login ulang.');
                navigate('/tukang-minyak-dan-gas/login');
                return; 
            }
            
            // Penanganan error umum
            toast.error('Gagal memuat data UMKM'); 
        } finally {
            setLoading(false);
        }
    };

    // ✅ EXPORT TO EXCEL - OPTIMIZED VERSION (Kode tetap sama)
    const exportToExcel = () => {
        try {
            // Check if data is empty
            if (filteredList.length === 0) {
                toast.error('⚠️ Tidak ada data untuk diexport!');
                return;
            }

            // Prepare export data with proper formatting and null safety
            const exportData = filteredList.map((item, index) => ({
                'No': index + 1,
                'Nama UMKM': item.name || '-',
                'Kategori': item.category || '-',
                'Pemilik': item.owner || '-',
                'Lokasi': item.location || '-',
                'Status': item.status || '-',
                'Tahun Mulai': item.year_started || '-',
                'Deskripsi': item.description || '-',
                'Testimonial': item.testimonial || '-',
                'Pencapaian': item.achievement || '-',
                'Link Toko': item.shop_link || '-',
                'No. WhatsApp': item.contact_number || '-',
                'Featured': item.is_featured ? 'Ya' : 'Tidak',
            }));

            // Create workbook and worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);

            // Set column widths for better readability
            ws['!cols'] = [
                { wch: 5 },   // No
                { wch: 35 },  // Nama UMKM
                { wch: 15 },  // Kategori
                { wch: 25 },  // Pemilik
                { wch: 30 },  // Lokasi
                { wch: 15 },  // Status
                { wch: 12 },  // Tahun Mulai
                { wch: 50 },  // Deskripsi
                { wch: 50 },  // Testimonial
                { wch: 30 },  // Pencapaian
                { wch: 35 },  // Link Toko
                { wch: 18 },  // No. WhatsApp
                { wch: 10 }   // Featured
            ];

            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(wb, ws, 'Data UMKM Binaan');

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `Data_UMKM_Binaan_MHJ_ONWJ_${timestamp}.xlsx`;

            // Write and download file
            XLSX.writeFile(wb, filename);

            // Success notification with details
            toast.success(`✅ Data berhasil diexport ke Excel!\n\nFile: ${filename}\nTotal data: ${filteredList.length} UMKM`);
            
            console.log('✅ Export Excel berhasil:', {
                filename,
                totalRows: filteredList.length,
                timestamp,
                exportedData: exportData
            });

        } catch (error) {
            console.error('❌ Error exporting to Excel:', error);
            toast.error(`❌ Gagal export ke Excel!\n\nError: ${error.message}\n\nSilakan coba lagi atau hubungi administrator.`);
        }
    };

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
        if (formData.imagePreview && !formData.imagePreview.startsWith('http')) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData(prev => ({
            ...prev,
            image: null,
            imagePreview: null
        }));
    };

    const resetForm = () => {
        if (formData.imagePreview && !formData.imagePreview.startsWith('http')) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData({
            name: '',
            category: '',
            owner: '',
            location: '',
            description: '',
            testimonial: '',
            shop_link: '',
            contact_number: '',
            status: 'Aktif',
            year_started: new Date().getFullYear(),
            achievement: '',
            is_featured: false,
            image: null,
            imagePreview: null
        });
        setEditingId(null);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setFilterCategory('');
        setFilterStatus('');
        setFilterFeatured('');
    };

    // 🔥 FUNGSI HANDLE SUBMIT YANG SUDAH DIPERBAIKI
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.category || !formData.owner || !formData.location || !formData.description) {
            toast.error('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        if (!formData.image && !editingId) {
            toast.error('Mohon upload foto produk!');
            return;
        }

        if (formData.is_featured && !formData.testimonial.trim()) {
            toast.error('Untuk UMKM Featured, mohon isi Cerita Sukses/Testimonial!');
            return;
        }

        const submitData = new FormData();
        
        // MAPPING FIELD DARI camelCase di state ke snake_case di Backend
        submitData.append('name', formData.name);
        submitData.append('category', formData.category);
        submitData.append('owner', formData.owner);
        submitData.append('location', formData.location);
        submitData.append('description', formData.description || '');
        submitData.append('testimonial', formData.testimonial || '');
        submitData.append('shop_link', formData.shop_link || ''); // ✅ snake_case
        submitData.append('contact_number', formData.contact_number || ''); // ✅ snake_case
        submitData.append('status', formData.status || 'Aktif');
        submitData.append('year_started', formData.year_started); // Cek: Jika ini string di state, Laravel akan mengkonversi
        submitData.append('achievement', formData.achievement || '');
        submitData.append('is_featured', formData.is_featured ? 1 : 0);
        
        if (formData.image) {
            submitData.append('image', formData.image);
        }

        try {
            setIsSubmitting(true);
            const loadingToast = toast.loading(editingId ? 'Mengupdate UMKM...' : 'Menambahkan UMKM...');
            
            // DEBUG LOG: MENGIRIM DATA
            console.log('📤 Submitting UMKM Data: ');
            for (let [key, value] of submitData.entries()) {
                console.log(`  ${key}:`, value);
            }

            let response;
            if (editingId) {
                // Laravel workaround untuk multipart/form-data PUT/PATCH
                submitData.append('_method', 'POST'); 
                
                // Gunakan post, tetapi tambahkan _method: 'PUT'/'PATCH' di formData
                response = await umkmService.updateUmkm(editingId, submitData); 
            } else {
                response = await umkmService.createUmkm(submitData);
            }

            toast.dismiss(loadingToast);

            if (response.success) {
                toast.success(editingId ? 'UMKM berhasil diupdate!' : 'UMKM berhasil ditambahkan!');
                
                await fetchUmkmData();
                setShowForm(false);
                resetForm();
            } else {
                // Jika response 200 OK tapi success: false
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('❌ Full Error:', error);
            console.error('❌ Error Response:', error.response?.data);
            
            toast.dismiss(toast.loading());
            
            // Penanganan 401 (Unauthorized)
            if (error.response && error.response.status === 401) {
                toast.error('Sesi Anda berakhir. Mohon login ulang.');
                navigate('/tukang-minyak-dan-gas/login');
                return;
            }

            // Penanganan 422 (Validation Error)
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.keys(errors).forEach(key => {
                    toast.error(`${key}: ${errors[key][0]}`);
                });
            } else {
                // Penanganan error umum atau 500
                const errorMsg = error.message || error.response?.data?.message || 'Gagal menyimpan data UMKM';
                toast.error(`❌ ${errorMsg}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    // AKHIR DARI FUNGSI HANDLE SUBMIT YANG DIPERBAIKI

    const handleEdit = (umkm) => {
        setFormData({
            name: umkm.name,
            category: umkm.category,
            owner: umkm.owner,
            location: umkm.location,
            description: umkm.description,
            testimonial: umkm.testimonial || '',
            shop_link: umkm.shop_link || '',
            contact_number: umkm.contact_number || '',
            status: umkm.status,
            year_started: umkm.year_started,
            achievement: umkm.achievement || '',
            is_featured: umkm.is_featured,
            image: null,
            imagePreview: umkm.full_image_url || umkm.image_url || null
        });
        setEditingId(umkm.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Apakah Anda yakin ingin menghapus UMKM ini?')) {
            return;
        }

        try {
            const loadingToast = toast.loading('Menghapus UMKM...');
            const response = await umkmService.deleteUmkm(id);
            toast.dismiss(loadingToast);

            if (response.success) {
                toast.success('UMKM berhasil dihapus!');
                fetchUmkmData();
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            console.error('Error deleting UMKM:', error);
            
            // Tambahkan penanganan 401 saat delete
            if (error.response && error.response.status === 401) {
                toast.error('Sesi Anda berakhir. Mohon login ulang.');
                navigate('/tukang-minyak-dan-gas/login');
                return;
            }
            
            toast.error(error.message || 'Gagal menghapus UMKM');
        }
    };

    const handleCancel = () => {
        if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang.')) {
            setShowForm(false);
            resetForm();
        }
    };

    // Stats Calculation
    const stats = {
        total: umkmList.length,
        featured: umkmList.filter(u => u.is_featured).length,
        active: umkmList.filter(u => u.status === 'Aktif').length,
        graduated: umkmList.filter(u => u.status === 'Lulus Binaan').length,
    };

    return (
        <div>
            {/* Tombol Kembali - Hanya Muncul di Page Input */}
            {showForm && (
                <button
                    onClick={() => {
                        setShowForm(false);
                        resetForm();
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
                    <h1 className="text-3xl font-bold text-gray-900">Kelola UMKM Binaan</h1>
                    <p className="text-gray-600 mt-1">Manajemen UMKM mitra binaan perusahaan</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                    >
                        <FaPlus />
                        Tambah UMKM Baru
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            {!showForm && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaStore className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.total}</div>
                        <div className="text-sm text-blue-100">Total UMKM</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaStar className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.featured}</div>
                        <div className="text-sm text-yellow-100">Featured</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.active}</div>
                        <div className="text-sm text-green-100">Aktif</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaTrophy className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.graduated}</div>
                        <div className="text-sm text-purple-100">Lulus Binaan</div>
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

                        {/* Export Excel Button */}
                        <button
                            onClick={exportToExcel}
                            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            title="Export data UMKM ke Excel"
                        >
                            <FaFileExcel className="w-5 h-5" />
                            Export ke Excel
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama, pemilik, lokasi..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Filter Category */}
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

                        {/* Filter Status */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Status</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        {/* Filter Featured */}
                        <select
                            value={filterFeatured}
                            onChange={(e) => setFilterFeatured(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Tipe</option>
                            <option value="true">Featured Only</option>
                            <option value="false">Non-Featured</option>
                        </select>
                    </div>

                    {/* Clear Filter Button */}
                    {(searchTerm || filterCategory || filterStatus || filterFeatured) && (
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-blue-600">{filteredList.length}</span> dari {umkmList.length} UMKM
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

            {/* Form Input UMKM */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? 'Edit UMKM Binaan' : 'Tambah UMKM Binaan Baru'}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Lengkapi formulir di bawah untuk mengelola data UMKM binaan
                            </p>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Section 1: Basic Info */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FaStore className="w-4 h-4 text-blue-600" />
                                </div>
                                Informasi Dasar UMKM
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nama UMKM / Produk <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Contoh: Kopi Mangrove Segara"
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

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaUser className="w-4 h-4 text-gray-500" />
                                            Nama Pemilik <span className="text-red-500">*</span>
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        name="owner"
                                        value={formData.owner}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Contoh: Ibu Siti Aminah"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="w-4 h-4 text-gray-500" />
                                            Lokasi / Wilayah <span className="text-red-500">*</span>
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Contoh: Muara Gembong, Bekasi"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status Binaan <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Description */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                Deskripsi & Cerita
                            </h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Deskripsi Produk / Usaha <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Jelaskan tentang produk atau usaha UMKM ini..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Cerita Sukses / Testimonial
                                        {formData.is_featured && <span className="text-red-500">*</span>}
                                    </label>
                                    <textarea
                                        name="testimonial"
                                        value={formData.testimonial}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Contoh: Dulu saya cuma bisa jual 10 bungkus sehari, setelah dapat pelatihan pengemasan dari MHJ ONWJ, sekarang bisa kirim ke luar kota. Omzet naik 300%!"
                                        required={formData.is_featured}
                                    />
                                    <p className="text-sm text-gray-500 mt-2">
                                        {formData.is_featured ? 'Wajib diisi untuk UMKM Featured' : 'Testimonial pemilik untuk menginspirasi UMKM lain'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Media Upload */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FaImage className="w-4 h-4 text-purple-600" />
                                </div>
                                Foto Produk
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
                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4">
                                                <FaImage className="w-8 h-8 text-purple-600" />
                                            </div>
                                            <span className="text-blue-600 font-semibold hover:text-blue-700 mb-2 text-lg">
                                                Klik untuk upload foto produk
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

                        {/* Section 4: Contact & Additional Info */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <FaPhone className="w-4 h-4 text-orange-600" />
                                </div>
                                Kontak & Informasi Tambahan
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaLink className="w-4 h-4 text-gray-500" />
                                            Link Toko Online
                                        </div>
                                    </label>
                                    <input
                                        type="url"
                                        name="shop_link" // field name sesuai state
                                        value={formData.shop_link}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="https://tokopedia.com/..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaPhone className="w-4 h-4 text-gray-500" />
                                            Nomor WhatsApp
                                        </div>
                                    </label>
                                    <input
                                        type="tel"
                                        name="contact_number" // field name sesuai state
                                        value={formData.contact_number}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="62812xxxx"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaCalendar className="w-4 h-4 text-gray-500" />
                                            Tahun Mulai Binaan <span className="text-red-500">*</span>
                                        </div>
                                    </label>
                                    <input
                                        type="number"
                                        name="year_started" // field name sesuai state
                                        value={formData.year_started}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        min="2020"
                                        max="2030"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <FaTrophy className="w-4 h-4 text-gray-500" />
                                            Pencapaian / Omzet
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        name="achievement"
                                        value={formData.achievement}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="Contoh: Omzet naik 300%"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Featured Checkbox */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border-2 border-yellow-200">
                            <label className="flex items-start gap-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="is_featured"
                                    checked={formData.is_featured}
                                    onChange={handleInputChange}
                                    className="w-6 h-6 text-yellow-600 rounded focus:ring-yellow-500 mt-1"
                                />
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <FaStar className="text-yellow-500 w-5 h-5" />
                                        <span className="font-bold text-gray-900 text-lg">UMKM Featured</span>
                                    </div>
                                    <p className="text-sm text-gray-700">
                                        UMKM ini akan ditampilkan di section unggulan (paling atas) dengan cerita sukses lengkap.
                                        Pastikan field <strong>"Cerita Sukses/Testimonial"</strong> sudah diisi dengan baik untuk menginspirasi UMKM lain.
                                    </p>
                                </div>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                                disabled={isSubmitting}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Memproses...' : (editingId ? 'Update UMKM' : 'Simpan UMKM')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Loading State */}
            {loading && !showForm && (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">Memuat data UMKM...</p>
                </div>
            )}

            {/* Table List UMKM */}
            {!showForm && !loading && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        UMKM
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Pemilik & Lokasi
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Tahun
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Featured
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredList.map((item) => (
                                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {item.full_image_url || item.image_url ? (
                                                    <img 
                                                        src={item.full_image_url || item.image_url} 
                                                        alt={item.name} 
                                                        className="w-14 h-14 rounded-lg object-cover shadow-md" 
                                                    />
                                                ) : (
                                                    <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                        <FaStore className="text-gray-500 w-6 h-6" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                                                    <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-semibold text-gray-900">{item.owner}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <FaMapMarkerAlt className="w-3 h-3" />
                                                {item.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.status === 'Aktif' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : item.status === 'Lulus Binaan'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap">
                                            {item.year_started}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.is_featured && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border border-yellow-200">
                                                    <FaStar className="w-3 h-3" />
                                                    Featured
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(item)}
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
                    
                    {/* Empty State */}
                    {filteredList.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <FaStore className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                {searchTerm || filterCategory || filterStatus || filterFeatured
                                    ? 'Tidak ada UMKM yang sesuai dengan filter'
                                    : 'Belum ada UMKM binaan'}
                            </p>
                            <p className="text-gray-400 text-sm mb-4">
                                {searchTerm || filterCategory || filterStatus || filterFeatured
                                    ? 'Coba ubah kriteria pencarian atau filter'
                                    : 'Mulai tambahkan UMKM binaan pertama Anda'}
                            </p>
                            {!(searchTerm || filterCategory || filterStatus || filterFeatured) && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    Tambah UMKM Pertama
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageUmkm;