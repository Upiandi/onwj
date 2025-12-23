import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSpinner } from 'react-icons/fa';
import PageHero from '../components/PageHero';
import bannerImage from '../assets/hero-bg.png';
import { dummyBeritaList, dummyBeritaCategories } from '../utils/dummyData';

const BeritaHero = () => (
    <PageHero
        title="Berita TJSL"
        description="Ikuti perkembangan terbaru mengenai program Tanggung Jawab Sosial dan Lingkungan kami."
        backgroundImage={bannerImage}
        heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
        breadcrumbs={[
            { label: 'Beranda', to: '/', icon: 'home' },
            { label: 'Berita TJSL' },
        ]}
    />
);

const BeritaFilter = ({ categories, selected, onSelect, onSearch, searchTerm }) => (
    <div className="section-container py-grid-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => onSelect(cat)}
                        className={`px-4 py-2 rounded-full font-medium transition-colors ${
                            selected === cat 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="relative w-full md:w-72">
                <input
                    type="text"
                    placeholder="Cari berita..."
                    value={searchTerm}
                    onChange={onSearch}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>
    </div>
);

const ArticleCard = ({ article }) => (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
        <div className="h-48 overflow-hidden bg-gray-200">
            <Link to={`/artikel/${article.slug}`}>
                <img 
                    src={article.full_image_url} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                    }}
                />
            </Link>
        </div>
        <div className="p-6 flex flex-col flex-grow">
            <p className="text-sm mb-2">
                <span className="font-semibold text-blue-600">{article.category}</span>
                <time dateTime={article.date} className="text-gray-400 ml-3">
                    {article.formatted_date}
                </time>
            </p>
            <h2 className="text-xl font-bold text-gray-800 mb-2 leading-tight flex-grow">
                <Link to={`/artikel/${article.slug}`} className="hover:text-blue-600 transition-colors">
                    {article.title}
                </Link>
            </h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                {article.short_description}
            </p>
            <Link 
                to={`/artikel/${article.slug}`} 
                className="font-semibold text-blue-600 flex items-center group self-start mt-auto" 
                aria-label={`Read more about ${article.title}`}
            >
                Read More <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
            </Link>
        </div>
    </div>
);

const ArticleGrid = ({ articles, loading }) => {
    if (loading) {
        return (
            <div className="section-container pb-grid-20">
                <div className="flex items-center justify-center py-20">
                    <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="section-container pb-grid-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
            {articles.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">Tidak ada berita yang ditemukan. </p>
                </div>
            )}
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }
    
    return (
        <nav className="flex justify-center items-center gap-grid-2 pb-grid-20" aria-label="Pagination">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ‹
            </button>
            
            {startPage > 1 && (
                <>
                    <button
                        onClick={() => onPageChange(1)}
                        className="w-10 h-10 rounded-md font-bold transition-colors hover:bg-gray-100 text-gray-700"
                    >
                        1
                    </button>
                    {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-md font-bold transition-colors ${
                        page === currentPage 
                            ? 'bg-blue-600 text-white' 
                            : 'hover:bg-gray-100 text-gray-700'
                    }`}
                >
                    {page}
                </button>
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className="w-10 h-10 rounded-md font-bold transition-colors hover:bg-gray-100 text-gray-700"
                    >
                        {totalPages}
                    </button>
                </>
            )}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                ›
            </button>
        </nav>
    );
};

const BeritaTJSLPage = () => {
    const [loading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [categories] = useState(dummyBeritaCategories);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 9;

    // Filter and search logic
    const filteredArticles = dummyBeritaList.filter(article => {
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        const matchesSearch = searchTerm.trim() === '' || 
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.short_description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const articles = filteredArticles.slice(startIndex, startIndex + itemsPerPage);

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <BeritaHero />
            <BeritaFilter 
                categories={categories}
                selected={selectedCategory}
                onSelect={handleSelectCategory}
                searchTerm={searchTerm}
                onSearch={handleSearch}
            />
            <ArticleGrid articles={articles} loading={loading} />
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default BeritaTJSLPage;