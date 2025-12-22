import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// ==== HALAMAN PUBLIK ====
import Layout from './Layout';
import Header from './pages/landingpage/header';
import HomePage from './pages/HomePage';
import TJSLPage from './pages/TJSLPage';
import BeritaTJSLPage from './pages/BeritaTJSLPage';
import ArtikelPage from './pages/ArtikelPage';
import AllProgramsPage from './pages/AllProgramsPage';
import Tentang from './pages/company/tentang';
import TataKelola from './pages/kelola/tatakelola';
import MediaInformasiPage from './pages/media/MediaInformasiPage';
import PenghargaanPage from './pages/media/PenghargaanPage';
import LaporanTahunanPage from './pages/media/LaporanTahunanPage';
import Mainbisnis from './pages/bisnis/mainbisnis';
import Mmanajemen from './pages/manajemen/mmanajemen';
import UmkmPage from './pages/UmkmPage';
import KontakPage from './pages/KontakPage';
import Profile from './pages/landingpage/profile';
import GalleryPage from './pages/GalleryPage';

// ==== WILAYAH KERJA ====
import Mainwk from './pages/wk/mainwk';


// ==== ROUTER ====
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <ScrollRestoration />
        <Layout />
      </>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tjsl', element: <TJSLPage /> },
      { path: 'berita-tjsl', element: <BeritaTJSLPage /> },
      { path: 'artikel/:slug', element: <ArtikelPage /> },
      { path: 'program-berkelanjutan', element: <AllProgramsPage /> },
      { path: 'gallery', element: <GalleryPage /> }, // ← BARU: Public Gallery Route
      { path: 'tentang', element: <Tentang /> },
      { path: 'kelola', element: <TataKelola /> },
      { path: 'media-informasi', element: <MediaInformasiPage /> },
      { path: 'penghargaan', element: <PenghargaanPage /> },
      { path: 'laporan-tahunan', element: <LaporanTahunanPage /> },
      { path: 'bisnis', element: <Mainbisnis /> },
      { path: 'manajemen', element: <Mmanajemen /> },
      { path: 'umkm-binaan', element: <UmkmPage /> },
      { path: 'kontak', element: <KontakPage /> },
      { path: 'profile', element: <Profile /> },
    ],
  },

  {
    path: '/wilayah-kerja/*',
    element: (
      <>
        <Header />
        <ScrollRestoration />
        <Mainwk />
      </>
    ),
  },

]);

// ==== RENDER APP ====
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
  </StrictMode>
);
