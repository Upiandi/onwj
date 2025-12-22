import React from 'react';
import Hero from './mhero';
import Komisaris from './mkomisaris';
import Direksi from './mdireksi';
import Struktur from './mstruktur';

const Manajemen = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Komisaris />
      <Direksi />
      <Struktur />
    </div>
  );
};

export default Manajemen;