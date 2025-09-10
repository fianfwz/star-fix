import React from 'react';

export default function InfoModal({ title = 'Informasi', message, onClose }) {
  if (!message) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-40"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg p-5 w-[90%] max-w-md shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-3 text-sm whitespace-pre-wrap">{message}</p>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
