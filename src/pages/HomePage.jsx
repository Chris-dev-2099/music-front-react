import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white">
      
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">

        {/* Logo / Title */}
        <div className="mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            🎧 Music Admin
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto">
            Panel administrativo para gestionar canciones y usuarios de tu plataforma musical.
          </p>
        </div>

        {/* Cards navegación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mt-6">
          
          {/* Songs */}
          <div
            onClick={() => navigate("/songs")}
            className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 cursor-pointer 
            hover:bg-[#252525] hover:scale-[1.02] transition-all shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">🎧 Canciones</h2>
            <p className="text-gray-400 text-sm">
              Gestiona, sube, edita y elimina canciones.
            </p>
          </div>

          {/* Users */}
          <div
            onClick={() => navigate("/users")}
            className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-6 cursor-pointer 
            hover:bg-[#252525] hover:scale-[1.02] transition-all shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">👤 Usuarios</h2>
            <p className="text-gray-400 text-sm">
              Administra usuarios, roles y accesos.
            </p>
          </div>

        </div>

        {/* Extra info */}
        <div className="mt-10 text-gray-500 text-xs max-w-md">
          <p>
            Usa este panel para mantener organizada tu plataforma musical. 
            Puedes subir nuevas canciones, editar información existente y controlar los accesos de los usuarios.
          </p>
        </div>

      </div>
    </div>
  );
}