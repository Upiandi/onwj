import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaTrash, FaEdit, FaPlus, FaImage, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import managementService from '../../services/managementService';

const ManageManagement = () => {
  // States
  const [managements, setManagements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [filtering, setFiltering] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'director',
    name: '',
    position: '',
    description: '',
    order: 0,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Fetch data
  useEffect(() => {
    fetchManagements();
  }, []);

  const fetchManagements = async () => {
    try {
      setLoading(true);
      const response = await managementService.admin.getAll();
      if (response.success) {
        setManagements(response.data);
      }
    } catch (error) {
      console.error('Error fetching managements:', error);
      toast.error('Gagal memuat data manajemen');
    } finally {
      setLoading(false);
    }
  };

  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = (management) => {
    setEditingId(management.id);
    setFormData({
      type: management.type,
      name: management.name,
      position: management.position,
      description: management.description || '',
      order: management.order,
    });
    if (management.image_url) {
      setImagePreview(management.image_url);
    }
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      type: 'director',
      name: '',
      position: '',
      description: '',
      order: 0,
    });
    setImagePreview(null);
    setImageFile(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (formData.type === 'organizational_structure') {
      // For organizational_structure, only validate image
      if (!imageFile && !editingId) {
        toast.error('Gambar struktur organisasi harus diupload');
        return;
      }
    } else {
      // For director and commissioner
      if (!formData.name.trim()) {
        toast.error('Nama harus diisi');
        return;
      }
      if (!formData.position.trim()) {
        toast.error('Posisi harus diisi');
        return;
      }

      // Validate unique order
      const isDuplicateOrder = managements.some(m => 
        m.type === formData.type &&
        m.order === parseInt(formData.order) &&
        m.id !== editingId
      );
      if (isDuplicateOrder) {
        toast.error('Urutan sudah digunakan oleh data lain');
        return;
      }
    }

    setSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('type', formData.type);
      
      if (formData.type === 'organizational_structure') {
        // For organizational_structure, only send type and image
        submitData.append('name', 'Struktur Organisasi');
        submitData.append('position', 'Organization Chart');
        submitData.append('description', '');
        submitData.append('order', 0);
      } else {
        // For director and commissioner
        submitData.append('name', formData.name);
        submitData.append('position', formData.position);
        submitData.append('description', formData.description);
        submitData.append('order', formData.order);
      }
      
      submitData.append('is_active', '1'); // Always active, send as string "1"

      if (imageFile) {
        submitData.append('image', imageFile);
      }

      let response;
      if (editingId) {
        response = await managementService.admin.update(editingId, submitData);
        toast.success('Data berhasil diperbarui');
      } else {
        response = await managementService.admin.create(submitData);
        toast.success('Data berhasil ditambahkan');
      }

      fetchManagements();
      handleReset();
    } catch (error) {
      console.error('Error:', error);
      const message = error.response?.data?.message || 'Gagal menyimpan data';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      return;
    }

    try {
      await managementService.admin.delete(id);
      toast.success('Data berhasil dihapus');
      fetchManagements();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Gagal menghapus data');
    }
  };

  // Filter managements
  const filteredManagements = filtering === 'all' 
    ? managements 
    : managements.filter(m => m.type === filtering);

  const typeOptions = [
    { value: 'director', label: 'Direktur' },
    { value: 'commissioner', label: 'Komisaris' },
    { value: 'organizational_structure', label: 'Struktur Organisasi' },
  ];

  if (loading && managements.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Perusahaan</h1>
            <p className="text-gray-600">Kelola data direktur, komisaris, dan struktur organisasi</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md"
            >
              <FaPlus className="w-4 h-4" />
              Input Data
            </button>
          )}
        </div>

        {/* Form Section - Only show when showForm is true */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {editingId ? 'Edit Data' : 'Tambah Data Baru'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Type Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipe <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {typeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Conditional Fields - Only for director and commissioner */}
              {formData.type !== 'organizational_structure' && (
                <>
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nama <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Posisi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Masukkan posisi"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Deskripsi/Bio
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Masukkan deskripsi atau biografi"
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.type === 'organizational_structure' ? 'Gambar Struktur Organisasi' : 'Foto'}
                  {formData.type === 'organizational_structure' && <span className="text-red-500">*</span>}
                </label>
                <div className="flex items-start gap-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImageFile(null);
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image-input"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="image-input"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                    >
                      <FaImage className="w-4 h-4" />
                      Pilih Foto
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Format: JPEG, PNG, WebP. Max: 2MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Order - Only for director and commissioner */}
              {formData.type !== 'organizational_structure' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Urutan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    placeholder='0'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Urutan tampilan (harus unik, tidak boleh sama dengan data lain)</p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  <FaUndo className="w-4 h-4" />
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <FaSave className="w-4 h-4" />
                      {editingId ? 'Perbarui' : 'Simpan'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFiltering('all')}
            className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              filtering === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Semua ({managements.length})
          </button>
          {typeOptions.map(opt => {
            const count = managements.filter(m => m.type === opt.value).length;
            return (
              <button
                key={opt.value}
                onClick={() => setFiltering(opt.value)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  filtering === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredManagements.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">Tidak ada data manajemen</p>
              <button
                onClick={() => setFiltering('all')}
                className="text-blue-600 hover:underline font-semibold"
              >
                Kembali ke semua data
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Posisi</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tipe</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredManagements.map(management => (
                    <tr key={management.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {management.image_url && (
                            <img
                              src={management.image_url}
                              alt={management.name}
                              className="w-8 h-10 object-cover rounded"
                            />
                          )}
                          <span className="font-medium text-gray-900">{management.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{management.position}</td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          {typeOptions.find(o => o.value === management.type)?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          management.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${
                            management.is_active ? 'bg-green-500' : 'bg-gray-500'
                          }`}></span>
                          {management.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(management)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <FaEdit className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(management.id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <FaTrash className="w-3.5 h-3.5" />
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageManagement;
