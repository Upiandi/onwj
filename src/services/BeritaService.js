// ✅ FRONTEND-ONLY SERVICE: Uses dummy data instead of API
// ============================================================================
import {
  dummyBeritaList,
  dummyBeritaCategories,
  getPaginatedData,
  filterBerita,
} from '../utils/dummyData';

// Simulate API delay for realism
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// ===== PUBLIC API (FRONTEND ONLY) =====
export const beritaApi = {
    /**
     * Get all berita for TJSL Page with filtering and pagination
     * @param {Object} params - Query parameters (page, per_page, category, search)
     * @returns {Promise<{success: boolean, data: Array, meta: Object}>}
     */
    getAll: async (params = {}) => {
        await simulateDelay();
        
        const {
            page = 1,
            per_page = 9,
            category = null,
            search = null,
        } = params;

        try {
            // Filter berita
            let filtered = filterBerita(dummyBeritaList, category, search);

            // Paginate
            const result = getPaginatedData(filtered, page, per_page);

            return {
                success: true,
                data: result.data,
                meta: {
                    current_page: result.current_page,
                    per_page: result.per_page,
                    total: result.total,
                    last_page: result.last_page,
                },
            };
        } catch (error) {
            console.error('❌ Error in beritaApi.getAll:', error);
            throw error;
        }
    },

    /**
     * Get single berita by slug
     * @param {string} slug - Berita slug
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getBySlug: async (slug) => {
        await simulateDelay();
        
        const berita = dummyBeritaList.find(item => item.slug === slug);

        if (!berita) {
            return {
                success: false,
                message: 'Berita tidak ditemukan',
                data: null,
            };
        }

        return {
            success: true,
            data: berita,
        };
    },

    /**
     * Get all available categories
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getCategories: async () => {
        await simulateDelay();
        
        return {
            success: true,
            data: dummyBeritaCategories,
        };
    },

    /**
     * Get recent berita
     * @param {number} limit - Number of berita to fetch (default: 5)
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getRecent: async (limit = 5) => {
        await simulateDelay();
        
        const recent = dummyBeritaList.slice(0, limit);

        return {
            success: true,
            data: recent,
        };
    },

    /**
     * Get berita for Media Informasi page
     * @param {Object} params - Query parameters
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    forMediaInformasi: async (params = {}) => {
        await simulateDelay();
        
        // Use getAll under the hood with media informasi specific logic
        const result = await beritaApi.getAll(params);
        return result;
    },

    /**
     * Get pinned berita for Homepage
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    forHomepage: async () => {
        await simulateDelay();
        
        // Return first 3 most recent berita
        const homepage = dummyBeritaList.slice(0, 3);

        return {
            success: true,
            data: homepage,
        };
    },
};

// Default export
export default beritaApi;