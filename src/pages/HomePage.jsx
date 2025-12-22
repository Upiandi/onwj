import React from 'react';
import Hero from './landingpage/hero';
import Profile from './landingpage/profile';
import Bisnis from './landingpage/Bisnis';
import Berita from './landingpage/berita';
import Penghargaan from './landingpage/penghargaan/penghargaan';

const HomePage = () => {
  return (
    <>
      <Hero />
      <div className="relative bg-white">
        <Profile />
        <Bisnis />
        <Penghargaan />
        <Berita />
      </div>
    </>
  );
};

export default HomePage;