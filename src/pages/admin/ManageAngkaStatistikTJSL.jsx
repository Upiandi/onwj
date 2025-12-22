import React, { useState, useEffect } from 'react';
import { FaSave, FaUsers, FaBuilding, FaSolarPanel, FaBook, FaHandsHelping, FaSpinner } from 'react-icons/fa';
import { tjslService } from '../../services/StaticTJSLService'; // ✅ Pastikan path import benar
import toast from 'react-hot-toast';

// Mapping Icon
const iconComponents = {
    users: FaUsers,
    building: FaBuilding,
    solar:  FaSolarPanel,
    book: FaBook,
    hands: FaHandsHelping,
    default: FaUsers // Fallback icon
};

// Mapping Warna
const colorClasses = {
    orange: { bg: 'bg-orange-50', icon: 'text-orange-600', border: 'border-orange-200', focus: 'focus:ring-orange-500' },
    blue: { bg: 'bg-blue-50', icon: 'text-blue-600', border: 'border-blue-200', focus: 'focus:ring-blue-500' },
    green: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200', focus: 'focus:ring-green-500' },
    purple: { bg: 'bg-purple-50', icon: 'text-purple-600', border: 'border-purple-200', focus: 'focus:ring-purple-500' },
    default: { bg: 'bg-gray-50', icon: 'text-gray-600', border:  'border-gray-200', focus: 'focus:ring-gray-500' }
};

const ManageAngkaStatistikTJSL = () => {
    const [formData, setFormData] = useState({});
    const [originalData, setOriginalData] = useState({});
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            // ✅ FIXED: Use getAllStatistics instead of getStatistik
            const response = await tjslService.getAllStatistics(); 
            
            // ✅ Service mengembalikan response. data, jadi langsung cek response. success
            if (response && response.success) {
                const data = response.data;
                const transformedData = {};
                
                // Normalisasi data (Array vs Object)
                if (Array.isArray(data)) {
                    data.forEach(item => {
                        transformedData[item. key] = item;
                    });
                } else {
                    Object.entries(data).forEach(([key, item]) => {
                        transformedData[key] = { ... item, key:  item.key || key };
                    });
                }

                setFormData(transformedData);
                setOriginalData(JSON. parse(JSON.stringify(transformedData)));
            }
        } catch (error) {
            console.error('❌ Error fetching statistics:', error);
            const errorMsg = error.response?.data?.message || 'Gagal memuat data statistik';
            toast.error(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key, value) => {
        // Mencegah angka negatif
        const newValue = value === '' ? 0 : Math.max(0, parseInt(value) || 0);

        setFormData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                value: newValue
            }
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (! hasChanges) {
            toast.error('Tidak ada perubahan untuk disimpan');
            return;
        }

        if (! window.confirm('Simpan perubahan statistik TJSL?')) {
            return;
        }

        try {
            setSaving(true);
            
            // Format data untuk dikirim ke backend (Array of Objects)
            const statisticsPayload = Object.values(formData).map(item => ({
                key: item.key,
                value: item.value
            }));

            // ✅ Panggil bulkUpdateStatistics (sesuai service yang baru)
            const response = await tjslService.bulkUpdateStatistics(statisticsPayload);

            if (response && response.success) {
                toast.success('✅ Statistik TJSL berhasil diupdate! ');
                setHasChanges(false);
                setOriginalData(JSON.parse(JSON.stringify(formData)));
            } else {
                throw new Error(response.message || 'Gagal menyimpan');
            }
        } catch (error) {
            console.error('❌ Error saving statistics:', error);
            const errorMsg = error.response?.data?.message || 'Gagal menyimpan statistik';
            toast.error(`❌ ${errorMsg}`);
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm('Reset semua ke nilai default dari database?')) {
            return;
        }
        
        try {
            setSaving(true);
            // ✅ Panggil resetStatistics (sesuai service yang baru)
            const response = await tjslService.resetStatistics();
            
            if (response && response.success) {
                toast. success('✅ Nilai berhasil direset ke default');
                await fetchStatistics(); // Refresh data
                setHasChanges(false);
            }
        } catch (error) {
            console.error('❌ Error resetting:', error);
            toast.error('Gagal melakukan reset');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Batalkan perubahan yang belum disimpan?')) {
            setFormData(JSON.parse(JSON.stringify(originalData)));
            setHasChanges(false);
            toast.success('Perubahan dibatalkan');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data statistik...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Statistik TJSL</h1>
                    <p className="text-gray-600 mt-1">Update angka fokus utama TJSL - Ditampilkan di TJSL Page</p>
                </div>
                <div className="flex gap-3">
                    {hasChanges && (
                        <button
                            onClick={handleCancel}
                            disabled={saving}
                            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
                        >
                            Batal
                        </button>
                    )}
                    <button
                        onClick={handleReset}
                        disabled={saving}
                        className="px-6 py-3 bg-white border-2 border-red-300 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                        Reset ke Default
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={! hasChanges || saving}
                        className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-md transition-all ${
                            hasChanges && ! saving
                                ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {saving ? (
                            <>
                                <FaSpinner className="animate-spin" />
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

            {hasChanges && (
                <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8. 257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-yellow-800">
                            Ada perubahan yang belum disimpan.  Klik "Simpan Perubahan" untuk menyimpan.
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(formData).map(([key, item]) => {
                        const IconComponent = iconComponents[item.icon_name] || iconComponents.default;
                        const colors = colorClasses[item.color] || colorClasses.default;
                        
                        return (
                            <div 
                                key={key}
                                className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 transition-all hover:shadow-md`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 bg-white rounded-lg shadow-sm ${colors.icon}`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900">{item.label}</h3>
                                        <p className="text-xs text-gray-600">{item. unit || 'Unit'}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2">Nilai:  </label>
                                    <input
                                        type="number"
                                        value={item. value}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className={`w-full px-4 py-3 text-2xl font-bold border-2 ${colors.border} rounded-lg ${colors.focus} transition-all bg-white`}
                                        min="0"
                                        placeholder="0"
                                        disabled={saving}
                                    />
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-600 mb-1">Preview di Website: </p>
                                    <p className="text-3xl font-extrabold text-gray-900">
                                        {item.value. toLocaleString('id-ID')}+
                                    </p>
                                </div>

                                {originalData[key] && item.value !== originalData[key]. value && (
                                    <div className="mt-3 text-xs text-orange-600 font-semibold flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                        </svg>
                                        Sebelumnya: {originalData[key].value.toLocaleString('id-ID')}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-blue-900 mb-2">Informasi</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Statistik ini ditampilkan di section <strong>"Fokus Utama TJSL Kami"</strong> pada TJSL Page</li>
                            <li>• Perubahan akan langsung terlihat di halaman publik setelah disimpan</li>
                            <li>• Pastikan data sudah diverifikasi sebelum menyimpan</li>
                            <li>• Angka akan otomatis diformat dengan tanda "+" di website</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageAngkaStatistikTJSL;