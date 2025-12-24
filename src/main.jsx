import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, ScrollRestoration } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';

// ==== KEEP EAGER (Critical for first paint) ====
import Layout from './Layout';
import Header from './pages/landingpage/header';

// ==== Loading Component ====
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// ==== LAZY LOAD PUBLIC PAGES ====
const HomePage = lazy(() => import('./pages/HomePage'));
const TJSLPage = lazy(() => import('./pages/TJSLPage'));
const BeritaTJSLPage = lazy(() => import('./pages/BeritaTJSLPage'));
const ArtikelPage = lazy(() => import('./pages/ArtikelPage'));
const AllProgramsPage = lazy(() => import('./pages/AllProgramsPage'));
const Tentang = lazy(() => import('./pages/company/tentang'));
const TataKelola = lazy(() => import('./pages/kelola/tatakelola'));
const MediaInformasiPage = lazy(() => import('./pages/media/MediaInformasiPage'));
const PenghargaanPage = lazy(() => import('./pages/media/PenghargaanPage'));
const LaporanTahunanPage = lazy(() => import('./pages/media/LaporanTahunanPage'));
const Mainbisnis = lazy(() => import('./pages/bisnis/mainbisnis'));
const Mmanajemen = lazy(() => import('./pages/manajemen/mmanajemen'));
const UmkmPage = lazy(() => import('./pages/UmkmPage'));
const KontakPage = lazy(() => import('./pages/KontakPage'));
const Profile = lazy(() => import('./pages/landingpage/profile'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));

// ==== LAZY LOAD WILAYAH KERJA ====
const Mainwk = lazy(() => import('./pages/wk/mainwk'));

// ==== LAZY LOAD ADMIN PAGES ====
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const DashboardPage = lazy(() => import('./pages/admin/DashboardPage'));

// Divisi TJSL
const ManageBerita = lazy(() => import('./pages/admin/ManageBerita'));
const ManageProgram = lazy(() => import('./pages/admin/ManageProgram'));
const ManageUmkm = lazy(() => import('./pages/admin/ManageUmkm'));
const ManageTestimonial = lazy(() => import('./pages/admin/ManageTestimonial'));
const ManageAngkaStatistikTJSL = lazy(() => import('./pages/admin/ManageAngkaStatistikTJSL'));
const UnifiedImportExport = lazy(() => import('./pages/admin/UnifiedImportExport'));
const ManageGallery = lazy(() => import('./pages/admin/Gallery/ManageGallery'));

// Sekretaris Perusahaan
const ManagePenghargaan = lazy(() => import('./pages/admin/ManagePenghargaan'));
const ManageLaporan = lazy(() => import('./pages/admin/ManageLaporan'));
const ManageStatistikLanding = lazy(() => import('./pages/admin/ManageStatistikLanding'));
const ManageManagement = lazy(() => import('./pages/admin/ManageManagement'));

// Keuangan
const ManageKeuangan = lazy(() => import('./pages/admin/ManageKeuangan'));

// Wilayah Kerja
const ManageWkTekkom = lazy(() => import('./pages/admin/ManageWkTekkom'));
const ManageWkTjsl = lazy(() => import('./pages/admin/ManageWkTjsl'));

// Tekkom
const ManageHargaTekkom = lazy(() => import('./pages/admin/ManageMinyak'));
const ManageProduksiTekkom = lazy(() => import('./pages/admin/ManageProduksi'));

// Contacts
const ManageContacts = lazy(() => import('./pages/admin/ManageContacts'));

// Settings
const ManageSettings = lazy(() => import('./pages/admin/ManageSettings'));

// ==== ROUTER ====
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Header />
        <ScrollRestoration />
        <Suspense fallback={<LoadingFallback />}>
          <Layout />
        </Suspense>
      </>
    ),
    children: [
      { index: true, element: <Suspense fallback={<LoadingFallback />}><HomePage /></Suspense> },
      { path: 'tjsl', element: <Suspense fallback={<LoadingFallback />}><TJSLPage /></Suspense> },
      { path: 'berita-tjsl', element: <Suspense fallback={<LoadingFallback />}><BeritaTJSLPage /></Suspense> },
      { path: 'artikel/:slug', element: <Suspense fallback={<LoadingFallback />}><ArtikelPage /></Suspense> },
      { path: 'program-berkelanjutan', element: <Suspense fallback={<LoadingFallback />}><AllProgramsPage /></Suspense> },
      { path: 'gallery', element: <Suspense fallback={<LoadingFallback />}><GalleryPage /></Suspense> },
      { path: 'tentang', element: <Suspense fallback={<LoadingFallback />}><Tentang /></Suspense> },
      { path: 'kelola', element: <Suspense fallback={<LoadingFallback />}><TataKelola /></Suspense> },
      { path: 'media-informasi', element: <Suspense fallback={<LoadingFallback />}><MediaInformasiPage /></Suspense> },
      { path: 'penghargaan', element: <Suspense fallback={<LoadingFallback />}><PenghargaanPage /></Suspense> },
      { path: 'laporan-tahunan', element: <Suspense fallback={<LoadingFallback />}><LaporanTahunanPage /></Suspense> },
      { path: 'bisnis', element: <Suspense fallback={<LoadingFallback />}><Mainbisnis /></Suspense> },
      { path: 'manajemen', element: <Suspense fallback={<LoadingFallback />}><Mmanajemen /></Suspense> },
      { path: 'umkm-binaan', element: <Suspense fallback={<LoadingFallback />}><UmkmPage /></Suspense> },
      { path: 'kontak', element: <Suspense fallback={<LoadingFallback />}><KontakPage /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<LoadingFallback />}><Profile /></Suspense> },
    ],
  },

  {
    path: '/wilayah-kerja/*',
    element: (
      <>
        <Header />
        <ScrollRestoration />
        <Suspense fallback={<LoadingFallback />}>
          <Mainwk />
        </Suspense>
      </>
    ),
  },

  // ==== ADMIN ROUTES (TANPA LOGIN/PROTECTION) ====
  {
    path: '/tukang-minyak-dan-gas',
    element: (
        <Suspense fallback={<LoadingFallback />}>
          <AdminLayout />
        </Suspense>
    ),
    children: [
      { path: 'dashboard', element: <Suspense fallback={<LoadingFallback />}><DashboardPage /></Suspense> },

      // TJSL
      { path: 'manage-berita', element: <Suspense fallback={<LoadingFallback />}><ManageBerita /></Suspense> },
      { path: 'manage-program', element: <Suspense fallback={<LoadingFallback />}><ManageProgram /></Suspense> },
      { path: 'manage-umkm', element: <Suspense fallback={<LoadingFallback />}><ManageUmkm /></Suspense> },
      { path: 'manage-testimonial', element: <Suspense fallback={<LoadingFallback />}><ManageTestimonial /></Suspense> },
      { path: 'manage-angka-statistik-tjsl', element: <Suspense fallback={<LoadingFallback />}><ManageAngkaStatistikTJSL /></Suspense> },
      { path: 'unified-import-export', element: <Suspense fallback={<LoadingFallback />}><UnifiedImportExport /></Suspense> },
      { path: 'manage-gallery', element: <Suspense fallback={<LoadingFallback />}><ManageGallery /></Suspense> },

      // Sekper
      { path: 'manage-penghargaan', element: <Suspense fallback={<LoadingFallback />}><ManagePenghargaan /></Suspense> },
      { path: 'manage-laporan', element: <Suspense fallback={<LoadingFallback />}><ManageLaporan /></Suspense> },
      { path: 'manage-statistik-landing', element: <Suspense fallback={<LoadingFallback />}><ManageStatistikLanding /></Suspense> },
      { path: 'manage-manajemen', element: <Suspense fallback={<LoadingFallback />}><ManageManagement /></Suspense> },

      // Keuangan
      { path: 'manage-keuangan', element: <Suspense fallback={<LoadingFallback />}><ManageKeuangan /></Suspense> },

      // Wilayah Kerja
      { path: 'manage-wk-tekkom', element: <Suspense fallback={<LoadingFallback />}><ManageWkTekkom /></Suspense> },
      { path: 'manage-wk-tjsl', element: <Suspense fallback={<LoadingFallback />}><ManageWkTjsl /></Suspense> },

      // Tekkom
      { path: 'manage-harga-tekkom', element: <Suspense fallback={<LoadingFallback />}><ManageHargaTekkom /></Suspense> },
      { path: 'manage-produksi-tekkom', element: <Suspense fallback={<LoadingFallback />}><ManageProduksiTekkom /></Suspense> },

      // Contacts
      { path: 'manage-contacts', element: <Suspense fallback={<LoadingFallback />}><ManageContacts /></Suspense> },

      // Settings
      { path: 'manage-settings', element: <Suspense fallback={<LoadingFallback />}><ManageSettings /></Suspense> },
    ],
  },
]);

// ==== RENDER APP ====
createRoot(document.getElementById('root')).render(
  <StrictMode>
      {/* Di sini udah bersih.
         Gak ada AuthProvider.
         Gak ada SettingsProvider.
         Murni Router doang.
      */}
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