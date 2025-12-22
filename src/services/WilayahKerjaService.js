// ✅ DUMMY DATA - Frontend Only
import { dummyAreas } from '../utils/dummyData';

const simulateDelay = () => new Promise(r => setTimeout(r, 300));

export const wilayahKerjaService = {
  // Get all areas (TEKKOM + TJSL)
  getAll: async (params) => {
    await simulateDelay();
    
    let data = dummyAreas;
    
    if (params?.category) {
      data = dummyAreas.filter(area => area.category === params.category);
    }
    
    return {
      data: {
        success: true,
        data
      }
    };
  },
  
  // Get by category only
  getTekkom: async () => {
    await simulateDelay();
    return {
      data: {
        success: true,
        data: dummyAreas.filter(area => area.category === 'TEKKOM')
      }
    };
  },
  
  getTjsl: async () => {
    await simulateDelay();
    return {
      data: {
        success: true,
        data: dummyAreas.filter(area => area.category === 'TJSL')
      }
    };
  },
  
  // Get single area
  getById: async (id, category) => {
    await simulateDelay();
    
    let area = dummyAreas.find(a => a.id === parseInt(id) || a.area_id === id);
    
    if (category) {
      area = area && area.category === category ? area : null;
    }
    
    if (!area) {
      throw {
        response: {
          data: {
            success: false,
            message: 'Area not found'
          }
        }
      };
    }
    
    return {
      data: {
        success: true,
        data: area
      }
    };
  },
  
  // Get statistics
  getStatistics: async () => {
    await simulateDelay();
    
    const statistics = {
      total_areas: dummyAreas.length,
      tekkom_areas: dummyAreas.filter(a => a.category === 'TEKKOM').length,
      tjsl_areas: dummyAreas.filter(a => a.category === 'TJSL').length,
      total_production: '250,000 BOPD',
      total_wells: dummyAreas.reduce((sum, a) => sum + a.wells, 0),
      total_budget: 'Rp 16 Miliar',
    };
    
    return {
      data: {
        success: true,
        data: statistics
      }
    };
  }
};

export default wilayahKerjaService;