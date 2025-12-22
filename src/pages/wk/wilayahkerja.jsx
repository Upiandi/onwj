import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './wilayahkerja.css';
import Peta from './Peta.png';
import produksiBulananService from '../../services/ProduksiBulananService';
import wilayahKerjaService from '../../services/WilayahKerjaService';

const Wilayah = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch data from API
  useEffect(() => {
    const fetchAreas = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await wilayahKerjaService.getAll();
        
        if (response.data.success) {
          // Transform data to match component structure
          const transformedData = response.data.data.map(area => ({
            id: area. area_id,
            dbId: area.id, // ✅ Database ID untuk reference
            name: area.name,
            category: area.category,
            position: { 
              x: parseFloat(area.position_x), 
              y: parseFloat(area.position_y) 
            },
            color: area.color,
            description: area.description,
            // TEKKOM fields
            facilities: area.facilities || [],
            production: area.production || '',
            wells: area.wells || 0,
            depth: area.depth || '',
            pressure: area.pressure || '',
            temperature: area. temperature || '',
            // TJSL fields
            programs: area.programs || [],
            beneficiaries: area.beneficiaries || '',
            budget: area.budget || '',
            duration: area.duration || '',
            impact: area.impact || '',
            // Common fields
            status: area.status,
            // ✅ Related news fields
            related_news_id: area.related_news_id || null,
            related_news_slug: area.related_news?. slug || null,
            related_news_title: area.related_news?.title || null,
          }));
          
          setAllData(transformedData);
          console.log('✅ Data loaded:', transformedData. length, 'areas');
        } else {
          setError('Failed to load data');
        }
      } catch (error) {
        console.error('❌ Error fetching wilayah kerja:', error);
        setError(error.response?.data?.message || 'Gagal memuat data wilayah kerja');
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);
  
  // Memoized filtered data
  const pengeboranData = useMemo(() => 
    allData.filter(d => d.category === 'TEKKOM'), 
    [allData]
  );
  
  const tjslData = useMemo(() => 
    allData.filter(d => d.category === 'TJSL'), 
    [allData]
  );
  
  const filteredData = useMemo(() => {
    if (activeTab === 'tekkom') return pengeboranData;
    if (activeTab === 'tjsl') return tjslData;
    return allData;
  }, [activeTab, pengeboranData, tjslData, allData]);

  // Modal handlers
  const openModal = (item) => {
    setActive(item);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };
  
  const closeModal = () => {
    setActive(null);
    document.body.style.overflow = 'unset'; // Restore scroll
  };

  // Navigation handler
  const handleViewNews = (newsSlug) => {
    if (newsSlug) {
      navigate(`/artikel/${newsSlug}`);
      closeModal();
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gray-50 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold">Memuat data wilayah kerja...</p>
          <p className="text-gray-500 text-sm mt-2">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-50 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Gagal Memuat Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location. reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔄 Muat Ulang Halaman
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (allData. length === 0) {
    return (
      <div className="bg-gray-50 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-gray-400 text-6xl mb-4">📍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Data</h3>
          <p className="text-gray-600">Saat ini belum ada data wilayah kerja yang tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4 lg:px-16">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          {/* Header */}
          <h3 className="font-semibold text-xl mb-3">🗺️ Peta Wilayah Kerja ONWJ 2025</h3>
          <p className="text-sm text-gray-600 mb-4">
            Klik pada marker untuk melihat detail area.  Filter berdasarkan kategori menggunakan tombol di bawah.
          </p>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <TabButton
              active={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              icon="🗺️"
              label="Semua Area"
              count={allData.length}
            />
            <TabButton
              active={activeTab === 'tekkom'}
              onClick={() => setActiveTab('tekkom')}
              icon="🛢️"
              label="Area Pengeboran"
              count={pengeboranData.length}
            />
            <TabButton
              active={activeTab === 'tjsl'}
              onClick={() => setActiveTab('tjsl')}
              icon="🤝"
              label="Program TJSL"
              count={tjslData.length}
            />
          </div>

          {/* Map Container */}
          <div style={{ 
            width: '100%', 
            position: 'relative',
            backgroundColor: '#f1f5f9',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
          }}>
            {/* Background Image */}
            <img 
              src={Peta} 
              alt="Peta Wilayah Kerja ONWJ 2025"
              style={{ 
                width: '100%', 
                height: 'auto',
                display: 'block',
                userSelect: 'none'
              }}
              draggable={false}
            />

            {/* Clickable Areas Overlay */}
            {filteredData.map((area) => (
              <MapMarker
                key={area.id}
                area={area}
                isHovered={hoveredId === area.id}
                onHover={() => setHoveredId(area.id)}
                onLeave={() => setHoveredId(null)}
                onClick={() => openModal(area)}
              />
            ))}
          </div>

          {/* Legend */}
          <MapLegend
            activeTab={activeTab}
            pengeboranData={pengeboranData}
            tjslData={tjslData}
          />
        </div>
      </div>

      {/* Modal */}
      {active && (
        <Modal
          area={active}
          onClose={closeModal}
          onViewNews={handleViewNews}
        />
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

// ==================== SUB-COMPONENTS ====================

// Tab Button Component
const TabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    style={{
      padding: '8px 16px',
      borderRadius: '8px',
      border: active ? '2px solid #2563eb' : '2px solid #e5e7eb',
      backgroundColor: active ? '#eff6ff' : 'white',
      color: active ? '#2563eb' : '#6b7280',
      fontSize:  '14px',
      fontWeight: '600',
      cursor:  'pointer',
      transition:  'all 0.2s'
    }}
  >
    {icon} {label} ({count})
  </button>
);

// Map Marker Component
const MapMarker = ({ area, isHovered, onHover, onLeave, onClick }) => (
  <div
    onClick={onClick}
    onMouseEnter={onHover}
    onMouseLeave={onLeave}
    style={{
      position: 'absolute',
      left: `${area.position.x}%`,
      top: `${area.position.y}%`,
      transform: 'translate(-50%, -50%)',
      cursor: 'pointer',
      zIndex: isHovered ? 20 : 10,
      transition: 'all 0.2s ease'
    }}
    aria-label={`Area ${area.name}`}
  >
    {/* Map Pin Icon */}
    <svg
      width={isHovered ? '42' : '32'}
      height={isHovered ? '42' : '32'}
      viewBox="0 0 24 24"
      fill={area.color}
      style={{
        filter: isHovered 
          ? 'drop-shadow(0 8px 16px rgba(0,0,0,0.4))' 
          : 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
        transition: 'all 0.2s ease',
        animation: isHovered ? 'pulse 1. 5s infinite' : 'none'
      }}
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>

    {/* Tooltip Label */}
    {isHovered && (
      <div style={{
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        pointerEvents: 'none'
      }}>
        {area. name}
        <div style={{
          position: 'absolute',
          bottom: '-4px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '5px solid rgba(17, 24, 39, 0.95)'
        }} />
      </div>
    )}
  </div>
);

// Map Legend Component
const MapLegend = ({ activeTab, pengeboranData, tjslData }) => (
  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h4 className="font-semibold text-sm mb-3 text-gray-700">📊 Legenda</h4>
    
    {/* TEKKOM Legend */}
    {(activeTab === 'all' || activeTab === 'tekkom') && pengeboranData.length > 0 && (
      <div className="mb-4">
        <h5 className="text-xs font-semibold text-gray-600 mb-2">🛢️ Area Pengeboran (TEKKOM)</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {pengeboranData.map((area) => (
            <LegendItem key={area.id} area={area} />
          ))}
        </div>
      </div>
    )}

    {/* TJSL Legend */}
    {(activeTab === 'all' || activeTab === 'tjsl') && tjslData.length > 0 && (
      <div>
        <h5 className="text-xs font-semibold text-gray-600 mb-2">🤝 Program TJSL</h5>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tjslData.map((area) => (
            <LegendItem key={area.id} area={area} />
          ))}
        </div>
      </div>
    )}

    <p className="text-xs text-gray-500 mt-3">
      💡 <strong>Tip:</strong> Hover pada marker untuk melihat nama area.  Klik marker untuk melihat detail lengkap.
    </p>
  </div>
);

// Legend Item Component
const LegendItem = ({ area }) => (
  <div className="flex items-center gap-2">
    <svg width="20" height="20" viewBox="0 0 24 24" fill={area.color} style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
    <span className="text-xs font-medium text-gray-700">{area.name}</span>
  </div>
);

// Modal Component
const Modal = ({ area, onClose, onViewNews }) => {
  const [activeTab, setActiveTab] = useState(
    area.category === 'TEKKOM' ?  'overview' : 'overview'
  );

  const tabs = area.category === 'TEKKOM'
    ? [
        { id: 'overview', label: 'Ringkasan' },
        { id: 'produksi', label: 'Produksi Bulanan' },
      ]
    : [
        { id: 'overview', label:  'Ringkasan' },
        { id: 'dokumentasi', label: 'Foto Dokumentasi' },
      ];

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => { if (e.target. classList.contains('modal-backdrop')) onClose(); }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(17,24,39,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        backdropFilter: 'blur(4px)'
      }}
    >
      <div className="modal-content" style={{ 
        width: 'min(920px,95%)', 
        maxHeight: '90vh', 
        overflowY:  'auto',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)'
      }}>
        {/* Modal Header */}
        <ModalHeader area={area} onClose={onClose} />

        <div style={{ display: 'flex', gap: 8, padding: '12px 24px', borderBottom: '1px solid #e5e7eb' }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: activeTab === tab.id ? '2px solid #2563eb' :  '1px solid #e5e7eb',
                backgroundColor: activeTab === tab.id ? '#eff6ff' : '#f9fafb',
                color:  activeTab === tab.id ? '#1d4ed8' : '#4b5563',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '24px' }}>
          {area.category === 'TEKKOM' ? (
            <TekkomModalContent area={area} activeTab={activeTab} />
          ) : (
            <TjslModalContent area={area} onViewNews={onViewNews} activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

// Modal Header Component
const ModalHeader = ({ area, onClose }) => (
  <div className="modal-header" style={{ 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '2px solid #e5e7eb'
  }}>
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <svg width="32" height="32" viewBox="0 0 24 24" fill={area.color} style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))' }}>
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
      <h3 className="modal-title" style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
        {area.category === 'TEKKOM' ?  '🛢️ Area Pengeboran' : '🤝 Program TJSL'}:  {area.name}
      </h3>
    </div>
    <button 
      className="modal-close-btn" 
      onClick={onClose}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: '#f3f4f6',
        color: '#6b7280',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#ef4444';
        e.target.style.color = 'white';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = '#f3f4f6';
        e.target.style.color = '#6b7280';
      }}
    >
      ✕
    </button>
  </div>
);

// TEKKOM Modal Content Component
const TekkomModalContent = ({ area, activeTab }) => {
  const [produksiData, setProduksiData] = useState([]);
  const [loadingProduksi, setLoadingProduksi] = useState(false);
  const [latestProd, setLatestProd] = useState(null);

  // Fetch produksi data when tab is 'produksi'
  useEffect(() => {
    if (activeTab === 'produksi') {
      fetchProduksi();
    }
  }, [activeTab, area.dbId]);

  // Always fetch latest produksi (for Overview tab technical/facilities)
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const resp = await produksiBulananService.getAll({ wk_tekkom_id: area.dbId });
        if (resp.data?. success) {
          const items = Array.isArray(resp.data. data) ? resp.data.data. slice() : [];
          items.sort((a, b) => (b.tahun - a.tahun) || (b.bulan - a.bulan));
          setLatestProd(items[0] || null);
        } else {
          setLatestProd(null);
        }
      } catch (e) {
        console.error('❌ Error fetching latest produksi for overview:', e);
        setLatestProd(null);
      }
    };
    fetchLatest();
  }, [area.dbId]);

  const fetchProduksi = async () => {
    setLoadingProduksi(true);
    try {
      const response = await produksiBulananService.getAll({
        wk_tekkom_id: area.dbId,
        tahun: new Date().getFullYear(),
      });
      
      if (response.data. success) {
        setProduksiData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching produksi:', error);
      setProduksiData([]);
    } finally {
      setLoadingProduksi(false);
    }
  };

  if (activeTab === 'produksi') {
    return (
      <div>
        <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight:  '700', marginBottom: '12px', color: '#111827' }}>
          📊 Data Produksi Per Bulan
        </h4>
        
        {loadingProduksi ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : produksiData.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Belum ada data produksi untuk area ini</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                  <th style={{ textAlign: 'left', padding:  '10px', fontWeight: 700 }}>Bulan</th>
                  <th style={{ textAlign: 'right', padding: '10px', fontWeight: 700 }}>Minyak (BOPD)</th>
                  <th style={{ textAlign: 'right', padding: '10px', fontWeight: 700 }}>Gas (MMSCFD)</th>
                  <th style={{ textAlign: 'left', padding: '10px', fontWeight: 700 }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {produksiData.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding:  '10px', fontWeight: 600 }}>{row.periode}</td>
                    <td style={{ padding: '10px', color: '#2563eb', fontWeight: 700, textAlign: 'right' }}>
                      {row.produksi_minyak ?  Number(row.produksi_minyak).toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td style={{ padding:  '10px', color: '#059669', fontWeight: 700, textAlign: 'right' }}>
                      {row.produksi_gas ? Number(row.produksi_gas).toLocaleString('id-ID', { minimumFractionDigits: 2 }) : '-'}
                    </td>
                    <td style={{ padding: '10px', color: '#6b7280' }}>{row.catatan || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap:  24 }}>
      {/* Left Column */}
      <div>
        <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          📋 Deskripsi
        </h4>
        <p className="modal-text" style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
          {area.description}
        </p>

        <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          📐 Data Teknis
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns:  '1fr 1fr', 
          gap: '12px',
          backgroundColor: '#f9fafb',
          padding: '16px',
          borderRadius: '8px'
        }}>
          <DataField label="ID Area" value={area.id} />
          <DataField 
            label="Status" 
            value={latestProd?. status || '-'} 
            color={latestProd?.status === 'Operasional' ? '#059669' :  '#f59e0b'} 
          />
          {latestProd?. wells > 0 && <DataField label="Jumlah Sumur" value={`${latestProd.wells} sumur`} />}
          {latestProd?.depth && <DataField label="Kedalaman" value={latestProd.depth} />}
          {latestProd?. pressure && <DataField label="Tekanan" value={latestProd.pressure} color="#dc2626" />}
          {latestProd?.temperature && <DataField label="Temperatur" value={latestProd.temperature} color="#ea580c" />}
          {(latestProd?.produksi_minyak || latestProd?.produksi_gas) && (
            <div style={{ gridColumn: '1 / -1' }}>
              <DataField 
                label="Produksi Terbaru" 
                value={`Minyak: ${latestProd?. produksi_minyak ??  '-'} BOPD • Gas: ${latestProd?. produksi_gas ?? '-'} MMSCFD (${latestProd?.periode || ''})`} 
                color="#2563eb" 
                fontSize="16px" 
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Column */}
      <div>
        <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          🏭 Fasilitas & Infrastruktur
        </h4>
        {latestProd?.facilities && latestProd.facilities.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
            {latestProd. facilities.map((f, i) => (
              <ListItem key={i} text={f} color={area.color} />
            ))}
          </ul>
        ) : (
          <p className="modal-text text-gray-500">Tidak ada data fasilitas. </p>
        )}
      </div>
    </div>
  );
};

