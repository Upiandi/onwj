// ✅ DUMMY DATA - Frontend Only
const simulateDelay = () => new Promise(r => setTimeout(r, 300));

export const contactService = {
  /**
   * Submit contact form (Frontend dummy handler)
   * @param {Object} data - { name, email, phone, subject, message }
   * Returns simulated success response
   */
  submit: async (data) => {
    await simulateDelay();
    
    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      const errors = {};
      if (!data.name) errors.name = ['Nama harus diisi'];
      if (!data.email) errors.email = ['Email harus diisi'];
      if (!data.message) errors.message = ['Pesan harus diisi'];
      
      throw {
        response: {
          data: {
            success: false,
            message: 'Validasi gagal',
            errors
          }
        }
      };
    }
    
    // Simulate form submission success
    return {
      data: {
        success: true,
        message: 'Pesan Anda telah kami terima. Terima kasih telah menghubungi kami!',
        data: {
          id: Math.random().toString(36).substr(2, 9),
          ...data,
          submitted_at: new Date().toISOString()
        }
      }
    };
  }
};

export default contactService;