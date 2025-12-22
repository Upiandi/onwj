// ✅ FRONTEND-ONLY SERVICE: Uses dummy data instead of API
// ============================================================================
import {
  dummyUmkmList,
  dummyUmkmCategories,
  filterUmkm,
} from '../utils/dummyData';

// Simulate API delay for realism
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export const umkmService = {
    // Public APIs (FRONTEND ONLY)

    /**
     * Get all UMKM with optional category filter
     * @param {Object} params - Query parameters including category
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getAllUmkm: async (params = {}) => {
        await simulateDelay();

        try {
            const { category = 'Semua' } = params;

            // Filter by category
            const filtered = filterUmkm(dummyUmkmList, category);

            // Separate featured and regular
            const featured = filtered.find(item => item.is_featured);
            const regular = filtered.filter(item => !item.is_featured);

            return {
                success: true,
                data: {
                    featured,
                    umkm: regular,
                    categories: dummyUmkmCategories,
                },
            };
        } catch (error) {
            console.error('❌ Error in getAllUmkm:', error);
            throw error;
        }
    },

    /**
     * Get single UMKM by ID
     * @param {Number} id - UMKM ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getUmkmById: async (id) => {
        await simulateDelay();

        const umkm = dummyUmkmList.find(item => item.id === id);

        if (!umkm) {
            return {
                success: false,
                message: 'UMKM tidak ditemukan',
                data: null,
            };
        }

        return {
            success: true,
            data: umkm,
        };
    },

    /**
     * Get UMKM categories with counts
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getCategories: async () => {
        await simulateDelay();

        return {
            success: true,
            data: dummyUmkmCategories,
        };
    },

    /**
     * Get UMKM status options
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getStatusOptions: async () => {
        await simulateDelay();

        const statuses = ['Aktif', 'Lulus Binaan', 'Tertunda'];

        return {
            success: true,
            data: statuses,
        };
    },
};

export default umkmService;