// TJSL Modal Content Component
const TjslModalContent = ({ area, onViewNews, activeTab }) => {
  const dummyPhotos = [
    { title: 'Kegiatan Sosialisasi', url: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=400&q=60' },
    { title: 'Pelatihan Masyarakat', url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=400&q=60' },
    { title: 'Monitoring Lapangan', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=60' },
  ];

  if (activeTab === 'dokumentasi') {
    return (
      <div>
        <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: '#111827' }}>
          📸 Dokumentasi Program (Dummy)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
          {dummyPhotos.map((photo) => (
            <div key={photo.title} style={{ backgroundColor: '#f9fafb', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
              <img src={photo.url} alt={photo.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
              <div style={{ padding: '10px', fontSize: '13px', fontWeight: 700, color: '#374151' }}>{photo.title}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {/* Left Column */}
      <div>
        <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          📋 Deskripsi Program
        </h4>
        <p className="modal-text" style={{ color: '#6b7280', lineHeight: '1.6', marginBottom: '20px' }}>
          {area. description}
        </p>

        <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight:  '600', marginBottom: '12px', color: '#374151' }}>
          📊 Informasi Program
        </h4>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '12px',
          backgroundColor: '#f9fafb',
          padding:  '16px',
          borderRadius: '8px'
        }}>
          <DataField label="ID Area" value={area.id} />
          <DataField 
            label="Status Program" 
            value={area.status} 
            color={area.status === 'Aktif' ? '#059669' :  '#f59e0b'} 
          />
          {area.duration && <DataField label="Durasi Program" value={area.duration} />}
          {area.beneficiaries && <DataField label="Penerima Manfaat" value={area.beneficiaries} color="#7c3aed" />}
          {area.budget && <DataField label="Anggaran Program" value={area.budget} color="#2563eb" fontSize="16px" fontWeight="700" />}
          {area. impact && <DataField label="Dampak Utama" value={area.impact} color="#059669" />}
        </div>
      </div>

      {/* Right Column */}
      <div>
        <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
          🎯 Program & Kegiatan
        </h4>
        {area.programs && area.programs.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: '20px' }}>
            {area. programs.map((p, i) => (
              <ListItem key={i} text={p} color={area.color} />
            ))}
          </ul>
        ) : (
          <p className="modal-text text-gray-500">Tidak ada data program.</p>
        )}

        {/* ✅ Related News Section */}
        <div style={{ marginTop: '20px' }}>
          <h4 className="modal-section-title" style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color:  '#374151' }}>
            📰 Berita Terkait
          </h4>
          
          {area.related_news_slug && area.related_news_title ?  (
            <div>
              {/* News Card */}
              <div style={{
                padding: '16px',
                backgroundColor: '#f0fdf4',
                border: '2px solid #86efac',
                borderRadius:  '10px',
                marginBottom: '12px'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#166534',
                  marginBottom:  '8px',
                  lineHeight: '1.4'
                }}>
                  📄 {area.related_news_title}
                </div>
                <div style={{
                  fontSize:  '12px',
                  color: '#15803d'
                }}>
                  Klik tombol di bawah untuk membaca selengkapnya
                </div>
              </div>

              {/* Action Button */}
              <ActionButton
                primary
                color="#059669"
                hoverColor="#047857"
                onClick={() => onViewNews(area. related_news_slug)}
              >
                📖 Baca Berita Lengkap
              </ActionButton>
            </div>
          ) : (
            <div style={{
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: '#f3f4f6',
              color: '#9ca3af',
              fontSize: '14px',
              fontWeight: '600',
              textAlign: 'center',
              border: '2px dashed #e5e7eb'
            }}>
              📰 Belum ada berita terkait untuk program ini
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== UTILITY COMPONENTS ====================

// Data Field Component
const DataField = ({ label, value, color = '#111827', fontSize = '14px', fontWeight = '600' }) => (
  <div>
    <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>{label}:</div>
    <div style={{ fontSize, fontWeight, color }}>{value}</div>
  </div>
);

// List Item Component
const ListItem = ({ text, color }) => (
  <li style={{
    padding: '10px 12px',
    backgroundColor: '#f9fafb',
    marginBottom: '8px',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    borderLeft: `3px solid ${color}`
  }}>
    ✓ {text}
  </li>
);

// Action Button Component
const ActionButton = ({ 
  children, 
  onClick, 
  primary = false,
  color = '#2563eb',
  hoverColor = '#1d4ed8',
  hoverBorderColor = '#2563eb'
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = primary ? {
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: color,
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: `0 2px 4px ${color}40`,
    width: '100%'
  } : {
    padding: '12px 16px',
    borderRadius: '8px',
    border: `2px solid ${isHovered ? hoverBorderColor : '#e5e7eb'}`,
    backgroundColor: 'white',
    color: '#374151',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%'
  };

  return (
    <button
      style={primary ? { ...baseStyle, backgroundColor: isHovered ? hoverColor : color } : baseStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Wilayah;