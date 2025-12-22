// ✅ FRONTEND-ONLY SERVICE: Uses dummy data instead of API
// ============================================================================

import Hero1 from '../assets/Hero/Hero1.png';
import Hero2 from '../assets/Hero/Hero2.mp4';
import Hero3 from '../assets/Hero/Hero3.png';

// Dummy hero sections data with actual assets
const dummyHeroSections = [
  {
    id: 1,
    title: 'Komitmen Terhadap Kelestarian Lingkungan',
    description: 'Bergabunglah dengan kami dalam misi menjaga lingkungan untuk generasi mendatang',
    type: 'image',
    src: Hero1,
    active: true,
  },
  {
    id: 2,
    title: 'Pemberdayaan Masyarakat Lokal',
    description: 'Program TJSL kami fokus pada kesejahteraan masyarakat sekitar wilayah operasi',
    type: 'video',
    src: Hero2,
    active: true,
  },
  {
    id: 3,
    title: 'Energi Bersih untuk Masa Depan',
    description: 'Investasi dalam teknologi ramah lingkungan dan energi terbarukan',
    type: 'image',
    src: Hero3,
    active: true,
  },
];

// Simulate API delay for realism
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 300));

/**
 * Hero Section Service (Frontend-Only)
 * Returns dummy hero sections
 */
const heroService = {
  /**
   * Get all active hero sections
   * @returns {Promise<Array>} Array of active hero sections
   */
  async getHeroSections() {
    await simulateDelay();
    
    try {
      // Return active hero sections
      const activeHeros = dummyHeroSections.filter(h => h.active);
      console.log('✅ Hero sections loaded:', activeHeros.length);
      return activeHeros;
    } catch (error) {
      console.error('❌ Error in heroService.getHeroSections:', error);
      // Return fallback
      return dummyHeroSections;
    }
  },
};

export default heroService;
