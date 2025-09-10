import React from 'react';

export default function ModalFormula({ data, onClose }) {
  if (!data || !Array.isArray(data.details)) return null;
  const { title, details } = data;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-2xl p-5 w-[90%] max-w-3xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm table-auto border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gradient-to-r from-pink-200 via-orange-200 to-yellow-200">
                <th className="px-3 py-2 text-left">LPF_ID</th>
                <th className="px-3 py-2 text-left">LPF_NAME</th>
                <th className="px-3 py-2 text-left">LPF_DESC</th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-b-0 hover:bg-gradient-to-r hover:from-orange-50 hover:via-pink-50 hover:to-yellow-50 transition"
                >
                  <td className="px-3 py-2">{item.LPF_ID ?? '-'}</td>
                  <td className="px-3 py-2">{item.LPF_NAME ?? '-'}</td>
                  <td className="px-3 py-2">{item.LPF_DESC ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-pink-400 via-orange-400 to-yellow-400 text-white font-medium hover:opacity-90 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
