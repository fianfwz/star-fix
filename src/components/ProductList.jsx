import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchProductList,
  fetchPsetList,
  fetchProductFormula,
  fetchCombinedProductData,
  updateDetBisnis,
  fetchTenagaPemasarList,
  fetchRiderList
} from '../api/productApi';
import { formatCurrency } from '../utils/formatCurrency';
import ModalFormula from './ModalFormula';
import InfoModal from './InfoModal';
import DetailPsetModal from './DetailPsetModal';
import ModalEditPset from './ModalEditPset';

function Rider({ isOpen, onClose, title, lsbsId, lsdbsNumber }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const showRiderList = lsbsId === 213 && lsdbsNumber === 3;

  useEffect(() => {
    if (!isOpen) return;
    if (!showRiderList) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await fetchRiderList(lsbsId, lsdbsNumber);
        setData(result);
      } catch (err) {
        setError(err.message || "Gagal memuat data rider.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isOpen, showRiderList, lsbsId, lsdbsNumber]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-3xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
          {title || "Daftar Rider"}
        </h3>
        <div className="overflow-x-auto max-h-[50vh] sm:max-h-[60vh] border border-gray-200 rounded-md">
          {!showRiderList ? (
            <p className="p-4 text-center text-gray-500">TIDAK ADA RIDER</p>
          ) : loading ? (
            <p className="p-4 text-center text-gray-600">⏳ Memuat data...</p>
          ) : error ? (
            <p className="p-4 text-center text-red-600 text-sm">❌ {error}</p>
          ) : data.length === 0 ? (
            <p className="p-4 text-center text-gray-500">Tidak ada data rider.</p>
          ) : (
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white">
                <tr>
                  <th className="px-2 sm:px-3 py-2 text-left font-semibold text-xs sm:text-sm">NAMA RIDER</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, idx) => (
                  <tr
                    key={idx}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-2 sm:px-3 py-2 text-gray-800 text-xs sm:text-sm">{item.NAMA_RIDER || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-4 sm:mt-6 text-right">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-md bg-gray-700 text-white font-medium hover:bg-gray-800 transition text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

function TenagaPemasar({ lsbsId, lsdbsNumber }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    if (Number(lsbsId) !== 213 || Number(lsdbsNumber) !== 3) {
      setData([]);
      setError('');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchTenagaPemasarList(lsbsId, lsdbsNumber);
        const list = Array.isArray(res) ? res : (res?.data ?? []);
        if (!mounted) return;
        setData(list);
      } catch (err) {
        console.error('Gagal fetch TenagaPemasar:', err);
        if (!mounted) return;
        setError(err.message || 'Gagal memuat tenaga pemasar');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [lsbsId, lsdbsNumber]);

  return (
    <div className="mt-4 sm:mt-6">
      <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-2 sm:mb-3">👨‍💼 Tenaga Pemasar</h4>
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {Number(lsbsId) !== 213 || Number(lsdbsNumber) !== 3 ? (
          <div className="p-3 text-xs sm:text-sm text-gray-500">
            Tidak ada data tenaga pemasar untuk produk ini
          </div>
        ) : loading ? (
          <div className="p-3 text-xs sm:text-sm text-gray-600">⏳ Memuat daftar tenaga pemasar...</div>
        ) : error ? (
          <div className="p-3 text-xs sm:text-sm text-red-600">❌ {error}</div>
        ) : data.length === 0 ? (
          <div className="p-3 text-xs sm:text-sm text-gray-500">Tidak ada data tenaga pemasar.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white">
                <tr>
                  <th className="px-2 sm:px-4 py-2 text-center">Nama Pemasar</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 sm:px-4 py-2 font-medium text-center">{row.TENAGA_PEMASAR || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

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

  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingList(true);
      try {
        const [list, psets] = await Promise.all([fetchProductList(), fetchPsetList()]);
        if (!mounted) return;
        
        const filteredList = Array.isArray(list) 
          ? list.filter(product => 
              product.PSET_ID !== null && 
              product.PSET_ID !== undefined && 
              product.PSET_ID !== ''
            ) 
          : [];
        
        setProductOptions(filteredList);
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
    if (!prod || (!prod.PSET_ID && (!prod.LSBS_ID || !prod.LSDBS_NUMBER))) return;

    setLoadingDetail(true);
    try {
      const payload = prod.PSET_ID
        ? { pset_id: Number(prod.PSET_ID) }
        : { product_code: String(prod.LSBS_ID), plan: String(prod.LSDBS_NUMBER) };

      const json = await fetchCombinedProductData(payload);

      const productCalc = Array.isArray(json.product_calc) ? json.product_calc : [];
      let allProductInvest = [];

      if (productCalc.length > 0) {
        productCalc.forEach(calcItem => {
          if (Array.isArray(calcItem.product_invest)) {
            allProductInvest = [...allProductInvest, ...calcItem.product_invest];
          }
        });
      }

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
    if (!newPsetId) return alert('Pilih PSET_ID terlebih dahulu.');
    if (!selectedProduct) return alert('Pilih produk dulu.');

    try {
      const payload = {
        lsbs_id: selectedProduct.LSBS_ID,
        lsdbs_number: selectedProduct.LSDBS_NUMBER,
        pset_id: newPsetId,
      };
      await updateDetBisnis(payload);
      alert('PSET_ID berhasil diupdate.');
      setEditingPset(null);

      const updatedSelectedProduct = { ...selectedProduct, PSET_ID: newPsetId };
      setSelectedProduct(updatedSelectedProduct);

      setProductOptions(prev =>
        prev.map(product =>
          product.LSBS_ID === selectedProduct.LSBS_ID &&
          product.LSDBS_NUMBER === selectedProduct.LSDBS_NUMBER
            ? { ...product, PSET_ID: newPsetId }
            : product
        )
      );

      await handleRowClick(updatedSelectedProduct);
    } catch (err) {
      console.error(err);
      alert('Gagal update PSET_ID.');
    }
  };

  const handleEditPset = (item) => {
    setEditingPset({
      PSET_ID: item.PSET_ID,
      LSBS_ID: selectedProduct?.LSBS_ID || item.LSBS_ID,
      LSDBS_NUMBER: selectedProduct?.LSDBS_NUMBER || item.LSDBS_NUMBER
    });
  };

  const handleShowDetail = async (psetData) => {
    await loadDetailForPset(psetData, true);
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return productOptions.filter(p =>
      p.LSBS_ID?.toString().includes(q) ||
      (p.LSDBS_NAME && p.LSDBS_NAME.toLowerCase().includes(q))
    );
  }, [productOptions, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Left panel */}
        <div className="w-full xl:w-[36%] bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">List Produk</h2>
            {loadingList && (
              <span className="px-2 sm:px-3 py-1 text-xs text-blue-700 bg-blue-100 rounded-full animate-pulse">
                Memuat...
              </span>
            )}
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari produk atau kode..."
            className="w-full border border-gray-300 rounded-lg p-2 mb-3 sm:mb-4 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <div className="max-h-[40vh] sm:max-h-[50vh] lg:max-h-[60vh] overflow-auto border rounded-lg">
            <table className="min-w-full text-xs sm:text-sm">
              <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white sticky top-0">
                <tr>
                  <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left">LSBS_ID</th>
                  <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left">LSDBS_NUMBER</th>
                  <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left">LSDBS_NAME</th>
                  <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left">PSET_ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, index) => (
                  <tr
                    key={`${p.LSBS_ID}-${p.LSDBS_NUMBER}`}
                    onClick={() => handleRowClick(p)}
                    className={`cursor-pointer hover:bg-blue-200 transition ${
                      p.LSDBS_AKTIF === 0 
                        ? 'bg-pink-100' 
                        : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">{p.LSBS_ID}</td>
                    <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">{p.LSDBS_NUMBER}</td>
                    <td className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 font-medium ${p.LSDBS_AKTIF === 0 ? 'text-pink-700' : 'text-gray-800'}`}>
                      <div className="break-words">
                        {p.LSDBS_NAME}
                        {p.LSDBS_AKTIF === 0 && <span className="ml-1 sm:ml-2 text-xs text-pink-600 font-semibold">(NON-AKTIF)</span>}
                      </div>
                    </td>
                    <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                        <span className={p.LSDBS_AKTIF === 0 ? 'text-pink-700' : 'text-gray-700'}>
                          {Array.isArray(p.PSET_ID) ? p.PSET_ID.join(', ') : (p.PSET_ID ?? '-')}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditPset(p); }}
                          className="text-blue-500 hover:text-blue-700 text-xs underline whitespace-nowrap"
                        >
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && !loadingList && (
              <div className="p-4 sm:p-6 text-center text-gray-500 text-sm">Tidak ada produk ditemukan</div>
            )}
          </div>
        </div>

        {/* Right panel */}
        <div className="w-full xl:flex-1 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-md border border-gray-200">
          {loadingDetail && (
            <div className="text-center py-8 sm:py-12 text-gray-500 text-sm sm:text-base">⏳ Memuat detail produk...</div>
          )}

          {!selectedProduct && !loadingDetail && (
            <div className="text-center py-12 sm:py-16 text-gray-500 text-sm sm:text-base">👆 Pilih produk untuk melihat detail</div>
          )}

          {selectedProduct && detail.length > 0 && (
            <>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 break-words">{selectedProduct.LSDBS_NAME}</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full text-xs sm:text-sm">
                  <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white sticky top-0">
                    <tr>
                      <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">PSET_ID</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">INSURED_PERIOD_MONTH</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">MIN_UP</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">MAX_UP</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">MIN_PREMIUM</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">MAX_PREMIUM</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">LPF_COI_BASIC</th>
                      <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">LPF_UP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detail.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                            <span className="font-medium">{item.PSET_ID}</span>
                            <button
                              onClick={() => handleEditPset(item)}
                              className="text-orange-500 hover:text-orange-700 text-xs underline whitespace-nowrap"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                        <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">{item.INSURED_PERIOD_MONTH}</td>
                        <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 break-all">{formatCurrency(item.MIN_UP, selectedProduct?.LKU_ID)}</td>
                        <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 break-all">{formatCurrency(item.MAX_UP, selectedProduct?.LKU_ID)}</td>
                        <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 break-all">{formatCurrency(item.MIN_PREMIUM, selectedProduct?.LKU_ID)}</td>
                        <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 break-all">{formatCurrency(item.MAX_PREMIUM, selectedProduct?.LKU_ID)}</td>
                        <td
                          className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-blue-600 underline cursor-pointer break-all"
                          onClick={() => handleCellClick('Detail COI Basic', 'LPF_COI_BASIC', item.LPF_COI_BASIC)}
                        >
                          {item.LPF_COI_BASIC}
                        </td>
                        <td
                          className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-green-600 underline cursor-pointer break-all"
                          onClick={() => handleCellClick('Detail UP', 'LPF_UP', item.LPF_UP)}
                        >
                          {item.LPF_UP}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 sm:mt-4">
                <button
                  onClick={() => setIsRiderModalOpen(true)}
                  className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md text-sm sm:text-base"
                >
                  Lihat Daftar Rider 🏇
                </button>
              </div>
            </>
          )}

          {selectedProduct && (
            <div className="mt-4 sm:mt-6">
              <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-2">💰 Investment Data</h4>
              <div className="border rounded-lg">
                {productInvest.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-xs sm:text-sm">
                      <thead className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white sticky top-0">
                        <tr>
                          <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">PSET_ID</th>
                          <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">LJI_ID</th>
                          <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">LJI_INVEST</th>
                          <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">JENIS</th>
                          <th className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-left whitespace-nowrap">LJI_DESC</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productInvest.map((item, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">{item.PSET_ID}</td>
                            <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">{item.LJI_ID}</td>
                            <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 break-words">{item.LJI_INVEST}</td>
                            <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2">{item.JENIS}</td>
                            <td className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 break-words">{item.LJI_DESC}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-3 sm:p-4 text-gray-500 text-sm">Tidak ada data investasi</div>
                )}
              </div>
            </div>
          )}

          {selectedProduct && (
            <TenagaPemasar
              lsbsId={selectedProduct.LSBS_ID}
              lsdbsNumber={selectedProduct.LSDBS_NUMBER}
            />
          )}
        </div>
      </div>

      {/* Modals placed at the end of the return statement */}
      {modalData && <ModalFormula data={modalData} onClose={() => setModalData(null)} />}
      {infoModal.message && <InfoModal title={infoModal.title} message={infoModal.message} onClose={() => setInfoModal({ title: '', message: '' })} />}
      {detailPsetModal.isOpen && <DetailPsetModal isOpen={detailPsetModal.isOpen} onClose={() => setDetailPsetModal({ isOpen: false, data: [], title: '' })} data={detailPsetModal.data} title={detailPsetModal.title} />}
      {editingPset && <ModalEditPset isOpen={!!editingPset} onClose={() => setEditingPset(null)} onSave={handlePsetSave} onShowDetail={handleShowDetail} psetList={psetList} currentPset={editingPset} />}
      {selectedProduct && <Rider isOpen={isRiderModalOpen} onClose={() => setIsRiderModalOpen(false)} title="Daftar Nama Rider" lsbsId={selectedProduct.LSBS_ID} lsdbsNumber={selectedProduct.LSDBS_NUMBER} />}
    </div>
  );
}