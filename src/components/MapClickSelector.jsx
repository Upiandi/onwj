import React, { useState, useRef, useEffect } from 'react';
import { FaMapMarkerAlt, FaTimes, FaRedo } from 'react-icons/fa';

const MapClickSelector = ({ 
  imageSrc, 
  onPositionSelect, 
  initialX = null, 
  initialY = null,
  markerColor = '#EF4444' 
}) => {
  // FIX: Konversi string kosong menjadi null
  const [position, setPosition] = useState({ 
    x: initialX === '' || initialX === null ? null : parseFloat(initialX), 
    y: initialY === '' || initialY === null ? null : parseFloat(initialY) 
  });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const updateImageSize = () => {
      if (imageRef.current) {
        setImageSize({
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight
        });
      }
    };

    updateImageSize();
    window.addEventListener('resize', updateImageSize);
    return () => window.removeEventListener('resize', updateImageSize);
  }, []);

  useEffect(() => {
    // FIX: Konversi dan validasi initialX dan initialY
    if (initialX !== null && initialX !== '' && initialY !== null && initialY !== '') {
      setPosition({ 
        x: parseFloat(initialX), 
        y: parseFloat(initialY) 
      });
    }
  }, [initialX, initialY]);

  const handleImageClick = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to percentage
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    setPosition({ x: percentX, y: percentY });
    
    if (onPositionSelect) {
      onPositionSelect({
        position_x: parseFloat(percentX.toFixed(2)),
        position_y: parseFloat(percentY.toFixed(2))
      });
    }
  };

  const handleReset = () => {
    setPosition({ x: null, y: null });
    if (onPositionSelect) {
      onPositionSelect({ position_x: '', position_y: '' });
    }
  };

  // FIX: Helper function untuk validasi posisi
  const hasValidPosition = position.x !== null && position.y !== null && 
                          ! isNaN(position.x) && !isNaN(position.y);

  return (
    <div className="w-full">
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-blue-600 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900 mb-1">Cara Menggunakan:</h4>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1.Klik pada peta untuk menentukan lokasi area</li>
              <li>2.Marker merah akan muncul di posisi yang Anda klik</li>
              <li>3.Koordinat akan otomatis terisi dalam bentuk persentase</li>
              <li>4.Klik "Reset Posisi" untuk memilih ulang</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
        <div 
          ref={containerRef}
          className="relative cursor-crosshair"
          onClick={handleImageClick}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Peta TEKKOM"
            className="w-full h-auto"
            draggable={false}
          />
          
          {/* FIX: Validasi posisi sebelum render marker */}
          {hasValidPosition && (
            <div
              className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-full animate-bounce"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill={markerColor}
                className="w-full h-full drop-shadow-lg"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          )}

          <div className="absolute top-2 right-2 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
            <div className="text-xs font-semibold text-gray-700">
              {/* FIX: Validasi sebelum memanggil toFixed */}
              {hasValidPosition ? (
                <>
                  <div>X: {position.x.toFixed(2)}%</div>
                  <div>Y: {position.y.toFixed(2)}%</div>
                </>
              ) : (
                <div className="text-gray-400">Klik pada peta</div>
              )}
            </div>
          </div>
        </div>

        {/* FIX: Validasi sebelum render tombol reset */}
        {hasValidPosition && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all shadow-lg flex items-center gap-2"
          >
            <FaRedo />
            Reset Posisi
          </button>
        )}
      </div>

      {/* FIX: Validasi sebelum render success message */}
      {hasValidPosition && (
        <div className="mt-4 bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            <span className="font-semibold">
              Posisi berhasil dipilih: X={position.x.toFixed(2)}%, Y={position.y.toFixed(2)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapClickSelector;