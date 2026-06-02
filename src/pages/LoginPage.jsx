import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


export default function LoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await login({
                username,
                password,
            });
            navigate("/");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">

            {/* Glow Background */}
            <div className="absolute w-[500px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full top-[-150px] left-[-150px]" />

            <div className="absolute w-[400px] h-[400px] bg-blue-500/10 blur-[150px] rounded-full bottom-[-100px] right-[-100px]" />

            <div className="w-full max-w-md relative z-10">

            <div className="bg-[#111827]/95 border border-cyan-400/20 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(34,211,238,0.12)]">

                {/* Header */}
                <div className="text-center mb-8">

                <div className="w-20 h-20 mx-auto mb-5 rounded-3xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                    <span className="text-4xl">
                    🎵
                    </span>
                </div>

                <h1 className="text-3xl font-bold text-white">
                    Ciafy Admin
                </h1>

                <p className="text-gray-400 mt-2">
                    Inicia sesión para administrar tu catálogo musical
                </p>

                </div>

                <form
                onSubmit={handleLogin}
                className="space-y-5"
                >

                {/* Usuario */}
                <div>

                    <label className="block text-sm text-gray-300 mb-2">
                    Usuario
                    </label>

                    <input
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all disabled:opacity-50"
                    />

                </div>

                {/* Password */}
                <div>

                    <label className="block text-sm text-gray-300 mb-2">
                    Contraseña
                    </label>

                    <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    disabled={loading}
                    required
                    className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-500/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all disabled:opacity-50"
                    />

                </div>

                {/* Botón */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 rounded-2xl bg-cyan-500 text-black font-bold hover:bg-cyan-400 hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                    {loading && (
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    )}
                    {loading
                    ? "Ingresando..."
                    : "Ingresar"}

                </button>

                </form>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-cyan-500/10">

                <p className="text-center text-xs text-gray-500">
                    Plataforma administrativa de música
                </p>

                </div>

            </div>

            </div>

        </div>
    );
}