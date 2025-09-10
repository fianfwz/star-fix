import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchProductList,
  fetchPsetList,
  fetchProductFormula,
  fetchCombinedProductData,
  updateDetBisnis
} from '../api/productApi';
import { formatCurrency } from '../utils/formatCurrency';
import ModalFormula from './ModalFormula';
import InfoModal from './InfoModal';
import DetailPsetModal from './DetailPsetModal';
import ModalEditPset from './ModalEditPset';

export default function ProductList() {
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detail, setDetail] = useState([]);
  const [productInvest, setProductInvest] = useState([]);
  const [psetList, setPsetList] = useState([]);

  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [modalData, setModalData] = useState(null);
  const [infoModal, setInfoModal] = useState({ title: '', message: '' });
  const [editingPset, setEditingPset] = useState(null);
  const [detailPsetModal, setDetailPsetModal] = useState({ isOpen: false, data: [], title: '' });

  // Load product list and pset list
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingList(true);
      try {
        const [list, psets] = await Promise.all([fetchProductList(), fetchPsetList()]);
        if (!mounted) return;
        setProductOptions(Array.isArray(list) ? list : []);
        setPsetList(Array.isArray(psets) ? psets : []);
      } catch (err) {
        console.error(err);
        setInfoModal({ title: 'Gagal Memuat Data', message: err.message || 'Error' });
      } finally {
        setLoadingList(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const loadDetailForPset = useCallback(async (prod, isForModal = false) => {
    if (!prod || (!prod.PSET_ID && (!prod.LSBS_ID || !prod.LSDBS_NUMBER))) {
      console.warn("Data tidak lengkap untuk load detail PSET.");
      return;
    }

    setLoadingDetail(true);
    try {
      const payload = prod.PSET_ID
        ? { pset_id: Number(prod.PSET_ID) }
        : { product_code: String(prod.LSBS_ID), plan: String(prod.LSDBS_NUMBER) };

      const json = await fetchCombinedProductData(payload);

      // Extract product_calc and product_invest (some responses nest invest inside product_calc)
      const productCalc = Array.isArray(json.product_calc) ? json.product_calc : [];
      let allProductInvest = [];

      if (productCalc.length > 0) {
        productCalc.forEach(calcItem => {
          if (Array.isArray(calcItem.product_invest)) {
            allProductInvest = [...allProductInvest, ...calcItem.product_invest];
          }
        });
      }

      // fallback: some APIs return product_invest top-level
      if (Array.isArray(json.product_invest) && allProductInvest.length === 0) {
        allProductInvest = json.product_invest;
      }

      if (isForModal) {
        setDetailPsetModal({
          isOpen: true,
          data: productCalc,
          title: `Detail PSET ${prod.PSET_ID ?? `${prod.LSBS_ID}-${prod.LSDBS_NUMBER}`}`
        });
      } else {
        setDetail(productCalc);
        setProductInvest(allProductInvest);
      }
    } catch (err) {
      console.error('Gagal load detail:', err);
      setInfoModal({ title: 'Gagal Memuat Detail Produk', message: err.message || 'Terjadi kesalahan' });
      if (!isForModal) {
        setDetail([]);
        setProductInvest([]);
      }
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  const handleRowClick = useCallback(async (prod) => {
    setSelectedProduct(prod);
    await loadDetailForPset(prod);
  }, [loadDetailForPset]);

  const handleCellClick = async (title, field, value) => {
    if (!selectedProduct || !value) return;
    try {
      const formulas = await fetchProductFormula(value);
      if (!formulas || (Array.isArray(formulas) && formulas.length === 0)) {
        setInfoModal({ title: 'Formula Tidak Ditemukan', message: 'Tidak ada data formula ditemukan.' });
        return;
      }
      setModalData({ title, details: Array.isArray(formulas) ? formulas : [formulas] });
    } catch (err) {
      console.error(err);
      setInfoModal({ title: 'Gagal Memuat Detail Formula', message: err.message || 'Error' });
    }
  };

  const handlePsetSave = async (newPsetId) => {
    if (!newPsetId) {
      alert('Pilih PSET_ID terlebih dahulu.');
      return;
    }
    if (!selectedProduct) {
      alert('Pilih produk dulu.');
      return;
    }

    try {
      const payload = {
        lsbs_id: selectedProduct.LSBS_ID,
        lsdbs_number: selectedProduct.LSDBS_NUMBER,
        pset_id: newPsetId,
      };
      await updateDetBisnis(payload);
      alert('PSET_ID berhasil diupdate.');
      setEditingPset(null);
      await handleRowClick({ ...selectedProduct, PSET_ID: newPsetId });
    } catch (err) {
      console.error(err);
      alert('Gagal update PSET_ID.');
    }
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return productOptions.filter(p =>
      p.LSBS_ID?.toString().includes(q) ||
      (p.LSDBS_NAME && p.LSDBS_NAME.toLowerCase().includes(q))
    );
  }, [productOptions, searchQuery]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 p-6">
      <div className="flex gap-6">
        {/* Left panel */}
        <div className="w-[36%] bg-white rounded-2xl p-6 shadow-xl border border-yellow-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              List Produk
            </h2>
            {loadingList && (
              <span className="px-3 py-1 text-sm text-orange-600 bg-orange-100 rounded-full animate-pulse">
                Memuat...
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk atau kode..."
              className="w-full border-2 border-yellow-300 focus:border-orange-400 rounded-xl p-3 text-sm 
                         bg-gradient-to-r from-yellow-50 to-orange-50 focus:shadow-lg transition-all duration-300
                         placeholder-orange-400"
            />
            <div className="absolute right-3 top-3 text-orange-400">
              🔍
            </div>
          </div>

          <div className="mt-6 max-h-[60vh] overflow-auto rounded-xl border border-yellow-200">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-300 to-orange-300 text-white">
                  <th className="px-4 py-3 text-left font-bold">LSBS_ID</th>
                  <th className="px-4 py-3 text-left font-bold">LSDBS_NUMBER</th>
                  <th className="px-4 py-3 text-left font-bold">LSDBS_NAME</th>
                  <th className="px-4 py-3 text-left font-bold">PSET_ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, index) => (
                  <tr
                    key={`${p.LSBS_ID}-${p.LSDBS_NUMBER}`}
                    onClick={() => handleRowClick(p)}
                    className={`cursor-pointer transition-all duration-200 
                              ${index % 2 === 0 
                                ? 'bg-gradient-to-r from-yellow-50 to-orange-50' 
                                : 'bg-gradient-to-r from-pink-50 to-yellow-50'
                              }
                              hover:bg-gradient-to-r hover:from-orange-200 hover:to-pink-200 
                              hover:shadow-md hover:scale-[1.02] active:scale-[0.98]`}
                  >
                    <td className="px-4 py-3 font-medium text-orange-700">{p.LSBS_ID}</td>
                    <td className="px-4 py-3 text-pink-700">{p.LSDBS_NUMBER}</td>
                    <td className="px-4 py-3 text-orange-800">{p.LSDBS_NAME}</td>
                    <td className="px-4 py-3 text-pink-600">
                      {Array.isArray(p.PSET_ID) ? p.PSET_ID.join(', ') : p.PSET_ID}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && !loadingList && (
              <div className="p-8 text-center">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-lg text-orange-600">Tidak ada produk ditemukan</p>
              </div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-xl border border-pink-200">
          {loadingDetail && (
            <div className="flex items-center justify-center p-8">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-4">⏳</div>
                <p className="text-lg text-pink-600">Memuat detail produk...</p>
              </div>
            </div>
          )}

          {!selectedProduct && !loadingDetail && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="text-6xl mb-4">👆</div>
                <p className="text-xl text-orange-600">Pilih produk untuk melihat detail</p>
              </div>
            </div>
          )}

          {selectedProduct && detail.length > 0 && (
            <>
              <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-500 mb-6">
                {selectedProduct.LSDBS_NAME}
              </h3>

              <div className="overflow-x-auto rounded-xl border border-pink-200">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-pink-300 to-orange-300 text-white">
                      <th className="px-4 py-3 text-left font-bold">PSET_ID</th>
                      <th className="px-4 py-3 text-left font-bold">INSURED_PERIOD_MONTH</th>
                      <th className="px-4 py-3 text-left font-bold">MIN_UP</th>
                      <th className="px-4 py-3 text-left font-bold">MAX_UP</th>
                      <th className="px-4 py-3 text-left font-bold">MIN_PREMIUM</th>
                      <th className="px-4 py-3 text-left font-bold">MAX_PREMIUM</th>
                      <th className="px-4 py-3 text-left font-bold">LPF_COI_BASIC</th>
                      <th className="px-4 py-3 text-left font-bold">LPF_UP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.map((item, idx) => (
                      <tr 
                        key={`${item.PSET_ID}-${idx}`} 
                        className={`transition-all duration-200 
                                  ${idx % 2 === 0 
                                    ? 'bg-gradient-to-r from-pink-50 to-orange-50' 
                                    : 'bg-gradient-to-r from-yellow-50 to-pink-50'
                                  }
                                  hover:bg-gradient-to-r hover:from-orange-100 hover:to-pink-100`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                setEditingPset({ ...item, index: idx }); 
                              }}
                              className="px-3 py-1 text-xs rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 
                                       text-white font-bold hover:from-yellow-500 hover:to-orange-500 
                                       transform hover:scale-110 transition-all duration-200 shadow-md"
                            >
                              ✏️ Edit
                            </button>
                            <span className="font-medium text-pink-700">{item.PSET_ID}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-orange-700">{item.INSURED_PERIOD_MONTH}</td>
                        <td className="px-4 py-3 text-pink-700">
                          {formatCurrency(item.MIN_UP, selectedProduct?.LKU_ID || item.LKU_ID)}
                        </td>
                        <td className="px-4 py-3 text-orange-700">
                          {formatCurrency(item.MAX_UP, selectedProduct?.LKU_ID || item.LKU_ID)}
                        </td>
                        <td className="px-4 py-3 text-pink-700">
                          {formatCurrency(item.MIN_PREMIUM, selectedProduct?.LKU_ID || item.LKU_ID)}
                        </td>
                        <td className="px-4 py-3 text-orange-700">
                          {formatCurrency(item.MAX_PREMIUM, selectedProduct?.LKU_ID || item.LKU_ID)}
                        </td>
                        <td
                          className="px-4 py-3 text-pink-600 underline cursor-pointer font-medium 
                                   hover:text-orange-600 hover:bg-yellow-100 transition-all duration-200 rounded"
                          onClick={() => handleCellClick('Detail COI Basic', 'LPF_COI_BASIC', item.LPF_COI_BASIC)}
                        >
                          {item.LPF_COI_BASIC}
                        </td>
                        <td
                          className="px-4 py-3 text-orange-600 underline cursor-pointer font-medium 
                                   hover:text-pink-600 hover:bg-yellow-100 transition-all duration-200 rounded"
                          onClick={() => handleCellClick('Detail UP', 'LPF_UP', item.LPF_UP)}
                        >
                          {item.LPF_UP}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Investment Data */}
          {selectedProduct && (
            <div className="mt-8">
              <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-4">
                💰 Investment Data
              </h4>
              <div className="rounded-xl border border-orange-200 overflow-hidden">
                {productInvest.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-orange-300 to-yellow-300 text-white">
                        <th className="px-4 py-3 text-left font-bold">PSET_ID</th>
                        <th className="px-4 py-3 text-left font-bold">LJI_ID</th>
                        <th className="px-4 py-3 text-left font-bold">LJI_INVEST</th>
                        <th className="px-4 py-3 text-left font-bold">JENIS</th>
                        <th className="px-4 py-3 text-left font-bold">LJI_DESC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productInvest.map((item, idx) => (
                        <tr 
                          key={`${item.PSET_ID}-${item.LJI_ID}-${idx}`} 
                          className={`transition-all duration-200 
                                    ${idx % 2 === 0 
                                      ? 'bg-gradient-to-r from-orange-50 to-yellow-50' 
                                      : 'bg-gradient-to-r from-yellow-50 to-pink-50'
                                    }
                                    hover:bg-gradient-to-r hover:from-orange-100 hover:to-yellow-100`}
                        >
                          <td className="px-4 py-3 font-medium text-orange-700">{item.PSET_ID}</td>
                          <td className="px-4 py-3 text-yellow-700">{item.LJI_ID}</td>
                          <td className="px-4 py-3 text-pink-700">{item.LJI_INVEST}</td>
                          <td className="px-4 py-3 text-orange-700">{item.JENIS}</td>
                          <td className="px-4 py-3 text-yellow-700">{item.LJI_DESC}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center bg-gradient-to-r from-orange-50 to-yellow-50">
                    <div className="text-4xl mb-4">📈</div>
                    <p className="text-lg text-orange-600">Tidak ada data investasi untuk produk ini</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalFormula data={modalData} onClose={() => setModalData(null)} />
      <InfoModal 
        title={infoModal.title} 
        message={infoModal.message} 
        onClose={() => setInfoModal({ title: '', message: '' })} 
      />
      <DetailPsetModal
        isOpen={detailPsetModal.isOpen}
        onClose={() => setDetailPsetModal({ isOpen: false, data: [], title: '' })}
        data={detailPsetModal.data}
        title={detailPsetModal.title}
      />
      <ModalEditPset
        isOpen={!!editingPset}
        currentPset={{ 
          ...editingPset, 
          LSBS_ID: selectedProduct?.LSBS_ID, 
          LSDBS_NUMBER: selectedProduct?.LSDBS_NUMBER 
        }}
        psetList={psetList}
        onClose={() => setEditingPset(null)}
        onSave={handlePsetSave}
        onShowDetail={(prod) => loadDetailForPset(prod, true)}
      />
    </div>
  );
}   