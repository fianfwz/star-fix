import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  fetchProductList,
  fetchPsetList,
  fetchProductFormula,
  fetchCombinedProductData,
  fetchTenagaPemasarList,
  fetchRiderList
} from '../api/productApi';
import { formatCurrency } from '../utils/formatCurrency';
import ModalFormula from './ModalFormula';
import InfoModal from './InfoModal';
import DetailPsetModal from './DetailPsetModal';
import LogoutButton from './LogoutButton';

// Hook untuk dark mode
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  return { isDark, toggleDarkMode };
};

// DarkModeToggle Component
const DarkModeToggle = ({ isDark, toggleDarkMode }) => (
  <button
    onClick={toggleDarkMode}
    className="p-1.5 sm:p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {isDark ? '☀️' : '🌙'}
  </button>
);

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
        className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-[95vw] sm:max-w-3xl shadow-xl border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {title || "Daftar Rider"}
        </h3>
        <div className="max-h-[50vh] sm:max-h-[60vh] border border-gray-200 dark:border-gray-700 rounded-md overflow-y-auto">
          {!showRiderList ? (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">TIDAK ADA RIDER</p>
          ) : loading ? (
            <p className="p-4 text-center text-gray-600 dark:text-gray-300">⏳ Memuat data...</p>
          ) : error ? (
            <p className="p-4 text-center text-red-600 dark:text-red-400 text-sm">❌ {error}</p>
          ) : data.length === 0 ? (
            <p className="p-4 text-center text-gray-500 dark:text-gray-400">Tidak ada data rider.</p>
          ) : (
            <div className="w-full">
              <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white p-3 font-semibold text-xs sm:text-sm">
                NAMA RIDER
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 text-gray-800 dark:text-gray-200 text-xs sm:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {item.NAMA_RIDER || "-"}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 sm:mt-6 text-right">
          <button
            onClick={onClose}
            className="px-3 sm:px-4 py-2 rounded-md bg-gray-700 dark:bg-gray-600 text-white font-medium hover:bg-gray-800 dark:hover:bg-gray-700 transition text-sm"
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
    <div>
      <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2 sm:mb-3">👨‍💼 Tenaga Pemasar</h4>
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {Number(lsbsId) !== 213 || Number(lsdbsNumber) !== 3 ? (
          <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Tidak ada data tenaga pemasar untuk produk ini
          </div>
        ) : loading ? (
          <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300">⏳ Memuat daftar tenaga pemasar...</div>
        ) : error ? (
          <div className="p-3 sm:p-4 text-xs sm:text-sm text-red-600 dark:text-red-400">❌ {error}</div>
        ) : data.length === 0 ? (
          <div className="p-3 sm:p-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">Tidak ada data tenaga pemasar.</div>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white p-2 sm:p-3 font-semibold text-xs sm:text-sm text-center">
              Nama Pemasar
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((row, idx) => (
                <div key={idx} className={`p-2 sm:p-3 text-xs sm:text-sm font-medium text-center text-gray-800 dark:text-gray-200 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                  {row.TENAGA_PEMASAR || '-'}
                </div>
              ))}
            </div>
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
  const [filterType, setFilterType] = useState('all'); // 'all', 'main', 'rider'
  const [psetIdFilter, setPsetIdFilter] = useState('');
  const [modalData, setModalData] = useState(null);
  const [infoModal, setInfoModal] = useState({ title: '', message: '' });
  const [detailPsetModal, setDetailPsetModal] = useState({ isOpen: false, data: [], title: '' });

  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);

  // Dark mode hook
  const { isDark, toggleDarkMode } = useDarkMode();

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingList(true);
      try {
        // Prepare filter payload based on current filter type
        let lsbs_id = "";
        if (filterType === 'main') {
          lsbs_id = "<=300";
        } else if (filterType === 'rider') {
          lsbs_id = ">=800";
        }

        const payload = {
          aktif: 1,
          lsbs_id: lsbs_id,
          pset_id: psetIdFilter.trim()
        };

        console.log('📤 Sending filter payload:', payload);

        const [list, psets] = await Promise.all([
          fetchProductList(payload),
          fetchPsetList()
        ]);
        
        console.log('📥 Received list:', list);
        
        if (!mounted) return;
        
        let filteredList = Array.isArray(list) 
          ? list.filter(product => 
              product.PSET_ID !== null && 
              product.PSET_ID !== undefined && 
              product.PSET_ID !== ''
            ) 
          : [];
        
        // Client-side filtering untuk LSBS_ID
        if (filterType === 'main') {
          filteredList = filteredList.filter(p => Number(p.LSBS_ID) <= 300);
          console.log('🔍 Client-side filter: Produk Utama (LSBS_ID <= 300)');
        } else if (filterType === 'rider') {
          filteredList = filteredList.filter(p => Number(p.LSBS_ID) >= 800);
          console.log('🔍 Client-side filter: Rider (LSBS_ID >= 800)');
        }
        
        // Client-side filtering untuk PSET_ID
        if (psetIdFilter.trim()) {
          const searchPsetId = psetIdFilter.trim();
          filteredList = filteredList.filter(p => {
            // Handle array PSET_ID
            if (Array.isArray(p.PSET_ID)) {
              return p.PSET_ID.some(id => String(id) === searchPsetId);
            }
            // Handle single PSET_ID
            return String(p.PSET_ID) === searchPsetId;
          });
          console.log(`🔍 Client-side filter: PSET_ID = ${searchPsetId}`);
        }
        
        console.log('✅ Final filtered list count:', filteredList.length);
        
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
  }, [filterType, psetIdFilter]);

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

  const handleShowPsetDetail = async (psetId) => {
    if (!psetId) return;
    await loadDetailForPset({ PSET_ID: psetId }, true);
  };

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return productOptions.filter(p =>
      p.LSBS_ID?.toString().includes(q) ||
      (p.LSDBS_NAME && p.LSDBS_NAME.toLowerCase().includes(q))
    );
  }, [productOptions, searchQuery]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header with Logout and Dark Mode */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-end gap-2">
          <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />
          <LogoutButton />
        </div>
      </div>

      <div className="container mx-auto p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          
          {/* Left panel */}
          <div className="xl:col-span-5 2xl:col-span-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex flex-col gap-2 mb-3 sm:mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-200">List Produk</h2>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="mb-3 sm:mb-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Semua Produk
                </button>
                <button
                  onClick={() => setFilterType('main')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filterType === 'main'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Produk Utama
                </button>
                <button
                  onClick={() => setFilterType('rider')}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filterType === 'rider'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Rider
                </button>
              </div>

              {/* PSET ID Filter */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={psetIdFilter}
                  onChange={(e) => setPsetIdFilter(e.target.value)}
                  placeholder="Filter by PSET ID..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                {psetIdFilter && (
                  <button
                    onClick={() => setPsetIdFilter('')}
                    className="px-3 py-2 rounded-lg bg-gray-500 dark:bg-gray-600 text-white text-xs sm:text-sm hover:bg-gray-600 dark:hover:bg-gray-700 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Search Input */}
            {/* <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari produk atau kode..."
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2 mb-3 sm:mb-4 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
            /> */}
            {loadingList && (
              <div className="text-center py-4 text-blue-700 dark:text-blue-400">
                <span className="px-2 py-1 text-xs text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full animate-pulse">
                  Memuat...
                </span>
              </div>
            )}
            <div className="max-h-[40vh] sm:max-h-[50vh] lg:max-h-[65vh] 2xl:max-h-[70vh] overflow-y-auto border rounded-lg border-gray-200 dark:border-gray-700">
              {/* Mobile Card View */}
              <div className="block sm:hidden">
                {filteredProducts.map((p, index) => (
                  <div
                    key={`${p.LSBS_ID}-${p.LSDBS_NUMBER}`}
                    onClick={() => handleRowClick(p)}
                    className={`p-3 cursor-pointer border-b last:border-b-0 border-gray-200 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition ${
                      p.LSDBS_AKTIF === 0 
                        ? 'bg-pink-100 dark:bg-pink-900' 
                        : index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-600 dark:text-gray-400">ID:</span>
                        <span className="text-gray-900 dark:text-gray-100">{p.LSBS_ID}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Number:</span>
                        <span className="text-gray-900 dark:text-gray-100">{p.LSDBS_NUMBER}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                        <div className="text-xs text-gray-800 dark:text-gray-200">
                          {p.LSDBS_NAME}
                        </div>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-600 dark:text-gray-400">PSET_ID:</span>
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-700 dark:text-gray-300">
                            {Array.isArray(p.PSET_ID) ? p.PSET_ID.join(', ') : (p.PSET_ID ?? '-')}
                          </span>
                          {p.PSET_ID && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handleShowPsetDetail(p.PSET_ID); }}
                              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs underline"
                            >
                              Detail
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block w-full">
                <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white sticky top-0 grid grid-cols-12 gap-1 p-2 text-xs font-semibold">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-2">NUM</div>
                  <div className="col-span-5">NAME</div>
                  <div className="col-span-3">PSET_ID</div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((p, index) => (
                    <div
                      key={`${p.LSBS_ID}-${p.LSDBS_NUMBER}`}
                      onClick={() => handleRowClick(p)}
                      className={`grid grid-cols-12 gap-1 p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition text-xs ${
                        p.LSDBS_AKTIF === 0 
                          ? 'bg-pink-100 dark:bg-pink-900' 
                          : index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'
                      }`}
                    >
                      <div className="col-span-2 text-gray-900 dark:text-gray-100 truncate" title={p.LSBS_ID}>
                        {p.LSBS_ID}
                      </div>
                      <div className="col-span-2 text-gray-900 dark:text-gray-100 truncate" title={p.LSDBS_NUMBER}>
                        {p.LSDBS_NUMBER}
                      </div>
                      <div className="col-span-5 font-medium text-gray-800 dark:text-gray-200">
                        <div className="break-words leading-tight">
                          {p.LSDBS_NAME}
                        </div>
                      </div>
                      <div className="col-span-3 space-y-1">
                        <div className="truncate text-gray-700 dark:text-gray-300" title={Array.isArray(p.PSET_ID) ? p.PSET_ID.join(', ') : (p.PSET_ID ?? '-')}>
                          {Array.isArray(p.PSET_ID) ? p.PSET_ID.join(', ') : (p.PSET_ID ?? '-')}
                        </div>
                        {p.PSET_ID && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleShowPsetDetail(p.PSET_ID); }}
                            className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                          >
                            Detail
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {filteredProducts.length === 0 && !loadingList && (
                <div className="p-4 sm:p-6 text-center text-gray-500 dark:text-gray-400 text-sm">Tidak ada produk ditemukan</div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="xl:col-span-7 2xl:col-span-8 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="h-full flex flex-col">
              {/* Header area */}
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                {selectedProduct && (
                  <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-200 break-words">
                    {selectedProduct.LSDBS_NAME}
                  </h3>
                )}
              </div>

              {/* Content area - scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                  {loadingDetail && (
                    <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400 text-sm sm:text-base">⏳ Memuat detail produk...</div>
                  )}

                  {!selectedProduct && !loadingDetail && (
                    <div className="text-center py-12 sm:py-16 text-gray-500 dark:text-gray-400 text-sm sm:text-base">👆 Pilih produk untuk melihat detail</div>
                  )}

                  {selectedProduct && detail.length > 0 && (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Product Detail */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">📊 Detail Produk</h4>
                        
                        {/* Mobile Card View */}
                        <div className="block lg:hidden space-y-3">
                          {detail.map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                              <div className="space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600 dark:text-gray-400">PSET_ID:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-900 dark:text-gray-100">{item.PSET_ID}</span>
                                    <button
                                      onClick={() => handleShowPsetDetail(item.PSET_ID)}
                                      className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs underline"
                                    >
                                      Detail
                                    </button>
                                  </div>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600 dark:text-gray-400">Period:</span>
                                  <span className="text-gray-900 dark:text-gray-100">{item.INSURED_PERIOD_MONTH}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600 dark:text-gray-400">MIN_UP:</span>
                                  <span className="text-gray-900 dark:text-gray-100 text-right">{formatCurrency(item.MIN_UP, selectedProduct?.LKU_ID)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600 dark:text-gray-400">MAX_UP:</span>
                                  <span className="text-gray-900 dark:text-gray-100 text-right">{formatCurrency(item.MAX_UP, selectedProduct?.LKU_ID)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600 dark:text-gray-400">MIN_PREMIUM:</span>
                                  <span className="text-gray-900 dark:text-gray-100 text-right">{formatCurrency(item.MIN_PREMIUM, selectedProduct?.LKU_ID)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600 dark:text-gray-400">MAX_PREMIUM:</span>
                                  <span className="text-gray-900 dark:text-gray-100 text-right">{formatCurrency(item.MAX_PREMIUM, selectedProduct?.LKU_ID)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600 dark:text-gray-400">LPF_COI_BASIC:</span>
                                  <span
                                    className="text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors text-right"
                                    onClick={() => handleCellClick('Detail LPF_COI Basic', 'LPF_COI_BASIC', item.LPF_COI_BASIC)}
                                  >
                                    {item.LPF_COI_BASIC}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-600 dark:text-gray-400">LPF_UP:</span>
                                  <span
                                    className="text-green-600 dark:text-green-400 underline cursor-pointer hover:text-green-800 dark:hover:text-green-300 transition-colors text-right"
                                    onClick={() => handleCellClick('Detail UP', 'LPF_UP', item.LPF_UP)}
                                  >
                                    {item.LPF_UP}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden lg:block border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto max-h-96">
                          <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white sticky top-0 grid grid-cols-8 gap-1 p-2 text-xs font-semibold">
                            <div className="col-span-1">PSET_ID</div>
                            <div className="col-span-1">PERIOD</div>
                            <div className="col-span-1">MIN_UP</div>
                            <div className="col-span-1">MAX_UP</div>
                            <div className="col-span-1">MIN_PREM</div>
                            <div className="col-span-1">MAX_PREM</div>
                            <div className="col-span-1">LPF_COI_BASIC</div>
                            <div className="col-span-1">LPF_UP</div>
                          </div>
                          <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {detail.map((item, idx) => (
                              <div key={idx} className={`grid grid-cols-8 gap-1 p-2 text-xs ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                <div className="col-span-1 text-gray-900 dark:text-gray-100">
                                  <div className="flex flex-col gap-1">
                                    <span className="font-medium">{item.PSET_ID}</span>
                                    <button
                                      onClick={() => handleShowPsetDetail(item.PSET_ID)}
                                      className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline"
                                    >
                                      Detail
                                    </button>
                                  </div>
                                </div>
                                <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={item.INSURED_PERIOD_MONTH}>
                                  {item.INSURED_PERIOD_MONTH}
                                </div>
                                <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={formatCurrency(item.MIN_UP, selectedProduct?.LKU_ID)}>
                                  {formatCurrency(item.MIN_UP, selectedProduct?.LKU_ID)}
                                </div>
                                <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={formatCurrency(item.MAX_UP, selectedProduct?.LKU_ID)}>
                                  {formatCurrency(item.MAX_UP, selectedProduct?.LKU_ID)}
                                </div>
                                <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={formatCurrency(item.MIN_PREMIUM, selectedProduct?.LKU_ID)}>
                                  {formatCurrency(item.MIN_PREMIUM, selectedProduct?.LKU_ID)}
                                </div>
                                <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={formatCurrency(item.MAX_PREMIUM, selectedProduct?.LKU_ID)}>
                                  {formatCurrency(item.MAX_PREMIUM, selectedProduct?.LKU_ID)}
                                </div>
                                <div
                                  className="col-span-1 text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors truncate"
                                  title={item.LPF_COI_BASIC}
                                  onClick={() => handleCellClick('Detail LPF COI Basic', 'LPF_COI_BASIC', item.LPF_COI_BASIC)}
                                >
                                  {item.LPF_COI_BASIC}
                                </div>
                                <div
                                  className="col-span-1 text-green-600 dark:text-green-400 underline cursor-pointer hover:text-green-800 dark:hover:text-green-300 transition-colors truncate"
                                  title={item.LPF_UP}
                                  onClick={() => handleCellClick('Detail UP', 'LPF_UP', item.LPF_UP)}
                                >
                                  {item.LPF_UP}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Rider Button */}
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button
                          onClick={() => setIsRiderModalOpen(true)}
                          className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                        >
                          <span>🏇</span>
                          <span>Lihat Daftar Rider</span>
                        </button>
                      </div>

                      {/* Investment Data */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">💰 Investment Data</h4>
                        <div className="border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                          {productInvest.length > 0 ? (
                            <div>
                              {/* Mobile Card View */}
                              <div className="block lg:hidden space-y-3 p-3">
                                {productInvest.map((item, idx) => (
                                  <div key={idx} className="border-b last:border-b-0 border-gray-200 dark:border-gray-700 pb-3 last:pb-0">
                                    <div className="space-y-2 text-xs sm:text-sm">
                                      <div className="flex justify-between">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">PSET_ID:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{item.PSET_ID}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">LJI_ID:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{item.LJI_ID}</span>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">LJI_INVEST:</span>
                                        <div className="text-gray-900 dark:text-gray-100 text-sm break-words">{item.LJI_INVEST}</div>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">JENIS:</span>
                                        <span className="text-gray-900 dark:text-gray-100">{item.JENIS}</span>
                                      </div>
                                      <div className="space-y-1">
                                        <span className="font-medium text-gray-600 dark:text-gray-400">LJI_DESC:</span>
                                        <div className="text-gray-900 dark:text-gray-100 text-sm break-words">{item.LJI_DESC}</div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Desktop Table View */}
                              <div className="hidden lg:block">
                                <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white grid grid-cols-5 gap-1 p-2 text-xs font-semibold">
                                  <div className="col-span-1">PSET_ID</div>
                                  <div className="col-span-1">LJI_ID</div>
                                  <div className="col-span-1">LJI_INVEST</div>
                                  <div className="col-span-1">JENIS</div>
                                  <div className="col-span-1">LJI_DESC</div>
                                </div>
                                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto">
                                  {productInvest.map((item, idx) => (
                                    <div key={idx} className={`grid grid-cols-5 gap-1 p-2 text-xs ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                      <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={item.PSET_ID}>
                                        {item.PSET_ID}
                                      </div>
                                      <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={item.LJI_ID}>
                                        {item.LJI_ID}
                                      </div>
                                      <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={item.LJI_INVEST}>
                                        {item.LJI_INVEST}
                                      </div>
                                      <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate" title={item.LJI_JENIS}>
                                        {item.JENIS}
                                      </div>
                                      <div className="col-span-1 text-gray-900 dark:text-gray-100 break-words whitespace-normal">
                                        {item.LJI_DESC}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 sm:p-6 text-gray-500 dark:text-gray-400 text-sm text-center">Tidak ada data investasi</div>
                          )}
                        </div>
                      </div>

                      {/* Tenaga Pemasar */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
                        <TenagaPemasar
                          lsbsId={selectedProduct.LSBS_ID}
                          lsdbsNumber={selectedProduct.LSDBS_NUMBER}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalData && <ModalFormula data={modalData} onClose={() => setModalData(null)} />}
      {infoModal.message && <InfoModal title={infoModal.title} message={infoModal.message} onClose={() => setInfoModal({ title: '', message: '' })} />}
      {detailPsetModal.isOpen && <DetailPsetModal isOpen={detailPsetModal.isOpen} onClose={() => setDetailPsetModal({ isOpen: false, data: [], title: '' })} data={detailPsetModal.data} title={detailPsetModal.title} />}
      {selectedProduct && <Rider isOpen={isRiderModalOpen} onClose={() => setIsRiderModalOpen(false)} title="Daftar Nama Rider" lsbsId={selectedProduct.LSBS_ID} lsdbsNumber={selectedProduct.LSDBS_NUMBER} />}
    </div>
  );
}