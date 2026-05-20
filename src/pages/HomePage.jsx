import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getUser } from "../services/authService";

export default function HomePage() {
  const navigate = useNavigate();
  const user = getUser();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120] text-white overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-cyan-500/20 blur-3xl rounded-full" />
        <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-blue-600/20 blur-3xl rounded-full" />
      </div>

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-10 text-center">

        {/* HERO */}
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-5xl font-black leading-tight">
            Bienvenido a{" "}
            <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]">
              Ciafy
            </span>
            <span className="text-white">
              -Admin
            </span>
          </h1>

          <p className="mt-5 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Administra canciones, usuarios y el contenido de tu plataforma musical.
          </p>

        </div>

        {/* USER CARD */}
        <div className="mt-8 bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl px-6 py-5 flex items-center gap-5 shadow-[0_0_25px_rgba(34,211,238,0.1)]">

          {/* AVATAR */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-2xl font-bold shadow-[0_0_18px_rgba(34,211,238,0.7)]">
            {user?.nombre_usuario?.charAt(0) || "U"}
          </div>

          {/* INFO */}
          <div className="text-left">
            <h2 className="text-xl font-semibold text-white">
              {user?.nombre_usuario || "Usuario"}
            </h2>

            <p className="text-sm text-gray-400">
              {user?.correo}
            </p>

            <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full border ${
              user?.tipo_usuario === "admin"
                ? "bg-cyan-500/10 border-cyan-400/30 text-cyan-300"
                : "bg-blue-500/10 border-blue-400/30 text-blue-300"
            }`}>
              {user?.tipo_usuario}
            </span>
          </div>

        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl mt-12">

          {/* SONGS */}
          <div
            onClick={() => navigate("/songs")}
            className="group relative bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-hidden"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <div className="relative z-10">

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-2xl mb-5 shadow-[0_0_18px_rgba(34,211,238,0.15)]">
                🎵
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Canciones
              </h2>

              <p className="text-gray-400 leading-relaxed">
                Gestiona canciones, álbumes y contenido musical de forma rápida y organizada.
              </p>

            </div>

          </div>

          {/* USERS */}
          <div
            onClick={() => navigate("/users")}
            className="group relative bg-[#111827]/80 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] overflow-hidden"
          >

            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition" />

            <div className="relative z-10">

              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-2xl mb-5 shadow-[0_0_18px_rgba(59,130,246,0.2)]">
                👤
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">
                Usuarios
              </h2>

              <p className="text-gray-400 leading-relaxed">
                Administra usuarios, permisos y accesos dentro de la plataforma.
              </p>

            </div>

          </div>

        </div>

        {/* FOOTER INFO */}
        <div className="mt-14 max-w-2xl text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            Ciafy-Admin te permite controlar toda tu plataforma musical desde
            una interfaz moderna, segura y optimizada para administradores.
          </p>
        </div>

      </div>
    </div>
  );
}