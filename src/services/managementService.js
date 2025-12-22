// ✅ DUMMY DATA - Frontend Only
import { dummyDirectors, dummyCommissioners, dummyOrgStructure } from '../utils/dummyData';

const simulateDelay = () => new Promise(r => setTimeout(r, 300));

const managementService = {
  /**
   * Get all active management data (Frontend dummy)
   */
  getAll: async () => {
    await simulateDelay();
    return {
      success: true,
      data: [...dummyDirectors, ...dummyCommissioners, ...dummyOrgStructure]
    };
  },

  /**
   * Get management by type (Frontend dummy)
   */
  getByType: async (type) => {
    await simulateDelay();
    
    let data = [];
    
    if (type === 'director') {
      data = dummyDirectors;
    } else if (type === 'commissioner') {
      data = dummyCommissioners;
    } else if (type === 'organizational_structure') {
      data = dummyOrgStructure;
    }
    
    return {
      success: true,
      data
    };
  }
};

export default managementService;
