import React from "react";

export default function ModalFormula({ data, onClose }) {
  if (!data || !Array.isArray(data.details)) return null;
  const { title, details } = data;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-[90%] max-w-3xl shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm table-auto border border-gray-200 rounded-md">
            <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white">
              <tr>
                <th className="px-3 py-2 text-left">LPF_ID</th>
                <th className="px-3 py-2 text-left">LPF_NAME</th>
                <th className="px-3 py-2 text-left">LPF_DESC</th>
              </tr>
            </thead>
            <tbody>
              {details.map((item, idx) => (
                <tr
                  key={idx}
                  className="border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  <td className="px-3 py-2">{item.LPF_ID ?? "-"}</td>
                  <td className="px-3 py-2">{item.LPF_NAME ?? "-"}</td>
                  <td className="px-3 py-2">{item.LPF_DESC ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
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