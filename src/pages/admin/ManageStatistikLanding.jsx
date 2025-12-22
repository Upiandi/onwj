import React, { useState } from 'react';
import { FaSave, FaClock, FaAward, FaHandshake, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

// Data Dummy - nanti diganti dengan API
const initialStatistik = {
    tahunPengalaman: {
        value: 20,
        label: 'Tahun Pengalaman',
        unit: 'Tahun',
        icon: FaClock,
        color: 'blue'
    },
    penghargaanDiterima: {
        value: 35,
        label: 'Penghargaan Diterima',
        unit: 'Penghargaan',
        icon: FaAward,
        color: 'yellow'
    },
    pelangganPuas: {
        value: 1750,
        label: 'Pelanggan Puas',
        unit: 'Pelanggan',
        icon: FaHandshake,
        color: 'green'
    },
    stafProfesional: {
        value: 120,
        label: 'Staf Profesional',
        unit: 'Staf',
        icon: FaUsers,
        color: 'purple'
    }
};

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        border: 'border-blue-200',
        focus: 'focus:ring-blue-500 focus:border-blue-500'
    },
    yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        border: 'border-yellow-200',
        focus: 'focus:ring-yellow-500 focus:border-yellow-500'
    },
    green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        border: 'border-green-200',
        focus: 'focus:ring-green-500 focus:border-green-500'
    },
    purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        border: 'border-purple-200',
        focus: 'focus:ring-purple-500 focus:border-purple-500'
    }
};

const ManageStatistikLanding = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialStatistik);
    const [hasChanges, setHasChanges] = useState(false);

    const handleChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                value: value === '' ? 0 : parseInt(value) || 0
            }
        }));
        setHasChanges(true);
    };

    const handleSave = () => {
        if (!hasChanges) {
            alert('Tidak ada perubahan untuk disimpan');
            return;
        }

        if (window.confirm('Simpan perubahan statistik landing page?')) {
            // TODO: Kirim ke backend API
            console.log('Saving:', formData);
            alert('✅ Statistik Landing Page berhasil diupdate!');
            setHasChanges(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('Reset semua ke nilai awal?')) {
            setFormData(initialStatistik);
            setHasChanges(false);
            alert('✅ Statistik telah direset!');
        }
    };

    return (
        <div>
            {/* Back Button */}
            <button
                onClick={() => navigate('/tukang-minyak-dan-gas/dashboard')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold mb-6 transition-colors"
            >
                <FaArrowLeft />
                Kembali ke Dashboard
            </button>

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Kelola Statistik Landing Page</h1>
                    <p className="text-gray-600 mt-1">Update angka statistik perusahaan di halaman utama</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges}
                        className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg shadow-md transition-all ${
                            hasChanges
                                ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:-translate-y-0.5'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <FaSave />
                        Simpan Perubahan
                    </button>
                </div>
            </div>

            {/* Warning Alert */}
            {hasChanges && (
                <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-yellow-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm font-medium text-yellow-800">
                            Ada perubahan yang belum disimpan. Klik "Simpan Perubahan" untuk menyimpan.
                        </p>
                    </div>
                </div>
            )}

            {/* Simple Form Cards */}
            <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(formData).map(([key, item]) => {
                        const IconComponent = item.icon;
                        const colors = colorClasses[item.color];
                        
                        return (
                            <div 
                                key={key}
                                className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 transition-all hover:shadow-md`}
                            >
                                {/* Icon & Label */}
                                <div className="flex flex-col items-center text-center mb-4">
                                    <div className={`p-3 bg-white rounded-lg shadow-sm ${colors.icon} mb-3`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        {item.label}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-1">{item.unit}</p>
                                </div>

                                {/* Input */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 text-center">
                                        Nilai:
                                    </label>
                                    <input
                                        type="number"
                                        value={item.value}
                                        onChange={(e) => handleChange(key, e.target.value)}
                                        className={`w-full px-4 py-3 text-2xl font-bold border-2 ${colors.border} rounded-lg ${colors.focus} transition-all bg-white text-center`}
                                        min="0"
                                        placeholder="0"
                                    />
                                </div>

                                {/* Preview */}
                                <div className="mt-4 pt-4 border-t border-gray-200 text-center">
                                    <p className="text-xs text-gray-600 mb-1">Preview:</p>
                                    <p className="text-3xl font-extrabold text-gray-900">
                                        {item.value.toLocaleString('id-ID')}+
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Info Footer */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-blue-900 mb-2">Informasi Penting</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Statistik ini ditampilkan di <strong>Homepage/Landing Page</strong></li>
                            <li>• Format: <strong>"20+ Tahun Pengalaman | 35+ Penghargaan | 1,750+ Pelanggan | 120+ Staf"</strong></li>
                            <li>• Perubahan langsung terlihat di halaman publik setelah disimpan</li>
                            <li>• Pastikan data sudah diverifikasi sebelum menyimpan</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageStatistikLanding;