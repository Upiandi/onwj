import React from 'react';
import PageHero from '../../components/PageHero';
import platformImage from '../../assets/contoh1.png';

const Hero = () => (
  <PageHero
    title="Manajemen Perusahaan"
    description="Kepemimpinan profesional yang membawa perusahaan menuju masa depan energi berkelanjutan"
    backgroundImage={platformImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'Manajemen' },
    ]}
  />
);

export default Hero;