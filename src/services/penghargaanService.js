// ✅ FRONTEND-ONLY SERVICE: Uses dummy data instead of API
// ============================================================================
import {
  dummyPenghargaanList,
  dummyPenghargaanYears,
  filterPenghargaan,
} from '../utils/dummyData';

// Simulate API delay for realism
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

const penghargaanService = {
    // ==================== PUBLIC APIs (FRONTEND ONLY) ====================
    
    /**
     * Get all penghargaan with filters for Media Informasi page
     * @param {Object} params - Query parameters (year, category, search, etc.)
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAllPenghargaan: async (params = {}) => {
        await simulateDelay();

        const { year = null } = params;

        try {
            const filtered = filterPenghargaan(dummyPenghargaanList, year);

            return {
                success: true,
                data: filtered,
            };
        } catch (error) {
            console.error('❌ Error fetching penghargaan:', error);
            throw error;
        }
    },

    /**
     * Get penghargaan for Landing Page
     * @param {Number} limit - Number of awards to fetch (default: 6)
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getForLanding: async (limit = 6) => {
        await simulateDelay();

        const landing = dummyPenghargaanList.slice(0, limit);

        return {
            success: true,
            data: landing,
        };
    },

    /**
     * Get single penghargaan detail by ID
     * @param {Number} id - Penghargaan ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getPenghargaanById: async (id) => {
        await simulateDelay();

        const penghargaan = dummyPenghargaanList.find(p => p.id === id);

        if (!penghargaan) {
            return {
                success: false,
                message: 'Penghargaan tidak ditemukan',
                data: null,
            };
        }

        return {
            success: true,
            data: penghargaan,
        };
    },

    /**
     * Get all available years for filter
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getYears: async () => {
        await simulateDelay();

        return {
            success: true,
            data: dummyPenghargaanYears,
        };
    },

    /**
     * Get all available categories for filter
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getCategories: async () => {
        await simulateDelay();

        const categories = [...new Set(dummyPenghargaanList.map(p => p.category))];

        return {
            success: true,
            data: categories,
        };
    },
};

export default penghargaanService;