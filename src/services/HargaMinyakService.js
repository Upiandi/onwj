// ✅ DUMMY DATA - Frontend Only
const simulateDelay = () => new Promise(r => setTimeout(r, 300));

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Generate dummy harga minyak data for a date range
const generateChartData = (fromDate, toDate) => {
  const data = [];
  let current = new Date(fromDate);
  const end = new Date(toDate);
  
  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    const day = current.getDate();
    const month = MONTHS[current.getMonth()];
    
    // Dummy prices with slight variation
    const baseBrent = 80 + Math.random() * 20;
    const baseDuri = 75 + Math.random() * 18;
    const baseArdjuna = 78 + Math.random() * 19;
    const baseKresna = 82 + Math.random() * 21;
    
    data.push({
      date: dateStr,
      fullLabel: `${day} ${month}`,
      brent: Math.round(baseBrent * 100) / 100,
      duri: Math.round(baseDuri * 100) / 100,
      ardjuna: Math.round(baseArdjuna * 100) / 100,
      kresna: Math.round(baseKresna * 100) / 100,
    });
    
    current.setDate(current.getDate() + 1);
  }
  
  return data;
};

// Generate dummy statistics
const generateStats = (chartData) => {
  if (chartData.length === 0) {
    return {
      brent: { current: 0, change: 0 },
      duri: { current: 0, change: 0 },
      ardjuna: { current: 0, change: 0 },
      kresna: { current: 0, change: 0 },
    };
  }
  
  const latest = chartData[chartData.length - 1];
  const previous = chartData[Math.max(0, chartData.length - 2)];
  
  return {
    brent: {
      current: latest.brent,
      change: latest.brent - previous.brent
    },
    duri: {
      current: latest.duri,
      change: 0 // Always constant
    },
    ardjuna: {
      current: latest.ardjuna,
      change: latest.ardjuna - previous.ardjuna
    },
    kresna: {
      current: latest.kresna,
      change: latest.kresna - previous.kresna
    },
  };
};

export const hargaMinyakService = {
  // Frontend dummy endpoints
  getAll: async (params) => {
    await simulateDelay();
    
    const fromDate = params?.from || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0];
    const toDate = params?.to || new Date().toISOString().split('T')[0];
    
    const chartData = generateChartData(fromDate, toDate);
    const stats = generateStats(chartData);
    
    return {
      data: {
        success: true,
        data: {
          chartData,
          stats
        }
      }
    };
  },
  
  getById: async (id) => {
    await simulateDelay();
    return {
      data: {
        success: true,
        data: {
          id,
          price: Math.round((70 + Math.random() * 30) * 100) / 100,
          type: 'brent'
        }
      }
    };
  },
  
  getStatistics: async (params) => {
    await simulateDelay();
    const currentDate = new Date();
    const chartData = generateChartData(
      new Date(currentDate.getFullYear(), 0, 1).toISOString().split('T')[0],
      currentDate.toISOString().split('T')[0]
    );
    const stats = generateStats(chartData);
    
    return {
      data: {
        success: true,
        data: stats
      }
    };
  },

  getLatest: async (params) => {
    await simulateDelay();
    const today = new Date().toISOString().split('T')[0];
    const chartData = generateChartData(today, today);
    
    return {
      data: {
        success: true,
        data: chartData[0] || {}
      }
    };
  }
};

export default hargaMinyakService;