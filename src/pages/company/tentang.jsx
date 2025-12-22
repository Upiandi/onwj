import React from 'react';
import PHero from './phero';
import PProfile from './pprofile';
import PSejarah from './psejarah';
import PVisiMisi from './pvisimisi';

const Tentang = () => {
  return (
    <main className="min-h-screen bg-white" id="main-content">
      <PHero />
      <PProfile />
      <PSejarah />
      <PVisiMisi />
    </main>
  );
};

export default Tentang;