import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const API_URL = "http://10.10.0.31:8020/api/pkg/product/authUser";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    error: "",
    success: "",
    showPassword: false,
    rememberMe: false,
  });

  // ✅ Cek apakah sudah login & rememberMe
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      window.location.href = "/products"; // langsung ke products
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormState((p) => ({ ...p, [name]: checked }));
    } else {
      setFormData((p) => ({ ...p, [name]: value }));
    }
  };

  const performLogin = async (username, password) => {
    const payloadVariants = [
      { Username: username, password: password },
      { username: username, password: password },
      { Username: username, Password: password },
      { user: username, pass: password },
      { login: username, password: password }
    ];

    for (let i = 0; i < payloadVariants.length; i++) {
      const payload = payloadVariants[i];
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "WebApp/1.0"
          },
          body: JSON.stringify(payload),
        });

        const rawText = await response.text();
        let parsed = {};
        try {
          parsed = rawText ? JSON.parse(rawText) : {};
        } catch {
          parsed = { __raw: rawText };
        }

        if (response.ok || response.status === 200) {
          return parsed;
        }

        if (response.status !== 401) {
          const errorMessage = parsed.message || parsed.error || parsed.detail || rawText || `HTTP ${response.status}`;
          throw new Error(errorMessage);
        }
      } catch (fetchError) {
        if (i === payloadVariants.length - 1) {
          throw fetchError;
        }
      }
    }

    throw new Error("Username atau password salah");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      setFormState((p) => ({ ...p, error: "Username harus diisi" }));
      return;
    }

    if (!formData.password.trim()) {
      setFormState((p) => ({ ...p, error: "Password harus diisi" }));
      return;
    }

    setFormState((p) => ({ ...p, error: "", success: "", loading: true }));

    try {
      const result = await performLogin(formData.username, formData.password);

      setFormState((p) => ({
        ...p,
        success: `Login sukses: ${formData.username}`,
        loading: false,
      }));

      // ✅ Simpan login di localStorage
      localStorage.setItem("isLoggedIn", "true");

      // ✅ Jika rememberMe dicentang, simpan juga username
      if (formState.rememberMe) {
        localStorage.setItem("rememberedUsername", formData.username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

      setTimeout(() => {
        if (onLogin) onLogin(result);
        else window.location.href = "/products";
      }, 500);
    } catch (error) {
      setFormState((p) => ({
        ...p,
        error: error.message || "Terjadi kesalahan saat login",
        loading: false,
      }));
    }
  };

  // ✅ Isi username dari rememberedUsername jika ada
  useEffect(() => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    if (rememberedUsername) {
      setFormData((p) => ({ ...p, username: rememberedUsername }));
      setFormState((p) => ({ ...p, rememberMe: true }));
    }
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Selamat Datang</h1>
          <p className="text-sm text-gray-600 mt-1">Masuk ke akun Anda</p>
        </div>

        {formState.success && (
          <div className="p-3 mb-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{formState.success}</span>
            </div>
          </div>
        )}

        {formState.error && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{formState.error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="pl-10 pr-3 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan username"
                disabled={formState.loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type={formState.showPassword ? "text" : "password"}
                className="pl-10 pr-12 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Masukkan password"
                disabled={formState.loading}
              />
              <button
                type="button"
                onClick={() =>
                  setFormState((p) => ({ ...p, showPassword: !p.showPassword }))
                }
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={formState.loading}
              >
                {formState.showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formState.rememberMe}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={formState.loading}
            />
            <label className="ml-2 text-sm text-gray-600">Ingat saya</label>
          </div>

          <button
            type="submit"
            disabled={formState.loading}
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {formState.loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
