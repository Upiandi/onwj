import React, { useState, useEffect } from 'react';
import { 
  FiUpload, FiImage, FiEdit2, FiTrash2, FiX, FiSave,
  FiSearch, FiFilter, FiGrid, FiList, FiStar,
  FiEye, FiEyeOff, FiDownload, FiMaximize2
} from 'react-icons/fi';
import galleryService from '../../../services/galleryService';
import toast from 'react-hot-toast';

const ManageGallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    category_id: '',
    is_published: '',
    sort_by: 'created_at',
    sort_order: 'desc',
    page: 1,
    per_page: 12,
  });

  // Pagination
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total:  0,
  });

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isBatchUploadModalOpen, setIsBatchUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Selection for bulk delete
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch data on mount and filter change
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const response = await galleryService.getCategories({ include_inactive: false });
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getAdminGallery(filters);
      setImages(response.data || []);
      setPagination(response.meta || {});
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('Gagal memuat galeri');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]:  value,
      page: 1, // Reset to first page
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Toggle selection
  const toggleSelection = (imageId) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  // Select all
  const toggleSelectAll = () => {
    if (selectedImages.length === images. length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.id));
    }
  };

  // Handle delete single
  const handleDelete = async (image) => {
    if (! window.confirm(`Hapus gambar "${image.title}"?`)) return;

    try {
      await galleryService. deleteImage(image.id);
      toast.success('Gambar berhasil dihapus');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Gagal menghapus gambar');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) {
      toast.error('Pilih gambar terlebih dahulu');
      return;
    }

    if (!window.confirm(`Hapus ${selectedImages.length} gambar?`)) return;

    try {
      await galleryService.bulkDeleteImages(selectedImages);
      toast.success(`${selectedImages.length} gambar berhasil dihapus`);
      setSelectedImages([]);
      fetchImages();
    } catch (error) {
      console.error('Error bulk deleting:', error);
      toast.error('Gagal menghapus gambar');
    }
  };

  // Open preview
  const openPreview = (image) => {
    setSelectedImage(image);
    setIsPreviewModalOpen(true);
  };

  // Open edit
  const openEdit = (image) => {
    setSelectedImage(image);
    setIsEditModalOpen(true);
  };

  if (loading && filters.page === 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Galeri Foto</h1>
          <p className="text-gray-600 mt-1">Kelola foto galeri</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsBatchUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FiUpload />
            <span>Upload Multiple</span>
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiUpload />
            <span>Upload Single</span>
          </button>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md: grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul..."
              value={filters. search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category_id}
            onChange={(e) => handleFilterChange('category_id', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Semua Kategori</option>
            {categories. map(cat => (
              <option key={cat.id} value={cat. id}>{cat.name}</option>
            ))}
          </select>

          {/* Published Filter */}
          <select
            value={filters.is_published}
            onChange={(e) => handleFilterChange('is_published', e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Semua Status</option>
            <option value="1">Published</option>
            <option value="0">Draft</option>
          </select>

          {/* Sort */}
          <select
            value={`${filters.sort_by}-${filters.sort_order}`}
            onChange={(e) => {
              const [sort_by, sort_order] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, sort_by, sort_order, page: 1 }));
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus: ring-primary-500 focus: border-transparent"
          >
            <option value="created_at-desc">Terbaru</option>
            <option value="created_at-asc">Terlama</option>
            <option value="title-asc">Judul A-Z</option>
            <option value="title-desc">Judul Z-A</option>
            <option value="views-desc">Paling Dilihat</option>
          </select>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Select All */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedImages.length === images.length && images.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                {selectedImages.length > 0 ? `${selectedImages.length} dipilih` : 'Pilih Semua'}
              </span>
            </label>

            {/* Bulk Delete */}
            {selectedImages.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm"
              >
                <FiTrash2 />
                <span>Hapus Terpilih</span>
              </button>
            )}
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600' 
                  : 'text-gray-400 hover: text-gray-600'
              }`}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {/* Images Grid/List */}
      {images.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FiImage className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Belum Ada Foto</h3>
          <p className="text-gray-500 mb-6">Upload foto pertama Anda</p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FiUpload />
            <span>Upload Foto</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images. map((image) => (
            <ImageCard 
              key={image.id}
              image={image}
              selected={selectedImages.includes(image. id)}
              onToggleSelect={() => toggleSelection(image.id)}
              onPreview={() => openPreview(image)}
              onEdit={() => openEdit(image)}
              onDelete={() => handleDelete(image)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="w-12 px-4 py-3"></th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Gambar</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Judul</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Kategori</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Views</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {images.map((image) => (
                <ImageRow
                  key={image. id}
                  image={image}
                  selected={selectedImages.includes(image.id)}
                  onToggleSelect={() => toggleSelection(image.id)}
                  onPreview={() => openPreview(image)}
                  onEdit={() => openEdit(image)}
                  onDelete={() => handleDelete(image)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {[... Array(pagination.last_page)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  filters.page === i + 1
                    ? 'bg-primary-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page === pagination.last_page}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled: cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {isUploadModalOpen && (
        <UploadModal
          categories={categories}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            setIsUploadModalOpen(false);
            fetchImages();
          }}
        />
      )}

      {isBatchUploadModalOpen && (
        <BatchUploadModal
          categories={categories}
          onClose={() => setIsBatchUploadModalOpen(false)}
          onSuccess={() => {
            setIsBatchUploadModalOpen(false);
            fetchImages();
          }}
        />
      )}

      {isEditModalOpen && selectedImage && (
        <EditModal
          image={selectedImage}
          categories={categories}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedImage(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedImage(null);
            fetchImages();
          }}
        />
      )}

      {isPreviewModalOpen && selectedImage && (
        <PreviewModal
          image={selectedImage}
          onClose={() => {
            setIsPreviewModalOpen(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

// ==================== IMAGE CARD (GRID VIEW) ====================
const ImageCard = ({ image, selected, onToggleSelect, onPreview, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative aspect-video bg-gray-100">
        <img
          src={image.thumbnail_url || image.image_url}
          alt={image.alt_text || image.title}
          className="w-full h-full object-cover cursor-pointer"
          onClick={onPreview}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
          <button
            onClick={onPreview}
            className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100"
          >
            <FiMaximize2 className="text-xl" />
          </button>
        </div>

        {/* Checkbox */}
        <div className="absolute top-2 left-2">
          <input
            type="checkbox"
            checked={selected}
            onChange={onToggleSelect}
            className="w-5 h-5 text-primary-600 border-2 border-white rounded focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          {image.is_featured && (
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded-full flex items-center gap-1">
              <FiStar className="text-xs" />
              Featured
            </span>
          )}
          {! image.is_published && (
            <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">{image.title}</h3>
        
        {image.caption && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{image.caption}</p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span className="bg-gray-100 px-2 py-1 rounded">{image.category?. name}</span>
          <span className="flex items-center gap-1">
            <FiEye />
            {image.views}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
          >
            <FiEdit2 />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
          >
            <FiTrash2 />
            <span>Hapus</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==================== IMAGE ROW (LIST VIEW) ====================
const ImageRow = ({ image, selected, onToggleSelect, onPreview, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggleSelect}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus: ring-primary-500"
        />
      </td>
      <td className="px-4 py-3">
        <img
          src={image.thumbnail_url || image. image_url}
          alt={image.title}
          className="w-16 h-16 object-cover rounded cursor-pointer"
          onClick={onPreview}
        />
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{image.title}</div>
        {image.caption && (
          <div className="text-sm text-gray-500 truncate max-w-xs">{image. caption}</div>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{image.category?.name}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {image.is_published ?  (
            <span className="flex items-center gap-1 text-green-600 text-sm">
              <FiEye />
              Published
            </span>
          ) : (
            <span className="flex items-center gap-1 text-gray-500 text-sm">
              <FiEyeOff />
              Draft
            </span>
          )}
          {image.is_featured && <FiStar className="text-yellow-500" />}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{image.views}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Edit"
          >
            <FiEdit2 />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover: bg-red-50 rounded transition-colors"
            title="Hapus"
          >
            <FiTrash2 />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ManageGallery;