import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logoHero from '../../assets/logo.webp';
import logoDefault from '../../assets/LOGO-HD.webp';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isInHero, setIsInHero] = useState(true);
  const location = useLocation();

  const getLogoUrl = () => {
    // Di hero section gunakan logo.webp
    if (isInHero && !isScrolled) {
      return logoHero;
    }
    // Di non-hero gunakan LOGO-HD.webp
    return logoDefault;
  };

  const logoUrl = getLogoUrl();

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    const heroSection = document.getElementById('hero-section');
    const heroHeight = heroSection ? heroSection.offsetHeight : 600;
    
    setIsScrolled(currentScrollPos > 20);
    setIsInHero(currentScrollPos < heroHeight - 100);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const closeMobileMenu = () => {
    setIsOpen(false);
    setActiveDropdown(null);
  };

  const isActivePath = (path) => location.pathname === path;

  const menuData = {
    tentang: {
      label: 'Tentang Kami',
      items: [
        { label: 'Profil Perusahaan', path: '/tentang', desc: 'Visi, misi, dan sejarah perusahaan' },
        { label: 'Manajemen', path: '/manajemen', desc: 'Struktur dewan direksi dan komisaris' },
        { label: 'Tata Kelola', path: '/kelola', desc: 'Prinsip GCG dan tata kelola perusahaan' }
      ]
    },
    bisnis: {
      label: 'Bisnis & Operasional',
      items: [
        { label: 'Bisnis Kami', path: '/bisnis', desc: 'Model bisnis dan alur operasional' },
        { label: 'Wilayah Kerja', path: '/wilayah-kerja', desc: 'Peta dan informasi wilayah operasi' }
      ]
    },
    program: {
      label: 'Program TJSL',
      items: [
        { label: 'Program TJSL', path: '/tjsl', desc: 'Tanggung Jawab Sosial & Lingkungan' },
        { label: 'Berita TJSL', path: '/berita-tjsl', desc: 'Update kegiatan program sosial' },
        { label: 'UMKM Binaan', path: '/umkm-binaan', desc: 'Program pemberdayaan UMKM' },
      ]
    },
    media: {
      label: 'Media & Informasi',
      items: [
        { label: 'Media & Berita', path: '/media-informasi', desc: 'Artikel dan konten media terbaru' },
        { label: 'Penghargaan', path: '/penghargaan', desc: 'Prestasi dan penghargaan perusahaan' },
        { label: 'Laporan Tahunan', path: '/laporan-tahunan', desc: 'Laporan keuangan dan kinerja' }
      ]
    }
  };

  const getHeaderStyle = () => {
    if (isInHero && !isScrolled) return 'bg-transparent border-transparent';
    return 'bg-white border-b border-secondary-200';
  };

  const getTextColor = () =>
    isInHero && !isScrolled ? 'text-white' : 'text-secondary-900';

  const getHoverColor = () =>
    isInHero && !isScrolled ? 'hover:text-white/80' : 'hover:text-primary-600';

  const getActiveColor = () =>
    isInHero && !isScrolled ? 'text-white' : 'text-primary-600';

  const NavLink = ({ to, children, onClick }) => {
    const isActive = isActivePath(to);
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`
          relative font-heading font-medium text-body-md transition-all duration-300 ease-out
          ${isActive ? getActiveColor() : `${getTextColor()} ${getHoverColor()}`}
          after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px]
          after:bg-current after:transition-all after:duration-300
          ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
        `}
      >
        {children}
      </Link>
    );
  };

  const DropdownButton = ({ menuKey }) => {
    const menu = menuData[menuKey];
    const isActive = menu?.items.some(item => isActivePath(item.path));

    return (
      <div
        className="relative group"
        onMouseEnter={() => setActiveDropdown(menuKey)}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <button
          className={`
            relative flex items-center gap-1 font-heading font-medium text-body-md
            transition-all duration-300
            ${isActive ? getActiveColor() : `${getTextColor()} ${getHoverColor()}`}
            after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px]
            after:bg-current after:transition-all
            ${isActive ? 'after:w-full' : 'after:w-0 group-hover:after:w-full'}
          `}
        >
          {menu.label}
          <svg
            className={`w-3.5 h-3.5 transition-all ${activeDropdown === menuKey ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`
            absolute top-full left-0 pt-6 min-w-[240px] z-50
            transition-all duration-300
            ${activeDropdown === menuKey 
              ? 'opacity-100 visible translate-y-0' 
              : 'opacity-0 invisible -translate-y-2'}
          `}
        >
          <div
            className="bg-white rounded border border-secondary-200 shadow-lg overflow-hidden"
            style={{ animation: activeDropdown === menuKey ? 'fadeInScale 0.3s ease-out forwards' : 'none' }}
          >
            <div className="py-2">
              {menu.items.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setActiveDropdown(null)}
                  className={`
                    block px-4 py-2.5 transition-all
                    ${isActivePath(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-700 hover:text-primary-600 hover:bg-secondary-50 hover:translate-x-1'}
                  `}
                  style={{ transitionDelay: `${index * 30}ms` }}
                >
                  <div className="font-heading font-semibold text-sm mb-0.5">{item.label}</div>
                  <div className="text-xs text-secondary-500">{item.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${getHeaderStyle()}`}
      >
        <div className="section-container">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block transition-all hover:scale-105"
              >
                <img
                  className="h-11 w-auto"
                  src={logoUrl}
                  alt="PT Migas Hulu Jabar ONWJ"
                />
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              <NavLink to="/">Beranda</NavLink>
              <DropdownButton menuKey="tentang" />
              <DropdownButton menuKey="bisnis" />
              <DropdownButton menuKey="program" />
              <DropdownButton menuKey="media" />
              <NavLink to="/kontak">Kontak</NavLink>
            </nav>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                lg:hidden flex items-center justify-center w-10 h-10 rounded
                ${isInHero && !isScrolled ? 'text-white hover:bg-white/10' : 'text-secondary-700 hover:bg-secondary-100'}
              `}
            >
              <div className="w-6 h-5 relative flex flex-col justify-center">
                <span className={`w-6 h-0.5 bg-current rounded-full absolute transition-all ${isOpen ? 'rotate-45' : '-translate-y-2'}`} />
                <span className={`w-6 h-0.5 bg-current rounded-full transition-all ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
                <span className={`w-6 h-0.5 bg-current rounded-full absolute transition-all ${isOpen ? '-rotate-45' : 'translate-y-2'}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className={`
          fixed inset-0 bg-secondary-900/50 backdrop-blur-sm z-40 lg:hidden
          transition-all ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={closeMobileMenu}
      />

      {/* Mobile Menu */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-40 lg:hidden
          overflow-y-auto shadow-2xl transition-all
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="pt-24 pb-8 px-6">
          <nav className="space-y-1">

            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`
                block px-4 py-3 rounded font-heading
                ${isActivePath('/') ? 'text-primary-600 bg-primary-50' : 'text-secondary-700 hover:bg-secondary-50'}
              `}
            >
              Beranda
            </Link>

            {Object.entries(menuData).map(([key, menu]) => (
              <div key={key} className="py-1">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded text-secondary-700 hover:bg-secondary-50"
                >
                  {menu.label}
                  <svg
                    className={`w-4 h-4 transition-all ${activeDropdown === key ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`
                    overflow-hidden transition-all
                    ${activeDropdown === key ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
                  `}
                >
                  <div className="mt-1 ml-4 pl-4 border-l border-secondary-200 space-y-1">
                    {menu.items.map((item, idx) => (
                      <Link
                        key={idx}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className={`
                          block px-3 py-2 rounded text-sm
                          ${isActivePath(item.path)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-secondary-600 hover:bg-secondary-50'}
                        `}
                        style={{ transitionDelay: activeDropdown === key ? `${idx * 40}ms` : '0ms' }}
                      >
                        <div className="font-medium mb-0.5">{item.label}</div>
                        <div className="text-xs text-secondary-500">{item.desc}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <Link
              to="/kontak"
              onClick={closeMobileMenu}
              className={`
                block px-4 py-3 rounded font-heading
                ${isActivePath('/kontak') ? 'text-primary-600 bg-primary-50' : 'text-secondary-700 hover:bg-secondary-50'}
              `}
            >
              Kontak
            </Link>

          </nav>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </>
  );
};

export default Header;
