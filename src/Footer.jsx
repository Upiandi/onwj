import React from 'react';
import { Link } from 'react-router-dom';
import logoDefault from './assets/logo.webp';

// ============================================
// CONSTANTS
// ============================================
const FOOTER_LINKS = {
  company: [
    { to: '/', label: 'Beranda' },
    { to: '/tentang', label:  'Tentang Kami' },
    { to: '/bisnis', label: 'Bisnis Kami' },
    { to: '/kontak', label: 'Kontak' },
  ],
  business: [
    { to:  '/eksplorasi-produksi', label: 'Eksplorasi & Produksi' },
    { to: '/tjsl', label: 'Program TJSL' },
    { to: '/wilayah-kerja', label: 'Wilayah Kerja' },
    { to: '/umkm-binaan', label: 'UMKM Binaan' },
  ],
  resources: [
    { to: '/media-informasi', label: 'Media & Berita' },
    { to:  '/penghargaan', label: 'Penghargaan' },
    { to: '/laporan-tahunan', label: 'Laporan Tahunan' },
    { to: '/karir', label: 'Karir' },
  ],
};

// ============================================
// COMPONENTS
// ============================================
const FooterLink = ({ to, label }) => (
  <li>
    <Link 
      to={to} 
      className="text-body-sm text-secondary-400 hover:text-white transition-colors duration-300 block py-1"
    >
      {label}
    </Link>
  </li>
);

