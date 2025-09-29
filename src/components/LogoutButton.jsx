import React from "react";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("rememberedUsername");

        window.location.href = "/";
};
    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Logout
        </button>
    );
};

export default LogoutButton;