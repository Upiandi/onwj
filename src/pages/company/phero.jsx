import React from 'react';
import PageHero from '../../components/PageHero';
import platformImage from '../../assets/contoh1.png';

const PHero = () => (
  <PageHero
    title="Tentang Kami"
    description="Mengenal lebih jauh profil, sejarah, dan komitmen PT Migas Hulu Jabar ONWJ"
    backgroundImage={platformImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'Tentang Kami' },
    ]}
  />
);

export default PHero;