const SocialIcon = ({ href, label, icon }) => {
  if (! href) return null; // ✅ Don't render if no URL
  
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-10 h-10 bg-secondary-800 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 group"
    >
      <svg className="w-5 h-5 text-secondary-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
        <path d={icon} />
      </svg>
    </a>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Use local logo asset
  const logoUrl = logoDefault;

  // Dummy settings for frontend-only
  const settings = {
    company_name: 'PT Migas Hulu Jabar ONWJ',
    tagline: 'Energi untuk Masa Depan',
    address: 'Jl. Jakarta No. 40, Kebonwaru, Batununggal, Kota Bandung, Jawa Barat 40272',
    email: 'corsec@muj-onwj.com',
    phone: '(022) 1234 5678',
    social_facebook: 'https://facebook.com',
    social_instagram: 'https://instagram.com',
    social_twitter: 'https://twitter.com',
    social_linkedin: 'https://linkedin.com',
    social_youtube: 'https://youtube.com'
  };

  // ✅ Dynamic social media with icons (flat settings structure)
  const socialLinks = [
    { 
      href: settings.social_facebook, 
      label: 'Facebook',
      icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
    },
    { 
      href: settings.social_linkedin, 
      label: 'LinkedIn',
      icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
    },
    { 
      href: settings.social_instagram, 
      label: 'Instagram',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
    },
    { 
      href: settings.social_twitter, 
      label: 'Twitter',
      icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'
    },
    {
      href: settings.social_youtube,
      label: 'YouTube',
      icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
    }
  ];

  // ✅ Dynamic contact info (prioritize contact_ fields, fallback to company_ fields)
  const contact = {
    phone: { 
      label: settings.contact_phone || settings.company_phone || '(002) 20538178', 
      href: `tel:${(settings.contact_phone || settings.company_phone || '(002) 20538178').replace(/\s/g, '')}` 
    },
    email: { 
      label: settings.contact_email || settings.company_email || 'sekretariat@migashulujabaronwj.co.id', 
      href: `mailto:${settings.contact_email || settings.company_email || 'sekretariat@migashulujabaronwj.co.id'}` 
    },
    address: settings.company_address || 'Jl. Jakarta No. 40, Kebonwaru, Batununggal, Kota Bandung, Jawa Barat 40272',
  };

  return (
    <footer className="bg-secondary-900 text-secondary-300 relative overflow-hidden">
      {/* Background Pattern - Subtle */}
      <div className="absolute inset-0 opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="footer-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40V0h40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-grid)"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative section-container py-grid-12 sm:py-grid-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-grid-4 lg:gap-grid-6">
          
          {/* Company Info - Span 2 columns on large screens */}
          <div className="lg:col-span-2">
            {/* ✅ Dynamic Logo */}
            <Link to="/" className="inline-block mb-grid-5">
              <img 
                src={logoUrl} 
                alt={settings.company_name || 'PT Migas Hulu Jabar ONWJ'} 
                className="h-10 w-auto"
                loading="lazy"
              />
            </Link>
            
            {/* ✅ Dynamic Description */}
            <p className="text-body-md text-secondary-400 mb-grid-6 leading-relaxed max-w-sm">
              {settings.footer_about_text || 'Perusahaan energi terkemuka yang berkomitmen pada keberlanjutan dan inovasi untuk masa depan Indonesia.'}
            </p>

            {/* ✅ Dynamic Social Media */}
            <div>
              <p className="text-body-md font-heading font-semibold text-white mb-grid-4">
                Ikuti Kami
              </p>
              <div className="flex gap-grid-2">
                {socialLinks.map((social) => (
                  <SocialIcon key={social.label} {...social} />
                ))}
              </div>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-body-lg mb-grid-5">
              Perusahaan
            </h4>
            <ul className="space-y-grid-1">
              {FOOTER_LINKS.company.map((link) => (
                <FooterLink key={link.to} {...link} />
              ))}
            </ul>
          </div>

          {/* Business Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-body-lg mb-grid-5">
              Bisnis
            </h4>
            <ul className="space-y-grid-1">
              {FOOTER_LINKS.business.map((link) => (
                <FooterLink key={link.to} {...link} />
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-white font-heading font-bold text-body-lg mb-grid-5">
              Resources
            </h4>
            <ul className="space-y-grid-1">
              {FOOTER_LINKS.resources.map((link) => (
                <FooterLink key={link.to} {...link} />
              ))}
            </ul>
          </div>
        </div>

        {/* ✅ Dynamic Contact Section - Full Width Below */}
        <div className="mt-grid-12 pt-grid-10 border-t border-secondary-800">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-grid-4">
            
            {/* Phone */}
            <a 
              href={contact.phone.href}
              className="flex items-center gap-grid-3 text-secondary-300 hover:text-white transition-colors duration-300 group"
            >
              <div className="w-12 h-12 bg-secondary-800 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-6 h-6 text-primary-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-body-xs text-secondary-500 mb-0.5">Telepon</p>
                <p className="text-body-md font-semibold">{contact.phone. label}</p>
              </div>
            </a>

            {/* Email */}
            <a 
              href={contact. email.href}
              className="flex items-center gap-grid-3 text-secondary-300 hover:text-white transition-colors duration-300 group"
            >
              <div className="w-12 h-12 bg-secondary-800 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300 flex-shrink-0">
                <svg className="w-6 h-6 text-primary-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-body-xs text-secondary-500 mb-0.5">Email</p>
                <p className="text-body-md font-semibold">{contact.email.label}</p>
              </div>
            </a>

            {/* Address */}
            <div className="flex items-center gap-grid-3 text-secondary-300">
              <div className="w-12 h-12 bg-secondary-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-body-xs text-secondary-500 mb-0.5">Alamat</p>
                <p className="text-body-sm leading-relaxed">{contact.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Dynamic Bottom Bar */}
      <div className="relative border-t border-secondary-800">
        <div className="section-container py-grid-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-grid-4">
            
            <p className="text-body-xs text-secondary-500 text-center sm:text-left">
              {settings.footer_copyright || `© ${currentYear} PT Migas Hulu Jabar ONWJ. All rights reserved.`}
            </p>
            
            <div className="flex items-center gap-grid-5 text-body-xs text-secondary-500">
              {['Privacy', 'Terms', 'Sitemap']. map((item, index) => (
                <React.Fragment key={item}>
                  {index > 0 && <span className="text-secondary-700">•</span>}
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="hover:text-white transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;