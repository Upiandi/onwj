import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import logo from '../../assets/logo.webp';

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const { showSuccess, showError } = useToast();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false,
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/tukang-minyak-dan-gas/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.email) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            const response = await login(formData);
            showSuccess(response.message || 'Login berhasil!');
            navigate('/tukang-minyak-dan-gas/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            showError(error.message || 'Login gagal. Silakan coba lagi.');
            
            if (error.errors) {
                setErrors(error.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-fade-in will-change-opacity">
                
                {/* Header */}
                <div className="px-8 pt-10 pb-6 bg-gradient-to-r from-blue-600 to-indigo-600 animate-slide-down">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="bg-white p-4 rounded-2xl shadow-lg transform transition-smart-ease-out hover:scale-105 will-change-transform">
                            <img 
                                src={logo} 
                                alt="Logo MHJ ONWJ" 
                                className="w-20 h-20 object-contain" 
                            />
                        </div>
                        
                        <div className="text-center">
                            <h2 className="text-display-sm text-white">
                                Admin Panel
                            </h2>
                            <p className="text-blue-100 mt-1 text-sm font-medium">
                                PT Migas Hulu Jabar ONWJ
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="px-8 py-8 animate-slide-up">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${
                                    errors.email 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-300'
                                }`}
                                placeholder="admin@example.com"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${
                                    errors.password 
                                        ? 'border-red-500 bg-red-50' 
                                        : 'border-gray-300'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600 flex items-center gap-1 animate-fade-in">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember */}
                        <div className="flex items-center justify-center py-2">
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleChange}
                                    disabled={loading}
                                    className="h-4 w-4 text-blue-600"
                                />
                                <span className="ml-2 text-sm font-medium text-gray-700 select-none">
                                    Ingat saya selama 7 hari
                                </span>
                            </label>
                        </div>

                        {/* SUBMIT BUTTON — CENTERED */}
                        <div className="pt-2 flex justify-center">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-10 py-3.5 font-bold text-white rounded-lg shadow-lg text-center transition-smart-ease-out transform mx-auto block ${
                                    loading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                                }`}
                            >
                                {loading ? 'Logging in...' : 'Login to Dashboard'}
                            </button>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Protected Admin Area</span>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                        © 2025 PT Migas Hulu Jabar ONWJ
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
