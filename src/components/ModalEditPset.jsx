import React, { useEffect, useState } from 'react';
import DetailPsetModal from './DetailPsetModal'; // Import modal

export default function ModalEditPset({
  isOpen,
  onClose,
  currentPset,
  psetList = [],
  onSave
}) {
  const [selectedPsetId, setSelectedPsetId] = useState(currentPset?.PSET_ID || '');
  const [detailPsetModal, setDetailPsetModal] = useState({ isOpen: false, data: [], title: '' });

  useEffect(() => {
    setSelectedPsetId(currentPset?.PSET_ID || '');
  }, [currentPset]);

  if (!isOpen || !currentPset) return null;
  
  const handleShowDetail = async () => {
    const dummyData = [
      {
        PSET_ID: selectedPsetId,
        INSURED_PERIOD_MONTH: 12,
        MIN_UP: 10000000,
        MAX_UP: 500000000,
        MIN_PREMIUM: 100000,
        MAX_PREMIUM: 5000000,
        LKU_ID: 1 // Contoh: IDR
      }
    ];

    setDetailPsetModal({
      isOpen: true,
      data: dummyData,
      title: `Detail PSET ${selectedPsetId}`
    });
  };

  return (
    // Layer pertama (ModalEditPset) dengan z-index 50
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[90%] max-w-lg shadow-xl 
                   border border-gray-200 dark:border-gray-700 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          ✏️ Ubah PSET_ID
        </h3>
        <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
          Ubah PSET_ID <span className="font-semibold">{currentPset.PSET_ID}</span> ke:
        </p>

        <select
          value={selectedPsetId}
          onChange={(e) => setSelectedPsetId(e.target.value)}
          className="mt-4 w-full border border-gray-300 dark:border-gray-600 
                     focus:border-blue-400 rounded-lg p-3 text-sm 
                     bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                     focus:shadow-md transition-all duration-200"
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
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium 
                       hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                       transition-all duration-200"
          >
            ❌ Batal
          </button>
          <button
            onClick={handleShowDetail}
            className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold 
                       shadow-sm hover:bg-blue-600 transition-all duration-200"
          >
            🔍 Detail
          </button>
          <button
            onClick={() => {
              onSave(selectedPsetId);
            }}
            className="px-5 py-2 rounded-lg bg-green-500 text-white font-semibold 
                       shadow-sm hover:bg-green-600 transition-all duration-200"
          >
            💾 Simpan
          </button>
        </div>
      </div>
      
      {/* Layer kedua (DetailPsetModal) dengan z-index 60 */}
      <DetailPsetModal 
        isOpen={detailPsetModal.isOpen} 
        onClose={() => setDetailPsetModal({ isOpen: false, data: [], title: '' })} 
        data={detailPsetModal.data} 
        title={detailPsetModal.title} 
        className="z-[60]"
      />
    </div>
  );
}
