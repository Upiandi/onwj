import React, { useState } from 'react';
import { FaFileExcel, FaUpload, FaDownload, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const UnifiedImportExport = () => {
  const [importing, setImporting] = useState(false);
  const [importResults, setImportResults] = useState(null);

  // ✅ DOWNLOAD UNIFIED TEMPLATE
  const downloadUnifiedTemplate = () => {
    try {
      const wb = XLSX.utils.book_new();

      // ===== SHEET 1: BERITA =====
      const beritaTemplate = [
        {
          'Judul Berita': 'Contoh: Program Mangrove Berhasil Tanam 10.000 Pohon',
          'Kategori': 'Lingkungan',
          'Tanggal': '2024-11-24',
          'Penulis': 'Admin TJSL',
          'Deskripsi Singkat': 'Ringkasan berita maksimal 200 karakter',
          'Konten Lengkap': 'Isi berita lengkap di sini...',
          'Status': 'Published',
          'Tampil di TJSL': 'Ya',
          'Tampil di Media Informasi': 'Ya',
          'Tampil di Dashboard': 'Tidak',
          'Pinned ke Homepage': 'Tidak',
        }
      ];
      const wsBerita = XLSX.utils.json_to_sheet(beritaTemplate);
      wsBerita['!cols'] = [
        { wch: 50 }, { wch: 20 }, { wch: 15 }, { wch: 20 },
        { wch: 50 }, { wch: 80 }, { wch: 15 }, { wch: 18 },
        { wch: 25 }, { wch: 20 }, { wch: 20 }
      ];
      XLSX.utils.book_append_sheet(wb, wsBerita, 'Berita');

      // ===== SHEET 2: UMKM =====
      const umkmTemplate = [
        {
          'Nama UMKM': 'Contoh: Kopi Mangrove Segara',
          'Kategori': 'Kuliner',
          'Pemilik': 'Ibu Siti Aminah',
          'Lokasi': 'Muara Gembong, Bekasi',
          'Status': 'Aktif',
          'Tahun Mulai': 2023,
          'Deskripsi': 'Kopi olahan khas pesisir dengan cita rasa mangrove',
          'Testimonial': 'Dulu saya cuma bisa jual 10 bungkus sehari, setelah dapat pelatihan dari MHJ ONWJ, sekarang bisa kirim ke luar kota.',
          'Pencapaian': 'Omzet naik 300%',
          'Link Toko': 'https://tokopedia.com/kopi-mangrove',
          'No. WhatsApp': '628123456789',
          'Featured': 'Ya',
        }
      ];
      const wsUmkm = XLSX.utils.json_to_sheet(umkmTemplate);
      wsUmkm['!cols'] = [
        { wch: 35 }, { wch: 15 }, { wch: 25 }, { wch: 30 },
        { wch: 15 }, { wch: 12 }, { wch: 50 }, { wch: 60 },
        { wch: 30 }, { wch: 35 }, { wch: 18 }, { wch: 10 }
      ];
      XLSX.utils.book_append_sheet(wb, wsUmkm, 'UMKM');

      // ===== SHEET 3: TESTIMONIAL =====
      const testimonialTemplate = [
        {
          'Nama Lengkap': 'Contoh: Ibu Siti Aminah',
          'Lokasi / Desa': 'Muara Gembong, Bekasi',
          'Program Terkait': 'Program Mangrove',
          'Isi Testimonial': 'Berkat program penanaman mangrove, pantai kami tidak lagi terkena abrasi. Anak-anak bisa bermain dengan aman di pesisir.',
          'Status': 'Published',
        }
      ];
      const wsTestimonial = XLSX.utils.json_to_sheet(testimonialTemplate);
      wsTestimonial['!cols'] = [
        { wch: 25 }, { wch: 30 }, { wch: 25 }, { wch: 80 }, { wch: 12 }
      ];
      XLSX.utils.book_append_sheet(wb, wsTestimonial, 'Testimonial');

      // ===== SHEET 4: LAPORAN TAHUNAN =====
      const laporanTemplate = [
        {
          'Judul Laporan': 'Contoh: Laporan Tahunan PT MHJ ONWJ 2024',
          'Jenis Laporan': 'Laporan Tahunan',
          'Tahun': 2024,
          'Tanggal Publikasi': '2024-11-24',
          'Deskripsi': 'Laporan tahunan perusahaan tahun 2024',
          'Status': 'Published',
          'Tampil di TJSL': 'Ya',
          'Tampil di Media Informasi': 'Ya',
          'Tampil di Dashboard': 'Ya',
          'Pinned ke Homepage': 'Tidak',
        }
      ];
      const wsLaporan = XLSX.utils.json_to_sheet(laporanTemplate);
      wsLaporan['!cols'] = [
        { wch: 50 }, { wch: 25 }, { wch: 10 }, { wch: 20 },
        { wch: 50 }, { wch: 15 }, { wch: 18 }, { wch: 25 },
        { wch: 20 }, { wch: 20 }
      ];
      XLSX.utils.book_append_sheet(wb, wsLaporan, 'Laporan Tahunan');

      // ===== SHEET 5: PROGRAM TJSL =====
      const tjslTemplate = [
        {
          'ID Area': 'KEPULAUAN_SERIBU',
          'Nama Program': 'Program Konservasi Mangrove',
          'Status': 'Aktif',
          'Position X (%)': '45.5',
          'Position Y (%)': '30.2',
          'Warna Marker': '#0EA5E9',
          'Deskripsi': 'Program penanaman dan konservasi mangrove untuk melindungi ekosistem pesisir',
          'Program/Kegiatan': 'Penanaman Mangrove; Edukasi Lingkungan; Monitoring',
          'Penerima Manfaat': '850 Keluarga',
          'Anggaran': 'Rp 2.8 Miliar',
          'Durasi': '2023-2025',
          'Dampak': 'Peningkatan 35% pendapatan nelayan',
          'Urutan': '1',
          'Tampil di Website': 'Ya',
        }
      ];
      const wsTjsl = XLSX.utils.json_to_sheet(tjslTemplate);
      wsTjsl['!cols'] = [
        { wch: 25 }, { wch: 35 }, { wch: 12 }, { wch: 15 },
        { wch: 15 }, { wch: 15 }, { wch: 50 }, { wch: 60 },
        { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 35 },
        { wch: 10 }, { wch: 18 }
      ];
      XLSX.utils.book_append_sheet(wb, wsTjsl, 'Program TJSL');

      // Write file
      XLSX.writeFile(wb, 'Template_Import_ALL_DATA_MHJ_ONWJ.xlsx');

      toast.success('✅ Template Unified berhasil didownload!\n\n5 Sheet: Berita, UMKM, Testimonial, Laporan, Program TJSL');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('❌ Gagal download template!');
    }
  };

  // ✅ UNIFIED IMPORT FROM EXCEL
  const handleUnifiedImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('❌ File harus berformat Excel (.xlsx atau .xls)');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        setImporting(true);
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        console.log('📊 Sheets ditemukan:', workbook.SheetNames);

        const results = {
          berita: { success: 0, failed: 0, errors: [] },
          umkm: { success: 0, failed: 0, errors: [] },
          testimonial: { success: 0, failed: 0, errors: [] },
          laporan: { success: 0, failed: 0, errors: [] },
          tjsl: { success: 0, failed: 0, errors: [] },
        };

        // ===== IMPORT BERITA =====
        if (workbook.SheetNames.includes('Berita')) {
          const wsBerita = workbook.Sheets['Berita'];
          const beritaData = XLSX.utils.sheet_to_json(wsBerita);
          
          for (const row of beritaData) {
            try {
              const beritaPayload = {
                title: row['Judul Berita'],
                category: row['Kategori'],
                date: row['Tanggal'],
                author: row['Penulis'] || 'Admin',
                shortDescription: row['Deskripsi Singkat'] || '',
                content: row['Konten Lengkap'] || '',
                status: row['Status'] === 'Published' ? 'Published' : 'Draft',
                showInTJSL: row['Tampil di TJSL']?.toLowerCase() === 'ya',
                showInMediaInformasi: row['Tampil di Media Informasi']?.toLowerCase() === 'ya',
                showInDashboard: row['Tampil di Dashboard']?.toLowerCase() === 'ya',
                pinToHomepage: row['Pinned ke Homepage']?.toLowerCase() === 'ya',
              };

              // Validasi
              if (!beritaPayload.title || !beritaPayload.category || !beritaPayload.date) {
                results.berita.failed++;
                results.berita.errors.push(`${row['Judul Berita'] || 'Unknown'}: Field wajib tidak lengkap`);
                continue;
              }

              const response = await axios.post(`${API_URL}/v1/admin/berita`, beritaPayload);
              if (response.data.success) {
                results.berita.success++;
              } else {
                results.berita.failed++;
              }
            } catch (error) {
              results.berita.failed++;
              results.berita.errors.push(`${row['Judul Berita']}: ${error.response?.data?.message || error.message}`);
            }
          }
        }

        // ===== IMPORT UMKM =====
        if (workbook.SheetNames.includes('UMKM')) {
          const wsUmkm = workbook.Sheets['UMKM'];
          const umkmData = XLSX.utils.sheet_to_json(wsUmkm);
          
          for (const row of umkmData) {
            try {
              const umkmPayload = {
                name: row['Nama UMKM'],
                category: row['Kategori'],
                owner: row['Pemilik'],
                location: row['Lokasi'],
                description: row['Deskripsi'],
                testimonial: row['Testimonial'] || '',
                shop_link: row['Link Toko'] || '',
                contact_number: row['No. WhatsApp'] || '',
                status: row['Status'] || 'Aktif',
                year_started: row['Tahun Mulai'] || new Date().getFullYear(),
                achievement: row['Pencapaian'] || '',
                is_featured: row['Featured']?.toLowerCase() === 'ya',
              };

              if (!umkmPayload.name || !umkmPayload.category || !umkmPayload.owner || !umkmPayload.location) {
                results.umkm.failed++;
                results.umkm.errors.push(`${row['Nama UMKM'] || 'Unknown'}: Field wajib tidak lengkap`);
                continue;
              }

              const response = await axios.post(`${API_URL}/v1/admin/umkm`, umkmPayload);
              if (response.data.success) {
                results.umkm.success++;
              } else {
                results.umkm.failed++;
              }
            } catch (error) {
              results.umkm.failed++;
              results.umkm.errors.push(`${row['Nama UMKM']}: ${error.response?.data?.message || error.message}`);
            }
          }
        }

        // ===== IMPORT TESTIMONIAL =====
        if (workbook.SheetNames.includes('Testimonial')) {
          const wsTestimonial = workbook.Sheets['Testimonial'];
          const testimonialData = XLSX.utils.sheet_to_json(wsTestimonial);
          
          for (const row of testimonialData) {
            try {
              const testimonialPayload = {
                name: row['Nama Lengkap'],
                location: row['Lokasi / Desa'],
                program: row['Program Terkait'],
                testimonial: row['Isi Testimonial'],
                status: row['Status'] || 'Published',
              };

              if (!testimonialPayload.name || !testimonialPayload.location || !testimonialPayload.program || !testimonialPayload.testimonial) {
                results.testimonial.failed++;
                results.testimonial.errors.push(`${row['Nama Lengkap'] || 'Unknown'}: Field wajib tidak lengkap`);
                continue;
              }

              if (testimonialPayload.testimonial.length < 20) {
                results.testimonial.failed++;
                results.testimonial.errors.push(`${row['Nama Lengkap']}: Testimonial terlalu pendek (min 20 karakter)`);
                continue;
              }

              const response = await axios.post(`${API_URL}/v1/admin/testimonial`, testimonialPayload);
              if (response.data.success) {
                results.testimonial.success++;
              } else {
                results.testimonial.failed++;
              }
            } catch (error) {
              results.testimonial.failed++;
              results.testimonial.errors.push(`${row['Nama Lengkap']}: ${error.response?.data?.message || error.message}`);
            }
          }
        }

        // ===== IMPORT LAPORAN TAHUNAN =====
        if (workbook.SheetNames.includes('Laporan Tahunan')) {
          const wsLaporan = workbook.Sheets['Laporan Tahunan'];
          const laporanData = XLSX.utils.sheet_to_json(wsLaporan);
          
          for (const row of laporanData) {
            try {
              const laporanPayload = {
                title: row['Judul Laporan'],
                type: row['Jenis Laporan'],
                year: row['Tahun'],
                published_date: row['Tanggal Publikasi'],
                description: row['Deskripsi'] || '',
                status: row['Status'] || 'Published',
                showInTJSL: row['Tampil di TJSL']?.toLowerCase() === 'ya',
                showInMediaInformasi: row['Tampil di Media Informasi']?.toLowerCase() === 'ya',
                showInDashboard: row['Tampil di Dashboard']?.toLowerCase() === 'ya',
                pinToHomepage: row['Pinned ke Homepage']?.toLowerCase() === 'ya',
              };

              if (!laporanPayload.title || !laporanPayload.type || !laporanPayload.year) {
                results.laporan.failed++;
                results.laporan.errors.push(`${row['Judul Laporan'] || 'Unknown'}: Field wajib tidak lengkap`);
                continue;
              }

              const response = await axios.post(`${API_URL}/v1/admin/laporan`, laporanPayload);
              if (response.data.success) {
                results.laporan.success++;
              } else {
                results.laporan.failed++;
              }
            } catch (error) {
              results.laporan.failed++;
              results.laporan.errors.push(`${row['Judul Laporan']}: ${error.response?.data?.message || error.message}`);
            }
          }
        }

        // ===== IMPORT PROGRAM TJSL =====
        if (workbook.SheetNames.includes('Program TJSL')) {
          const wsTjsl = workbook.Sheets['Program TJSL'];
          const tjslData = XLSX.utils.sheet_to_json(wsTjsl);
          
          for (const row of tjslData) {
            try {
              const programsString = row['Program/Kegiatan'] || '';
              const programsArray = programsString.split(';').map(p => p.trim()).filter(p => p);

              const tjslPayload = {
                area_id: row['ID Area'],
                name: row['Nama Program'],
                status: row['Status'] || 'Aktif',
                position_x: parseFloat(row['Position X (%)']).toString(),
                position_y: parseFloat(row['Position Y (%)']).toString(),
                color: row['Warna Marker'] || '#0EA5E9',
                description: row['Deskripsi'],
                programs: programsArray,
                beneficiaries: row['Penerima Manfaat'] || '',
                budget: row['Anggaran'] || '',
                duration: row['Durasi'] || '',
                impact: row['Dampak'] || '',
                order: parseInt(row['Urutan']) || 0,
                is_active: row['Tampil di Website']?.toLowerCase() === 'ya',
              };

              if (!tjslPayload.area_id || !tjslPayload.name || !tjslPayload.position_x || !tjslPayload.position_y) {
                results.tjsl.failed++;
                results.tjsl.errors.push(`${row['ID Area'] || 'Unknown'}: Field wajib tidak lengkap`);
                continue;
              }

              const response = await axios.post(`${API_URL}/v1/admin/wk-tjsl`, tjslPayload);
              if (response.data.success) {
                results.tjsl.success++;
              } else {
                results.tjsl.failed++;
              }
            } catch (error) {
              results.tjsl.failed++;
              results.tjsl.errors.push(`${row['ID Area']}: ${error.response?.data?.message || error.message}`);
            }
          }
        }

        // Set Results
        setImportResults(results);

        // Show Summary
        const totalSuccess = results.berita.success + results.umkm.success + results.testimonial.success + results.laporan.success + results.tjsl.success;
        const totalFailed = results.berita.failed + results.umkm.failed + results.testimonial.failed + results.laporan.failed + results.tjsl.failed;

        if (totalSuccess > 0) {
          toast.success(
            `✅ Import Selesai!\n\n` +
            `✓ Berhasil: ${totalSuccess} data\n` +
            `✗ Gagal: ${totalFailed} data\n\n` +
            `Detail:\n` +
            `- Berita: ${results.berita.success}/${results.berita.success + results.berita.failed}\n` +
            `- UMKM: ${results.umkm.success}/${results.umkm.success + results.umkm.failed}\n` +
            `- Testimonial: ${results.testimonial.success}/${results.testimonial.success + results.testimonial.failed}\n` +
            `- Laporan: ${results.laporan.success}/${results.laporan.success + results.laporan.failed}\n` +
            `- Program TJSL: ${results.tjsl.success}/${results.tjsl.success + results.tjsl.failed}`,
            { duration: 8000 }
          );
        } else {
          toast.error('❌ Semua import gagal! Periksa format data.');
        }

      } catch (error) {
        console.error('❌ Error importing:', error);
        toast.error(`❌ Gagal import Excel!\n\nError: ${error.message}`);
      } finally {
        setImporting(false);
        e.target.value = '';
      }
    };

    reader.onerror = () => {
      toast.error('❌ Gagal membaca file Excel');
      e.target.value = '';
      setImporting(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaFileExcel className="text-green-600" />
            Unified Import/Export System
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Import & Export SEMUA data (Berita, UMKM, Testimonial, Laporan, Program TJSL) dalam 1 file Excel
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={downloadUnifiedTemplate}
          className="flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          <FaDownload className="w-6 h-6" />
          <div className="text-left">
            <div>Download Template Unified</div>
            <div className="text-xs text-blue-100">5 Sheets: Berita, UMKM, Testimonial, Laporan, TJSL</div>
          </div>
        </button>

        <label className="flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all shadow-md cursor-pointer">
          {importing ? (
            <>
              <FaSpinner className="w-6 h-6 animate-spin" />
              <div className="text-left">
                <div>Importing...</div>
                <div className="text-xs text-purple-100">Mohon tunggu...</div>
              </div>
            </>
          ) : (
            <>
              <FaUpload className="w-6 h-6" />
              <div className="text-left">
                <div>Import Unified Excel</div>
                <div className="text-xs text-purple-100">Upload file template yang sudah diisi</div>
              </div>
            </>
          )}
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleUnifiedImport}
            className="hidden"
            disabled={importing}
          />
        </label>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
        <h3 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
          <FaFileExcel className="text-blue-600" />
          Cara Menggunakan Unified Import
        </h3>
        <ol className="text-sm text-blue-800 space-y-2 ml-5 list-decimal">
          <li>Klik <strong>"Download Template Unified"</strong> untuk mendapatkan file Excel dengan 5 sheet</li>
          <li>Buka file Excel, isi data di sheet yang diinginkan:
            <ul className="ml-5 mt-1 space-y-1 list-disc">
              <li><strong>Sheet Berita:</strong> Data berita & artikel</li>
              <li><strong>Sheet UMKM:</strong> Data UMKM binaan</li>
              <li><strong>Sheet Testimonial:</strong> Testimonial masyarakat</li>
              <li><strong>Sheet Laporan Tahunan:</strong> Laporan perusahaan</li>
              <li><strong>Sheet Program TJSL:</strong> Wilayah kerja TJSL</li>
            </ul>
          </li>
          <li>Anda bisa isi <strong>semua sheet</strong> atau <strong>beberapa sheet saja</strong></li>
          <li>Simpan file Excel, lalu klik <strong>"Import Unified Excel"</strong></li>
          <li>Sistem akan otomatis detect & import data dari semua sheet yang terisi</li>
        </ol>
      </div>

      {/* Import Results */}
      {importResults && (
        <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Hasil Import</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Berita */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Berita</span>
                {importResults.berita.success > 0 ? (
                  <FaCheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                  <FaTimesCircle className="text-red-600 w-5 h-5" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                ✓ Berhasil: <span className="font-bold text-green-600">{importResults.berita.success}</span><br />
                ✗ Gagal: <span className="font-bold text-red-600">{importResults.berita.failed}</span>
              </div>
              {importResults.berita.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-600 max-h-20 overflow-y-auto">
                  {importResults.berita.errors.slice(0, 2).map((err, idx) => (
                    <div key={idx}>• {err}</div>
                  ))}
                </div>
              )}
            </div>

            {/* UMKM */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">UMKM</span>
                {importResults.umkm.success > 0 ? (
                  <FaCheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                  <FaTimesCircle className="text-red-600 w-5 h-5" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                ✓ Berhasil: <span className="font-bold text-green-600">{importResults.umkm.success}</span><br />
                ✗ Gagal: <span className="font-bold text-red-600">{importResults.umkm.failed}</span>
              </div>
              {importResults.umkm.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-600 max-h-20 overflow-y-auto">
                  {importResults.umkm.errors.slice(0, 2).map((err, idx) => (
                    <div key={idx}>• {err}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Testimonial */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Testimonial</span>
                {importResults.testimonial.success > 0 ? (
                  <FaCheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                  <FaTimesCircle className="text-red-600 w-5 h-5" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                ✓ Berhasil: <span className="font-bold text-green-600">{importResults.testimonial.success}</span><br />
                ✗ Gagal: <span className="font-bold text-red-600">{importResults.testimonial.failed}</span>
              </div>
              {importResults.testimonial.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-600 max-h-20 overflow-y-auto">
                  {importResults.testimonial.errors.slice(0, 2).map((err, idx) => (
                    <div key={idx}>• {err}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Laporan */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Laporan Tahunan</span>
                {importResults.laporan.success > 0 ? (
                  <FaCheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                  <FaTimesCircle className="text-red-600 w-5 h-5" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                ✓ Berhasil: <span className="font-bold text-green-600">{importResults.laporan.success}</span><br />
                ✗ Gagal: <span className="font-bold text-red-600">{importResults.laporan.failed}</span>
              </div>
              {importResults.laporan.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-600 max-h-20 overflow-y-auto">
                  {importResults.laporan.errors.slice(0, 2).map((err, idx) => (
                    <div key={idx}>• {err}</div>
                  ))}
                </div>
              )}
            </div>

            {/* Program TJSL */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">Program TJSL</span>
                {importResults.tjsl.success > 0 ? (
                  <FaCheckCircle className="text-green-600 w-5 h-5" />
                ) : (
                  <FaTimesCircle className="text-red-600 w-5 h-5" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                ✓ Berhasil: <span className="font-bold text-green-600">{importResults.tjsl.success}</span><br />
                ✗ Gagal: <span className="font-bold text-red-600">{importResults.tjsl.failed}</span>
              </div>
              {importResults.tjsl.errors.length > 0 && (
                <div className="mt-2 text-xs text-red-600 max-h-20 overflow-y-auto">
                  {importResults.tjsl.errors.slice(0, 2).map((err, idx) => (
                    <div key={idx}>• {err}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedImportExport;