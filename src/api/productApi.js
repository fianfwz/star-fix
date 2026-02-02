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
  console.log("📤 Request getProductFormula:", { lpf_id: productCode, plan });

  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getProductFormula", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lpf_id: productCode, plan }),
  });

  if (!res.ok) throw new Error("Failed to fetch product formula");

  const text = await res.text();
  console.log("🔎 Raw response getProductFormula:", text);

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
  console.log("📤 Request updateDetBisnis:", payload);

  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/updateDetBisnis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update DetBisnis");

  const text = await res.text();
  console.log("🔎 Raw response updateDetBisnis:", text);

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
  console.log("📤 Requesting rider list for:", { lsbs_id, lsdbs_number });
  
  try {
    const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getNamaRiderList", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lsbs_id, lsdbs_number }),
    });

    console.log("📡 Response status:", res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ API Error Response:", errorText);
      throw new Error(`Failed to fetch rider list: ${res.status} - ${errorText}`);
    }

    const text = await res.text();
    console.log("🔎 Raw response rider list API (first 500 chars):", text.substring(0, 500));
    
    if (!text || text.trim() === "") {
      throw new Error("Empty response from rider list API");
    }

    try {
      const parsed = JSON.parse(text);
      console.log("✅ Successfully parsed rider list data");
      
      // Debug: Tampilkan struktur data
      console.log("📊 Data type:", typeof parsed);
      console.log("📊 Is array?", Array.isArray(parsed));
      
      if (Array.isArray(parsed)) {
        console.log(`📊 Array length: ${parsed.length}`);
        if (parsed.length > 0) {
          console.log("📊 First item structure:", Object.keys(parsed[0]));
          console.log("📊 First item values:", parsed[0]);
          
          // Cek apakah ada LSBS_ID dan LSDBS_NUMBER
          const firstItem = parsed[0];
          console.log(`📊 Has LSBS_ID? ${'LSBS_ID' in firstItem} (value: ${firstItem.LSBS_ID})`);
          console.log(`📊 Has LSDBS_NUMBER? ${'LSDBS_NUMBER' in firstItem} (value: ${firstItem.LSDBS_NUMBER})`);
          console.log(`📊 Has NAMA_RIDER? ${'NAMA_RIDER' in firstItem} (value: ${firstItem.NAMA_RIDER})`);
          
          // Cari semua key yang ada
          console.log("🔍 All keys in first item:");
          Object.keys(firstItem).forEach(key => {
            console.log(`  ${key}: ${firstItem[key]} (${typeof firstItem[key]})`);
          });
        }
      } else if (parsed && typeof parsed === 'object') {
        console.log("📊 Object keys:", Object.keys(parsed));
        
        // Cari array di dalam object
        for (let key in parsed) {
          if (Array.isArray(parsed[key])) {
            console.log(`📊 Found array in key "${key}" with ${parsed[key].length} items`);
            if (parsed[key].length > 0) {
              console.log(`📊 First item in "${key}":`, parsed[key][0]);
            }
          }
        }
      }
      
      return parsed;
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      console.error("❌ Raw text that failed to parse:", text);
      
      // Coba cari data dalam teks
      if (text.includes('[') && text.includes(']')) {
        console.log("⚠️ Text contains array brackets, trying to extract...");
        try {
          // Coba ekstrak JSON dari teks
          const start = text.indexOf('[');
          const end = text.lastIndexOf(']') + 1;
          const jsonStr = text.substring(start, end);
          const extracted = JSON.parse(jsonStr);
          console.log("✅ Successfully extracted JSON from text");
          return extracted;
        } catch (extractError) {
          console.error("❌ Failed to extract JSON:", extractError);
        }
      }
      
      return { 
        message: text, 
        raw: true,
        error: parseError.message 
      };
    }
  } catch (error) {
    console.error("❌ fetchRiderList error:", error);
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
  console.log("🔎 Raw response tenaga pemasar API:", text);

  if (!text) throw new Error("Empty response from tenaga pemasar API");

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Error parsing JSON tenaga pemasar:", error);
    return { message: text };
  }
};
