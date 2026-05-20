import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";

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
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-[#1f1f1f] border border-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-center text-white">
                    Iniciar Sesión
                </h2>

                <p className="text-sm text-gray-400 text-center mt-1">
                    Panel administrativo de música
                </p>

                <form
                    onSubmit={handleLogin}
                    className="mt-6 space-y-4"
                >

                    {/* Username */}
                    <div>

                        <label className="block text-sm font-medium text-gray-300">
                            Nombre de Usuario
                        </label>

                        <input
                            type="text"
                            placeholder="Ingresa tu nombre de usuario"
                            value={username}
                            onChange={(e) =>
                                setUsername(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            className="mt-1 w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
                            onChange={(e) =>
                                setPassword(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            className="mt-1 w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                            required
                        />

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >

                        {loading && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        )}

                        {
                            loading
                                ? "Ingresando..."
                                : "Ingresar"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}