import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';

const Layout = () => {
  const location = useLocation();
  console.log('📍 Layout render, path:', location.pathname);
  const isAdminRoute = location.pathname.startsWith('/tukang-minyak-dan-gas');

  return (
    <div className={`
      relative w-screen min-h-screen overflow-x-hidden
      ${! isAdminRoute ?  'font-body' : ''}
    `}>
      <main>
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;