import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchProductList,
  fetchPsetList,
  fetchProductFormula,
  fetchCombinedProductData,
  fetchTenagaPemasarList
} from '../api/productApi';
import { formatCurrency } from '../utils/formatCurrency';
import ModalFormula from './ModalFormula';
import InfoModal from './InfoModal';
import LogoutButton from './LogoutButton';
import Rider from './Rider';

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

const DarkModeToggle = ({ isDark, toggleDarkMode }) => (
  <button
    onClick={toggleDarkMode}
    className="p-1.5 sm:p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    {isDark ? '☀️' : '🌙'}
  </button>
);

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
  const [searchInput, setSearchInput] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [modalData, setModalData] = useState(null);
  const [infoModal, setInfoModal] = useState({ title: '', message: '' });
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [pendingRider, setPendingRider] = useState(null);
  const { isDark, toggleDarkMode } = useDarkMode();

  // Load product detail
  const loadProductDetail = useCallback(async (product) => {
    console.log("🎯 Loading product detail:", product);
    setSelectedProduct(product);
    setLoadingDetail(true);
    setDetail([]);
    setProductInvest([]);

    try {
      let payload;
      if (product.PSET_ID && product.PSET_ID !== '' && product.PSET_ID !== null) {
        const psetId = Array.isArray(product.PSET_ID) ? product.PSET_ID[0] : product.PSET_ID;
        payload = { pset_id: Number(psetId) };
      } else {
        payload = { 
          product_code: String(product.LSBS_ID), 
          plan: String(product.LSDBS_NUMBER) 
        };
      }

      console.log("📤 Fetching with payload:", payload);
      
      const json = await fetchCombinedProductData(payload);

      let productCalc = [];
      let allProductInvest = [];

      if (json.product_calc && Array.isArray(json.product_calc)) {
        productCalc = json.product_calc;
      } else if (json.calc && Array.isArray(json.calc)) {
        productCalc = json.calc;
      } else if (Array.isArray(json)) {
        productCalc = json;
      } else if (json.data && Array.isArray(json.data)) {
        productCalc = json.data;
      }

      if (productCalc.length > 0) {
        productCalc.forEach(calcItem => {
          if (calcItem.product_invest && Array.isArray(calcItem.product_invest)) {
            allProductInvest = [...allProductInvest, ...calcItem.product_invest];
          }
        });
      } else if (json.product_invest && Array.isArray(json.product_invest)) {
        allProductInvest = json.product_invest;
      }

      setDetail(productCalc);
      setProductInvest(allProductInvest);
      
    } catch (err) {
      console.error('Error loading product detail:', err);
      setInfoModal({
        title: 'Informasi',
        message: 'Data detail produk tidak tersedia atau belum ada di sistem.'
      });
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  // Handler klik row produk
  const handleRowClick = useCallback((product) => {
    loadProductDetail(product);
  }, [loadProductDetail]);

  // Handler klik rider dari modal - GUNAKAN DATA DARI RIDER.JSX
  const handleRiderClickFromModal = useCallback((riderData) => {
    console.log("🎯 Rider clicked from modal (ProductList):", riderData);
    
    // 1. Tutup modal
    setIsRiderModalOpen(false);
    
    // 2. Clear search
    setSearchInput('');
    
    // 3. Extract LSBS_ID dari debug atau langsung
    let lsbsId = riderData.LSBS_ID;
    let lsdbsNumber = riderData.LSDBS_NUMBER;
    
    // Jika ada _debug, gunakan nilai dari sana
    if (riderData._debug && riderData._debug.foundKeys) {
      lsbsId = riderData._debug.foundKeys.lsbsId || lsbsId;
      lsdbsNumber = riderData._debug.foundKeys.lsdbsNumber || lsdbsNumber;
    }
    
    console.log("📋 Extracted IDs:", { lsbsId, lsdbsNumber });
    
    // 4. Simpan pending rider dengan flag searchByName jika LSBS_ID/NUMBER dari fallback
    const shouldSearchByName = !riderData._debug?.foundKeys?.lsbsId || 
                                riderData._debug?.foundKeys?.lsbsId === riderData.LSBS_ID;
    
    setPendingRider({
      LSBS_ID: lsbsId,
      LSDBS_NUMBER: lsdbsNumber,
      LSDBS_NAME: riderData.LSDBS_NAME,
      PSET_ID: riderData.PSET_ID,
      searchByName: shouldSearchByName,
      originalName: riderData.LSDBS_NAME
    });
    
    // 5. Switch ke tab rider
    console.log("🔄 Switching to RIDER tab...");
    setFilterType('rider');
    
    console.log("✅ Pending rider set, searchByName:", shouldSearchByName);
  }, []);

  // Effect untuk handle pending rider setelah list dimuat
  useEffect(() => {
    console.log("🔍 useEffect triggered:", { 
      hasPendingRider: !!pendingRider, 
      filterType, 
      loadingList,
      productOptionsCount: productOptions.length 
    });
    
    if (!pendingRider) {
      console.log("⏭️ No pending rider, skipping");
      return;
    }
    
    if (filterType !== 'rider') {
      console.log("⏭️ Not on rider tab yet, current:", filterType);
      return;
    }
    
    if (loadingList) {
      console.log("⏭️ Still loading list, waiting...");
      return;
    }
    
    console.log("✅ All conditions met, processing pending rider:", pendingRider);
    
    // Tunggu list selesai dimuat
    const timer = setTimeout(() => {
      console.log("⏰ Timer executed, searching for rider in list...");
      
      let riderInList = null;
      
      // Cari rider berdasarkan ID atau nama
      if (pendingRider.searchByName) {
        console.log("🔍 Searching by name:", pendingRider.originalName);
        riderInList = productOptions.find(
          p => p.LSDBS_NAME && 
               p.LSDBS_NAME.toLowerCase() === pendingRider.originalName.toLowerCase()
        );
      } else {
        console.log("🔍 Searching by ID:", pendingRider.LSBS_ID, pendingRider.LSDBS_NUMBER);
        riderInList = productOptions.find(
          p => Number(p.LSBS_ID) === Number(pendingRider.LSBS_ID) && 
               Number(p.LSDBS_NUMBER) === Number(pendingRider.LSDBS_NUMBER)
        );
      }
      
      if (riderInList) {
        console.log("✅ Rider found in list:", riderInList);
        
        // Load detail rider LANGSUNG
        loadProductDetail(riderInList);
        
        // Scroll ke rider setelah detail dimuat
        setTimeout(() => {
          const element = document.querySelector(`[data-rider-id="${riderInList.LSBS_ID}-${riderInList.LSDBS_NUMBER}"]`);
          if (element) {
            console.log("📍 Scrolling to element");
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight
            element.classList.add('!bg-yellow-200', 'dark:!bg-yellow-800', 'ring-2', 'ring-yellow-500', 'shadow-lg');
            
            // Remove highlight
            setTimeout(() => {
              element.classList.remove('!bg-yellow-200', 'dark:!bg-yellow-800', 'ring-2', 'ring-yellow-500', 'shadow-lg');
            }, 3000);
          } else {
            console.log("⚠️ Element not found in DOM");
          }
        }, 500);
        
        // Clear pending rider
        setPendingRider(null);
      } else {
        console.log("❌ Rider NOT found in list");
        console.log("🔍 Searched for:", pendingRider.searchByName ? `Name: ${pendingRider.originalName}` : `ID: ${pendingRider.LSBS_ID}-${pendingRider.LSDBS_NUMBER}`);
        console.log("📋 Available riders:", productOptions.map(p => `${p.LSBS_ID}-${p.LSDBS_NUMBER}: ${p.LSDBS_NAME}`));
        setInfoModal({
          title: 'Rider Tidak Ditemukan',
          message: `Rider "${pendingRider.LSDBS_NAME || pendingRider.originalName}" tidak ditemukan dalam daftar.\n\nKemungkinan rider ini tidak memiliki PSET_ID.`
        });
        setPendingRider(null);
      }
    }, 1000); // Tambah delay jadi 1 detik
    
    return () => {
      console.log("🧹 Cleanup timer");
      clearTimeout(timer);
    };
  }, [pendingRider, filterType, loadingList, productOptions, loadProductDetail]);

  const handleCellClick = useCallback(async (title, field, value) => {
    if (!selectedProduct || !value) return;

    try {
      const formulas = await fetchProductFormula(value);
      
      if (!formulas || (Array.isArray(formulas) && formulas.length === 0)) {
        setInfoModal({ 
          title: 'Formula Tidak Ditemukan', 
          message: 'Tidak ada data formula ditemukan.' 
        });
        return;
      }
      
      setModalData({ 
        title, 
        details: Array.isArray(formulas) ? formulas : [formulas] 
      });
    } catch (err) {
      console.error('Error fetching formula:', err);
      setInfoModal({
        title: 'Informasi',
        message: 'Data formula tidak tersedia untuk produk ini.'
      });
    }
  }, [selectedProduct]);

  // Load product list
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoadingList(true);

      try {
        let lsbsCondition = "";
        if (filterType === 'main') {
          lsbsCondition = "<=300";
        } else if (filterType === 'rider') {
          lsbsCondition = ">=800";
        }

        const payload = {
          aktif: 1,
          lsbs_id: lsbsCondition
        };

        const [list, psets] = await Promise.all([
          fetchProductList(payload),
          fetchPsetList()
        ]);

        if (!mounted) return;

        let filteredList = Array.isArray(list)
          ? list.filter(p => p.PSET_ID != null && p.PSET_ID !== '')
          : [];

        if (filterType === 'main') {
          filteredList = filteredList.filter(p => Number(p.LSBS_ID) <= 300);
        } else if (filterType === 'rider') {
          filteredList = filteredList.filter(p => Number(p.LSBS_ID) >= 800);
        }

        if (searchInput.trim()) {
          const q = searchInput.toLowerCase().trim();
          filteredList = filteredList.filter(p => {
            const idMatch = String(p.LSBS_ID).includes(q);
            const numMatch = String(p.LSDBS_NUMBER).includes(q);
            const nameMatch = p.LSDBS_NAME?.toLowerCase().includes(q);
            const pset = p.PSET_ID ?? [];
            const psetMatch = Array.isArray(pset)
              ? pset.some(id => String(id).includes(q))
              : String(pset).includes(q);
            return idMatch || numMatch || nameMatch || psetMatch;
          });
        }

        console.log(`✅ Loaded ${filteredList.length} products for filter: ${filterType}`);
        
        setProductOptions(filteredList);
        setPsetList(Array.isArray(psets) ? psets : []);
      } catch (err) {
        console.error(err);
        setInfoModal({
          title: 'Gagal Memuat Data',
          message: err.message || 'Error'
        });
      } finally {
        setLoadingList(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [filterType, searchInput]);

  const filteredProducts = productOptions;
    
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3 flex items-center justify-end gap-2">
          <DarkModeToggle isDark={isDark} toggleDarkMode={toggleDarkMode} />
          <LogoutButton />
        </div>
      </div>

      <div className="container mx-auto p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 sm:gap-4 lg:gap-6">
          
          {/* LEFT PANEL - Product List */}
          <div className="xl:col-span-5 2xl:col-span-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6 shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex flex-col gap-2 mb-3 sm:mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-200">📚 List Produk</h2>
                {pendingRider && (
                  <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full animate-pulse">
                    🔍 Mencari...
                  </span>
                )}
              </div>
            </div>

            <div className="mb-3 sm:mb-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setFilterType('all');
                    setPendingRider(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filterType === 'all'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Semua Produk
                </button>
                <button
                  onClick={() => {
                    setFilterType('main');
                    setPendingRider(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filterType === 'main'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Produk Utama
                </button>
                <button
                  onClick={() => {
                    setFilterType('rider');
                    setPendingRider(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    filterType === 'rider'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  Rider
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search ID / NUM / NAME / PSET ID..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-xs sm:text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="px-3 py-2 rounded-lg bg-gray-500 dark:bg-gray-600 text-white text-xs sm:text-sm hover:bg-gray-600 dark:hover:bg-gray-700 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {loadingList && (
              <div className="text-center py-4 text-blue-700 dark:text-blue-400">
                <span className="px-2 py-1 text-xs text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 rounded-full animate-pulse">
                  Memuat{pendingRider ? ' dan mencari rider...' : '...'}
                </span>
              </div>
            )}
            
            <div className="max-h-[40vh] sm:max-h-[50vh] lg:max-h-[65vh] 2xl:max-h-[70vh] overflow-y-auto border rounded-lg border-gray-200 dark:border-gray-700">
              <div className="w-full">
                <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white sticky top-0 grid grid-cols-12 gap-1 p-2 text-xs font-semibold">
                  <div className="col-span-2">ID</div>
                  <div className="col-span-2">NUM</div>
                  <div className="col-span-5">NAME</div>
                  <div className="col-span-3">PSET_ID</div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((p, index) => {
                    const isPending = pendingRider && 
                      Number(p.LSBS_ID) === Number(pendingRider.LSBS_ID) && 
                      Number(p.LSDBS_NUMBER) === Number(pendingRider.LSDBS_NUMBER);
                    
                    return (
                      <div
                        key={`${p.LSBS_ID}-${p.LSDBS_NUMBER}`}
                        data-rider-id={`${p.LSBS_ID}-${p.LSDBS_NUMBER}`}
                        onClick={() => handleRowClick(p)}
                        className={`grid grid-cols-12 gap-1 p-2 cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900 transition-all duration-300 text-xs ${
                          isPending
                            ? 'bg-yellow-200 dark:bg-yellow-800 ring-2 ring-yellow-500 shadow-lg'
                            : p.LSDBS_AKTIF === 0
                              ? 'bg-pink-300 dark:bg-pink-900'
                              : index % 2 === 0
                                ? 'bg-white dark:bg-gray-800'
                                : 'bg-gray-50 dark:bg-gray-700'
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
                            {isPending && <span className="ml-1">🎯</span>}
                          </div>
                        </div>
                        <div className="col-span-3 truncate text-gray-700 dark:text-gray-300" title={Array.isArray(p.PSET_ID) ? p.PSET_ID.join(', ') : (p.PSET_ID ?? '-')}>
                          {Array.isArray(p.PSET_ID) ? p.PSET_ID.join(', ') : (p.PSET_ID ?? '-')}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {filteredProducts.length === 0 && !loadingList && (
                <div className="p-4 sm:p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  {filterType === 'rider' ? 'Tidak ada rider ditemukan' : 'Tidak ada produk ditemukan'}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL - Product Detail */}
          <div className="xl:col-span-7 2xl:col-span-8 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="h-full flex flex-col">
              <div className="p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 space-y-2">
                {selectedProduct && (
                  <>
                    <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800 dark:text-gray-200 break-words">
                      {selectedProduct.LSDBS_NAME}
                      {pendingRider && 
                       Number(selectedProduct.LSBS_ID) === Number(pendingRider.LSBS_ID) && 
                       Number(selectedProduct.LSDBS_NUMBER) === Number(pendingRider.LSDBS_NUMBER) && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                          🎯 Dari Modal
                        </span>
                      )}
                    </h3>
                    <div className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium">
                      PSET ID: {Array.isArray(selectedProduct.PSET_ID) ? selectedProduct.PSET_ID.join(', ') : (selectedProduct.PSET_ID ?? '-')}
                    </div>
                  </>
                )}
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
                  {loadingDetail && (
                    <div className="text-center py-8 sm:py-12 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                      ⏳ Memuat detail produk...
                    </div>
                  )}

                  {!selectedProduct && !loadingDetail && (
                    <div className="text-center py-12 sm:py-16 text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                      <div className="text-4xl mb-4">👆</div>
                      <div>Pilih produk untuk melihat detail</div>
                    </div>
                  )}

                  {selectedProduct && !loadingDetail && detail.length === 0 && productInvest.length === 0 && (
                    <div className="text-center py-12 sm:py-16 space-y-3">
                      <div className="text-4xl">📭</div>
                      <div className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                        Data detail produk tidak tersedia
                      </div>
                      <div className="text-gray-400 dark:text-gray-500 text-xs sm:text-sm">
                        Produk ini belum memiliki data detail atau investasi
                      </div>
                    </div>
                  )}

                  {selectedProduct && (detail.length > 0 || productInvest.length > 0) && (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Product Detail Table */}
                      {detail.length > 0 && (
                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
                          <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">📊 Detail Produk</h4>
                          
                          <div className="hidden lg:block border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto max-h-96">
                            <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white sticky top-0 grid grid-cols-7 gap-1 p-2 text-xs font-semibold">
                              <div className="col-span-1">PERIOD</div>
                              <div className="col-span-1">MIN_UP</div>
                              <div className="col-span-1">MAX_UP</div>
                              <div className="col-span-1">MIN_PREMI</div>
                              <div className="col-span-1">MAX_PREMI</div>
                              <div className="col-span-1">LPF_COI_BASIC</div>
                              <div className="col-span-1">LPF_UP</div>
                            </div>
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                              {detail.map((item, idx) => (
                                <div key={idx} className={`grid grid-cols-7 gap-1 p-2 text-xs ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                  <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate">
                                    {item.INSURED_PERIOD_MONTH || item.insured_period_month || '-'}
                                  </div>
                                  <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate">
                                    {formatCurrency(item.MIN_UP || item.min_up, selectedProduct?.LKU_ID)}
                                  </div>
                                  <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate">
                                    {formatCurrency(item.MAX_UP || item.max_up, selectedProduct?.LKU_ID)}
                                  </div>
                                  <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate">
                                    {formatCurrency(item.MIN_PREMIUM || item.min_premium, selectedProduct?.LKU_ID)}
                                  </div>
                                  <div className="col-span-1 text-gray-900 dark:text-gray-100 truncate">
                                    {formatCurrency(item.MAX_PREMIUM || item.max_premium, selectedProduct?.LKU_ID)}
                                  </div>
                                  <div
                                    className="col-span-1 text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300 transition-colors truncate"
                                    onClick={() => handleCellClick('Detail LPF COI Basic', 'LPF_COI_BASIC', item.LPF_COI_BASIC || item.lpf_coi_basic)}
                                  >
                                    {item.LPF_COI_BASIC || item.lpf_coi_basic || '-'}
                                  </div>
                                  <div
                                    className="col-span-1 text-green-600 dark:text-green-400 underline cursor-pointer hover:text-green-800 dark:hover:text-green-300 transition-colors truncate"
                                    onClick={() => handleCellClick('Detail UP', 'LPF_UP', item.LPF_UP || item.lpf_up)}
                                  >
                                    {item.LPF_UP || item.lpf_up || '-'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rider Button */}
                      {filterType !== 'rider' && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                          <button
                            onClick={() => setIsRiderModalOpen(true)}
                            className="px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <span> Lihat Daftar Rider</span>
                          </button>
                        </div>
                      )}

                      {/* Investment Data */}
                      <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 sm:p-4">
                        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">💰 Investment Data</h4>
                        <div className="border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
                          <div className="hidden lg:block">
                            <div className="bg-gradient-to-r from-blue-900 via-blue-700 to-blue-400 text-white grid grid-cols-5 gap-1 p-2 text-xs font-semibold">
                              <div className="col-span-1">PSET_ID</div>
                              <div className="col-span-1">LJI_ID</div>
                              <div className="col-span-1">LJI_INVEST</div>
                              <div className="col-span-1">JENIS</div>
                              <div className="col-span-1">LJI_DESC</div>
                            </div>
                            {productInvest.length > 0 ? (
                              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto">
                                {productInvest.map((item, idx) => (
                                  <div key={idx} className={`grid grid-cols-5 gap-1 p-2 text-xs ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                                    <div className="col-span-1 text-gray-900 dark:text-gray-100 break-words">{item.PSET_ID || item.pset_id || '-'}</div>
                                    <div className="col-span-1 text-gray-900 dark:text-gray-100 break-words">{item.LJI_ID || item.lji_id || '-'}</div>
                                    <div className="col-span-1 text-gray-900 dark:text-gray-100 break-words">{item.LJI_INVEST || item.lji_invest || '-'}</div>
                                    <div className="col-span-1 text-gray-900 dark:text-gray-100 break-words">{item.JENIS || item.jenis || '-'}</div>
                                    <div className="col-span-1 text-gray-900 dark:text-gray-100 break-words">{item.LJI_DESC || item.lji_desc || '-'}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="p-4 sm:p-6 text-gray-500 dark:text-gray-400 text-sm text-center bg-white dark:bg-gray-800">
                                Tidak ada data investasi untuk produk ini
                              </div>
                            )}
                          </div>
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
      
      {/* Rider Modal */}
      <Rider 
        isOpen={isRiderModalOpen} 
        onClose={() => setIsRiderModalOpen(false)} 
        title="Daftar Nama Rider" 
        lsbsId={selectedProduct?.LSBS_ID} 
        lsdbsNumber={selectedProduct?.LSDBS_NUMBER}
        onRiderClick={handleRiderClickFromModal}
      />
    </div>
  );
}