import React from 'react';
import { formatCurrency } from '../utils/formatCurrency';

export default function DetailPsetModal({ isOpen, onClose, data = [], title }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-2xl p-6 w-[95%] max-w-4xl shadow-2xl border border-pink-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500">
          {title || 'Detail PSET'}
        </h3>

        <div className="mt-4 overflow-x-auto max-h-[60vh] rounded-xl border border-orange-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-pink-300 to-orange-300 text-white">
                <th className="px-3 py-2 text-left font-semibold">PSET_ID</th>
                <th className="px-3 py-2 text-left font-semibold">INSURED_PERIOD_MONTH</th>
                <th className="px-3 py-2 text-left font-semibold">MIN_UP</th>
                <th className="px-3 py-2 text-left font-semibold">MAX_UP</th>
                <th className="px-3 py-2 text-left font-semibold">MIN_PREMIUM</th>
                <th className="px-3 py-2 text-left font-semibold">MAX_PREMIUM</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr
                  key={idx}
                  className={`transition-all duration-200 ${
                    idx % 2 === 0
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
                      : 'bg-gradient-to-r from-pink-50 to-yellow-50'
                  } hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100`}
                >
                  <td className="px-3 py-2 font-medium text-pink-700">{item.PSET_ID}</td>
                  <td className="px-3 py-2 text-orange-700">{item.INSURED_PERIOD_MONTH}</td>
                  <td className="px-3 py-2 text-pink-700">{formatCurrency(item.MIN_UP, item.LKU_ID)}</td>
                  <td className="px-3 py-2 text-orange-700">{formatCurrency(item.MAX_UP, item.LKU_ID)}</td>
                  <td className="px-3 py-2 text-pink-700">{formatCurrency(item.MIN_PREMIUM, item.LKU_ID)}</td>
                  <td className="px-3 py-2 text-orange-700">{formatCurrency(item.MAX_PREMIUM, item.LKU_ID)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-orange-400 
                       text-white font-semibold shadow-md hover:from-pink-500 hover:to-orange-500 
                       transform hover:scale-105 transition-all duration-200"
          >
            ✨ Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
