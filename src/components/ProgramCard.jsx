// src/components/ProgramCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ProgramCard = ({ program }) => {
  // Gunakan slug jika ada, jika tidak pakai '#'
  const linkTo = program.slug ? `/artikel/${program.slug}` : '#';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <Link to={linkTo} className="block overflow-hidden h-56">
        <img
          src={program.image}
          alt={program.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </Link>
      <div className="p-6 relative flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 text-gray-800 leading-snug flex-grow"> {/* Hapus fixed height */}
          <Link to={linkTo} className="hover:text-blue-600 transition-colors">
            {program.title}
          </Link>
        </h3>
        <p className="text-gray-500 text-xs mt-1 mb-4"> {/* Tambah margin bottom */}
          {program.date}
        </p>
        <Link
          to={linkTo}
          className="absolute bottom-4 right-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-2xl"
          aria-label={`Read more about ${program.title}`}
        >
          →
        </Link>
      </div>
    </div>
  );
};

export default ProgramCard;