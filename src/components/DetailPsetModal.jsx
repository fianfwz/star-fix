import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

export default function DetailPsetModal({ isOpen, onClose, data = [], title }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-[90%] max-w-6xl shadow-xl border border-gray-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {title || 'Detail PSET'}
        </h3>

        <div className="mt-4">
          {/* Tampilan Tabel untuk layar besar (>= 768px) */}
          <div className="hidden md:block overflow-x-visible">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-md min-w-full">
                <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left whitespace-nowrap">PSET_ID</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">INSURED_PERIOD_MONTH</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">MIN_UP</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">MAX_UP</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">MIN_PREMIUM</th>
                    <th className="px-3 py-2 text-left whitespace-nowrap">MAX_PREMIUM</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b last:border-b-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{item.PSET_ID}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{item.INSURED_PERIOD_MONTH}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(item.MIN_UP, item.LKU_ID)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(item.MAX_UP, item.LKU_ID)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(item.MIN_PREMIUM, item.LKU_ID)}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatCurrency(item.MAX_PREMIUM, item.LKU_ID)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tampilan Kartu untuk layar kecil (< 768px) */}
          <div className="md:hidden space-y-4">
            {data.map((item, idx) => (
              <div key={idx} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <div className="font-semibold text-gray-600">PSET_ID:</div>
                  <div>{item.PSET_ID}</div>
                  <div className="font-semibold text-gray-600">Insured Period:</div>
                  <div>{item.INSURED_PERIOD_MONTH} bulan</div>
                  <div className="font-semibold text-gray-600">Min UP:</div>
                  <div>{formatCurrency(item.MIN_UP, item.LKU_ID)}</div>
                  <div className="font-semibold text-gray-600">Max UP:</div>
                  <div>{formatCurrency(item.MAX_UP, item.LKU_ID)}</div>
                  <div className="font-semibold text-gray-600">Min Premium:</div>
                  <div>{formatCurrency(item.MIN_PREMIUM, item.LKU_ID)}</div>
                  <div className="font-semibold text-gray-600">Max Premium:</div>
                  <div>{formatCurrency(item.MAX_PREMIUM, item.LKU_ID)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data untuk ditampilkan
          </div>
        )}

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