// ✅ DUMMY DATA - Frontend Only
const simulateDelay = () => new Promise(r => setTimeout(r, 300));

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Dummy wilayah kerja areas
const WILAYAH_KERJA = [
  { id: 1, dbId: 1, name: 'Cirebon' },
  { id: 2, dbId: 2, name: 'Jatibarang' },
  { id: 3, dbId: 3, name: 'Adiwiyono' },
];

// Generate dummy produksi data
const generateProduksiData = (wkId, year) => {
  const data = [];
  const baseYear = parseInt(year) || new Date().getFullYear();
  
  for (let month = 1; month <= 12; month++) {
    data.push({
      id: Math.random().toString(36).substr(2, 9),
      wk_tekkom_id: wkId || 1,
      tahun: baseYear,
      bulan: month,
      periode: `${MONTHS[month - 1]} ${baseYear}`,
      produksi_minyak: 50000 + Math.random() * 100000, // BOPD
      produksi_gas: 100 + Math.random() * 500, // MMSCFD
      catatan: Math.random() > 0.7 ? 'Maintenance' : null,
    });
  }
  
  return data;
};

export const produksiBulananService = {
  // Frontend dummy endpoints
  getAll: async (params) => {
    await simulateDelay();
    
    const wkId = params?.wk_tekkom_id || 1;
    const tahun = params?.tahun || new Date().getFullYear();
    
    const data = generateProduksiData(wkId, tahun);
    
    return {
      data: {
        success: true,
        data
      }
    };
  },
  
  getById: async (id) => {
    await simulateDelay();
    const data = generateProduksiData(1, new Date().getFullYear());
    const item = data.find(d => d.id === id) || data[0];
    
    return {
      data: {
        success: true,
        data: item
      }
    };
  },
  
  getStatistics: async (params) => {
    await simulateDelay();
    
    const wkId = params?.wk_tekkom_id || 1;
    const year = params?.tahun || new Date().getFullYear();
    
    const data = generateProduksiData(wkId, year);
    
    // Calculate statistics
    const totalMinyak = data.reduce((sum, item) => sum + (item.produksi_minyak || 0), 0);
    const totalGas = data.reduce((sum, item) => sum + (item.produksi_gas || 0), 0);
    const avgMinyak = totalMinyak / data.length;
    const avgGas = totalGas / data.length;
    
    return {
      data: {
        success: true,
        data: {
          total_minyak: totalMinyak,
          total_gas: totalGas,
          rata_minyak: avgMinyak,
          rata_gas: avgGas,
          items: data
        }
      }
    };
  }
};

export default produksiBulananService;
