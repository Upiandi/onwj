import React, { useState } from 'react';
import { Link, Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import logo from '../../assets/LOGO-HD.webp';
import { 
    FaTachometerAlt, FaSignOutAlt, FaChevronDown, 
    FaUsers, FaHardHat, FaWallet, FaBuilding, FaFileExcel
} from 'react-icons/fa';

// Sidebar Link
const SidebarLink = ({ to, icon, label, badge }) => {
    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    return (
        <NavLink to={to} className={navLinkClasses} end>
            <div className="flex items-center gap-3 flex-1">
                {icon}
                <span>{label}</span>
            </div>
            {badge && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {badge}
                </span>
            )}
        </NavLink>
    );
};

// Sidebar Dropdown
// Sidebar Dropdown
const SidebarDropdown = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                // PERUBAHAN DISINI:
                // 1. Hapus 'justify-between'
                // 2. Tambah 'gap-2' (atau gap-3 sesuai selera)
                className="flex items-center gap-2 px-4 py-3 w-full rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
                <span className="font-medium">{title}</span>
                <FaChevronDown
                    className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all ${
                    isOpen ? 'max-h-[500px] mt-2' : 'max-h-0'
                }`}
            >
                <div className="pl-8 space-y-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

const AdminLayout = () => {
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();
    const { showSuccess, showError } = useToast();

    const handleLogout = async () => {
        if (window.confirm('Apakah Anda yakin ingin logout?')) {
            try {
                await logout();
                showSuccess('Logout berhasil!');
                navigate('/tukang-minyak-dan-gas/login');
            } catch (error) {
                showError('Gagal logout');
            }
        }
    };

    const subLinkClasses = ({ isActive }) =>
        `block px-4 py-2 rounded-lg text-sm transition-colors ${
            isActive
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* SIDEBAR */}
            <aside className="w-74 bg-white shadow-lg flex flex-col border-r border-gray-200">

                {/* Logo */}
                <div className="p-6 border-b border-gray-200">
                    <Link to="/tukang-minyak-dan-gas" className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="h-10 w-10" />
                        <div>
                            <h2 className="font-bold text-gray-900">Admin Panel</h2>
                            <p className="text-xs text-gray-500">Migas Hulu Jabar ONWJ</p>
                        </div>
                    </Link>
                </div>

                {/* User Info */}
                {user && (
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* NAVIGATION */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto overflow-x-hidden">

                    <SidebarLink 
                        to="/tukang-minyak-dan-gas/dashboard"
                        icon={<FaTachometerAlt />}
                        label="Dashboard"
                    />

                    {/* Divisi TJSL */}
                    <SidebarDropdown title="Divisi TJSL">
                        <NavLink to="/tukang-minyak-dan-gas/manage-berita" className={subLinkClasses}>
                            Kelola Berita
                        </NavLink>

                        <NavLink to="/tukang-minyak-dan-gas/manage-umkm" className={subLinkClasses}>
                            Kelola UMKM Binaan
                        </NavLink>

                        <NavLink to="/tukang-minyak-dan-gas/manage-testimonial" className={subLinkClasses}>
                            Kelola Testimonial
                        </NavLink>

                        <NavLink to="/tukang-minyak-dan-gas/manage-angka-statistik-tjsl" className={subLinkClasses}>
                            Kelola Statistik TJSL
                        </NavLink>

                        <NavLink to="/tukang-minyak-dan-gas/manage-wk-tjsl" className={subLinkClasses}>
                            Kelola WK TJSL
                        </NavLink>

                        <NavLink
                            to="/tukang-minyak-dan-gas/unified-import-export"
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                                    isActive
                                        ? 'bg-green-100 text-green-700 font-semibold'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`
                            }
                        >
                            <FaFileExcel className="text-green-600" />
                            <span>Import/Export Unified</span>
                        </NavLink>
                    </SidebarDropdown>

                    {/* Divisi Tekkom */}
                    <SidebarDropdown title="Divisi Tekkom & K3LL">
                        <NavLink to="/tukang-minyak-dan-gas/manage-wk-tekkom" className={subLinkClasses}>
                            Kelola WK TEKKOM
                        </NavLink>
                        <NavLink to="/tukang-minyak-dan-gas/manage-harga-tekkom" className={subLinkClasses}>
                            Kelola Harga
                        </NavLink>
                        <NavLink to="/tukang-minyak-dan-gas/manage-produksi-tekkom" className={subLinkClasses}>
                            Kelola Produksi
                        </NavLink>
                    </SidebarDropdown>

                    {/* Divisi Keuangan */}
                    <SidebarDropdown title="Divisi Keuangan">
                        <NavLink to="/tukang-minyak-dan-gas/manage-keuangan" className={subLinkClasses}>
                            Lihat Anggaran
                        </NavLink>
                    </SidebarDropdown>

                    {/* Sekper */}
                    <SidebarDropdown title="Sekretaris Perusahaan">
                        <NavLink to="/tukang-minyak-dan-gas/manage-penghargaan" className={subLinkClasses}>
                            Kelola Penghargaan
                        </NavLink>

                        <NavLink to="/tukang-minyak-dan-gas/manage-laporan" className={subLinkClasses}>
                            Kelola Laporan Tahunan
                        </NavLink>

                        <NavLink to="/tukang-minyak-dan-gas/manage-statistik-landing" className={subLinkClasses}>
                            Kelola Statistik Landing
                        </NavLink>

                        <NavLink to="/tukang-minyak-dan-gas/manage-contacts" className={subLinkClasses}>
                            Kelola Kontak Masuk
                        </NavLink>
                        <NavLink to="/tukang-minyak-dan-gas/manage-manajemen" className={subLinkClasses}>
                            Kelola Manajemen
                        </NavLink>

                        {/* NEW — PENGATURAN WEBSITE */}
                        <NavLink to="/tukang-minyak-dan-gas/manage-settings" className={subLinkClasses}>
                            Pengaturan Website
                        </NavLink>
                    </SidebarDropdown>
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                    >
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 px-16 py-10">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
