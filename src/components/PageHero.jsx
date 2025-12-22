import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import defaultBg from '../assets/hero-bg.png';

const PageHero = ({
  title,
  description,
  backgroundImage = defaultBg,
  breadcrumbs = [],
  heightClass = 'h-[60vh]',
}) => {
  return (
    <section className={`relative ${heightClass} overflow-hidden`} id="hero-section">
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/70 to-secondary-900/50" />
      </div>

      <div className="relative section-container h-full flex items-center">
        <div className="max-w-3xl text-white">
          {breadcrumbs.length > 0 && (
            <div className="flex items-center gap-2 mb-4 text-body-sm">
              {breadcrumbs.map((item, idx) => {
                const isLast = idx === breadcrumbs.length - 1;
                const content = item.to ? (
                  <Link
                    to={item.to}
                    className="text-white/70 hover:text-white flex items-center gap-1 transition-colors duration-200"
                  >
                    {item.icon === 'home' && <FaHome className="w-4 h-4" />}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <span className="font-semibold text-white">{item.label}</span>
                );

                return (
                  <React.Fragment key={`${item.label}-${idx}`}>
                    {content}
                    {!isLast && <span className="text-white/50">/</span>}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <h1 className="text-display-lg lg:text-display-xl font-heading font-bold mb-6 text-white leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-body-lg text-white/90 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHero;
