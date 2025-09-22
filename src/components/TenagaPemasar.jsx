import React, { useEffect, useState } from "react";
import { fetchTenagaPemasarList } from "../api/productApi";

export default function TenagaPemasar({ lsbsId, lsdbsNumber }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchTenagaPemasarList(lsbsId, lsdbsNumber);
        setData(result || []);
      } catch (err) {
        setError(err.message || "Gagal memuat data tenaga pemasar.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lsbsId, lsdbsNumber]);

  return (
    <div className="mt-6">
      <div className="mb-3">
        <h3 className="text-lg font-bold text-pink-600">👨‍💼 Tenaga Pemasar</h3>
      </div>

      {loading ? (
        <div className="text-center text-pink-600">⏳ Memuat data...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : data.length === 0 ? (
        <div className="text-center text-orange-600">
          Tidak ada data tenaga pemasar
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-orange-200 shadow-inner">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-orange-300 to-pink-300 text-white">
                <th className="px-4 py-3 text-left font-semibold">
                  Nama Pemasar
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors duration-200 ${
                    idx % 2 === 0
                      ? "bg-gradient-to-r from-orange-50 to-pink-50"
                      : "bg-gradient-to-r from-pink-50 to-yellow-50"
                  } hover:from-orange-100 hover:to-pink-100`}
                >
                  <td className="px-4 py-3 text-gray-700 font-medium">
                    {item.NAMA_PEMASAR}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}