import React from 'react';
import BHero from './bhero';
import Bbisnis from './bbisnis';

const Mainbisnis = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-secondary-50/30 to-white overflow-hidden">
      <BHero />
      <Bbisnis />
    </main>
  );
};

export default Mainbisnis;