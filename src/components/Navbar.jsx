import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full bg-[#1f1f1f] border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      
      <div className="flex items-center gap-6">

        <h1 className="text-white font-bold text-lg cursor-pointer"
            onClick={() => navigate("/")}>
          🎧 Music Admin
        </h1>

        <div className="hidden sm:flex items-center gap-4 text-sm">
          
          <button
            onClick={() => navigate("/songs")}
            className={`px-3 py-1 rounded-md transition ${
              isActive("/songs")
                ? "bg-green-500/20 text-green-400"
                : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
            }`}
          >
            Canciones
          </button>

          <button
            onClick={() => navigate("/users")}
            className={`px-3 py-1 rounded-md transition ${
              isActive("/users")
                ? "bg-green-500/20 text-green-400"
                : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
            }`}
          >
            Usuarios
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-300 hover:text-white transition"
        >
          Usuario ▾
        </button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-lg overflow-hidden">
            
            <button
              onClick={() => {
                navigate("/songs");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
            >
              🎧 Canciones
            </button>

            <button
              onClick={() => {
                navigate("/users");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition"
            >
              👤 Usuarios
            </button>

            <div className="border-t border-gray-700" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition"
            >
              🚪 Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}