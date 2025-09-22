import React, { useEffect, useState } from "react";
import { fetchRiderList } from "../api/productApi";

export default function Rider({ isOpen, onClose, title, lsbsId, lsdbsNumber }) {
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
        setData(result);
      } catch (err) {
        setError(err.message || "Gagal memuat data rider.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, showRiderList, lsbsId, lsdbsNumber]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-[95%] max-w-3xl shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800">
          {title || "Daftar Rider"}
        </h3>

        <div className="mt-4 overflow-x-auto max-h-[60vh] border border-gray-200 rounded-md">
          {!showRiderList ? (
            <p className="p-4 text-center text-gray-500">TIDAK ADA RIDER</p>
          ) : loading ? (
            <p className="p-4 text-center text-gray-600">⏳ Memuat data...</p>
          ) : error ? (
            <p className="p-4 text-center text-red-600">❌ {error}</p>
          ) : data.length === 0 ? (
            <p className="p-4 text-center text-gray-500">Tidak ada data rider.</p>
          ) : (
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold">
                    NAMA RIDER
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-3 py-2 text-gray-800">
                      {item.NAMA_RIDER || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 text-white font-medium hover:bg-gray-800 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}