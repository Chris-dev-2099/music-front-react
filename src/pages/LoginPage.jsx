import { useState } from "react";
import { login } from "../services/authService";

export default function LoginPage() {
    const [email, setEmail] = useState("admin@mail.com");
    const [password, setPassword] = useState("123456");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            await login({ email, password });
            window.location.href = "/";
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
        
        {/* Card */}
        <div className="w-full max-w-md bg-[#1f1f1f] border border-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-white">
            Iniciar Sesión
            </h2>
            <p className="text-sm text-gray-400 text-center mt-1">
            Panel administrativo de música
            </p>

            {/* Form */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
            
            {/* Email */}
            <div>
                <label className="block text-sm font-medium text-gray-300">
                Correo
                </label>
                <input
                type="email"
                placeholder="ejemplo@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>

            {/* Password */}
            <div>
                <label className="block text-sm font-medium text-gray-300">
                Contraseña
                </label>
                <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
                Ingresar
            </button>
            </form>

        </div>
        </div>
    );
}