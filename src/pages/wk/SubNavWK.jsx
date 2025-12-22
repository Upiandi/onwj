import { NavLink } from 'react-router-dom';

const SubNavWK = () => {
  const activeStyle = "font-heading font-semibold text-primary-600 border-b-2 border-primary-600 py-4 transition-colors duration-200";
  const inactiveStyle = "font-heading font-medium text-secondary-600 hover:text-primary-600 border-b-2 border-transparent py-4 transition-colors duration-200";

  return (
    <div className="sticky top-0 z-40 bg-white/98 backdrop-blur-md shadow-sm border-b border-secondary-200">
      <nav className="section-container flex space-x-8">
        <NavLink 
          to="/wilayah-kerja" 
          end
          className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
        >
          Wilayah Kerja
        </NavLink>
        <NavLink 
          to="/wilayah-kerja/harga-minyak" 
          className={({ isActive }) => isActive ? activeStyle : inactiveStyle}
        >
          Harga Minyak
        </NavLink>
      </nav>
    </div>
  );
};

export default SubNavWK;