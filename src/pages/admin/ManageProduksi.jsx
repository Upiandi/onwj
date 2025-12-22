import { useState, useEffect } from 'react';
import { produksiBulananService } from '../../services/ProduksiBulananService';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaTimes, FaOilCan, FaChartLine } from 'react-icons/fa';

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const YEARS = Array.from({ length: 10 }, (_, i) => 2021 + i);

const ManageProduksi = () => {
  const [produksiData, setProduksiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBulan, setFilterBulan] = useState('');
  const [filterTahun, setFilterTahun] = useState('');
  const [filterArea, setFilterArea] = useState('');

  const [formData, setFormData] = useState({
    wk_tekkom_id: '',
    bulan: '',
    tahun: new Date().getFullYear(),
    produksi_minyak: '',
    produksi_gas: '',
    catatan: '',
    // Data Teknis
    wells: '',
    depth: '',
    pressure: '',
    temperature: '',
    // Fasilitas & Infrastruktur
    facilities: [],
    status: 'Operasional',
  });

  const [facilityInput, setFacilityInput] = useState('');

  // Fetch areas for dropdown
  useEffect(() => {
    fetchAreas();
  }, []);

  // Fetch produksi data
  useEffect(() => {
    fetchProduksi();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...produksiData];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.area_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.area_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBulan) {
      filtered = filtered.filter(item => item.bulan === parseInt(filterBulan));
    }

    if (filterTahun) {
      filtered = filtered.filter(item => item.tahun === parseInt(filterTahun));
    }

    if (filterArea) {
      filtered = filtered.filter(item => item.wk_tekkom_id === parseInt(filterArea));
    }

    setFilteredData(filtered);
  }, [searchTerm, filterBulan, filterTahun, filterArea, produksiData]);

  const fetchAreas = async () => {
    try {
      const response = await produksiBulananService.admin.getAreas();
      console.log('📍 Areas response:', response.data);
      if (response.data.success) {
        setAreas(response.data.data);
        if (response.data.data.length === 0) {
          console.warn('⚠️ No TEKKOM areas found. Please add areas in Manage WK TEKKOM first.');
        }
      }
    } catch (error) {
      console.error('❌ Error fetching areas:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  const fetchProduksi = async () => {
    setLoading(true);
    try {
      const response = await produksiBulananService.admin.getAll();
      console.log('📊 Produksi response:', response.data);
      if (response.data.success) {
        setProduksiData(response.data.data);
        setFilteredData(response.data.data);
        console.log(`✅ Loaded ${response.data.data.length} produksi records`);
      }
    } catch (error) {
      console.error('❌ Error fetching produksi:', error);
      console.error('Error details:', error.response?.data);
      const errorMsg = error.response?.data?.message || 'Gagal memuat data produksi';
      alert(`❌ ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        produksi_minyak: formData.produksi_minyak ? parseFloat(formData.produksi_minyak) : null,
        produksi_gas: formData.produksi_gas ? parseFloat(formData.produksi_gas) : null,
        wells: formData.wells !== '' ? parseInt(formData.wells, 10) : null,
      };

      if (editingId) {
        await produksiBulananService.admin.update(editingId, payload);
        alert('✅ Data produksi berhasil diupdate!');
      } else {
        await produksiBulananService.admin.create(payload);
        alert('✅ Data produksi berhasil ditambahkan!');
      }

      resetForm();
      fetchProduksi();
    } catch (error) {
      console.error('❌ Error saving produksi:', error);
      const message = error.response?.data?.message || 'Gagal menyimpan data';
      alert(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      wk_tekkom_id: item.wk_tekkom_id,
      bulan: item.bulan,
      tahun: item.tahun,
      produksi_minyak: item.produksi_minyak || '',
      produksi_gas: item.produksi_gas || '',
      catatan: item.catatan || '',
      // Data Teknis
      wells: item.wells || '',
      depth: item.depth || '',
      pressure: item.pressure || '',
      temperature: item.temperature || '',
      // Fasilitas & Infrastruktur
      facilities: item.facilities || [],
      status: item.status || 'Operasional',
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data produksi ini?')) return;

    setLoading(true);
    try {
      await produksiBulananService.admin.delete(id);
      alert('✅ Data produksi berhasil dihapus!');
      fetchProduksi();
    } catch (error) {
      console.error('❌ Error deleting produksi:', error);
      alert('❌ Gagal menghapus data');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      wk_tekkom_id: '',
      bulan: '',
      tahun: new Date().getFullYear(),
      produksi_minyak: '',
      produksi_gas: '',
      catatan: '',
      // Data Teknis
      wells: '',
      depth: '',
      pressure: '',
      temperature: '',
      // Fasilitas & Infrastruktur
      facilities: [],
      status: 'Operasional',
    });
    setEditingId(null);
    setShowForm(false);
    setFacilityInput('');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterBulan('');
    setFilterTahun('');
    setFilterArea('');
  };

  const stats = {
    total: produksiData.length,
    thisYear: produksiData.filter(p => p.tahun === new Date().getFullYear()).length,
  };

  return (
    <div>
      {/* Back Button */}
      {showForm && (
        <button
          onClick={resetForm}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg font-semibold transition-all mb-6"
        >
          <FaTimes />
          Kembali
        </button>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Kelola Data Produksi Bulanan</h1>
          <p className="text-gray-600 mt-1">Manajemen data produksi minyak dan gas per bulan</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
          >
            <FaPlus />
            Tambah Data Produksi
          </button>
        )}
      </div>

      {/* Stats Cards */}
      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaChartLine className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-blue-100">Total Data Produksi</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaOilCan className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.thisYear}</div>
            <div className="text-sm text-green-100">Data Tahun Ini</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                <FaFilter className="w-6 h-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{filteredData.length}</div>
            <div className="text-sm text-purple-100">Hasil Filter</div>
          </div>
        </div>
      )}

      {/* Filters */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Pencarian & Filter</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Area</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>
                  {area.area_id} - {area.name}
                </option>
              ))}
            </select>

            <select
              value={filterBulan}
              onChange={(e) => setFilterBulan(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Bulan</option>
              {MONTHS.map((month, idx) => (
                <option key={month} value={idx + 1}>{month}</option>
              ))}
            </select>

            <select
              value={filterTahun}
              onChange={(e) => setFilterTahun(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tahun</option>
              {YEARS.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {(searchTerm || filterBulan || filterTahun || filterArea) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Menampilkan <span className="font-semibold text-blue-600">{filteredData.length}</span> dari {produksiData.length} data
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

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? 'Edit Data Produksi' : 'Tambah Data Produksi'}
              </h2>
              <p className="text-gray-600 text-sm mt-1">Lengkapi formulir data produksi bulanan</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Area TEKKOM <span className="text-red-500">*</span>
                </label>
                <select
                  name="wk_tekkom_id"
                  value={formData.wk_tekkom_id}
                  onChange={handleInputChange}
                  required
                  disabled={areas.length === 0}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">{areas.length === 0 ? 'Tidak ada area tersedia' : 'Pilih Area'}</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>
                      {area.area_id} - {area.name}
                    </option>
                  ))}
                </select>
                {areas.length === 0 && (
                  <p className="text-sm text-orange-600 mt-2">
                    ⚠️ Belum ada Area TEKKOM. Silakan tambahkan area terlebih dahulu di halaman Manage WK TEKKOM.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bulan <span className="text-red-500">*</span>
                </label>
                <select
                  name="bulan"
                  value={formData.bulan}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Bulan</option>
                  {MONTHS.map((month, idx) => (
                    <option key={month} value={idx + 1}>{month}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tahun <span className="text-red-500">*</span>
                </label>
                <select
                  name="tahun"
                  value={formData.tahun}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {YEARS.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Produksi Minyak (BOPD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="produksi_minyak"
                  value={formData.produksi_minyak}
                  onChange={handleInputChange}
                  placeholder="Contoh: 5200.50"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Produksi Gas (MMSCFD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="produksi_gas"
                  value={formData.produksi_gas}
                  onChange={handleInputChange}
                  placeholder="Contoh: 120.75"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Data Teknis Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Data Teknis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jumlah Sumur
                  </label>
                  <input
                    type="number"
                    name="wells"
                    value={formData.wells}
                    onChange={handleInputChange}
                    placeholder="Contoh: 12"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kedalaman Sumur
                  </label>
                  <input
                    type="text"
                    name="depth"
                    value={formData.depth}
                    onChange={handleInputChange}
                    placeholder="Contoh: 3,450 m"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tekanan
                  </label>
                  <input
                    type="text"
                    name="pressure"
                    value={formData.pressure}
                    onChange={handleInputChange}
                    placeholder="Contoh: 2,850 psi"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Temperatur
                  </label>
                  <input
                    type="text"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    placeholder="Contoh: 85°C"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status Operasional
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Operasional">Operasional</option>
                    <option value="Non-Operasional">Non-Operasional</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Fasilitas & Infrastruktur Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Fasilitas & Infrastruktur</h3>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={facilityInput}
                  onChange={(e) => setFacilityInput(e.target.value)}
                  placeholder="Tambah fasilitas..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      if (facilityInput.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          facilities: [...prev.facilities, facilityInput.trim()]
                        }));
                        setFacilityInput('');
                      }
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (facilityInput.trim()) {
                      setFormData(prev => ({
                        ...prev,
                        facilities: [...prev.facilities, facilityInput.trim()]
                      }));
                      setFacilityInput('');
                    }
                  }}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
                >
                  Tambah
                </button>
              </div>

              {formData.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-lg"
                    >
                      <span>{facility}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            facilities: prev.facilities.filter((_, i) => i !== index)
                          }));
                        }}
                        className="text-red-600 hover:text-red-800 font-bold"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Catatan Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  name="catatan"
                  value={formData.catatan}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Catatan tambahan..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : editingId ? 'Update Data' : 'Simpan Data'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Area</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Periode</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Minyak (BOPD)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Gas (MMSCFD)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Catatan</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                      </div>
                      <p className="mt-4 text-gray-600">Memuat data...</p>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FaOilCan className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-lg font-medium mb-2">
                        {searchTerm || filterBulan || filterTahun || filterArea
                          ? 'Tidak ada data yang sesuai dengan filter'
                          : 'Belum ada data produksi'}
                      </p>
                      {!searchTerm && !filterBulan && !filterTahun && !filterArea && (
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>✅ Tabel siap digunakan</p>
                          <p>Klik "Tambah Data Produksi" untuk memulai</p>
                          {areas.length === 0 && (
                            <p className="text-orange-500 font-semibold mt-2">
                              ⚠️ Belum ada Area TEKKOM. Tambahkan dulu di Manage WK TEKKOM.
                            </p>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{item.area_id}</div>
                        <div className="text-sm text-gray-500">{item.area_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.periode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-blue-600 font-bold">
                          {item.produksi_minyak ? Number(item.produksi_minyak).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-green-600 font-bold">
                          {item.produksi_gas ? Number(item.produksi_gas).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {item.catatan || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
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

export default ManageProduksi;
