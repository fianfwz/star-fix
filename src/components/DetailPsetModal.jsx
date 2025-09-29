import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

export default function DetailPsetModal({ isOpen, onClose, data = [], title }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-[95vw] mx-2 shadow-xl border border-gray-200 dark:border-gray-700 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title || 'Detail PSET'}
        </h3>

        <div className="mt-4">
          {/* Tampilan Tabel untuk layar menengah ke atas (>= 1024px) */}
          <div className="hidden lg:block">
            <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white">
                  <tr>
                    <th className="px-3 py-3 text-left font-medium text-xs sm:text-sm">PSET_ID</th>
                    <th className="px-3 py-3 text-left font-medium text-xs sm:text-sm">PERIODE (Bulan)</th>
                    <th className="px-3 py-3 text-left font-medium text-xs sm:text-sm">MIN UP</th>
                    <th className="px-3 py-3 text-left font-medium text-xs sm:text-sm">MAX UP</th>
                    <th className="px-3 py-3 text-left font-medium text-xs sm:text-sm">MIN PREMI</th>
                    <th className="px-3 py-3 text-left font-medium text-xs sm:text-sm">MAX PREMI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                        idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                      }`}
                    >
                      <td className="px-3 py-3 text-gray-900 dark:text-gray-100 font-medium">{item.PSET_ID}</td>
                      <td className="px-3 py-3 text-gray-900 dark:text-gray-100">{item.INSURED_PERIOD_MONTH}</td>
                      <td className="px-3 py-3 text-gray-900 dark:text-gray-100">{formatCurrency(item.MIN_UP, item.LKU_ID)}</td>
                      <td className="px-3 py-3 text-gray-900 dark:text-gray-100">{formatCurrency(item.MAX_UP, item.LKU_ID)}</td>
                      <td className="px-3 py-3 text-gray-900 dark:text-gray-100">{formatCurrency(item.MIN_PREMIUM, item.LKU_ID)}</td>
                      <td className="px-3 py-3 text-gray-900 dark:text-gray-100">{formatCurrency(item.MAX_PREMIUM, item.LKU_ID)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tampilan Tabel untuk layar tablet (768px - 1023px) */}
          <div className="hidden md:block lg:hidden">
            <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white">
                  <tr>
                    <th className="px-2 py-2 text-left font-medium">PSET_ID</th>
                    <th className="px-2 py-2 text-left font-medium">PERIODE</th>
                    <th className="px-2 py-2 text-left font-medium">MIN UP</th>
                    <th className="px-2 py-2 text-left font-medium">MAX UP</th>
                    <th className="px-2 py-2 text-left font-medium">MIN PREMI</th>
                    <th className="px-2 py-2 text-left font-medium">MAX PREMI</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`border-b dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                        idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'
                      }`}
                    >
                      <td className="px-2 py-2 text-gray-900 dark:text-gray-100 font-medium text-xs">{item.PSET_ID}</td>
                      <td className="px-2 py-2 text-gray-900 dark:text-gray-100 text-xs">{item.INSURED_PERIOD_MONTH}</td>
                      <td className="px-2 py-2 text-gray-900 dark:text-gray-100 text-xs">{formatCurrency(item.MIN_UP, item.LKU_ID)}</td>
                      <td className="px-2 py-2 text-gray-900 dark:text-gray-100 text-xs">{formatCurrency(item.MAX_UP, item.LKU_ID)}</td>
                      <td className="px-2 py-2 text-gray-900 dark:text-gray-100 text-xs">{formatCurrency(item.MIN_PREMIUM, item.LKU_ID)}</td>
                      <td className="px-2 py-2 text-gray-900 dark:text-gray-100 text-xs">{formatCurrency(item.MAX_PREMIUM, item.LKU_ID)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tampilan Kartu untuk layar mobile (< 768px) */}
          <div className="md:hidden space-y-3">
            {data.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 gap-3 text-sm">
                  {/* Header Card */}
                  <div className="flex justify-between items-center pb-2 border-b dark:border-gray-700">
                    <span className="font-semibold text-gray-600 dark:text-gray-400">PSET_ID:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{item.PSET_ID}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="font-medium text-gray-600 dark:text-gray-400 text-xs">Periode:</div>
                    <div className="text-gray-900 dark:text-gray-100 text-xs">{item.INSURED_PERIOD_MONTH} bulan</div>
                    
                    <div className="font-medium text-gray-600 dark:text-gray-400 text-xs">Min UP:</div>
                    <div className="text-gray-900 dark:text-gray-100 text-xs font-medium">{formatCurrency(item.MIN_UP, item.LKU_ID)}</div>
                    
                    <div className="font-medium text-gray-600 dark:text-gray-400 text-xs">Max UP:</div>
                    <div className="text-gray-900 dark:text-gray-100 text-xs font-medium">{formatCurrency(item.MAX_UP, item.LKU_ID)}</div>
                    
                    <div className="font-medium text-gray-600 dark:text-gray-400 text-xs">Min Premi:</div>
                    <div className="text-gray-900 dark:text-gray-100 text-xs font-medium">{formatCurrency(item.MIN_PREMIUM, item.LKU_ID)}</div>
                    
                    <div className="font-medium text-gray-600 dark:text-gray-400 text-xs">Max Premi:</div>
                    <div className="text-gray-900 dark:text-gray-100 text-xs font-medium">{formatCurrency(item.MAX_PREMIUM, item.LKU_ID)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {data.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Tidak ada data untuk ditampilkan
          </div>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-700 dark:bg-gray-600 text-white font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}