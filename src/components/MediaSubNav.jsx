import React from 'react';
import { NavLink } from 'react-router-dom';

const MediaSubNav = () => {
  const activeStyle = "font-heading font-semibold text-primary-600 border-b-2 border-primary-600 py-4 px-0 transition-colors duration-200";
  const inactiveStyle = "font-heading font-medium text-secondary-600 hover:text-primary-600 border-b-2 border-transparent py-4 px-0 transition-colors duration-200";

  return (
    <div className="bg-white border-b border-secondary-100">
      <nav className="section-container flex gap-8">
        <NavLink 
          to="/media-informasi" 
          className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
        >
          Media & Berita
        </NavLink>
        <NavLink 
          to="/penghargaan" 
          className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
        >
          Penghargaan
        </NavLink>
        <NavLink 
          to="/laporan-tahunan" 
          className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
        >
          Laporan Tahunan
        </NavLink>
      </nav>
    </div>
  );
};

export default MediaSubNav;
