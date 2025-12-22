// ✅ FRONTEND-ONLY SERVICE: Uses dummy data instead of API
// ============================================================================
import {
  dummyProgramsList,
  getPaginatedData,
} from '../utils/dummyData';

// Simulate API delay for realism
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

const programService = {
    // ==================== PUBLIC APIs (FRONTEND ONLY) ====================
    
    /**
     * Get all programs with filters, search, and pagination
     * @param {Object} params - Query parameters (category, status, year, search, page, per_page, etc.)
     * @returns {Promise<{success: boolean, data: Array, meta: Object}>}
     */
    getAllPrograms: async (params = {}) => {
        await simulateDelay();

        const {
            page = 1,
            per_page = 6,
            category = null,
            search = null,
        } = params;

        try {
            // Filter programs
            let filtered = dummyProgramsList;

            if (category) {
                filtered = filtered.filter(p => p.category === category);
            }

            if (search) {
                const term = search.toLowerCase();
                filtered = filtered.filter(
                    p =>
                        p.title.toLowerCase().includes(term) ||
                        p.description.toLowerCase().includes(term)
                );
            }

            // Paginate
            const result = getPaginatedData(filtered, page, per_page);

            return {
                success: true,
                data: result.data,
                current_page: result.current_page,
                per_page: result.per_page,
                total: result.total,
                last_page: result.last_page,
            };
        } catch (error) {
            console.error('❌ Error fetching programs:', error);
            throw error;
        }
    },

    /**
     * Get single program detail by slug
     * @param {String} slug - Program slug
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getProgramBySlug: async (slug) => {
        await simulateDelay();

        const program = dummyProgramsList.find(p => p.slug === slug);

        if (!program) {
            return {
                success: false,
                message: 'Program tidak ditemukan',
                data: null,
            };
        }

        return {
            success: true,
            data: program,
        };
    },

    /**
     * Get recent programs for sidebar
     * @param {Number} limit - Number of programs to fetch (default: 3)
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getRecentPrograms: async (limit = 3) => {
        await simulateDelay();

        const recent = dummyProgramsList.slice(0, limit);

        return {
            success: true,
            data: recent,
        };
    },

    /**
     * Get all program categories
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getCategories: async () => {
        await simulateDelay();

        const categories = [...new Set(dummyProgramsList.map(p => p.category))];

        return {
            success: true,
            data: categories,
        };
    },

    /**
     * Get program status options
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getStatusOptions: async () => {
        await simulateDelay();

        const statuses = ['Aktif', 'Selesai', 'Tertunda'];

        return {
            success: true,
            data: statuses,
        };
    },

    /**
     * Get program statistics
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getStatistics: async () => {
        await simulateDelay();

        const activePrograms = dummyProgramsList.filter(p => p.status === 'Aktif').length;
        const totalPrograms = dummyProgramsList.length;

        return {
            success: true,
            data: {
                total_programs: totalPrograms,
                active_programs: activePrograms,
                completed_programs: totalPrograms - activePrograms,
            },
        };
    },
};

export default programService;