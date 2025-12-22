import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiImage, FiAlertCircle, FiUpload } from 'react-icons/fi';
import galleryService from '../../services/galleryService';
import toast from 'react-hot-toast';

const EditModal = ({ image, categories, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    slug: '',
    caption: '',
    description: '',
    alt_text: '',
    taken_date: '',
    photographer: '',
    location: '',
    tags: '',
    order: 0,
    is_featured: false,
    is_published: true,
  });

  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data
  useEffect(() => {
    if (image) {
      setFormData({
        category_id: image. category_id || '',
        title: image.title || '',
        slug: image.slug || '',
        caption: image.caption || '',
        description: image.description || '',
        alt_text: image.alt_text || '',
        taken_date: image.taken_date || '',
        photographer: image.photographer || '',
        location: image.location || '',
        tags: Array.isArray(image.tags) ? image.tags.join(', ') : '',
        order:  image.order || 0,
        is_featured: image.is_featured || false,
        is_published: image.is_published || false,
      });
    }
  }, [image]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:  type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle new image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (! file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB');
      return;
    }

    setNewImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewImagePreview(reader.result);
    };
    reader. readAsDataURL(file);
  };

  // Remove new image
  const removeNewImage = () => {
    setNewImageFile(null);
    setNewImagePreview(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (! formData.category_id) {
      newErrors.category_id = 'Kategori wajib dipilih';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Judul wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend. append('_method', 'PUT'); // Laravel method spoofing
    
    // Append all fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== '' && formData[key] !== null) {
        formDataToSend. append(key, formData[key]);
      }
    });

    // Append new image if selected
    if (newImageFile) {
      formDataToSend.append('image', newImageFile);
    }

    try {
      setSaving(true);
      await galleryService.updateImage(image.id, formDataToSend);
      toast.success('Gambar berhasil diperbarui');
      onSuccess();
    } catch (error) {
      console.error('Error updating image:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast. error(error.response?.data?.message || 'Gagal memperbarui gambar');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-gray-900">Edit Foto</h2>
          <button
            onClick={onClose}
            disabled={saving}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar
              </label>

              {/* Current Image */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Gambar Saat Ini: </p>
                <img
                  src={image. thumbnail_url || image.image_url}
                  alt={image.title}
                  className="w-full rounded-lg shadow-md"
                />
              </div>

              {/* New Image Upload */}
              <div>
                <p className="text-xs text-gray-500 mb-2">
                  Ganti dengan gambar baru (opsional):
                </p>
                
                {! newImagePreview ?  (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={saving}
                      className="hidden"
                      id="new-image-upload"
                    />
                    <label htmlFor="new-image-upload" className="cursor-pointer">
                      <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Klik untuk upload gambar baru
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, WEBP (max 5MB)
                      </p>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={newImagePreview}
                      alt="Preview"
                      className="w-full rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeNewImage}
                      disabled={saving}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      <FiX />
                    </button>
                    <div className="mt-2 p-2 bg-green-50 text-green-700 text-sm rounded">
                      ✓ Gambar baru akan menggantikan gambar lama
                    </div>
                  </div>
                )}
              </div>

              {/* Image Info */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">Ukuran:</span> {image. width} × {image.height}px
                </p>
                <p className="text-gray-600 mb-1">
                  <span className="font-medium">File Size:</span>{' '}
                  {image.file_size ?  `${(image.file_size / 1024).toFixed(1)} KB` : 'N/A'}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Views:</span> {image.views || 0}
                </p>
              </div>
            </div>

            {/* Right Column - Form Fields */}
            <div className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  disabled={saving}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle />
                    {errors.category_id}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={saving}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Judul gambar"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <FiAlertCircle />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="url-friendly-slug"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Kosongkan untuk generate otomatis dari judul
                </p>
              </div>

              {/* Caption */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caption
                </label>
                <textarea
                  name="caption"
                  value={formData. caption}
                  onChange={handleInputChange}
                  disabled={saving}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Caption singkat"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  disabled={saving}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Deskripsi detail"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text
                </label>
                <input
                  type="text"
                  name="alt_text"
                  value={formData.alt_text}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus: ring-primary-500 focus: border-transparent"
                  placeholder="Text alternatif untuk SEO"
                />
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Taken Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tanggal Foto
                  </label>
                  <input
                    type="date"
                    name="taken_date"
                    value={formData.taken_date}
                    onChange={handleInputChange}
                    disabled={saving}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus: ring-primary-500 focus: border-transparent"
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Urutan
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    disabled={saving}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Photographer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fotografer
                </label>
                <input
                  type="text"
                  name="photographer"
                  value={formData. photographer}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nama fotografer"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lokasi
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Lokasi pengambilan foto"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Pisahkan dengan koma (contoh: event, program, 2024)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Pisahkan setiap tag dengan koma
                </p>
              </div>

              {/* Checkboxes */}
              <div className="space-y-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    disabled={saving}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus: ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Tandai sebagai Featured
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleInputChange}
                    disabled={saving}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Publish (tampilkan di website)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover: bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled: opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave />
              <span>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;