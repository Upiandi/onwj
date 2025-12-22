import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlus, FaImage, FaTimes, FaMapMarkerAlt } from 'react-icons/fa';
import programService from '../../services/programService';
import toast from 'react-hot-toast';

const ManageProgram = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        location: '',
        latitude: '',
        longitude: '',
        description: '',
        facilities: [''],
        status: 'Aktif',
        year: new Date().getFullYear(),
        target: '',
        image: null,
        imagePreview: null,
        removeImage: false
    });

    const categories = [
        'Kesehatan',
        'Pendidikan',
        'Lingkungan',
        'Ekonomi',
        'Sosial',
        'Infrastruktur'
    ];

    const statusOptions = ['Aktif', 'Selesai', 'Dalam Proses'];

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const response = await programService.adminGetAllPrograms({ all: 'true' });
            
            if (response.success) {
                setPrograms(response.data.data || response.data || []);
            }
        } catch (error) {
            console.error('Error fetching programs:', error);
            toast.error('Failed to load programs');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFacilityChange = (index, value) => {
        const newFacilities = [...formData.facilities];
        newFacilities[index] = value;
        setFormData(prev => ({
            ...prev,
            facilities: newFacilities
        }));
    };

    const addFacility = () => {
        setFormData(prev => ({
            ...prev,
            facilities: [...prev.facilities, '']
        }));
    };

    const removeFacility = (index) => {
        if (formData.facilities.length > 1) {
            const newFacilities = formData.facilities.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                facilities: newFacilities
            }));
        }
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
                imagePreview: URL.createObjectURL(file),
                removeImage: false
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
            imagePreview: null,
            removeImage: editingId ? true : false
        }));
    };

    const resetForm = () => {
        if (formData.imagePreview && !editingId) {
            URL.revokeObjectURL(formData.imagePreview);
        }
        setFormData({
            name: '',
            category: '',
            location: '',
            latitude: '',
            longitude: '',
            description: '',
            facilities: [''],
            status: 'Aktif',
            year: new Date().getFullYear(),
            target: '',
            image: null,
            imagePreview: null,
            removeImage: false
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validasi
        if (!formData.name || !formData.category || !formData.location || !formData.latitude || !formData.longitude || !formData.description) {
            toast.error('Mohon lengkapi semua field yang wajib diisi!');
            return;
        }

        // Validasi koordinat
        const lat = parseFloat(formData.latitude);
        const lng = parseFloat(formData.longitude);
        
        if (isNaN(lat) || lat < -90 || lat > 90) {
            toast.error('Latitude harus antara -90 dan 90!');
            return;
        }
        
        if (isNaN(lng) || lng < -180 || lng > 180) {
            toast.error('Longitude harus antara -180 dan 180!');
            return;
        }

        // Filter facilities yang tidak kosong
        const filteredFacilities = formData.facilities.filter(f => f.trim() !== '');
        
        if (filteredFacilities.length === 0) {
            toast.error('Minimal ada 1 fasilitas/kegiatan program!');
            return;
        }

        const dataToSubmit = {
            name: formData.name,
            category: formData.category,
            location: formData.location,
            latitude: lat,
            longitude: lng,
            description: formData.description,
            facilities: filteredFacilities,
            status: formData.status,
            year: formData.year,
            target: formData.target,
            image: formData.image,
            removeImage: formData.removeImage
        };

        try {
            setSubmitting(true);
            
            if (editingId) {
                const response = await programService.adminUpdateProgram(editingId, dataToSubmit);
                if (response.success) {
                    toast.success('Program berhasil diupdate!');
                    fetchPrograms();
                    setShowForm(false);
                    resetForm();
                }
            } else {
                const response = await programService.adminCreateProgram(dataToSubmit);
                if (response.success) {
                    toast.success('Program berhasil ditambahkan!');
                    fetchPrograms();
                    setShowForm(false);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error submitting program:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save program';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (program) => {
        setFormData({
            name: program.name,
            category: program.category,
            location: program.location,
            latitude: program.latitude,
            longitude: program.longitude,
            description: program.description,
            facilities: program.facilities.length > 0 ? program.facilities : [''],
            status: program.status,
            year: program.year,
            target: program.target || '',
            image: null,
            imagePreview: program.imageUrl || null,
            removeImage: false
        });
        setEditingId(program.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus program ini?')) {
            try {
                const response = await programService.adminDeleteProgram(id);
                if (response.success) {
                    toast.success('Program berhasil dihapus!');
                    fetchPrograms();
                }
            } catch (error) {
                console.error('Error deleting program:', error);
                toast.error('Failed to delete program');
            }
        }
    };

    const handleCancel = () => {
        if (window.confirm('Apakah Anda yakin ingin membatalkan? Data yang belum disimpan akan hilang.')) {
            setShowForm(false);
            resetForm();
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Program TJSL</h1>
                    <p className="text-gray-600 mt-1">Manajemen program tanggung jawab sosial dan lingkungan</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                    >
                        <FaPlus />
                        Tambah Program Baru
                    </button>
                )}
            </div>

            {/* Form Input Program */}
            {showForm && (
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {editingId ? 'Edit Program' : 'Input Program TJSL Baru'}
                        </h2>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nama Program */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Nama Program <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Contoh: Program Kesehatan (Sungai Buntu)"
                                    required
                                />
                            </div>

                            {/* Kategori Program */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Kategori Program <span className="text-red-500">*</span>
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

                            {/* Status Program */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status Program <span className="text-red-500">*</span>
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

                            {/* Lokasi/Wilayah */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Lokasi/Desa/Wilayah <span className="text-red-500">*</span>
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
                                <p className="text-sm text-gray-500 mt-1">
                                    Masukkan nama desa, kecamatan, atau wilayah program
                                </p>
                            </div>

                            {/* Tahun Pelaksanaan */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tahun Pelaksanaan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    min="2020"
                                    max="2030"
                                    required
                                />
                            </div>
                        </div>

                        {/* Koordinat Lokasi */}
                        <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-2 mb-4">
                                <FaMapMarkerAlt className="text-blue-600" />
                                <label className="block text-sm font-semibold text-gray-800">
                                    Koordinat Lokasi <span className="text-red-500">*</span>
                                </label>
                            </div>
                            <p className="text-sm text-gray-600 mb-4">
                                Koordinat ini akan digunakan untuk menampilkan marker di peta wilayah kerja
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Latitude (Lintang)
                                    </label>
                                    <input
                                        type="number"
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        step="0.000001"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="-6.0563"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Rentang: -90 hingga 90</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Longitude (Bujur)
                                    </label>
                                    <input
                                        type="number"
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        step="0.000001"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="107.4026"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Rentang: -180 hingga 180</p>
                                </div>
                            </div>
                            <p className="text-xs text-blue-600 mt-3">
                                💡 Tip: Anda bisa mendapatkan koordinat dari Google Maps dengan klik kanan pada lokasi
                            </p>
                        </div>

                        {/* Deskripsi Program */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Deskripsi Program <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Jelaskan tujuan, manfaat, dan detail program..."
                                required
                            />
                        </div>

                        {/* Fasilitas/Kegiatan Program */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Fasilitas/Kegiatan Program <span className="text-red-500">*</span>
                            </label>
                            <p className="text-sm text-gray-500 mb-3">
                                Daftar fasilitas atau kegiatan yang ada dalam program ini
                            </p>
                            {formData.facilities.map((facility, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={facility}
                                        onChange={(e) => handleFacilityChange(index, e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder={`Fasilitas/Kegiatan ${index + 1}`}
                                    />
                                    {formData.facilities.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeFacility(index)}
                                            className="px-4 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addFacility}
                                className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                            >
                                <FaPlus className="w-3 h-3" />
                                Tambah Fasilitas/Kegiatan
                            </button>
                        </div>

                        {/* Target/Penerima Manfaat */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Target/Penerima Manfaat
                            </label>
                            <input
                                type="text"
                                name="target"
                                value={formData.target}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                placeholder="Contoh: 500 keluarga, 1.000 siswa, 3 desa pesisir"
                            />
                            <p className="text-sm text-gray-500 mt-1">
                                Opsional: Jumlah atau target penerima manfaat program
                            </p>
                        </div>

                        {/* Upload Foto */}
                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Upload Foto Program
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
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
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <FaImage className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <span className="text-blue-600 font-semibold hover:text-blue-700 mb-2">
                                                Klik untuk upload foto dokumentasi
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                PNG, JPG, atau WEBP (Max 5MB)
                                            </span>
                                        </label>
                                    </div>
                                ) : (
                                    <div className="relative inline-block">
                                        <img
                                            src={formData.imagePreview}
                                            alt="Preview"
                                            className="max-h-64 rounded-lg shadow-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                                disabled={submitting}
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400 disabled:cursor-not-allowed"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        {editingId ? 'Updating...' : 'Saving...'}
                                    </span>
                                ) : (
                                    editingId ? 'Update Program' : 'Save Program'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabel List Program */}
            {!showForm && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Program
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Lokasi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tahun
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {programs.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                            <div className="text-sm text-gray-500">{item.description.substring(0, 50)}...</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <FaMapMarkerAlt className="text-gray-400 w-3 h-3" />
                                                {item.location}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {parseFloat(item.latitude).toFixed(4)}, {parseFloat(item.longitude).toFixed(4)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                item.status === 'Aktif' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : item.status === 'Selesai'
                                                    ? 'bg-gray-100 text-gray-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                            {item.year}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-blue-600 hover:text-blue-900 transition-colors"
                                                    title="Edit"
                                                >
                                                    <FaEdit className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors"
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
                    {programs.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">Belum ada program yang ditambahkan.</p>
                            <button
                                onClick={() => setShowForm(true)}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                            >
                                Tambah Program Pertama
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageProgram;