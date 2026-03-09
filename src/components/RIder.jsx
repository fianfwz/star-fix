import React, { useEffect, useState } from "react";
import { fetchRiderList } from "../api/productApi";

export default function Rider({ isOpen, onClose, title, lsbsId, lsdbsNumber, onRiderClick }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const showRiderList = lsbsId === 213 && lsdbsNumber === 3;

  useEffect(() => {
    if (!isOpen) return;

    if (!showRiderList) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchRiderList(lsbsId, lsdbsNumber);
        
        // Handle berbagai format respons
        let riderData = [];
        
        if (Array.isArray(result)) {
          riderData = result;
        } else if (result && result.data && Array.isArray(result.data)) {
          riderData = result.data;
        } else if (result && typeof result === 'object') {
          // Cari properti yang berisi array
          for (let key in result) {
            if (Array.isArray(result[key]) && key !== 'message') {
              riderData = result[key];
              break;
            }
          }
        }
        
        
        // Debug: Tampilkan properti item pertama jika ada
        if (riderData.length > 0) {
          const firstItem = riderData[0];
          Object.keys(firstItem).forEach(key => {
          });
        }
        
        setData(riderData);
      } catch (err) {
        setError(err.message || "Gagal memuat data rider.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, showRiderList, lsbsId, lsdbsNumber]);

  const handleRiderClick = (rider) => {
    
    // Debug: Tampilkan semua properti rider
    Object.keys(rider).forEach(key => {
    });
    
    // Cari LSBS_ID dan LSDBS_NUMBER dengan berbagai kemungkinan nama properti
    let lsbsIdFound = null;
    let lsdbsNumberFound = null;
    
    // List kemungkinan nama properti untuk LSBS_ID
    const lsbsIdKeys = ['LSBS_ID', 'lsbs_id', 'LSBSID', 'lsbsId', 'ID', 'id', 'LsbsId', 'lsbsId'];
    
    // List kemungkinan nama properti untuk LSDBS_NUMBER
    const lsdbsNumberKeys = ['LSDBS_NUMBER', 'lsdbs_number', 'LSDBS_NUM', 'lsdbsNum', 'NUMBER', 'number', 'LsdbsNumber', 'lsdbsNumber'];
    
    // Cari LSBS_ID
    for (const key of lsbsIdKeys) {
      if (rider[key] !== undefined && rider[key] !== null && rider[key] !== '') {
        lsbsIdFound = rider[key];
        break;
      }
    }
    
    // Cari LSDBS_NUMBER
    for (const key of lsdbsNumberKeys) {
      if (rider[key] !== undefined && rider[key] !== null && rider[key] !== '') {
        lsdbsNumberFound = rider[key];
        break;
      }
    }
    
    // Jika tidak ditemukan dengan key langsung, cari di nilai string
    if (!lsbsIdFound || !lsdbsNumberFound) {
      // Cari pola dalam string
      for (const key in rider) {
        const value = String(rider[key]);
        
        // Cari pola seperti "213-1" atau "213.1" atau "213/1"
        const match = value.match(/(\d+)[\-\.\/](\d+)/);
        if (match) {
          if (!lsbsIdFound) {
            lsbsIdFound = match[1];
          }
          if (!lsdbsNumberFound) {
            lsdbsNumberFound = match[2];
          }
        }
      }
    }
    
    // Jika masih tidak ditemukan, gunakan fallback
    if (!lsbsIdFound) {
      lsbsIdFound = lsbsId; // Gunakan dari props
    }
    
    if (!lsdbsNumberFound) {
      lsdbsNumberFound = lsdbsNumber || 1; // Gunakan dari props atau default
    }
    
    // Buat data yang akan dikirim
    const riderDataToSend = {
      LSBS_ID: lsbsIdFound,
      LSDBS_NUMBER: lsdbsNumberFound,
      LSDBS_NAME: rider.NAMA_RIDER || rider.nama_rider || rider.NAME || rider.name || "Rider",
      PSET_ID: rider.PSET_ID || rider.pset_id,
      LKU_ID: rider.LKU_ID || rider.lku_id,
      LSDBS_AKTIF: rider.LSDBS_AKTIF || rider.lsdbs_aktif,
      // Tambahkan data asli untuk debugging
      _debug: {
        originalData: rider,
        foundKeys: {
          lsbsId: lsbsIdFound,
          lsdbsNumber: lsdbsNumberFound
        }
      }
    };
    
    
    // Tutup modal
    onClose();
    
    // Kirim data ke parent - TIDAK PERLU VALIDASI DISINI
    if (onRiderClick) {
      onRiderClick(riderDataToSend);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-3xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title || "Daftar Rider"}
        </h3>
        <div className="max-h-[50vh] sm:max-h-[60vh] border border-gray-200 dark:border-gray-700 rounded-md overflow-y-auto">
          {!showRiderList ? (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">TIDAK ADA RIDER</p>
          ) : loading ? (
            <p className="p-4 text-center text-gray-600 dark:text-gray-300">⏳ Memuat data...</p>
          ) : error ? (
            <p className="p-4 text-center text-red-600 dark:text-red-400 text-sm">❌ {error}</p>
          ) : data.length === 0 ? (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">Tidak ada data rider.</p>
          ) : (
            <div className="w-full">
              <div className="grid grid-cols-3 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white p-3 font-semibold text-xs sm:text-sm">
                <div>KODE</div>
                <div>KODE DETAIL</div>
                <div>NAMA RIDER</div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleRiderClick(item)}
                    className="grid grid-cols-3 p-3 text-gray-800 dark:text-gray-200 text-xs sm:text-sm hover:bg-blue-100 dark:hover:bg-blue-900 transition cursor-pointer"
                  >
                    <div>{item.LSBS_ID || item.lsbs_id || "-"}</div>

                    <div>{item.LSDBS_NUMBER || item.lsdbs_number || "-"}</div>

                    <div className="font-medium text-blue-600 dark:text-blue-400">
                      {item.NAMA_RIDER || item.nama_rider || item.NAME || item.name || "Unnamed Rider"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-6 text-right">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-md bg-gray-700 dark:bg-gray-600 text-white font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}