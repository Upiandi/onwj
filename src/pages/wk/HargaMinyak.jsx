import { useState, useEffect, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { FaChartLine, FaOilCan, FaArrowUp, FaArrowDown, FaCalendarAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import hargaMinyakService from '../../services/HargaMinyakService';

// ========== CONSTANTS ==========
const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const OIL_TYPES = {
  brent: { label: 'Brent Crude', color: '#3b82f6', gradient: 'from-blue-500 to-blue-600' },
  duri: { label: 'Duri Crude', color: '#f59e0b', gradient: 'from-amber-500 to-amber-600' },
  ardjuna:  { label: 'Ardjuna Crude', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600' },
  kresna: { label: 'Kresna Crude', color: '#8b5cf6', gradient: 'from-violet-500 to-violet-600' },
};

const YEARS = ['2021', '2022', '2023', '2024', '2025'];

// ========== UTILITY FUNCTIONS ==========
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
};

// ========== COMPONENTS ==========
const CustomTooltip = ({ active, payload }) => {
  if (! active || !payload?.length) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-xl border-2 border-gray-100">
      <p className="font-semibold text-gray-900 mb-3 text-sm">
        {payload[0]?.payload?.fullLabel}
      </p>
      <div className="space-y-2">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600 text-xs">{entry.name}</span>
            </div>
            <span className="font-bold text-sm" style={{ color: entry.color }}>
              ${entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, change, color, gradient, isConstant }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover: scale-105">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-md`}>
          <FaOilCan className="w-6 h-6 text-white" />
        </div>
        {! isConstant && (
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
            isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {isPositive ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
            {Math.abs(change).toFixed(2)}%
          </div>
        )}
        {isConstant && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-gray-100 text-gray-600">
            Konstan
          </div>
        )}
      </div>
      <h4 className="text-sm text-gray-500 font-medium mb-2">{title}</h4>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold" style={{ color }}>
          ${value}
        </p>
        <span className="text-sm text-gray-400 font-medium">/bbl</span>
      </div>
    </div>
  );
};

const FilterModal = ({ isOpen, onClose, rangeFrom, rangeTo, onApply }) => {
  const [tempFrom, setTempFrom] = useState(rangeFrom);
  const [tempTo, setTempTo] = useState(rangeTo);

  useEffect(() => {
    setTempFrom(rangeFrom);
    setTempTo(rangeTo);
  }, [rangeFrom, rangeTo, isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply(tempFrom, tempTo);
    onClose();
  };

  const getRangeDisplay = () => {
    return `${formatDate(tempFrom)} - ${formatDate(tempTo)}`;
  };

  const calculateDataCount = () => {
    const start = new Date(tempFrom);
    const end = new Date(tempTo);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaCalendarAlt className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Filter Periode Tanggal</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-all">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dari Tanggal</label>
            <input
              type="date"
              value={tempFrom}
              onChange={(e) => {
                setTempFrom(e.target.value);
                if (e.target.value > tempTo) setTempTo(e.target.value);
              }}
              max="2025-12-31"
              min="2021-01-01"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Sampai Tanggal</label>
            <input
              type="date"
              value={tempTo}
              onChange={(e) => setTempTo(e.target.value)}
              min={tempFrom}
              max="2025-12-31"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-700 font-medium"
            />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-900 font-medium">
            📊 Periode:  <span className="font-bold">{getRangeDisplay()}</span>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Menampilkan {calculateDataCount()} hari data
          </p>
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
            Batal
          </button>
          <button onClick={handleApply} className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover: from-blue-700 hover: to-blue-800 shadow-lg transition-all">
            Terapkan
          </button>
        </div>
      </div>
    </div>
  );
};

// ========== MAIN COMPONENT ==========
const HargaMinyakPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({});

  const today = new Date();
  const [monthFilter, setMonthFilter] = useState({
    year: String(today.getFullYear()),
    month: today.getMonth(),
  });
  
  // Default: current month
  const getMonthRange = (year, monthIndex) => {
    const start = new Date(year, monthIndex, 1);
    const end = new Date(year, monthIndex + 1, 0);
    return {
      from: start.toISOString().split('T')[0],
      to: end.toISOString().split('T')[0],
    };
  };

  const [dateRange, setDateRange] = useState(
    getMonthRange(today.getFullYear(), today.getMonth())
  );

  const applyMonthFilter = (year, monthIndex) => {
    setMonthFilter({ year: String(year), month: monthIndex });
    setDateRange(getMonthRange(year, monthIndex));
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        from: dateRange.from,
        to: dateRange.to,
      };

      const response = await hargaMinyakService.getAll(params);
      
      if (response.data.success) {
        setChartData(response.data.data.chartData);
        setStats(response.data.data.stats);
      } else {
        setError('Gagal memuat data');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleApplyFilter = (from, to) => {
    setDateRange({ from, to });
  };

  const handleMonthChange = (type, value) => {
    const updated = {
      year: type === 'year' ? value : monthFilter.year,
      month: type === 'month' ? Number(value) : monthFilter.month,
    };
    applyMonthFilter(updated.year, updated.month);
  };

  const getPeriodLabel = () => {
    return `${formatDate(dateRange.from)} - ${formatDate(dateRange.to)}`;
  };

  const statsCards = useMemo(() => {
    if (!stats || Object.keys(stats).length === 0) return [];
    
    return Object.entries(OIL_TYPES).map(([key, oilType]) => ({
      title: oilType.label,
      value: stats[key]?.current || 0,
      change:  stats[key]?.change || 0,
      color: oilType.color,
      gradient: oilType.gradient,
      isConstant: key === 'duri',
    }));
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-lg font-semibold">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg: px-8 max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <FaChartLine className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Harga Minyak Dunia</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Pantau perkembangan harga minyak mentah secara real-time
          </p>
        </div>

        <div className="grid grid-cols-1 md: grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Grafik Harga Minyak</h2>
              <p className="text-gray-600 text-sm">Pergerakan harga dalam periode yang dipilih</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
                <select
                  value={monthFilter.month}
                  onChange={(e) => handleMonthChange('month', e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none"
                >
                  {MONTHS.map((m, idx) => (
                    <option key={m} value={idx}>{m}</option>
                  ))}
                </select>
                <select
                  value={monthFilter.year}
                  onChange={(e) => handleMonthChange('year', e.target.value)}
                  className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setIsFilterOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaCalendarAlt className="w-4 h-4" />
                <span>Filter Periode</span>
              </button>
            </div>
          </div>

          <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-100">
            <p className="text-sm font-medium text-blue-900">
              📅 Periode: <span className="font-bold">{getPeriodLabel()}</span>
            </p>
            <p className="text-xs text-blue-700 mt-1">
              Menampilkan {chartData.length} hari data
            </p>
          </div>

          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  {Object.entries(OIL_TYPES).map(([key, oil]) => (
                    <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={oil.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={oil.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#d1d5db' }}
                />
                <YAxis
                  tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#d1d5db' }}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  wrapperStyle={{ paddingTop:  '20px' }} 
                  iconType="circle"
                  formatter={(value) => <span className="font-semibold text-gray-700">{value}</span>}
                />
                {Object.entries(OIL_TYPES).map(([key, oil]) => (
                  <Area
                    key={key}
                    type="monotone"
                    dataKey={key}
                    name={oil.label}
                    stroke={oil.color}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill={`url(#color${key})`}
                    dot={false}
                    activeDot={false}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        rangeFrom={dateRange.from}
        rangeTo={dateRange.to}
        onApply={handleApplyFilter}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform:  translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default HargaMinyakPage;