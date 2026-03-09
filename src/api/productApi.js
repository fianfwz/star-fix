export const fetchProductList = async () => {
  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getProductList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) throw new Error("Failed to fetch product list");

  const text = await res.text();
  if (!text) throw new Error("Empty response from product list API");

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

// Ambil daftar PSET
export const fetchPsetList = async () => {
  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getPsetList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  if (!res.ok) throw new Error("Failed to fetch PSET list");

  const text = await res.text();
  if (!text) throw new Error("Empty response from PSET list API");

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

// Ambil formula produk
export const fetchProductFormula = async (productCode, plan) => {

  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getProductFormula", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lpf_id: productCode, plan }),
  });

  if (!res.ok) throw new Error("Failed to fetch product formula");

  const text = await res.text();

  if (!text) throw new Error("Empty response from product formula API");

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

export const fetchCombinedProductData = async (payload = {}) => {
  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getCombinedProductData", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to fetch combined product data");

  const text = await res.text();
  if (!text) throw new Error("Empty response from combined product API");

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
};

// Update DetBisnis
export const updateDetBisnis = async (payload) => {
  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/updateDetBisnis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update DetBisnis");

  const text = await res.text();

  if (!text) throw new Error("Empty response from updateDetBisnis API");

  try {
    return JSON.parse(text);
  } catch {
    return { message: text }; // fallback kalau response plain text
  }
};

// Rider List
// Rider List - DIPERBAIKI dengan debugging
export const fetchRiderList = async (lsbs_id, lsdbs_number) => {
  
  try {
    const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getNamaRiderList", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lsbs_id, lsdbs_number }),
    });

    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch rider list: ${res.status} - ${errorText}`);
    }

    const text = await res.text();
    
    if (!text || text.trim() === "") {
      throw new Error("Empty response from rider list API");
    }

    try {
      const parsed = JSON.parse(text);
     
      
      if (Array.isArray(parsed)) {
        if (parsed.length > 0) {
         
          // Cek apakah ada LSBS_ID dan LSDBS_NUMBER
          const firstItem = parsed[0];
        
          // Cari semua key yang ada
          Object.keys(firstItem).forEach(key => {
          });
        }
      } else if (parsed && typeof parsed === 'object') {
        
        // Cari array di dalam object
        for (let key in parsed) {
          if (Array.isArray(parsed[key])) {
            if (parsed[key].length > 0) {
            }
          }
        }
      }
      
      return parsed;
    } catch (parseError) {
      
      // Coba cari data dalam teks
      if (text.includes('[') && text.includes(']')) {
        try {
          // Coba ekstrak JSON dari teks
          const start = text.indexOf('[');
          const end = text.lastIndexOf(']') + 1;
          const jsonStr = text.substring(start, end);
          const extracted = JSON.parse(jsonStr);
          return extracted;
        } catch (extractError) {
        }
      }
      
      return { 
        message: text, 
        raw: true,
        error: parseError.message 
      };
    }
  } catch (error) {
    throw error;
  }
};
// Tenaga Pemasar List
export const fetchTenagaPemasarList = async (lsbs_id, lsdbs_number) => {
  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getTenagaPemasarList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lsbs_id, lsdbs_number }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch tenaga pemasar list: ${errorText}`);
  }

  const text = await res.text();

  if (!text) throw new Error("Empty response from tenaga pemasar API");

  try {
    return JSON.parse(text);
  } catch (error) {
    return { message: text };
  }
};
