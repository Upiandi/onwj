import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import PageHero from '../components/PageHero';
import bannerImage from '../assets/hero-bg.png';
import contactService from '../services/contactService';

// Dummy company settings
const dummySettings = {
    company: {
        address: 'Jl. Jakarta No. 40, Kebonwaru, Batununggal, Kota Bandung, Jawa Barat 40272',
        email: 'corsec@muj-onwj.com',
        phone: '(022) 1234 5678'
    }
};

// --- SUB-KOMPONEN ---

// 1. Hero Banner (Konsisten dengan halaman lain)
const KontakHero = () => (
    <PageHero
        title="Kontak Kami"
        description="Kami senang terhubung dengan Anda. Hubungi kami untuk pertanyaan, kemitraan, atau informasi lebih lanjut."
        backgroundImage={bannerImage}
        heightClass="h-[45vh] min-h-[320px] max-h-[420px]"
        breadcrumbs={[
            { label: 'Beranda', to: '/', icon: 'home' },
            { label: 'Kontak' },
        ]}
    />
);

// 2. Info Kontak & Peta (✅ UPDATED WITH SETTINGS)
const KontakInfo = () => {
    const settings = dummySettings; // ✅ USE DUMMY SETTINGS

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-8 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Kolom Kiri:  Info Detail */}
                <div className="space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Hubungi Kami</h2>
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Silakan hubungi kami melalui detail di bawah ini atau isi formulir di samping.  Tim kami akan segera merespons Anda.
                        </p>
                    </div>
                    <div className="space-y-6">
                        {/* ✅ DYNAMIC ADDRESS */}
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <FaMapMarkerAlt className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Alamat Kantor</h3>
                                <p className="text-gray-600">
                                    {settings.company?.address || 'Jl.  Jakarta No.  40, Kebonwaru, Batununggal, Kota Bandung, Jawa Barat 40272'}
                                </p>
                            </div>
                        </div>

                        {/* ✅ DYNAMIC EMAIL */}
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <FaEnvelope className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                                <a 
                                    href={`mailto:${settings.company?.email || 'corsec@muj-onwj.com'}`}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    {settings.company?.email || 'corsec@muj-onwj.com'}
                                </a>
                            </div>
                        </div>

                        {/* ✅ DYNAMIC PHONE */}
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                <FaPhone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Telepon</h3>
                                <a 
                                    href={`tel:${settings.company?.phone?. replace(/\s/g, '') || '+622212345678'}`}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    {settings.company?.phone || '(022) 1234 5678'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Peta */}
                <div className="rounded-xl overflow-hidden shadow-lg h-96 lg:h-full">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.669866164213!2d107.63222307579174!3d-6.930107967817454!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3! 1m2!1s0x2e68e80e1a12004d%3A0x609e533d7b003a27!2sPT%20Migas%20Hulu%20Jabar%20ONWJ!5e0!3m2!1sen!2sid!4v1730391216091!5m2!1sen! 2sid"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="PT Migas Hulu Jabar ONWJ Location"
                    ></iframe>
                </div>
            </div>
        </section>
    );
};

// 3. Form Kontak (unchanged)
const KontakForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e. target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.message) {
            toast.error('Mohon lengkapi semua field yang wajib diisi');
            return;
        }

        setLoading(true);

        try {
            const response = await contactService.submit(formData);
            
            if (response.data.success) {
                toast.success(response.data.message || 'Pesan berhasil dikirim! ');
                setSubmitted(true);
                
                setFormData({
                    name:  '',
                    email: '',
                    phone: '',
                    subject: '',
                    message:  ''
                });

                setTimeout(() => {
                    setSubmitted(false);
                }, 5000);
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).forEach(err => {
                    toast.error(Array.isArray(err) ? err[0] : err);
                });
            } else {
                toast.error(error.response?.data?.message || 'Gagal mengirim pesan.  Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-8 lg:px-16 max-w-4xl">
                    <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-100 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Pesan Terkirim! </h3>
                        <p className="text-gray-600 mb-6">
                            Terima kasih telah menghubungi kami. Tim kami akan segera merespons pesan Anda melalui email.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Kirim Pesan Lain
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-8 lg:px-16 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900">Kirim Pesan</h2>
                    <p className="text-gray-600 mt-4">Ada pertanyaan atau masukan? Isi form di bawah ini.</p>
                </div>
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={formData. name}
                                onChange={handleChange}
                                required 
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus: ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Alamat Email <span className="text-red-500">*</span>
                            </label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleChange}
                                required 
                                disabled={loading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                            Nomor Telepon
                        </label>
                        <input 
                            type="tel" 
                            id="phone" 
                            name="phone" 
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                            placeholder="081234567890"
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                            Subjek <span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="subject" 
                            name="subject" 
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                            placeholder="Pertanyaan tentang Program TJSL"
                        />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            Pesan Anda <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            id="message" 
                            name="message" 
                            rows="5" 
                            value={formData.message}
                            onChange={handleChange}
                            required 
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus: ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all resize-none"
                            placeholder="Tulis pesan Anda di sini..."
                            minLength={10}
                        />
                        <p className="text-sm text-gray-500 mt-1">Minimal 10 karakter</p>
                    </div>
                    <div className="text-center pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all shadow-lg transform hover:-translate-y-1 disabled: opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mengirim... 
                                </>
                            ) : (
                                <>
                                    <FaPaperPlane />
                                    Kirim Pesan
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

// --- MAIN PAGE COMPONENT ---
const KontakPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <KontakHero />
      <KontakInfo />
      <KontakForm />
    </div>
  );
};

export default KontakPage;