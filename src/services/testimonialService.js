// ✅ FRONTEND-ONLY SERVICE: Uses dummy data instead of API
// ============================================================================
import { dummyTestimonialsList } from '../utils/dummyData';

// Simulate API delay for realism
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// ===== PUBLIC API (FRONTEND ONLY) =====
export const testimonialApi = {
    /**
     * Get all testimonials
     * @param {Object} params - Query parameters
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getAll: async (params = {}) => {
        await simulateDelay();

        return {
            success: true,
            data: dummyTestimonialsList,
        };
    },

    /**
     * Get single testimonial by ID
     * @param {Number} id - Testimonial ID
     * @returns {Promise<{success: boolean, data: Object}>}
     */
    getById: async (id) => {
        await simulateDelay();

        const testimonial = dummyTestimonialsList.find(t => t.id === id);

        if (!testimonial) {
            return {
                success: false,
                message: 'Testimonial tidak ditemukan',
                data: null,
            };
        }

        return {
            success: true,
            data: testimonial,
        };
    },

    /**
     * Get featured testimonials
     * @param {Number} limit - Number of testimonials to fetch
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getFeatured: async (limit = 3) => {
        await simulateDelay();

        const featured = dummyTestimonialsList
            .filter(t => t.is_featured)
            .slice(0, limit);

        return {
            success: true,
            data: featured,
        };
    },

    /**
     * Get testimonials by program
     * @param {String} program - Program name
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getByProgram: async (program) => {
        await simulateDelay();

        const byProgram = dummyTestimonialsList.filter(
            t => t.program && t.program.toLowerCase().includes(program.toLowerCase())
        );

        return {
            success: true,
            data: byProgram,
        };
    },

    /**
     * Get available programs for filter
     * @returns {Promise<{success: boolean, data: Array}>}
     */
    getPrograms: async () => {
        await simulateDelay();

        const programs = [...new Set(dummyTestimonialsList.map(t => t.program).filter(Boolean))];

        return {
            success: true,
            data: programs,
        };
    },
};

// Default export
export default testimonialApi;