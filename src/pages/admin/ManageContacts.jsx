import React, { useState, useEffect } from 'react';
import { 
  FaEnvelope, 
  FaEnvelopeOpen, 
  FaTrash, 
  FaEye, 
  FaTimes, 
  FaSearch, 
  FaFilter,
  FaCheckCircle,
  FaReply,
  FaClock,
  FaPhone,
  FaUser,
  FaCalendar
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import contactService from '../../services/contactService';

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    new:  0,
    read: 0,
    replied: 0,
    today: 0,
    this_week: 0,
    this_month: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0
  });

  useEffect(() => {
    fetchContacts();
    fetchStatistics();
  }, [currentPage, filterStatus, filterDateFrom, filterDateTo]);

  useEffect(() => {
    // Local search filter
    let result = [... contacts];

    if (searchTerm) {
      result = result.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email. toLowerCase().includes(searchTerm. toLowerCase()) ||
        item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContacts(result);
  }, [searchTerm, contacts]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        per_page: 15,
      };

      if (filterStatus) params.status = filterStatus;
      if (filterDateFrom) params.date_from = filterDateFrom;
      if (filterDateTo) params.date_to = filterDateTo;

      const response = await contactService.admin.getAll(params);

      if (response.data.success) {
        setContacts(response.data.data || []);
        setFilteredContacts(response.data.data || []);
        setPagination(response.data.meta);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Gagal memuat data kontak');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await contactService.admin. getStatistics();
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleViewDetail = async (contact) => {
    try {
      const response = await contactService.admin. getById(contact.id);
      if (response.data.success) {
        setSelectedContact(response. data.data);
        setShowDetailModal(true);
        
        // Update local state
        fetchContacts();
        fetchStatistics();
      }
    } catch (error) {
      console.error('Error fetching contact detail:', error);
      toast.error('Gagal memuat detail kontak');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await contactService.admin.updateStatus(id, { status });
      
      if (response.data.success) {
        toast.success('Status berhasil diperbarui');
        fetchContacts();
        fetchStatistics();
        
        if (selectedContact && selectedContact.id === id) {
          setSelectedContact(response.data.data);
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal memperbarui status');
    }
  };

  const handleDelete = async (id) => {
    if (! window.confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
      return;
    }

    try {
      const response = await contactService.admin.delete(id);
      
      if (response.data.success) {
        toast.success('Kontak berhasil dihapus');
        fetchContacts();
        fetchStatistics();
        
        if (selectedContact && selectedContact.id === id) {
          setShowDetailModal(false);
          setSelectedContact(null);
        }
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Gagal menghapus kontak');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { color: 'bg-blue-100 text-blue-800', icon: <FaEnvelope />, label: 'Baru' },
      read:  { color: 'bg-yellow-100 text-yellow-800', icon: <FaEnvelopeOpen />, label:  'Dibaca' },
      replied: { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle />, label: 'Dibalas' }
    };

    const badge = badges[status] || badges. new;

    return (
      <span className={`px-3 py-1 inline-flex items-center gap-2 text-xs leading-5 font-semibold rounded-full ${badge.color}`}>
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Kelola Kontak Masuk</h1>
        <p className="text-gray-600 mt-1">Lihat dan kelola semua pesan dari formulir kontak</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaEnvelope className="w-6 h-6" />}
          label="Total Kontak"
          value={statistics.total}
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<FaClock className="w-6 h-6" />}
          label="Belum Dibaca"
          value={statistics.new}
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          icon={<FaEnvelopeOpen className="w-6 h-6" />}
          label="Sudah Dibaca"
          value={statistics.read}
          color="from-yellow-500 to-yellow-600"
        />
        <StatCard
          icon={<FaCheckCircle className="w-6 h-6" />}
          label="Sudah Dibalas"
          value={statistics.replied}
          color="from-green-500 to-green-600"
        />
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <FaFilter className="text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Pencarian & Filter</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, subjek..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target. value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e. target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Semua Status</option>
            <option value="new">Baru</option>
            <option value="read">Dibaca</option>
            <option value="replied">Dibalas</option>
          </select>

          {/* Date From */}
          <input
            type="date"
            value={filterDateFrom}
            onChange={(e) => {
              setFilterDateFrom(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus: ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Dari Tanggal"
          />

          {/* Date To */}
          <input
            type="date"
            value={filterDateTo}
            onChange={(e) => {
              setFilterDateTo(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Sampai Tanggal"
          />
        </div>

        {/* Clear Filter */}
        {(searchTerm || filterStatus || filterDateFrom || filterDateTo) && (
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-blue-600">{filteredContacts.length}</span> dari {pagination.total} kontak
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-2"
            >
              <FaTimes />
              Hapus Filter
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Pengirim
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Subjek
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-4 text-gray-600">Memuat data... </p>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaEnvelope className="w-10 h-10 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      {searchTerm || filterStatus || filterDateFrom || filterDateTo
                        ? 'Tidak ada kontak yang sesuai dengan filter'
                        : 'Belum ada kontak masuk'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {searchTerm || filterStatus || filterDateFrom || filterDateTo
                        ? 'Coba ubah kriteria pencarian atau filter'
                        : 'Kontak dari formulir website akan muncul di sini'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr key={contact.id} className={`hover:bg-blue-50 transition-colors ${contact.status === 'new' ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                          <FaUser className="text-gray-400" />
                          {contact. name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <FaEnvelope className="text-gray-400" />
                          {contact.email}
                        </div>
                        {contact.phone && (
                          <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <FaPhone className="text-gray-400" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{contact.subject}</div>
                      <div className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {contact.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(contact. status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaCalendar className="text-gray-400" />
                        {formatDate(contact.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleViewDetail(contact)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                          title="Lihat Detail"
                        >
                          <FaEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Hapus"
                        >
                          <FaTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={pagination. current_page}
              lastPage={pagination.last_page}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <DetailModal
          contact={selectedContact}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedContact(null);
          }}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

// ==================== SUB-COMPONENTS ====================

// Stat Card Component
const StatCard = ({ icon, label, value, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg p-6 text-white`}>
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-white bg-opacity-20 rounded-lg">
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm opacity-90">{label}</div>
  </div>
);

// Pagination Component
const Pagination = ({ currentPage, lastPage, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center space-x-2" aria-label="Pagination">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
        >
          ‹
        </button>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-md font-bold transition-colors ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              :  'hover:bg-gray-100 text-gray-700'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < lastPage && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-2 hover:bg-gray-100 text-gray-700 rounded-md transition-colors"
        >
          ›
        </button>
      )}
    </nav>
  );
};

// Detail Modal Component
const DetailModal = ({ contact, onClose, onUpdateStatus, onDelete }) => {
  const [adminNotes, setAdminNotes] = useState(contact.admin_notes || '');

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(contact.id, newStatus);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">Detail Kontak</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <div>
              {contact.status === 'new' ? (
                <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold flex items-center gap-2 inline-flex">
                  <FaEnvelope /> Pesan Baru
                </span>
              ) : contact.status === 'read' ?  (
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold flex items-center gap-2 inline-flex">
                  <FaEnvelopeOpen /> Sudah Dibaca
                </span>
              ) : (
                <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold flex items-center gap-2 inline-flex">
                  <FaCheckCircle /> Sudah Dibalas
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <FaCalendar className="inline mr-2" />
              {new Date(contact.created_at).toLocaleDateString('id-ID', {
                day:  '2-digit',
                month:  'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>

          {/* Sender Info */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="font-semibold text-gray-900 mb-3">Informasi Pengirim</h4>
            <div className="grid grid-cols-1 md: grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nama</label>
                <p className="text-gray-900 font-semibold flex items-center gap-2 mt-1">
                  <FaUser className="text-gray-400" />
                  {contact.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900 font-semibold flex items-center gap-2 mt-1">
                  <FaEnvelope className="text-gray-400" />
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-700">
                    {contact.email}
                  </a>
                </p>
              </div>
              {contact.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Telepon</label>
                  <p className="text-gray-900 font-semibold flex items-center gap-2 mt-1">
                    <FaPhone className="text-gray-400" />
                    <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-700">
                      {contact.phone}
                    </a>
                  </p>
                </div>
              )}
              {contact.ip_address && (
                <div>
                  <label className="text-sm font-medium text-gray-600">IP Address</label>
                  <p className="text-gray-900 font-mono text-sm mt-1">{contact.ip_address}</p>
                </div>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="text-sm font-medium text-gray-600">Subjek</label>
            <p className="text-lg font-semibold text-gray-900 mt-1">{contact.subject}</p>
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-gray-600">Pesan</label>
            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>

          {/* Admin Notes */}
          <div>
            <label className="text-sm font-medium text-gray-600">Catatan Admin (Opsional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows="3"
              className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus: ring-blue-500 focus: border-transparent"
              placeholder="Tambahkan catatan internal..."
            />
          </div>

          {/* Status Actions */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-3">Ubah Status</label>
            <div className="flex flex-wrap gap-3">
              {contact.status !== 'read' && (
                <button
                  onClick={() => handleStatusChange('read')}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
                >
                  <FaEnvelopeOpen />
                  Tandai Sudah Dibaca
                </button>
              )}
              {contact.status !== 'replied' && (
                <button
                  onClick={() => handleStatusChange('replied')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaReply />
                  Tandai Sudah Dibalas
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-between">
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin menghapus kontak ini?')) {
                onDelete(contact.id);
              }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaTrash />
            Hapus Kontak
          </button>
          <div className="flex gap-3">
            <a
              href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FaReply />
              Balas via Email
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageContacts;