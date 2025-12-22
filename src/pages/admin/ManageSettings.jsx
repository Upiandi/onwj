import React, { useState, useEffect } from 'react';
import { FaSave, FaUndo, FaImage, FaTimes, FaCheckCircle, FaPlus, FaTrash, FaArrowUp, FaArrowDown, FaUpload } from 'react-icons/fa';
import toast from 'react-hot-toast';
import settingService from '../../services/settingService';
import heroService from '../../services/heroService';
import api from '../../api/axios';

const ManageSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  // Hero sections state
  const [heroItems, setHeroItems] = useState([]);
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroSaving, setHeroSaving] = useState(false);

  // Image upload states
  const [uploadingImages, setUploadingImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  const categories = [
    { id: 'company', label: 'Informasi Perusahaan' },
    { id: 'social_media', label: 'Media Sosial' },
    { id: 'contact', label: 'Kontak' },
    { id: 'operating_hours', label: 'Jam Operasional' },
    { id: 'seo', label: 'SEO Settings' },
    { id: 'footer', label: 'Footer' },
    { id: 'logo', label: 'Logo & Favicon' },
    { id: 'hero', label: 'Hero Section' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch hero when tab opened first time
  useEffect(() => {
    if (activeTab === 'hero' && heroItems.length === 0 && !heroLoading) {
      fetchHeroSections();
    }
  }, [activeTab]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingService.admin.getAll();

      if (response.data.success) {
        // Convert grouped settings to flat object
        const flatSettings = {};
        Object.values(response.data.data).forEach(categorySettings => {
          categorySettings. forEach(setting => {
            flatSettings[setting.key] = setting. value || '';
          });
        });
        setSettings(flatSettings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const fetchHeroSections = async () => {
    try {
      setHeroLoading(true);
      const data = await heroService.getAllHeroSections();
      const sorted = (data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      setHeroItems(sorted);
    } catch (error) {
      console.error('Error fetching hero sections:', error);
      const message = error?.response?.data?.message || 'Gagal memuat Hero Section';
      toast.error(message);
    } finally {
      setHeroLoading(false);
    }
  };

  const handleHeroChange = (id, field, value) => {
    setHeroItems(prev => prev.map(item => {
      if ((item.id ?? item._tempId) === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const handleHeroFileUpload = async (id, file) => {
    if (!file) return;

    // Find the item to get its type
    const item = heroItems.find(h => (h.id ?? h._tempId) === id);
    if (!item) return;

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg+xml'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const validTypes = item.type === 'image' ? validImageTypes : validVideoTypes;

    if (!validTypes.includes(file.type)) {
      toast.error(`Tipe file tidak valid untuk ${item.type}. Gunakan: ${validTypes.join(', ')}`);
      return;
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 50MB');
      return;
    }

    // Set uploading state
    setHeroItems(prev => prev.map(h => {
      if ((h.id ?? h._tempId) === id) {
        return { ...h, _uploading: true };
      }
      return h;
    }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', item.type);

      const response = await api.post('/v1/admin/hero-sections/upload-media', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        const uploadedPath = response.data.data.path;
        
        // Update the src field with uploaded path
        setHeroItems(prev => prev.map(h => {
          if ((h.id ?? h._tempId) === id) {
            return { ...h, src: uploadedPath, _uploading: false };
          }
          return h;
        }));

        toast.success('File berhasil diupload!');
      } else {
        throw new Error(response.data.message || 'Upload gagal');
      }
    } catch (error) {
      console.error('Failed to upload hero media:', error);
      toast.error(error.response?.data?.message || 'Gagal mengupload file');
      
      // Remove uploading state
      setHeroItems(prev => prev.map(h => {
        if ((h.id ?? h._tempId) === id) {
          return { ...h, _uploading: false };
        }
        return h;
      }));
    }
  };

  const validateHeroItem = (item) => {
    const errors = [];

    if (!item.type) {
      errors.push('Tipe wajib dipilih.');
    }

    if (!item.src || !item.src.trim()) {
      errors.push('Sumber media (URL/path) wajib diisi.');
    }

    if (item.duration && Number(item.duration) < 1000) {
      errors.push('Durasi minimal 1000 ms.');
    }

    if (item.label && item.label.length > 255) {
      errors.push('Label maksimal 255 karakter.');
    }

    if (item.title && item.title.length > 255) {
      errors.push('Title maksimal 255 karakter.');
    }

    return errors;
  };

  const handleAddHero = () => {
    const tempId = `temp-${Date.now()}`;
    setHeroItems(prev => ([
      ...prev,
      {
        _tempId: tempId,
        type: 'image',
        src: '',
        duration: 5000,
        label: 'Slide Baru',
        title: '',
        description: '',
        order: prev.length,
        is_active: true,
      }
    ]));
  };

  const handleSaveHero = async (item) => {
    const errors = validateHeroItem(item);
    if (errors.length > 0) {
      errors.slice(0, 3).forEach(msg => toast.error(msg));
      return;
    }

    try {
      setHeroSaving(true);
      const payload = {
        type: item.type,
        src: item.src,
        duration: item.duration ? Number(item.duration) : null,
        label: item.label,
        title: item.title,
        description: item.description,
        order: item.order ?? 0,
        is_active: item.is_active ?? true,
      };

      let saved;
      if (item.id) {
        saved = await heroService.updateHeroSection(item.id, payload);
      } else {
        saved = await heroService.createHeroSection(payload);
      }

      setHeroItems(prev => prev.map(h => {
        if ((h.id ?? h._tempId) === (item.id ?? item._tempId)) {
          return saved;
        }
        return h;
      }));

      toast.success('Hero section tersimpan');
    } catch (error) {
      console.error('Error saving hero section:', error);
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        const first = Object.values(apiErrors).flat()[0];
        toast.error(first || 'Gagal menyimpan Hero Section');
      } else {
        toast.error(error?.response?.data?.message || 'Gagal menyimpan Hero Section');
      }
    } finally {
      setHeroSaving(false);
    }
  };

  const handleDeleteHero = async (item) => {
    if (!window.confirm('Hapus hero section ini?')) return;
    try {
      // Delete from backend if it has an ID
      if (item.id) {
        await heroService.deleteHeroSection(item.id);
      }

      // Delete uploaded media file if it's not an external URL
      if (item.src && !item.src.startsWith('http')) {
        try {
          await api.delete('/v1/admin/hero-sections/delete-media', {
            data: { path: item.src }
          });
        } catch (err) {
          console.warn('Failed to delete media file:', err);
          // Don't block the deletion if media cleanup fails
        }
      }

      setHeroItems(prev => prev.filter(h => (h.id ?? h._tempId) !== (item.id ?? item._tempId)));
      toast.success('Hero section dihapus');
    } catch (error) {
      console.error('Error deleting hero section:', error);
      toast.error('Gagal menghapus Hero Section');
    }
  };

  const swapItems = (arr, i, j) => {
    const next = [...arr];
    [next[i], next[j]] = [next[j], next[i]];
    return next.map((item, idx) => ({ ...item, order: idx }));
  };

  const handleReorderHero = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= heroItems.length) return;

    const reordered = swapItems(heroItems, index, targetIndex);
    setHeroItems(reordered);

    // Send reorder for saved items only
    const payload = reordered
      .filter(item => item.id)
      .map(item => ({ id: item.id, order: item.order }));

    try {
      await heroService.reorderHeroSections(payload);
      toast.success('Urutan hero diperbarui');
    } catch (error) {
      console.error('Error reordering hero:', error);
      const apiErrors = error?.response?.data?.errors;
      if (apiErrors) {
        const first = Object.values(apiErrors).flat()[0];
        toast.error(first || 'Gagal mengurutkan Hero Section');
      } else {
        toast.error(error?.response?.data?.message || 'Gagal mengurutkan Hero Section');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingService.admin.update(settings);

      if (response.data.success) {
        toast.success('Pengaturan berhasil disimpan! ');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (key, file) => {
    if (!file) return;

    // Validate file
    if (! file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }

    setUploadingImages(prev => ({ ...prev, [key]: true }));

    try {
      const response = await settingService.admin. uploadImage(key, file);

      if (response.data.success) {
        toast.success('Gambar berhasil diupload! ');
        
        // Update settings with new path
        setSettings(prev => ({
          ... prev,
          [key]: response.data.data.path
        }));

        // Update preview
        setImagePreviews(prev => ({
          ...prev,
          [key]: response.data.data.url
        }));
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Gagal upload gambar');
    } finally {
      setUploadingImages(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleImageDelete = async (key) => {
    if (! window.confirm('Apakah Anda yakin ingin menghapus gambar ini?')) {
      return;
    }

    try {
      const response = await settingService. admin.deleteImage(key);

      if (response.data.success) {
        toast.success('Gambar berhasil dihapus!');
        
        setSettings(prev => ({
          ... prev,
          [key]: ''
        }));

        setImagePreviews(prev => ({
          ...prev,
          [key]: null
        }));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Gagal menghapus gambar');
    }
  };

  const handleReset = async () => {
    if (! window.confirm('Apakah Anda yakin ingin mereset semua pengaturan ke default?  Tindakan ini tidak dapat dibatalkan.')) {
      return;
    }

    try {
      const response = await settingService. admin.reset();

      if (response.data.success) {
        toast.success('Pengaturan berhasil direset! ');
        fetchSettings();
      }
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Gagal mereset pengaturan');
    }
  };

  const renderHeroTab = () => {
    if (heroLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Hero Sections</h2>
            <p className="text-gray-600">Kelola slide hero (gambar / video) yang tampil di landing page</p>
          </div>
          <button
            onClick={handleAddHero}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Tambah Slide
          </button>
        </div>

        {heroItems.length === 0 && (
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-600">
            Belum ada slide hero. Klik "Tambah Slide" untuk menambahkan.
          </div>
        )}

        <div className="grid gap-4">
          {heroItems.map((item, index) => (
            <div key={item.id ?? item._tempId} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-semibold">#{index + 1}</span>
                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                    {item.id ? 'Saved' : 'Draft'}
                  </span>
                </div>

                <div className="flex gap-2 ml-auto">
                  <button
                    onClick={() => handleReorderHero(index, 'up')}
                    className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
                    title="Naik"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    onClick={() => handleReorderHero(index, 'down')}
                    className="p-2 rounded-md border border-gray-200 hover:bg-gray-50"
                    title="Turun"
                  >
                    <FaArrowDown />
                  </button>
                  <button
                    onClick={() => handleDeleteHero(item)}
                    className="p-2 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                    title="Hapus"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Tipe</label>
                  <select
                    value={item.type}
                    onChange={(e) => handleHeroChange(item.id ?? item._tempId, 'type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Durasi (ms)</label>
                  <input
                    type="number"
                    min="1000"
                    value={item.duration ?? ''}
                    onChange={(e) => handleHeroChange(item.id ?? item._tempId, 'duration', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="5000"
                  />
                  <p className="text-xs text-gray-500">Jika video, durasi boleh dikosongkan untuk auto pakai durasi video.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Label</label>
                  <input
                    type="text"
                    value={item.label ?? ''}
                    onChange={(e) => handleHeroChange(item.id ?? item._tempId, 'label', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Judul pendek"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Sumber Media
                    <span className="text-xs font-normal text-gray-500 ml-2">(Upload file lokal)</span>
                  </label>
                  
                  <div className="flex gap-2">
                    {/* File Upload Button */}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        id={`hero-file-${item.id ?? item._tempId}`}
                        accept={item.type === 'image' ? 'image/jpeg,image/png,image/jpg,image/webp,image/svg+xml' : 'video/mp4,video/webm,video/ogg'}
                        onChange={(e) => handleHeroFileUpload(item.id ?? item._tempId, e.target.files[0])}
                        className="hidden"
                      />
                      <label
                        htmlFor={`hero-file-${item.id ?? item._tempId}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 bg-white"
                      >
                        <FaUpload className="text-gray-600" />
                        <span className="text-sm text-gray-700">Upload {item.type === 'image' ? 'Gambar' : 'Video'}</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  {item.src && (
                    <div className="mt-2 relative">
                      {item.type === 'image' ? (
                        <img
                          src={item.src.startsWith('http') ? item.src : `http://localhost:8000/storage/${item.src}`}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <video
                          src={item.src.startsWith('http') ? item.src : `http://localhost:8000/storage/${item.src}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  )}

                  {item._uploading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      Mengupload...
                    </div>
                  )}
                </div>
              </div>

              {item.type === 'image' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Title</label>
                    <textarea
                      value={item.title ?? ''}
                      onChange={(e) => handleHeroChange(item.id ?? item._tempId, 'title', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">Deskripsi</label>
                    <textarea
                      value={item.description ?? ''}
                      onChange={(e) => handleHeroChange(item.id ?? item._tempId, 'description', e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Deskripsi singkat"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mt-4">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={item.is_active ?? true}
                    onChange={(e) => handleHeroChange(item.id ?? item._tempId, 'is_active', e.target.checked)}
                    className="h-4 w-4 text-blue-600"
                  />
                  Active
                </label>

                <button
                  onClick={() => handleSaveHero(item)}
                  disabled={heroSaving}
                  className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {heroSaving ? 'Menyimpan...' : 'Simpan Slide'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderField = (key, label, type = 'text', description = '') => {
    if (type === 'image') {
      const imageUrl = imagePreviews[key] || (settings[key] ?  `http://localhost:8000/storage/${settings[key]}` : null);

      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 mb-2">{description}</p>
          )}

          <div className="flex items-start gap-4">
            {/* Preview */}
            {imageUrl && (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt={label}
                  className="w-32 h-32 object-contain border border-gray-300 rounded-lg bg-gray-50"
                />
                <button
                  onClick={() => handleImageDelete(key)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                  title="Hapus gambar"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex-1">
              <input
                type="file"
                id={`upload-${key}`}
                accept="image/*"
                onChange={(e) => handleImageUpload(key, e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor={`upload-${key}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <FaImage />
                {uploadingImages[key] ? 'Uploading...' : imageUrl ? 'Ganti Gambar' : 'Upload Gambar'}
              </label>
              {uploadingImages[key] && (
                <div className="mt-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <div key={key} className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
          {description && (
            <p className="text-sm text-gray-500 mb-2">{description}</p>
          )}
          <textarea
            value={settings[key] || ''}
            onChange={(e) => handleInputChange(key, e.target.value)}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={label}
          />
        </div>
      );
    }

    return (
      <div key={key} className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mb-2">{description}</p>
        )}
        <input
          type={type}
          value={settings[key] || ''}
          onChange={(e) => handleInputChange(key, e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={label}
        />
      </div>
    );
  };

  const renderCategoryContent = () => {
    switch (activeTab) {
      case 'company':
        return (
          <>
            {renderField('company_name', 'Nama Perusahaan', 'text', 'Nama resmi perusahaan')}
            {renderField('company_address', 'Alamat Kantor', 'textarea', 'Alamat lengkap kantor pusat')}
            {renderField('company_phone', 'Telepon', 'tel', 'Nomor telepon kantor')}
            {renderField('company_email', 'Email', 'email', 'Email resmi perusahaan')}
            {renderField('company_fax', 'Fax', 'tel', 'Nomor fax kantor')}
          </>
        );

      case 'social_media': 
        return (
          <>
            {renderField('social_facebook', 'Facebook', 'url', 'URL halaman Facebook')}
            {renderField('social_instagram', 'Instagram', 'url', 'URL profil Instagram')}
            {renderField('social_twitter', 'Twitter/X', 'url', 'URL profil Twitter/X')}
            {renderField('social_linkedin', 'LinkedIn', 'url', 'URL halaman LinkedIn')}
            {renderField('social_youtube', 'YouTube', 'url', 'URL channel YouTube')}
          </>
        );

      case 'contact':
        return (
          <>
            {renderField('contact_email', 'Email Customer Service', 'email', 'Email untuk pertanyaan umum')}
            {renderField('contact_phone', 'Telepon Hotline', 'tel', 'Nomor telepon layanan pelanggan')}
            {renderField('contact_whatsapp', 'WhatsApp', 'tel', 'Nomor WhatsApp (format: 62xxx)')}
          </>
        );

      case 'operating_hours':
        return (
          <>
            {renderField('hours_weekday', 'Jam Kerja (Hari Kerja)', 'text', 'Jam operasional hari Senin-Jumat')}
            {renderField('hours_weekend', 'Jam Kerja (Akhir Pekan)', 'text', 'Jam operasional hari Sabtu-Minggu')}
          </>
        );

      case 'seo':
        return (
          <>
            {renderField('seo_meta_title', 'Meta Title', 'text', 'Judul SEO untuk search engine')}
            {renderField('seo_meta_description', 'Meta Description', 'textarea', 'Deskripsi SEO untuk search engine')}
            {renderField('seo_meta_keywords', 'Meta Keywords', 'textarea', 'Keywords SEO (pisahkan dengan koma)')}
          </>
        );

      case 'footer':
        return (
          <>
            {renderField('footer_about_text', 'About Text (Footer)', 'textarea', 'Teks deskripsi singkat di footer')}
            {renderField('footer_copyright', 'Copyright Text', 'text', 'Teks copyright di footer')}
          </>
        );

      case 'logo':
        return (
          <>
            {renderField('logo_main', 'Logo Utama', 'image', 'Logo untuk header (PNG/SVG, max 2MB)')}
            {renderField('logo_footer', 'Logo Footer', 'image', 'Logo untuk footer (PNG/SVG, max 2MB)')}
            {renderField('logo_favicon', 'Favicon', 'image', 'Icon browser tab (ICO/PNG, 32x32px)')}
          </>
        );

      case 'hero':
        return renderHeroTab();

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan Website</h1>
          <p className="text-gray-600 mt-1">Kelola informasi umum, kontak, dan tampilan website</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            <FaUndo />
            Reset Default
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ?  (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <FaSave />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveTab(category.id)}
                className={`px-6 py-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                  activeTab === category. id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {category.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-8">
          {renderCategoryContent()}
        </div>
      </div>
    </div>
  );
};

export default ManageSettings;