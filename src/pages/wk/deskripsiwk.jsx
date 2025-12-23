const DeskripsiWK = () => {
  const workAreas = [
    {
      title: 'Wilayah Operasi ONWJ',
      description: 'MUJ ONWJ mengelola 10 persen Participating Interest di Blok ONWJ, yaitu wilayah laut seluas 8.300 km² yang membentang dari Kepulauan Seribu hingga utara Cirebon. Operasi mencakup lebih dari 220 platform lepas pantai, jaringan pipa bawah laut sepanjang 2.100 km, serta berbagai fasilitas pengolahan migas yang berperan dalam pemenuhan energi nasional.',
    }
  ];

  return (
    <section className="py-grid-12 bg-white">
      <div className="section-container">
        {/* Text Content */}
        <div className="space-y-6">
          {workAreas.map((area, index) => (
            <div key={index}>
              <h3 className="text-2xl lg:text-3xl font-heading font-bold text-secondary-900 mb-4 leading-tight">
                {area.title}
              </h3>
              <p className="text-sm text-secondary-600 mb-5 leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeskripsiWK;