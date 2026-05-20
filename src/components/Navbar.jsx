import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logout, getUser } from "../services/authService";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-[#0f172a] border-b border-cyan-500/20 px-4 py-3 flex items-center justify-between shadow-[0_0_25px_rgba(0,200,255,0.08)]">

      {/* LEFT */}
      <div className="flex items-center gap-6">

        {/* LOGO */}
        <h1
          onClick={() => navigate("/")}
          className="text-white font-bold text-2xl cursor-pointer tracking-wide transition hover:text-cyan-400"
        >
          <span className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
            Ciafy
          </span>
          <span className="text-white">
            -Admin
          </span>
        </h1>

        {/* NAV LINKS */}
        <div className="hidden sm:flex items-center gap-3 text-sm">

          <button
            onClick={() => navigate("/songs")}
            className={`px-4 py-2 rounded-xl transition-all duration-300 border ${
              isActive("/songs")
                ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                : "border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/5"
            }`}
          >
            🎵 Canciones
          </button>

          <button
            onClick={() => navigate("/users")}
            className={`px-4 py-2 rounded-xl transition-all duration-300 border ${
              isActive("/users")
                ? "bg-cyan-500/10 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)]"
                : "border-transparent text-gray-400 hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-cyan-500/5"
            }`}
          >
            👤 Usuarios
          </button>

        </div>
      </div>

      {/* RIGHT */}
      <div
        ref={dropdownRef}
        className="relative"
      >

        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-3 bg-[#111827] border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-[#172033] px-3 py-2 rounded-2xl transition-all duration-300 shadow-[0_0_15px_rgba(0,200,255,0.08)]"
        >

          {/* AVATAR */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold uppercase shadow-[0_0_15px_rgba(34,211,238,0.7)]">
            {user?.nombre_usuario?.charAt(0) || "U"}
          </div>

          {/* USER INFO */}
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm text-white font-semibold">
              {user?.nombre_usuario || "Usuario"}
            </span>

            <span className="text-xs text-gray-400 max-w-[180px] truncate">
              {user?.correo || "Sin correo"}
            </span>
          </div>

          <span className="text-cyan-400 text-sm">
            ▾
          </span>

        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 mt-3 w-64 bg-[#111827] border border-cyan-500/20 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.15)] overflow-hidden z-50 backdrop-blur-xl">

            {/* USER HEADER */}
            <div className="px-4 py-4 border-b border-cyan-500/10 bg-cyan-500/5">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white font-bold uppercase shadow-[0_0_15px_rgba(34,211,238,0.7)]">
                  {user?.nombre_usuario?.charAt(0) || "U"}
                </div>

                <div>
                  <p className="text-white font-semibold">
                    {user?.nombre_usuario}
                  </p>

                  <p className="text-sm text-gray-400">
                    {user?.correo}
                  </p>
                </div>

              </div>

              <span
                className={`inline-block mt-3 px-3 py-1 text-xs rounded-full border ${
                  user?.tipo_usuario === "admin"
                    ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
                    : "bg-blue-500/10 border-blue-400/30 text-blue-300"
                }`}
              >
                {user?.tipo_usuario}
              </span>

            </div>

            {/* LINKS */}
            <button
              onClick={() => {
                navigate("/songs");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all"
            >
              🎵 Gestionar canciones
            </button>

            <button
              onClick={() => {
                navigate("/users");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all"
            >
              👤 Gestionar usuarios
            </button>

            <div className="border-t border-cyan-500/10" />

            {/* LOGOUT */}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all"
            >
              🚪 Cerrar sesión
            </button>

          </div>
        )}

      </div>
    </div>
  );
}