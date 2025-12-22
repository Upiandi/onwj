import React, { useState, useEffect } from 'react';
import managementService from '../../services/managementService';

const Struktur = () => {
  const [orgStructure, setOrgStructure] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrgStructure();
  }, []);

  const fetchOrgStructure = async () => {
    try {
      setLoading(true);
      const response = await managementService.getByType('organizational_structure');
      if (response.success) {
        setOrgStructure(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching organizational structure:', error);
      setOrgStructure([]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="py-12 bg-white">
      <div className="section-container">
        
        {/* Compact Section Header */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-heading font-bold text-secondary-900 mb-2">
            Struktur Organisasi
          </h2>
          <div className="w-12 h-0.5 bg-primary-600 mx-auto"></div>
        </div>
        
          {/* Org Chart Image */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : orgStructure.length > 0 && orgStructure[0].image_url ? (
              <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
                <img
                  src={orgStructure[0].image_url}
                  alt="Struktur Organisasi"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center border border-gray-200">
                <p className="text-gray-500 text-lg">Belum ada struktur organisasi</p>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  export default Struktur;