import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaTrophy, FaSearch, FaFilter, FaCheck, FaArrowLeft, FaImage, FaCalendar, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import penghargaanService from '../../services/penghargaanService';

const ManagePenghargaan = () => {
  const navigate = useNavigate();
  const [penghargaan, setPenghargaan] = useState([]);
  const [filteredPenghargaan, setFilteredPenghargaan] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    given_by: '',
    year: new Date().getFullYear(),
    month: '',
    date: '',
    description: '',
    image: null,
    show_in_landing: false,
    show_in_media_informasi: true,
  });

  const categories = [
    'Lingkungan',
    'K3 (Kesehatan & Keselamatan Kerja)',
    'CSR & TJSL',
    'Inovasi & Teknologi',
    'Manajemen Terbaik',
    'Keuangan',
    'Lainnya',
  ];

  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  // ===== FETCH DATA FROM API =====
  useEffect(() => {
    fetchPenghargaan();
  }, []);

  const fetchPenghargaan = async () => {
    setLoading(true);
    try {
      const response = await penghargaanService.adminGetAllPenghargaan();
      if (response.success) {
        setPenghargaan(response.data);
        toast.success('Data berhasil dimuat');
      }
    } catch (error) {
      console.error('Error fetching penghargaan:', error);
      toast.error(error.message || 'Gagal memuat data penghargaan');
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  useEffect(() => {
    let result = [...penghargaan];

    // Search
    if (searchTerm) {
      result = result.filter(item =>
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.given_by?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year
    if (filterYear) {
      result = result.filter(item => item.year?.toString() === filterYear);
    }

    // Filter by category
    if (filterCategory) {
      result = result.filter(item => item.category === filterCategory);
    }

    setFilteredPenghargaan(result);
  }, [searchTerm, filterYear, filterCategory, penghargaan]);

  // ✅ EXPORT TO EXCEL
  const exportToExcel = () => {
    try {
      if (filteredPenghargaan.length === 0) {
        toast.error('Tidak ada data untuk diexport! ');
        return;
      }

      const exportData = filteredPenghargaan.map((item, index) => ({
        'No': index + 1,
        'Nama Penghargaan': item.title || '-',
        'Kategori': item.category || '-',
        'Pemberi Penghargaan': item.given_by || '-',
        'Tahun': item.year || '-',
        'Bulan': item.month || '-',
        'Tanggal Penerimaan': item.date ?  new Date(item.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }) : '-',
        'Deskripsi': item.description || '-',
        'Tampil di Landing': item.show_in_landing ? 'Ya' : 'Tidak',
        'Tampil di Media Informasi': item.show_in_media_informasi ? 'Ya' : 'Tidak',
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      ws['!cols'] = [
        { wch: 5 }, { wch: 45 }, { wch: 30 }, { wch: 35 },
        { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 60 },
        { wch: 20 }, { wch: 25 }
      ];

      XLSX.utils.book_append_sheet(wb, ws, 'Penghargaan');

      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `Penghargaan_MHJ_ONWJ_${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);

      toast.success(`Data berhasil diexport!  (${filteredPenghargaan.length} penghargaan)`);
      
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal export ke Excel! ');
    }
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterYear('');
    setFilterCategory('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 2MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.category || ! formData.given_by || ! formData.year || 
        !formData.month || !formData.date || !formData.description) {
      toast.error('Semua field wajib diisi!');
      return;
    }

    if (! editingItem && !formData.image) {
      toast.error('Gambar penghargaan wajib diupload!');
      return;
    }

    setSubmitting(true);

    try {
      // Prepare FormData
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('given_by', formData.given_by);
      submitData.append('year', formData.year);
      submitData.append('month', formData.month);
      submitData.append('date', formData.date);
      submitData.append('description', formData.description);
      submitData.append('show_in_landing', formData.show_in_landing ?  '1' : '0');
      submitData.append('show_in_media_informasi', formData.show_in_media_informasi ? '1' : '0');
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      let response;
      if (editingItem) {
        response = await penghargaanService.adminUpdatePenghargaan(editingItem.id, submitData);
        toast.success('✅ Penghargaan berhasil diupdate! ');
      } else {
        response = await penghargaanService.adminCreatePenghargaan(submitData);
        toast.success('✅ Penghargaan berhasil ditambahkan!');
      }

      // Refresh data
      await fetchPenghargaan();
      resetForm();

    } catch (error) {
      console.error('Submit error:', error);
      const errorMsg = error.errors 
        ? Object.values(error.errors).flat().join(', ')
        : error.message || 'Gagal menyimpan penghargaan';
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      given_by: item.given_by,
      year: item.year,
      month: item.month,
      date: item.date,
      description: item.description,
      image: null,
      show_in_landing: item.show_in_landing,
      show_in_media_informasi: item.show_in_media_informasi,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (! window.confirm('Apakah Anda yakin ingin menghapus penghargaan ini?')) {
      return;
    }

    try {
      await penghargaanService.adminDeletePenghargaan(id);
      toast.success('✅ Penghargaan berhasil dihapus!');
      await fetchPenghargaan();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.message || 'Gagal menghapus penghargaan');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: '',
      given_by: '',
      year: new Date().getFullYear(),
      month: '',
      date: '',
      description: '',
      image: null,
      show_in_landing: false,
      show_in_media_informasi: true,
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan?  Data yang belum disimpan akan hilang.')) {
      resetForm();
    }
  };

  // Get unique years for filter
  const years = [...new Set(penghargaan.map(item => item.year))].sort((a, b) => b - a);

  // Stats Calculation
  const stats = {
    total: penghargaan.length,
    landing: penghargaan.filter(item => item.show_in_landing).length,
    media: penghargaan.filter(item => item.show_in_media_informasi).length,
    thisYear: penghargaan.filter(item => item.year === new Date().getFullYear()).length,
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tombol Kembali */}
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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Penghargaan</h1>
          <p className="text-gray-600 mt-1">Manajemen penghargaan yang diterima perusahaan</p>
        </div>
        {! showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
          >
            <FaPlus />
            Tambah Penghargaan Baru
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {! showForm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaTrophy className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-blue-100">Total Penghargaan</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.landing}</div>
            <div className="text-sm text-green-100">Tampil di Landing</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.media}</div>
            <div className="text-sm text-purple-100">Media Informasi</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaCalendar className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.thisYear}</div>
            <div className="text-sm text-orange-100">Tahun Ini</div>
          </div>
        </div>
      )}

      {/* Search & Filter Section */}
      {! showForm && (
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
                placeholder="Cari penghargaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Tahun</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>

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
          </div>

          {(searchTerm || filterYear || filterCategory) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-blue-600">{filteredPenghargaan.length}</span> dari {penghargaan.length} penghargaan
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

      {/* Form Input */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit Penghargaan' : 'Tambah Penghargaan Baru'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Lengkapi formulir penghargaan perusahaan
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
            {/* Section 1: Basic Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <FaTrophy className="w-4 h-4 text-yellow-600" />
                </div>
                Informasi Penghargaan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nama Penghargaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Penghargaan PROPER Emas 2024"
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
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pemberi Penghargaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="given_by"
                    value={formData.given_by}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Kementerian Lingkungan Hidup"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="w-4 h-4 text-gray-500" />
                      Tahun <span className="text-red-500">*</span>
                    </div>
                  </label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                    min="1900"
                    max="2100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bulan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Bulan</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Penerimaan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Deskripsi singkat tentang penghargaan..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Image Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaImage className="w-4 h-4 text-purple-600" />
                </div>
                Gambar / Foto Penghargaan
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Gambar {! editingItem && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 hover:bg-white"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Format: JPG, PNG, WebP.Maksimal 2MB.
                </p>
                {formData.image && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200 flex items-center gap-3">
                    <FaCheck className="text-green-600 text-xl" />
                    <p className="text-sm font-semibold text-green-800">
                      File terpilih: {formData.image.name}
                    </p>
                  </div>
                )}
                {editingItem && editingItem.image_url && ! formData.image && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Gambar saat ini:</p>
                    <img 
                      src={editingItem.image_url} 
                      alt="Current" 
                      className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Display Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                Opsi Tampilan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-green-200 hover:bg-green-50 transition-all">
                  <input
                    type="checkbox"
                    name="show_in_landing"
                    checked={formData.show_in_landing}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">
                      Tampilkan di Landing Page
                    </span>
                    <span className="text-xs text-gray-600">
                      Muncul di section "Penghargaan Kami"
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-4 bg-white rounded-lg border-2 border-purple-200 hover:bg-purple-50 transition-all">
                  <input
                    type="checkbox"
                    name="show_in_media_informasi"
                    checked={formData.show_in_media_informasi}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 mt-0.5"
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block">
                      Tampilkan di Media Informasi
                    </span>
                    <span className="text-xs text-gray-600">
                      Muncul di Media Informasi → Penghargaan
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <span>{editingItem ? 'Update Penghargaan' : 'Simpan Penghargaan'}</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table List */}
      {! showForm && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Penghargaan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Pemberi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Tahun
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Tampilan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPenghargaan.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FaTrophy className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">
                        {searchTerm || filterYear || filterCategory
                          ? 'Tidak ada penghargaan yang sesuai dengan filter'
                          : 'Belum ada data penghargaan'}
                      </p>
                      <p className="text-gray-400 text-sm mb-4">
                        {searchTerm || filterYear || filterCategory
                          ? 'Coba ubah kriteria pencarian atau filter'
                          : 'Mulai tambahkan penghargaan pertama'}
                      </p>
                      {!(searchTerm || filterYear || filterCategory) && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Tambah Penghargaan Pertama
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredPenghargaan.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FaTrophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">
                              {item.month} {item.year}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.given_by}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          {item.show_in_landing && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md font-semibold" title="Landing Page">
                              LP
                            </span>
                          )}
                          {item.show_in_media_informasi && (
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-md font-semibold" title="Media Informasi">
                              MI
                            </span>
                          )}
                        </div>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePenghargaan;