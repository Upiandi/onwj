import React from 'react';
import { 
  FiX, FiDownload, FiExternalLink, FiCalendar, 
  FiMapPin, FiCamera, FiEye, FiStar, FiTag 
} from 'react-icons/fi';

const PreviewModal = ({ image, onClose }) => {
  // Handle download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.image_url;
    link.download = image.title || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle open in new tab
  const handleOpenInNewTab = () => {
    window.open(image.image_url, '_blank');
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-7xl w-full max-h-[95vh] flex flex-col md:flex-row gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 md:top-0 md:-right-12 p-3 bg-white bg-opacity-10 hover:bg-opacity-20 text-white rounded-full transition-colors z-10"
          title="Close (Esc)"
        >
          <FiX className="text-2xl" />
        </button>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center bg-black rounded-lg overflow-hidden">
          <img
            src={image.image_url}
            alt={image. alt_text || image.title}
            className="max-w-full max-h-[85vh] object-contain"
          />
        </div>

        {/* Info Sidebar */}
        <div className="w-full md:w-96 bg-white rounded-lg overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-xl font-bold text-gray-900 flex-1">
                {image.title}
              </h2>
              <div className="flex gap-1">
                {image.is_featured && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full flex items-center gap-1">
                    <FiStar className="text-xs" />
                    Featured
                  </span>
                )}
                {image.is_published ?  (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Published
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    Draft
                  </span>
                )}
              </div>
            </div>

            {/* Category */}
            {image.category && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                <FiTag className="text-xs" />
                {image.category.name}
              </div>
            )}
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Caption */}
            {image.caption && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Caption</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {image.caption}
                </p>
              </div>
            )}

            {/* Description */}
            {image.description && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {image.description}
                </p>
              </div>
            )}

            {/* Metadata Grid */}
            <div className="space-y-3">
              {/* Taken Date */}
              {image.taken_date && (
                <div className="flex items-start gap-3">
                  <FiCalendar className="text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Tanggal Foto</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {formatDate(image.taken_date)}
                    </p>
                  </div>
                </div>
              )}

              {/* Photographer */}
              {image. photographer && (
                <div className="flex items-start gap-3">
                  <FiCamera className="text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Fotografer</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {image.photographer}
                    </p>
                  </div>
                </div>
              )}

              {/* Location */}
              {image.location && (
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Lokasi</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {image.location}
                    </p>
                  </div>
                </div>
              )}

              {/* Views */}
              <div className="flex items-start gap-3">
                <FiEye className="text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {image.views || 0} kali dilihat
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {image. tags && image.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {image.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Informasi Teknis</h3>
              <div className="space-y-2 text-sm">
                {image.width && image.height && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensi</span>
                    <span className="text-gray-900 font-medium">
                      {image.width} × {image.height}px
                    </span>
                  </div>
                )}
                {image.file_size && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ukuran File</span>
                    <span className="text-gray-900 font-medium">
                      {(image.file_size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                )}
                {image.mime_type && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format</span>
                    <span className="text-gray-900 font-medium uppercase">
                      {image.mime_type. split('/')[1]}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Slug</span>
                  <span className="text-gray-900 font-mono text-xs">
                    {image.slug}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                Diupload: {formatDate(image. created_at) || 'N/A'}
              </p>
              {image.updated_at && image.updated_at !== image.created_at && (
                <p>
                  Terakhir diupdate: {formatDate(image. updated_at)}
                </p>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t bg-gray-50 flex gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiDownload />
              <span>Download</span>
            </button>
            <button
              onClick={handleOpenInNewTab}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiExternalLink />
              <span>Buka</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;