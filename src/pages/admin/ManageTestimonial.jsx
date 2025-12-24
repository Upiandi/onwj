import React, { useState, useEffect } from 'react';
import { 
    FaEdit, FaTrash, FaPlus, FaImage, FaTimes, FaQuoteLeft, 
    FaSearch, FaFilter, FaUser, FaMapMarkerAlt, FaCheck, 
    FaArrowLeft, FaFileExcel, FaStar, FaFileAlt, FaCalendarAlt 
} from 'react-icons/fa';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

// ✅ IMPORT SERVICE (Pastikan path dan nama file sesuai)

const ManageTestimonial = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    
    // Data States
    const [testimonialList, setTestimonialList] = useState([]);
    const [filteredTestimonials, setFilteredTestimonials] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        draft: 0,
        this_month: 0,
        featured: 0
    });
    
    // Search & Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [filterProgram, setFilterProgram] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        program: '',
        testimonial: '',
        avatar: null,
        avatarPreview: null,
        status: 'published',
        featured: false
    });

    const programOptions = [
        'Program Mangrove',
        'Program Pendidikan',
        'Program Kesehatan',
        'Program UKM',
        'Program Ekowisata',
        'Program Lingkungan',
        'Program Sosial',
        'Lainnya'
    ];

    const statusOptions = ['published', 'draft'];

    // ===== FETCH DATA FROM API =====
    useEffect(() => {
        fetchTestimonials();
        fetchStatistics();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            // Menggunakan Service
            const response = await testimonialAdminApi.getAll({
                per_page: 999,
                sort_by: 'created_at',
                sort_order: 'desc'
            });
            
            // Sesuaikan dengan struktur response service Anda
            if (response.data && response.data.success) {
                setTestimonialList(response.data.data);
                setFilteredTestimonials(response.data.data);
            }
        } catch (error) {
            console.error('❌ Error fetching testimonials:', error);
            toast.error('Gagal memuat data testimonial');
        } finally {
            setLoading(false);
        }
    };

    const fetchStatistics = async () => {
        try {
            const response = await testimonialAdminApi.getStatistics();
            if (response.data && response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            console.error('❌ Error fetching statistics:', error);
        }
    };

    // ===== SEARCH & FILTER LOGIC =====
    useEffect(() => {
        let result = [...testimonialList];

        if (searchTerm) {
            result = result.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.testimonial.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterProgram) {
            result = result.filter(item => item.program === filterProgram);
        }

        if (filterStatus) {
            result = result.filter(item => item.status === filterStatus);
        }

        setFilteredTestimonials(result);
    }, [searchTerm, filterProgram, filterStatus, testimonialList]);

    const clearFilters = () => {
        setSearchTerm('');
        setFilterProgram('');
        setFilterStatus('');
    };

    // ===== FORM HANDLERS =====
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Ukuran file terlalu besar! Maksimal 2MB');
                return;
            }
            
            setFormData(prev => ({
                ...prev,
                avatar: file,
                avatarPreview: URL.createObjectURL(file)
            }));
        }
    };

    const removeAvatar = () => {
        if (formData.avatarPreview && !formData.avatarPreview.startsWith('http')) {
            URL.revokeObjectURL(formData.avatarPreview);
        }
        setFormData(prev => ({
            ...prev,
            avatar: null,
            avatarPreview: null
        }));
    };

    const resetForm = () => {
        if (formData.avatarPreview && !formData.avatarPreview.startsWith('http')) {
            URL.revokeObjectURL(formData.avatarPreview);
        }
        setFormData({
            name: '',
            location: '',
            program: '',
            testimonial: '',
            avatar: null,
            avatarPreview: null,
            status: 'published',
            featured: false
        });
        setEditingId(null);
    };

    // ===== CRUD OPERATIONS =====
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.location || !formData.program || !formData.testimonial) {
            toast.error('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        if (formData.testimonial.length < 20) {
            toast.error('Testimonial terlalu pendek! Minimal 20 karakter.');
            return;
        }

        try {
            setLoading(true);

            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('location', formData.location);
            submitData.append('program', formData.program);
            submitData.append('testimonial', formData.testimonial);
            submitData.append('status', formData.status);
            // Konversi boolean ke string '1' atau '0' untuk backend Laravel
            submitData.append('featured', formData.featured ? '1' : '0');
            
            if (formData.avatar instanceof File) {
                submitData.append('avatar', formData.avatar);
            }

            if (editingId) {
                // Catatan: Service testimonialAdminApi.update sudah menangani logic _method: PUT
                // Jadi kita cukup kirim FormData biasa
                await testimonialAdminApi.update(editingId, submitData);
                toast.success('✅ Testimonial berhasil diupdate!');
            } else {
                await testimonialAdminApi.create(submitData);
                toast.success('✅ Testimonial berhasil ditambahkan!');
            }
            
            setShowForm(false);
            resetForm();
            await fetchTestimonials();
            await fetchStatistics();

        } catch (error) {
            console.error('❌ Error saving testimonial:', error);
            const errorMsg = error.response?.data?.message || 'Gagal menyimpan testimonial';
            toast.error(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id) => {
        const testimonial = testimonialList.find(t => t.id === id);
        if (testimonial) {
            setFormData({
                name: testimonial.name,
                location: testimonial.location,
                program: testimonial.program,
                testimonial: testimonial.testimonial,
                avatar: null,
                avatarPreview: testimonial.full_avatar_url || null,
                status: testimonial.status,
                featured: Boolean(testimonial.featured) // Pastikan boolean
            });
            setEditingId(id);
            setShowForm(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus testimonial ini?')) {
            try {
                setLoading(true);
                await testimonialAdminApi.delete(id);
                toast.success('✅ Testimonial berhasil dihapus!');
                await fetchTestimonials();
                await fetchStatistics();
            } catch (error) {
                console.error('❌ Error deleting testimonial:', error);
                toast.error('❌ Gagal menghapus testimonial!');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCancel = () => {
        if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang.')) {
            setShowForm(false);
            resetForm();
        }
    };

    // ===== EXPORT TO EXCEL =====
    const exportToExcel = () => {
        try {
            if (filteredTestimonials.length === 0) {
                toast.error('⚠️ Tidak ada data untuk diexport!');
                return;
            }

            const exportData = filteredTestimonials.map((item, index) => ({
                'No': index + 1,
                'Nama Lengkap': item.name || '-',
                'Lokasi / Desa': item.location || '-',
                'Program Terkait': item.program || '-',
                'Isi Testimonial': item.testimonial || '-',
                'Status': item.status || '-',
                'Featured': item.featured ? 'Ya' : 'Tidak',
                'Tanggal Input': item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : '-',
            }));

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(exportData);

            ws['!cols'] = [
                { wch: 5 },   // No
                { wch: 25 },  // Nama
                { wch: 30 },  // Lokasi
                { wch: 25 },  // Program
                { wch: 80 },  // Testimonial
                { wch: 12 },  // Status
                { wch: 10 },  // Featured
                { wch: 20 }   // Tanggal
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Testimonial Masyarakat');

            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `Testimonial_Masyarakat_MHJ_ONWJ_${timestamp}.xlsx`;

            XLSX.writeFile(wb, filename);

            toast.success(`✅ Data berhasil diexport!\n\nTotal: ${filteredTestimonials.length} testimonial`);

        } catch (error) {
            console.error('❌ Error exporting to Excel:', error);
            toast.error(`❌ Gagal export ke Excel!`);
        }
    };

    return (
        <div>
            {/* Back Button */}
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
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Testimonial</h1>
                    <p className="text-gray-600 mt-1">Voices From The Community - Suara dari masyarakat</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                    >
                        <FaPlus />
                        Tambah Testimonial Baru
                    </button>
                )}
            </div>

            {/* Stats Cards (FIXED: Menggunakan react-icons untuk menghindari error SVG) */}
            {!showForm && (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    {/* Total */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaQuoteLeft className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.total}</div>
                        <div className="text-sm text-blue-100">Total Testimonial</div>
                    </div>
                    
                    {/* Published */}
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaCheck className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.published}</div>
                        <div className="text-sm text-green-100">Published</div>
                    </div>

                    {/* Draft */}
                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaFileAlt className="w-6 h-6" /> 
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.draft}</div>
                        <div className="text-sm text-yellow-100">Draft</div>
                    </div>

                    {/* This Month */}
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaCalendarAlt className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.this_month}</div>
                        <div className="text-sm text-purple-100">Bulan Ini</div>
                    </div>

                    {/* Featured */}
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                                <FaStar className="w-6 h-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold mb-1">{stats.featured}</div>
                        <div className="text-sm text-orange-100">Featured</div>
                    </div>
                </div>
            )}

            {/* Search & Filter Section + Export Button */}
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
                            title="Export data UMKM ke Excel"
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
                                placeholder="Cari nama, lokasi, testimonial..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <select
                            value={filterProgram}
                            onChange={(e) => setFilterProgram(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Program</option>
                            {programOptions.map(prog => (
                                <option key={prog} value={prog}>{prog}</option>
                            ))}
                        </select>

                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            <option value="">Semua Status</option>
                            {statusOptions.map(status => (
                                <option key={status} value={status}>
                                    {status === 'published' ? 'Published' : 'Draft'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(searchTerm || filterProgram || filterStatus) && (
                        <div className="mt-4 flex justify-between items-center">
                            <p className="text-sm text-gray-600">
                                Menampilkan <span className="font-semibold text-blue-600">{filteredTestimonials.length}</span> dari {testimonialList.length} testimonial
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

            {/* Form Input Section */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingId ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Lengkapi formulir di bawah untuk mengelola data testimonial
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
                        {/* Personal Info */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FaUser className="w-4 h-4 text-blue-600" />
                                </div>
                                Informasi Pemberi Testimonial
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Contoh: Ibu Siti Aminah"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Lokasi / Desa <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Contoh: Muara Gembong, Bekasi"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Program Terkait <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="program"
                                        value={formData.program}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Pilih Program</option>
                                        {programOptions.map(prog => (
                                            <option key={prog} value={prog}>{prog}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Status Publikasi <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="published">Published</option>
                                        <option value="draft">Draft</option>
                                    </select>
                                </div>
                            </div>

                            {/* Featured Checkbox */}
                            <div className="mt-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Jadikan sebagai Featured Testimonial
                                    </span>
                                </label>
                                <p className="text-xs text-gray-500 ml-7 mt-1">
                                    Testimonial yang di-featured akan ditampilkan di homepage
                                </p>
                            </div>
                        </div>

                        {/* Avatar Upload */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <FaImage className="w-4 h-4 text-purple-600" />
                                </div>
                                Foto / Avatar (Opsional)
                            </h3>
                            
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-all bg-gray-50">
                                {!formData.avatarPreview ? (
                                    <div>
                                        <input
                                            type="file"
                                            id="avatar-upload"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="avatar-upload"
                                            className="cursor-pointer flex flex-col items-center"
                                        >
                                            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-4">
                                                <FaImage className="w-8 h-8 text-purple-600" />
                                            </div>
                                            <span className="text-blue-600 font-semibold hover:text-blue-700 mb-2 text-lg">
                                                Klik untuk upload foto
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                Format: PNG, JPG (Maksimal 2MB)
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative inline-block">
                                        <img
                                            src={formData.avatarPreview}
                                            alt="Avatar Preview"
                                            className="w-32 h-32 rounded-full object-cover shadow-lg mx-auto"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeAvatar}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 shadow-xl transition-all transform hover:scale-110"
                                        >
                                            <FaTimes className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Testimonial Content */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FaQuoteLeft className="w-4 h-4 text-green-600" />
                                </div>
                                Isi Testimonial
                            </h3>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Testimonial <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="testimonial"
                                    value={formData.testimonial}
                                    onChange={handleInputChange}
                                    rows="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tulis testimonial dari masyarakat tentang dampak program TJSL..."
                                    required
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-gray-500">
                                        Tulis dengan bahasa yang jujur dan menyentuh hati
                                    </p>
                                    <p className="text-sm font-medium text-gray-600">
                                        {formData.testimonial.length} karakter
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Preview Box */}
                        {formData.testimonial && (
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-8">
                                <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <FaQuoteLeft className="text-blue-600" />
                                    Preview Testimonial
                                </h3>
                                <div className="bg-white p-6 rounded-xl shadow-md">
                                    <p className="text-gray-700 italic mb-4 leading-relaxed">"{formData.testimonial}"</p>
                                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                        {formData.avatarPreview && (
                                            <img src={formData.avatarPreview} alt="Avatar" className="w-12 h-12 rounded-full object-cover" />
                                        )}
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">
                                                {formData.name || 'Nama Pemberi Testimonial'}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {formData.location || 'Lokasi'}
                                            </p>
                                            {formData.program && (
                                                <p className="text-xs text-blue-600 mt-1 font-semibold">
                                                    {formData.program}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : (editingId ? 'Update Testimonial' : 'Simpan Testimonial')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table List */}
            {!showForm && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                            <p className="text-gray-600">Memuat data...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Pemberi Testimonial
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Program
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Testimonial
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredTestimonials.map((item) => (
                                        <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {item.full_avatar_url ? (
                                                        <img src={item.full_avatar_url} alt={item.name} className="w-12 h-12 rounded-full object-cover shadow-md" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                                                            <span className="text-blue-600 font-bold text-lg">
                                                                {item.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <FaMapMarkerAlt className="w-3 h-3" />
                                                            {item.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                                                    {item.program}
                                                </span>
                                                {item.featured && (
                                                    <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                                                        ⭐ Featured
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-md italic">
                                                    "{item.testimonial}"
                                                </p>
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
                                            <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
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
                    )}
                    
                    {/* Empty State */}
                    {!loading && filteredTestimonials.length === 0 && (
                        <div className="text-center py-16 bg-gray-50">
                            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <FaQuoteLeft className="w-10 h-10 text-gray-400" />
                            </div>
                            <p className="text-gray-500 text-lg font-medium mb-2">
                                {searchTerm || filterProgram || filterStatus
                                    ? 'Tidak ada testimonial yang sesuai dengan filter'
                                    : 'Belum ada testimonial'}
                            </p>
                            <p className="text-gray-400 text-sm mb-4">
                                {searchTerm || filterProgram || filterStatus
                                    ? 'Coba ubah kriteria pencarian atau filter'
                                    : 'Mulai tambahkan testimonial pertama dari masyarakat'}
                            </p>
                            {!(searchTerm || filterProgram || filterStatus) && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="text-blue-600 hover:text-blue-700 font-semibold"
                                >
                                    Tambah Testimonial Pertama
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageTestimonial;