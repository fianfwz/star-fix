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

// Ambil data produk gabungan
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
export const fetchRiderList = async (lsbs_id, lsdbs_number) => {
  const res = await fetch("http://10.10.0.31:8020/api/pkg/product/getNamaRiderList", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lsbs_id, lsdbs_number }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch rider list: ${errorText}`);
  }

  const text = await res.text();
  console.log("🔎 Raw response rider list API:", text);

  if (!text) throw new Error("Empty response from rider list API");

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error("❌ Error parsing JSON rider list:", error);
    return { message: text };
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
