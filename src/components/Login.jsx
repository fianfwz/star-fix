import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  User,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Login = ({ onLogin }) => {
  // State untuk form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State untuk kondisi form
  const [formState, setFormState] = useState({
    loading: false,
    error: "",
    success: "",
    showPassword: false,
    rememberMe: false,
  });

  // State untuk validasi input
  const [validationErrors, setValidationErrors] = useState({});

  // Ambil data "ingat saya" dari localStorage
  useEffect(() => {
    const rememberedUsername = localStorage.getItem("remembered_username");
    const rememberedPassword = localStorage.getItem("remembered_password");

    if (rememberedUsername) {
      setFormData((prev) => ({ ...prev, username: rememberedUsername }));
      setFormState((prev) => ({ ...prev, rememberMe: true }));
    }
    if (rememberedPassword) {
      setFormData((prev) => ({ ...prev, password: rememberedPassword }));
    }
  }, []);

  // Handler input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormState((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (validationErrors[name]) {
        setValidationErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  // Validasi form
  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = "Username wajib diisi";
    } else if (formData.username.length < 3) {
      errors.username = "Username minimal 3 karakter";
    }

    if (!formData.password) {
      errors.password = "Password wajib diisi";
    } else if (formData.password.length < 4) {
      errors.password = "Password minimal 4 karakter";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Request login ke API
  const performLogin = async (username, password) => {
    try {
      const response = await fetch(
        "http://10.10.0.31:8020/api/pkg/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            timestamp: new Date().toISOString(),
          }),
        }
      );

      const text = await response.text();
      if (!text.trim()) throw new Error("Server mengembalikan respons kosong");

      const result = JSON.parse(text);
      if (!response.ok) throw new Error(result.message || `HTTP ${response.status}`);

      return result;
    } catch (err) {
      throw err;
    }
  };

  // Submit login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState((prev) => ({ ...prev, error: "", success: "" }));

    if (!validateForm()) return;

    setFormState((prev) => ({ ...prev, loading: true }));

    try {
      const result = await performLogin(formData.username, formData.password);

      if (result.success && result.data) {
        const { user, token, refreshToken } = result.data;

        // Simpan token ke localStorage
        localStorage.setItem("auth_token", token);
        localStorage.setItem("user_data", JSON.stringify(user));
        if (refreshToken) localStorage.setItem("refresh_token", refreshToken);

        // Simpan login jika "ingat saya"
        if (formState.rememberMe) {
          localStorage.setItem("remembered_username", formData.username);
          localStorage.setItem("remembered_password", formData.password);
        } else {
          localStorage.removeItem("remembered_username");
          localStorage.removeItem("remembered_password");
        }

        // Pesan sukses
        setFormState((prev) => ({
          ...prev,
          success: `Selamat datang, ${user.full_name || user.username}!`,
          loading: false,
        }));

        setTimeout(() => {
          if (onLogin) onLogin(user);
          else window.location.href = "/dashboard";
        }, 1500);
      } else {
        throw new Error(result.message || "Login gagal");
      }
    } catch (error) {
      let msg = "Terjadi kesalahan saat login";
      if (error.message.includes("401")) msg = "Username atau password salah";
      else if (error.message.includes("403")) msg = "Akses ditolak";
      else if (error.message.includes("500")) msg = "Kesalahan server";
      else if (error.message.includes("fetch")) msg = "Tidak dapat terhubung ke server";

      setFormState((prev) => ({ ...prev, error: msg, loading: false }));
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center min-h-screen
                 bg-gradient-to-br from-purple-700/40 via-pink-500/40 to-orange-400/40
                 backdrop-blur-sm p-4 overflow-hidden"
    >
      {/* Login Card */}
      <div className="relative w-full max-w-md mx-auto">
        <div
          className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50
                     backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20
                     p-8 animate-fade-in"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400
                         rounded-full flex items-center justify-center shadow-lg mb-6 animate-bounce-gentle"
            >
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h1>
            <p className="text-gray-600">Masuk ke akun Anda</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {formState.success && (
              <div
                className="flex items-center gap-3 p-4 bg-green-50 border border-green-200
                           text-green-700 rounded-xl animate-slide-down"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{formState.success}</span>
              </div>
            )}

            {/* Error Message */}
            {formState.error && (
              <div
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200
                           text-red-700 rounded-xl animate-slide-down"
              >
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{formState.error}</span>
              </div>
            )}

            {/* Username */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Masukkan username"
                  className="block w-full pl-12 pr-4 py-3 border rounded-xl text-gray-900
                             bg-white/80 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
              {validationErrors.username && (
                <p className="text-red-600 text-sm">{validationErrors.username}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                <input
                  type={formState.showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Masukkan password"
                  className="block w-full pl-12 pr-12 py-3 border rounded-xl text-gray-900
                             bg-white/80 border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-700"
                >
                  {formState.showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="text-red-600 text-sm">{validationErrors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formState.rememberMe}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Ingat saya</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formState.loading}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400
                         hover:from-purple-600 hover:via-pink-600 hover:to-orange-500
                         transition-all shadow-lg hover:shadow-xl"
            >
              {formState.loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              © 2025 Product Management System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
