import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaFilePdf, FaUpload, FaSearch, FaFilter, FaCheck, FaArrowLeft, FaImage, FaCalendar, FaDownload, FaFileExcel } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const ManageLaporan = () => {
  const navigate = useNavigate();
  const [laporanList, setLaporanList] = useState([]);
  const [filteredLaporan, setFilteredLaporan] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterType, setFilterType] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    year: new Date().getFullYear(),
    description: '',
    file: null,
    file_size: 0,
    cover_image: null,
    published_date: '',
    is_active: true,
  });

  const reportTypes = [
    'Laporan Tahunan',
    'Laporan Keuangan',
    'Laporan Keberlanjutan',
    'Laporan K3L',
    'Laporan TJSL',
    'Laporan Operasional',
    'Lainnya',
  ];

  // Filter Logic
  React.useEffect(() => {
    let result = [...laporanList];

    // Search
    if (searchTerm) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by year
    if (filterYear) {
      result = result.filter(item => item.year.toString() === filterYear);
    }

    // Filter by type
    if (filterType) {
      result = result.filter(item => item.type === filterType);
    }

    setFilteredLaporan(result);
  }, [searchTerm, filterYear, filterType, laporanList]);

  // ✅ EXPORT TO EXCEL - OPTIMIZED VERSION
  const exportToExcel = () => {
    try {
      // Check if data is empty
      if (filteredLaporan.length === 0) {
        alert('⚠️ Tidak ada data untuk diexport!');
        return;
      }

      // Prepare export data with proper formatting and null safety
      const exportData = filteredLaporan.map((item, index) => ({
        'No': index + 1,
        'Judul Laporan': item.title || '-',
        'Jenis Laporan': item.type || '-',
        'Tahun': item.year || '-',
        'Tanggal Publikasi': item.published_date ? new Date(item.published_date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }) : '-',
        'Deskripsi': item.description || '-',
        'Ukuran File': formatFileSize(item.file_size || 0),
        'Total Download': item.downloads || 0,
        'Status Aktif': item.is_active ? 'Ya' : 'Tidak',
        'Tanggal Dibuat': item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        }) : '-',
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths for better readability
      ws['!cols'] = [
        { wch: 5 },   // No
        { wch: 50 },  // Judul
        { wch: 25 },  // Jenis
        { wch: 10 },  // Tahun
        { wch: 20 },  // Tanggal Publikasi
        { wch: 60 },  // Deskripsi
        { wch: 15 },  // Ukuran File
        { wch: 15 },  // Total Download
        { wch: 12 },  // Status
        { wch: 20 }   // Tanggal Dibuat
      ];

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Laporan Tahunan');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 10);
      const filename = `Laporan_Tahunan_MHJ_ONWJ_${timestamp}.xlsx`;

      // Write and download file
      XLSX.writeFile(wb, filename);

      // Success notification with details
      alert(`✅ Data berhasil diexport ke Excel!\n\nFile: ${filename}\nTotal data: ${filteredLaporan.length} laporan`);
      
      console.log('✅ Export Excel berhasil:', {
        filename,
        totalRows: filteredLaporan.length,
        timestamp,
        exportedData: exportData
      });

    } catch (error) {
      console.error('❌ Error exporting to Excel:', error);
      alert(`❌ Gagal export ke Excel!\n\nError: ${error.message}\n\nSilakan coba lagi atau hubungi administrator.`);
    }
  };

  // Clear Filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterYear('');
    setFilterType('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('❌ File harus berupa PDF!');
        e.target.value = '';
        return;
      }
      
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('❌ Ukuran file maksimal 50MB!');
        e.target.value = '';
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        file: file,
        file_size: file.size
      }));
    }
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('❌ File harus berupa gambar (JPG, PNG, WebP)!');
        e.target.value = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Ukuran gambar maksimal 5MB!');
        e.target.value = '';
        return;
      }
      
      setFormData(prev => ({ ...prev, cover_image: file }));
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!editingItem && !formData.file) {
      alert('❌ File PDF wajib diupload!');
      return;
    }
    
    if (editingItem) {
      setLaporanList(prev => prev.map(item => 
        item.id === editingItem.id 
          ? {
              ...formData,
              id: item.id,
              file: formData.file || item.file,
              cover_image: formData.cover_image || item.cover_image,
              updated_at: new Date().toISOString(),
            }
          : item
      ));
      alert('✅ Laporan berhasil diupdate!');
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        created_at: new Date().toISOString(),
        downloads: 0,
      };
      setLaporanList(prev => [newItem, ...prev]);
      alert('✅ Laporan berhasil ditambahkan!');
    }
    
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      type: item.type,
      year: item.year,
      description: item.description,
      file: item.file,
      file_size: item.file_size,
      cover_image: item.cover_image,
      published_date: item.published_date,
      is_active: item.is_active,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) {
      setLaporanList(prev => prev.filter(item => item.id !== id));
      alert('✅ Laporan berhasil dihapus!');
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      type: '',
      year: new Date().getFullYear(),
      description: '',
      file: null,
      file_size: 0,
      cover_image: null,
      published_date: '',
      is_active: true,
    });
    setShowForm(false);
  };

  const handleCancel = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang.')) {
      resetForm();
    }
  };

  const years = [...new Set(laporanList.map(item => item.year))].sort((a, b) => b - a);

  // Stats Calculation
  const stats = {
    total: laporanList.length,
    active: laporanList.filter(item => item.is_active).length,
    downloads: laporanList.reduce((acc, item) => acc + (item.downloads || 0), 0),
    thisYear: laporanList.filter(item => item.year === new Date().getFullYear()).length,
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
          <h1 className="text-3xl font-bold text-gray-900">Kelola Laporan Tahunan</h1>
          <p className="text-gray-600 mt-1">Manajemen laporan tahunan dan dokumen perusahaan</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
          >
            <FaPlus />
            Tambah Laporan Baru
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaFilePdf className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-blue-100">Total Laporan</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaCheck className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.active}</div>
            <div className="text-sm text-green-100">Laporan Aktif</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaDownload className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.downloads}</div>
            <div className="text-sm text-purple-100">Total Download</div>
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

      {/* Search & Filter Section + Export Button */}
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
              title="Export data laporan ke Excel"
            >
              <FaFileExcel className="w-5 h-5" />
              Export ke Excel
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari judul laporan atau jenis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Year */}
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

            {/* Filter Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Semua Jenis</option>
              {reportTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Clear Filter & Result Counter */}
          {(searchTerm || filterYear || filterType) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-blue-600">{filteredLaporan.length}</span> dari {laporanList.length} laporan
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
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 animate-fade-in">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingItem ? 'Edit Laporan' : 'Tambah Laporan Baru'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Lengkapi formulir laporan tahunan perusahaan
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
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaFilePdf className="w-4 h-4 text-blue-600" />
                </div>
                Informasi Laporan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Judul Laporan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Contoh: Laporan Tahunan PT MHJ ONWJ 2024"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jenis Laporan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Pilih Jenis Laporan</option>
                    {reportTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
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

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal Publikasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="published_date"
                    value={formData.published_date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Deskripsi Singkat <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Deskripsi singkat tentang laporan ini..."
                  />
                </div>
              </div>
            </div>

            {/* Section 2: File Upload */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaUpload className="w-4 h-4 text-red-600" />
                </div>
                Upload File PDF
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  File PDF Laporan <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  required={!editingItem}
                  className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-400 bg-gray-50"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Format: PDF. Maksimal 50MB. Pastikan file dapat dibaca dengan baik.
                </p>
                {formData.file && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200 flex items-center gap-3">
                    <FaFilePdf className="w-8 h-8 text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {formData.file.name || 'File PDF sudah ada'}
                      </p>
                      <p className="text-xs text-gray-600">
                        Ukuran: {formatFileSize(formData.file_size || formData.file.size)}
                      </p>
                    </div>
                    <FaCheck className="text-green-600 text-2xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Cover Image */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FaImage className="w-4 h-4 text-purple-600" />
                </div>
                Cover / Thumbnail (Opsional)
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gambar Cover
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Format: JPG, PNG, WebP. Maksimal 5MB. Rasio 16:9 atau A4 portrait recommended.
                </p>
                {formData.cover_image && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-center gap-2">
                    <FaCheck className="text-blue-600" />
                    <p className="text-sm font-semibold text-blue-800">
                      Cover terpilih: {formData.cover_image.name || 'Cover sudah ada'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-200">
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-6 h-6 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-500 mt-1"
                />
                <div>
                  <span className="text-sm font-bold text-gray-900 block mb-1">
                    Aktifkan Laporan
                  </span>
                  <span className="text-xs text-gray-600">
                    Laporan akan tampil di halaman Media Informasi → Laporan Tahunan
                  </span>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg transform hover:-translate-y-0.5"
              >
                {editingItem ? 'Update Laporan' : 'Simpan Laporan'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table List */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Laporan
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Jenis
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Tahun
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Ukuran File
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLaporan.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FaFilePdf className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">
                        {searchTerm || filterYear || filterType
                          ? 'Tidak ada laporan yang sesuai dengan filter'
                          : 'Belum ada laporan tahunan'}
                      </p>
                      <p className="text-gray-400 text-sm mb-4">
                        {searchTerm || filterYear || filterType
                          ? 'Coba ubah kriteria pencarian atau filter'
                          : 'Mulai upload laporan pertama'}
                      </p>
                      {!(searchTerm || filterYear || filterType) && (
                        <button
                          onClick={() => setShowForm(true)}
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Upload Laporan Pertama
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredLaporan.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FaFilePdf className="w-6 h-6 text-red-600 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                            <div className="text-xs text-gray-500">{item.published_date}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {item.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                        {formatFileSize(item.file_size)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {item.is_active ? (
                          <span className="text-green-600 text-2xl">✓</span>
                        ) : (
                          <span className="text-red-600 text-2xl">✗</span>
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

export default ManageLaporan;