import React, { useEffect, useState } from 'react';

export default function ModalEditPset({
  isOpen,
  onClose,
  currentPset,
  psetList = [],
  onSave,
  onShowDetail
}) {
  const [selectedPsetId, setSelectedPsetId] = useState(currentPset?.PSET_ID || '');

  useEffect(() => {
    setSelectedPsetId(currentPset?.PSET_ID || '');
  }, [currentPset]);

  if (!isOpen || !currentPset) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl border border-orange-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
          ✏️ Ubah PSET_ID
        </h3>
        <p className="text-sm mt-2 text-orange-700">
          Ubah PSET_ID <span className="font-semibold">{currentPset.PSET_ID}</span> ke:
        </p>

        <select
          value={selectedPsetId}
          onChange={(e) => setSelectedPsetId(e.target.value)}
          className="mt-4 w-full border-2 border-orange-300 focus:border-pink-400 rounded-xl p-3 text-sm 
                     bg-gradient-to-r from-yellow-50 to-orange-50 focus:shadow-lg transition-all duration-300"
        >
          <option value="">-- Pilih PSET_ID --</option>
          {psetList.map((pset) => (
            <option key={pset.PSET_ID} value={pset.PSET_ID}>
              {pset.PSET_ID} {pset.PSET_DESC || ''}
            </option>
          ))}
        </select>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 text-slate-700 font-medium 
                       hover:bg-slate-300 transition-all duration-200"
          >
            ❌ Batal
          </button>
          <button
            onClick={() =>
              onShowDetail({
                PSET_ID: selectedPsetId,
                LSBS_ID: currentPset.LSBS_ID,
                LSDBS_NUMBER: currentPset.LSDBS_NUMBER,
              })
            }
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-orange-400 
                       text-white font-semibold shadow-md hover:from-pink-500 hover:to-orange-500 
                       transform hover:scale-105 transition-all duration-200"
          >
            🔍 Detail
          </button>
          <button
            onClick={() => {
              onSave(selectedPsetId);
            }}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-400 
                       text-white font-semibold shadow-md hover:from-yellow-500 hover:to-orange-500 
                       transform hover:scale-105 transition-all duration-200"
          >
            💾 Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
