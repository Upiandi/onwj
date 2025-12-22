import { useState, useEffect } from 'react';
import { hargaMinyakService } from '../../services/HargaMinyakService';
import toast from 'react-hot-toast';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaSpinner,
  FaSearch,
  FaChartLine,
  FaCalendarAlt,
  FaDownload,
  FaUpload,
  FaCalculator,
  FaFilter
} from 'react-icons/fa';
import * as XLSX from 'xlsx';

const OIL_TYPES = [
  { key: 'brent', label: 'Brent', color: '#3b82f6', editable: true },
  { key: 'duri', label: 'Duri', color: '#f59e0b', editable:  false },
  { key: 'ardjuna', label: 'Ardjuna', color: '#10b981', editable: false },
  { key: 'kresna', label: 'Kresna', color: '#8b5cf6', editable:  false },
];

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const YEARS = ['2024', '2025', '2026'];

// Helper function to format date to "1 Januari 2025"
const formatDateToIndonesian = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

// Helper function to convert "1 Januari 2025" to "2025-01-01"
const parseDateFromIndonesian = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split(' ');
  if (parts.length !== 3) return '';
  
  const day = parseInt(parts[0]);
  const monthIndex = MONTHS.indexOf(parts[1]);
  const year = parseInt(parts[2]);
  
  if (monthIndex === -1) return '';
  
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const ManageMinyak = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRealisasiModalOpen, setIsRealisasiModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 15,
    total: 0,
    last_page: 1,
  });
  
  const [formData, setFormData] = useState({
    tanggal: '',
    brent: '',
  });

  const [realisasiForm, setRealisasiForm] = useState({
    tahun: new Date().getFullYear(),
    bulan: new Date().getMonth() + 1,
    realisasi_brent: '',
    realisasi_ardjuna: '',
    realisasi_kresna: '',
  });

  const [errors, setErrors] = useState({});
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch all data with pagination and filters
  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        per_page: pagination.per_page,
        search: searchTerm || undefined,
        sort_by: 'tanggal',
        sort_order: 'desc',
      };

      // Add month/year filter
      if (filterYear && filterMonth) {
        const monthNum = MONTHS.indexOf(filterMonth) + 1;
        params.tahun = parseInt(filterYear);
        params.bulan = monthNum;
      } else if (filterYear) {
        params.tahun = parseInt(filterYear);
      }

      const response = await hargaMinyakService.admin.getAll(params);
      
      if (response.data.success) {
        setData(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [filterMonth, filterYear]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchData(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle realisasi form input change
  const handleRealisasiChange = (e) => {
    const { name, value } = e.target;
    setRealisasiForm(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (! formData.tanggal) {
      newErrors.tanggal = 'Tanggal harus diisi';
    }
    
    if (!formData.brent || formData.brent <= 0) {
      newErrors.brent = 'Harga Brent harus diisi dan lebih dari 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate realisasi form
  const validateRealisasiForm = () => {
    const newErrors = {};
    
    if (!realisasiForm.tahun) {
      newErrors.tahun = 'Tahun harus diisi';
    }
    
    if (! realisasiForm.bulan) {
      newErrors.bulan = 'Bulan harus diisi';
    }
    
    if (!realisasiForm.realisasi_brent || realisasiForm.realisasi_brent <= 0) {
      newErrors.realisasi_brent = 'Realisasi Brent harus diisi';
    }
    
    if (!realisasiForm.realisasi_ardjuna || realisasiForm.realisasi_ardjuna <= 0) {
      newErrors.realisasi_ardjuna = 'Realisasi Ardjuna harus diisi';
    }
    
    if (!realisasiForm.realisasi_kresna || realisasiForm.realisasi_kresna <= 0) {
      newErrors.realisasi_kresna = 'Realisasi Kresna harus diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await hargaMinyakService.admin.update(editingId, formData);
        toast.success('Data berhasil diperbarui');
      } else {
        await hargaMinyakService.admin.create(formData);
        toast.success('Data berhasil ditambahkan');
      }
      
      closeModal();
      fetchData(pagination.current_page);
    } catch (error) {
      console.error('Error saving data:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Gagal menyimpan data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle submit realisasi
  const handleSubmitRealisasi = async (e) => {
    e.preventDefault();
    
    if (!validateRealisasiForm()) {
      return;
    }

    setLoading(true);

    try {
      await hargaMinyakService.admin.storeRealisasi(realisasiForm);
      toast.success('Data realisasi berhasil disimpan dan harga harian telah diperbarui');
      
      closeRealisasiModal();
      fetchData(pagination.current_page);
    } catch (error) {
      console.error('Error saving realisasi:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Gagal menyimpan data realisasi');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (! confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    setLoading(true);

    try {
      await hargaMinyakService.admin.delete(id);
      toast.success('Data berhasil dihapus');
      fetchData(pagination.current_page);
    } catch (error) {
      console.error('Error deleting data:', error);
      toast.error('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error('Pilih data yang ingin dihapus');
      return;
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data?`)) {
      return;
    }

    setLoading(true);

    try {
      await hargaMinyakService.admin.bulkDelete(selectedIds);
      toast.success(`${selectedIds.length} data berhasil dihapus`);
      setSelectedIds([]);
      fetchData(pagination.current_page);
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error('Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  // Toggle select
  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(item => item.id));
    }
  };

  // Open modal for create
  const openCreateModal = () => {
    setEditingId(null);
    setFormData({
      tanggal: '',
      brent: '',
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      tanggal: item.tanggal,
      brent: item.brent,
    });
    setErrors({});
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      tanggal: '',
      brent: '',
    });
    setErrors({});
  };

  // Open realisasi modal
  const openRealisasiModal = () => {
    setRealisasiForm({
      tahun: new Date().getFullYear(),
      bulan: new Date().getMonth() + 1,
      realisasi_brent: '',
      realisasi_ardjuna: '',
      realisasi_kresna: '',
    });
    setErrors({});
    setIsRealisasiModalOpen(true);
  };

  // Close realisasi modal
  const closeRealisasiModal = () => {
    setIsRealisasiModalOpen(false);
    setRealisasiForm({
      tahun: new Date().getFullYear(),
      bulan: new Date().getMonth() + 1,
      realisasi_brent: '',
      realisasi_ardjuna: '',
      realisasi_kresna: '',
    });
    setErrors({});
  };

  // Export to Excel
  const handleExport = () => {
    const exportData = data.map(item => ({
      'Tanggal': formatDateToIndonesian(item.tanggal),
      'Brent': item.brent,
      'Duri': item.duri,
      'Ardjuna': item.ardjuna,
      'Kresna': item.kresna,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Harga Minyak');
    
    const maxWidth = exportData.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    ws['!cols'] = Array(maxWidth).fill({ wch: 15 });

    XLSX.writeFile(wb, `harga-minyak-${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Data berhasil diekspor');
  };

  // Import from Excel/CSV
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isCSV = file.name.toLowerCase().endsWith('.csv');
    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        const workbook = XLSX.read(event.target.result, { type: isCSV ? 'string' : 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const importData = jsonData.map(row => ({
          tanggal: parseDateFromIndonesian(row['Tanggal']) || row['Tanggal'],
          brent: parseFloat(row['Brent']),
        })).filter(row => row.tanggal && row.brent);

        if (importData.length === 0) {
          toast.error('Tidak ada data valid untuk diimport');
          e.target.value = '';
          return;
        }

        setLoading(true);
        const response = await hargaMinyakService.admin.bulkStore({ data: importData });
        
        if (response.data.success) {
          toast.success(response.data.message);
          fetchData(1);
        }
      } catch (error) {
        console.error('Error importing:', error);
        toast.error('Gagal mengimpor data');
      } finally {
        setLoading(false);
        e.target.value = '';
      }
    };

    if (isCSV) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.last_page) {
      fetchData(page);
    }
  };

  // Calculate alpha preview
  const getAlphaPreview = () => {
    if (!realisasiForm.realisasi_brent || ! realisasiForm.realisasi_ardjuna || !realisasiForm.realisasi_kresna) {
      return { alpha_ardjuna: 0, alpha_kresna: 0 };
    }

    return {
      alpha_ardjuna: (parseFloat(realisasiForm.realisasi_ardjuna) - parseFloat(realisasiForm.realisasi_brent)).toFixed(2),
      alpha_kresna: (parseFloat(realisasiForm.realisasi_kresna) - parseFloat(realisasiForm.realisasi_brent)).toFixed(2),
    };
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterMonth('');
    setFilterYear(new Date().getFullYear().toString());
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg: px-8 max-w-7xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <FaChartLine className="text-white w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manage Data Harga Minyak</h1>
                <p className="text-gray-600 mt-1">Kelola data harga minyak dunia (Input Brent, Auto-calculate Ardjuna & Kresna)</p>
              </div>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={openRealisasiModal}
                className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaCalculator className="w-4 h-4" />
                <span>Input Realisasi</span>
              </button>

              <label className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg cursor-pointer">
                <FaUpload className="w-4 h-4" />
                <span>Import Excel/CSV</span>
                <input 
                  type="file" 
                  accept=".xlsx,.xls,.csv" 
                  onChange={handleImport}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExport}
                className="px-4 py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaDownload className="w-4 h-4" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaPlus className="w-4 h-4" />
                <span>Tambah Data</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md: grid-cols-4 gap-4 mt-6">
            <div className="relative md:col-span-2">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan tanggal..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
              >
                {YEARS.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus: ring-blue-500 focus: border-blue-500 transition-all appearance-none"
              >
                <option value="">Semua Bulan</option>
                {MONTHS.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Info & Reset */}
          {(filterMonth || searchTerm) && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-blue-900">
                <FaFilter className="w-4 h-4" />
                <span className="font-semibold">
                  Filter aktif: 
                  {filterMonth && ` ${filterMonth} ${filterYear}`}
                  {searchTerm && ` | Pencarian: "${searchTerm}"`}
                </span>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-semibold transition-all"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
              <p className="text-sm text-blue-600 font-semibold mb-1">Total Data</p>
              <p className="text-2xl font-bold text-blue-900">{pagination.total}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border-2 border-emerald-200">
              <p className="text-sm text-emerald-600 font-semibold mb-1">Halaman</p>
              <p className="text-2xl font-bold text-emerald-900">{pagination.current_page} / {pagination.last_page}</p>
            </div>
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-4 rounded-xl border-2 border-violet-200">
              <p className="text-sm text-violet-600 font-semibold mb-1">Terpilih</p>
              <p className="text-2xl font-bold text-violet-900">{selectedIds.length}</p>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center justify-between">
              <p className="text-red-900 font-semibold">
                {selectedIds.length} data terpilih
              </p>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <FaTrash className="w-4 h-4" />
                <span>Hapus Terpilih</span>
              </button>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tidak Ada Data</h3>
              <p className="text-gray-600 mb-6">
                {filterMonth || searchTerm 
                  ? 'Tidak ada data yang sesuai dengan filter' 
                  : 'Belum ada data harga minyak yang tersedia'
                }
              </p>
              <button
                onClick={openCreateModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center gap-2"
              >
                <FaPlus className="w-4 h-4" />
                <span>Tambah Data Pertama</span>
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === data.length && data.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Tanggal
                      </th>
                      {OIL_TYPES.map(oil => (
                        <th key={oil.key} className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                          {oil.label} {! oil.editable && <span className="text-xs text-gray-500">(Auto)</span>}
                        </th>
                      ))}
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.map((item, index) => (
                      <tr 
                        key={item.id} 
                        className={`hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ?  'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(item.id)}
                            onChange={() => toggleSelect(item.id)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400 w-4 h-4" />
                            <div className="text-sm font-semibold text-gray-900">
                              {formatDateToIndonesian(item.tanggal)}
                            </div>
                          </div>
                        </td>
                        {OIL_TYPES.map(oil => (
                          <td key={oil.key} className="px-6 py-4 whitespace-nowrap text-right">
                            <span className="text-sm font-bold" style={{ color: oil.color }}>
                              ${parseFloat(item[oil.key]).toFixed(2)}
                            </span>
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(item)}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
                              title="Edit"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                              title="Hapus"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} data
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      let pageNum;
                      if (pagination.last_page <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.current_page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.current_page >= pagination.last_page - 2) {
                        pageNum = pagination.last_page - 4 + i;
                      } else {
                        pageNum = pagination.current_page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                            pagination.current_page === pageNum
                              ? 'bg-blue-600 text-white'
                              : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-4 py-2 bg-white border-2 border-gray-200 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal Form Harga Harian (Brent Only) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {editingId ? <FaEdit className="text-blue-600 w-5 h-5" /> : <FaPlus className="text-blue-600 w-5 h-5" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {editingId ? 'Edit Data Harga Harian' : 'Tambah Data Harga Harian'}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                <h4 className="text-sm font-bold text-blue-900 mb-2">ℹ️ Informasi</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Input hanya <strong>Harga Brent</strong></li>
                  <li>• <strong>Ardjuna</strong> dihitung:  Brent + Alpha Ardjuna (rata-rata 3 bulan)</li>
                  <li>• <strong>Kresna</strong> dihitung:  Brent + Alpha Kresna (rata-rata 3 bulan)</li>
                </ul>
              </div>

              <div className="space-y-6">
                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tanggal <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.tanggal ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                  {errors.tanggal && (
                    <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>
                  )}
                  {formData.tanggal && (
                    <p className="mt-2 text-sm text-gray-600">
                      Preview: <span className="font-semibold">{formatDateToIndonesian(formData.tanggal)}</span>
                    </p>
                  )}
                </div>

                {/* Brent Price */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Harga Brent (USD/bbl) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      name="brent"
                      value={formData.brent}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      max="9999.99"
                      placeholder="0.00"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus: ring-blue-500 transition-all ${
                        errors.brent ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.brent && (
                    <p className="mt-1 text-sm text-red-600">{errors.brent}</p>
                  )}
                </div>
              </div>

              {/* Preview Card */}
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📊</span> Preview Data
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Tanggal</p>
                    <p className="font-bold text-gray-900">{formatDateToIndonesian(formData.tanggal) || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Brent (Input)</p>
                    <p className="font-bold text-blue-600">
                      ${formData.brent ?  parseFloat(formData.brent).toFixed(2) : '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Ardjuna (Auto)</p>
                    <p className="font-bold text-emerald-600">Calculated</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Kresna (Auto)</p>
                    <p className="font-bold text-violet-600">Calculated</p>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled: cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      <span>{editingId ? 'Update Data' : 'Simpan Data'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Realisasi Bulanan - SAME AS BEFORE, NO CHANGES NEEDED */}
      {isRealisasiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            <div className="sticky top-0 bg-white border-b-2 border-gray-100 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FaCalculator className="text-purple-600 w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Input Realisasi Bulanan</h3>
              </div>
              <button
                onClick={closeRealisasiModal}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRealisasi} className="p-6">
              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-6">
                <h4 className="text-sm font-bold text-purple-900 mb-2">ℹ️ Informasi Realisasi</h4>
                <ul className="text-xs text-purple-700 space-y-1">
                  <li>• Input <strong>Realisasi Bulanan</strong> untuk Brent, Ardjuna, dan Kresna</li>
                  <li>• <strong>Alpha</strong> dihitung otomatis:  (Realisasi Ardjuna/Kresna - Realisasi Brent)</li>
                  <li>• <strong>Rata-rata Alpha 3 Bulan</strong> dihitung otomatis</li>
                  <li>• Setelah disimpan, <strong>semua harga harian bulan tersebut akan diperbarui</strong></li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tahun <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="tahun"
                    value={realisasiForm.tahun}
                    onChange={handleRealisasiChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus: ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    {YEARS.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  {errors.tahun && (
                    <p className="mt-1 text-sm text-red-600">{errors.tahun}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bulan <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="bulan"
                    value={realisasiForm.bulan}
                    onChange={handleRealisasiChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  >
                    {MONTHS.map((month, index) => (
                      <option key={month} value={index + 1}>{month}</option>
                    ))}
                  </select>
                  {errors.bulan && (
                    <p className="mt-1 text-sm text-red-600">{errors.bulan}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Realisasi Brent (USD/bbl) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      name="realisasi_brent"
                      value={realisasiForm.realisasi_brent}
                      onChange={handleRealisasiChange}
                      step="0.01"
                      min="0"
                      max="9999.99"
                      placeholder="0.00"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all ${
                        errors.realisasi_brent ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                    />
                  </div>
                  {errors.realisasi_brent && (
                    <p className="mt-1 text-sm text-red-600">{errors.realisasi_brent}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Realisasi Ardjuna (USD/bbl) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      name="realisasi_ardjuna"
                      value={realisasiForm.realisasi_ardjuna}
                      onChange={handleRealisasiChange}
                      step="0.01"
                      min="0"
                      max="9999.99"
                      placeholder="0.00"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all ${
                        errors.realisasi_ardjuna ? 'border-red-300 focus: border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                    />
                  </div>
                  {errors.realisasi_ardjuna && (
                    <p className="mt-1 text-sm text-red-600">{errors.realisasi_ardjuna}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Realisasi Kresna (USD/bbl) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
                    <input
                      type="number"
                      name="realisasi_kresna"
                      value={realisasiForm.realisasi_kresna}
                      onChange={handleRealisasiChange}
                      step="0.01"
                      min="0"
                      max="9999.99"
                      placeholder="0.00"
                      className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all ${
                        errors.realisasi_kresna ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                      }`}
                    />
                  </div>
                  {errors.realisasi_kresna && (
                    <p className="mt-1 text-sm text-red-600">{errors.realisasi_kresna}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-100">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🧮</span> Preview Perhitungan Alpha
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Periode</p>
                    <p className="font-bold text-gray-900">
                      {MONTHS[realisasiForm.bulan - 1]} {realisasiForm.tahun}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Alpha Ardjuna</p>
                    <p className={`font-bold text-lg ${
                      getAlphaPreview().alpha_ardjuna >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {getAlphaPreview().alpha_ardjuna >= 0 ?  '+' : ''}{getAlphaPreview().alpha_ardjuna}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ({realisasiForm.realisasi_ardjuna || '0'} - {realisasiForm.realisasi_brent || '0'})
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Alpha Kresna</p>
                    <p className={`font-bold text-lg ${
                      getAlphaPreview().alpha_kresna >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {getAlphaPreview().alpha_kresna >= 0 ?  '+' : ''}{getAlphaPreview().alpha_kresna}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      ({realisasiForm.realisasi_kresna || '0'} - {realisasiForm.realisasi_brent || '0'})
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
                  <p className="text-xs text-purple-900 font-semibold mb-2">
                    📝 Catatan:  
                  </p>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>• Rata-rata Alpha 3 bulan akan dihitung otomatis dari bulan ini dan 2 bulan sebelumnya</li>
                    <li>• Semua harga harian Ardjuna dan Kresna pada bulan ini akan diperbarui menggunakan rata-rata alpha terbaru</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeRealisasiModal}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      <span>Simpan Realisasi</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMinyak;