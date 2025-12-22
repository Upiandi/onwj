import React from 'react';
import PageHero from '../../components/PageHero';
import platformImage from '../../assets/hero-bg.png';

const WHero = () => (
  <PageHero
    title="Wilayah Kerja"
    description="Menjelajahi area operasi PT Migas Hulu Jabar ONWJ di lepas pantai utara Jawa Barat"
    backgroundImage={platformImage}
    heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
    breadcrumbs={[
      { label: 'Beranda', to: '/' },
      { label: 'Wilayah Kerja' },
    ]}
  />
);

export default WHero;