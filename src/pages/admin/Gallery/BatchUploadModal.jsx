import React, { useState } from 'react';
import { FiX, FiUpload, FiTrash2, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import galleryService from '../../services/galleryService';
import toast from 'react-hot-toast';

const BatchUploadModal = ({ categories, onClose, onSuccess }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate files
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name}:  Bukan file gambar`);
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name}: Ukuran lebih dari 5MB`);
        return;
      }

      validFiles.push(file);
    });

    // Show errors for invalid files
    if (invalidFiles.length > 0) {
      toast.error(
        <div>
          <p className="font-semibold mb-1">File tidak valid:</p>
          <ul className="text-sm">
            {invalidFiles.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>,
        { duration: 5000 }
      );
    }

    // Add valid files with preview
    const filesWithPreview = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));

    setSelectedFiles(prev => [...prev, ...filesWithPreview]);
  };

  // Remove file
  const removeFile = (index) => {
    setSelectedFiles(prev => {
      const newFiles = [... prev];
      // Revoke object URL to free memory
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Remove all files
  const removeAllFiles = () => {
    selectedFiles.forEach(file => URL. revokeObjectURL(file. preview));
    setSelectedFiles([]);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (! selectedCategory) {
      newErrors.category = 'Kategori wajib dipilih';
    }
    if (selectedFiles.length === 0) {
      newErrors.files = 'Pilih minimal 1 gambar';
    }
    if (selectedFiles.length > 20) {
      newErrors.files = 'Maksimal 20 gambar per upload';
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

    const formData = new FormData();
    formData.append('category_id', selectedCategory);
    formData.append('is_published', isPublished ?  '1' : '0');

    // Append all image files
    selectedFiles.forEach((fileObj, index) => {
      formData.append('images[]', fileObj. file);
    });

    try {
      setUploading(true);
      const response = await galleryService.batchUploadImages(formData, (progress) => {
        setUploadProgress(progress);
      });

      const uploaded = response.data?. length || 0;
      const failed = response.errors?.length || 0;

      if (failed > 0) {
        toast.success(
          <div>
            <p className="font-semibold">{uploaded} gambar berhasil diupload</p>
            <p className="text-sm">{failed} gambar gagal</p>
          </div>,
          { duration: 5000 }
        );
      } else {
        toast.success(`${uploaded} gambar berhasil diupload`);
      }

      // Cleanup
      selectedFiles.forEach(file => URL. revokeObjectURL(file. preview));
      
      onSuccess();
    } catch (error) {
      console.error('Error batch uploading:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast. error(error.response?.data?.message || 'Gagal mengupload gambar');
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Calculate total size
  const totalSize = selectedFiles.reduce((sum, file) => sum + file.size, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Multiple Foto</h2>
            <p className="text-sm text-gray-600 mt-1">
              Upload hingga 20 gambar sekaligus
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={uploading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Settings */}
          <div className="grid grid-cols-1 md: grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  if (errors.category) {
                    setErrors(prev => ({ ...prev, category: '' }));
                  }
                }}
                disabled={uploading}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <FiAlertCircle />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Publish Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Publikasi
              </label>
              <label className="flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  disabled={uploading}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">
                  Publish semua gambar (tampilkan di website)
                </span>
              </label>
            </div>
          </div>

          {/* File Upload Area */}
          {selectedFiles.length === 0 ?  (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
                id="batch-upload"
              />
              <label htmlFor="batch-upload" className="cursor-pointer">
                <FiUpload className="mx-auto text-5xl text-gray-400 mb-4" />
                <p className="text-lg text-gray-600 mb-2">
                  Klik untuk pilih gambar atau drag & drop
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  PNG, JPG, WEBP (max 5MB per file, max 20 files)
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <FiUpload />
                  <span>Pilih Gambar</span>
                </div>
              </label>
            </div>
          ) : (
            <div>
              {/* Summary */}
              <div className="flex items-center justify-between mb-4 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <FiCheckCircle className="text-xl" />
                  <span className="font-semibold">
                    {selectedFiles.length} gambar dipilih
                  </span>
                  <span className="text-sm">
                    ({formatFileSize(totalSize)})
                  </span>
                </div>
                <div className="flex gap-2">
                  <label
                    htmlFor="batch-upload-more"
                    className="px-4 py-2 bg-white text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer text-sm"
                  >
                    + Tambah Lagi
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="hidden"
                    id="batch-upload-more"
                  />
                  <button
                    type="button"
                    onClick={removeAllFiles}
                    disabled={uploading}
                    className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm disabled:opacity-50"
                  >
                    Hapus Semua
                  </button>
                </div>
              </div>

              {errors.files && (
                <p className="mb-4 text-sm text-red-500 flex items-center gap-1 p-3 bg-red-50 rounded-lg">
                  <FiAlertCircle />
                  {errors.files}
                </p>
              )}

              {/* File Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-96 overflow-y-auto p-2">
                {selectedFiles.map((fileObj, index) => (
                  <div
                    key={index}
                    className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
                  >
                    <img
                      src={fileObj.preview}
                      alt={fileObj.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all disabled:opacity-50"
                      >
                        <FiTrash2 />
                      </button>
                    </div>

                    {/* File Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                      <p className="text-white text-xs truncate">{fileObj.name}</p>
                      <p className="text-white text-xs opacity-75">
                        {formatFileSize(fileObj.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                <span className="font-semibold">Mengupload gambar... </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width:  `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Mohon tunggu, jangan tutup halaman ini
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={uploading || selectedFiles.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiUpload />
              <span>
                {uploading 
                  ? 'Uploading...' 
                  :  `Upload ${selectedFiles.length} Gambar`
                }
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BatchUploadModal;