// Ambil daftar produk
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

// Ambil formula produk berdasarkan product_code & plan
export const fetchProductFormula = async (productCode, plan) => {
  console.log(JSON.stringify({ product_code: productCode, plan }),"Request")
  const res = await fetch(
    "http://10.10.0.31:8020/api/pkg/product/getProductFormula",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lpf_id: productCode, plan }),
    }
  );

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
  const res = await fetch(
    "http://10.10.0.31:8020/api/pkg/product/getCombinedProductData",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
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
  const res = await fetch(
    "http://10.10.0.31:8020/api/pkg/product/updateDetBisnis",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) throw new Error("Failed to update DetBisnis");

  const text = await res.text();
  if (!text) throw new Error("Empty response from updateDetBisnis API");

  try {
    return JSON.parse(text);
  } catch {
    return text; // misal: "Update berhasil"
  }
};
