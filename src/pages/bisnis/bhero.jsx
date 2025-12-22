import React from 'react';
import PageHero from '../../components/PageHero';
import platformImage from '../../assets/contoh1.png';

const BHero = () => (
  <PageHero
    title="Bisnis Kami"
    description="Mengelola dan mengoptimalkan aset energi melalui kolaborasi strategis untuk pembangunan berkelanjutan"
    backgroundImage={platformImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'Bisnis Kami' },
    ]}
  />
);

export default BHero;