import { useEffect, useState } from "react";
import {
  getSongs,
  deleteSong,
  createSong,
  updateSong,
} from "../services/soungsServices";

export default function SongsTable() {
    const [songs, setSongs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newSong, setNewSong] = useState({
        title: "",
        artist: "",
        file: "",
        genre: "",
    });

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ title: "", artist: "", genre: "" });

    const loadSongs = async () => {
        const data = await getSongs();
        setSongs(data);
    };

    useEffect(() => {
        const fetchSongs = async () => {
            const data = await getSongs();
            setSongs(data);
        };

        fetchSongs();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("¿Eliminar canción?")) return;
        await deleteSong(id);
        loadSongs();
    };

    const startEdit = (song) => {
        setEditingId(song.id);
        setEditData({
            title: song.title,
            artist: song.artist,
            genre: song.genre,
        });
    };

    const handleUpdate = async (id) => {
        await updateSong(id, editData);
        setEditingId(null);
        loadSongs();
    };

    return (
        <>
            <div className="bg-[#1f1f1f] border border-gray-800 rounded-2xl p-5 shadow-lg">

                {/* HEADER */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-white text-xl font-semibold tracking-tight">
                    🎧 Canciones
                    </h2>

                    <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 px-4 py-2 rounded-lg text-white cursor-pointer
                        hover:bg-green-600 active:scale-95 transition flex items-center gap-2"
                    >
                    + Agregar
                    </button>
                </div>

                {/* TABLA */}
                <div className="overflow-x-auto rounded-xl border border-gray-800">
                    <table className="w-full text-left text-sm text-gray-300">
                    
                    {/* HEADER TABLA */}
                    <thead className="bg-[#181818] text-gray-400 uppercase text-xs tracking-wider">
                        <tr>
                        <th className="py-3 px-4">Título</th>
                        <th className="py-3 px-4">Artista</th>
                        <th className="py-3 px-4">Género</th>
                        <th className="py-3 px-4">Preview</th>
                        <th className="py-3 px-4 text-right">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {songs.map((song) => (
                        <tr
                            key={song.id}
                            className="border-b border-gray-800 hover:bg-[#252525] transition-colors duration-200"
                        >
                            {/* ✏️ EDIT MODE */}
                            {editingId === song.id ? (
                            <>
                                <td className="px-4 py-3">
                                <input
                                    value={editData.title}
                                    onChange={(e) =>
                                    setEditData({ ...editData, title: e.target.value })
                                    }
                                    className="w-full bg-[#2a2a2a] border border-gray-700 px-2 py-1 rounded 
                                    focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                </td>

                                <td className="px-4 py-3">
                                <input
                                    value={editData.artist}
                                    onChange={(e) =>
                                    setEditData({ ...editData, artist: e.target.value })
                                    }
                                    className="w-full bg-[#2a2a2a] border border-gray-700 px-2 py-1 rounded 
                                    focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                </td>

                                <td className="px-4 py-3 text-gray-500">—</td>

                                <td className="px-4 py-3 text-right space-x-2">
                                <button
                                    onClick={() => handleUpdate(song.id)}
                                    className="px-3 py-1 rounded-md bg-green-500 text-white text-xs 
                                    hover:bg-green-600 transition cursor-pointer"
                                >
                                    Guardar
                                </button>

                                <button
                                    onClick={() => setEditingId(null)}
                                    className="px-3 py-1 rounded-md bg-gray-600 text-white text-xs 
                                    hover:bg-gray-500 transition cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                </td>
                            </>
                            ) : (
                            <>
                                <td className="px-4 py-3 font-medium text-white">
                                {song.title}
                                </td>

                                <td className="px-4 py-3 text-gray-400">
                                {song.artist}
                                </td>

                                <td className="px-4 py-3 text-gray-400">
                                {song.genre || "—"}
                                </td>

                                <td className="px-4 py-3">
                                {song.file ? (
                                    <audio
                                    controls
                                    src={song.file}
                                    className="h-8 opacity-80 hover:opacity-100 transition"
                                    />
                                ) : (
                                    <span className="text-gray-500">Sin archivo</span>
                                )}
                                </td>

                                <td className="px-4 py-3 text-right space-x-2">
                                <button
                                    onClick={() => startEdit(song)}
                                    className="px-3 py-1 rounded-md bg-blue-500/20 text-blue-400 text-xs cursor-pointer
                                    hover:bg-blue-500 hover:text-white transition"
                                >
                                    Editar
                                </button>

                                <button
                                    onClick={() => handleDelete(song.id)}
                                    className="px-3 py-1 rounded-md bg-red-500/20 text-red-400 text-xs cursor-pointer
                                    hover:bg-red-500 hover:text-white transition"
                                >
                                    Eliminar
                                </button>
                                </td>
                            </>
                            )}
                        </tr>
                        ))}
                    </tbody>

                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                    className="bg-[#1f1f1f] w-full max-w-md rounded-2xl p-6 border border-gray-800 shadow-2xl transform transition-all scale-100 animate-fadeIn"
                    onClick={(e) => e.stopPropagation()}
                    >
                    
                    {/* Header */}
                    <h3 className="text-white text-xl font-semibold mb-5">
                        Nueva Canción
                    </h3>

                    <form
                        onSubmit={async (e) => {
                        e.preventDefault();

                        if (!newSong.title || !newSong.artist) return;

                        await createSong(newSong);

                        setNewSong({ title: "", artist: "", file: "" });
                        setIsModalOpen(false);
                        loadSongs();
                        }}
                        className="space-y-5"
                    >
                        {/* INPUTS */}
                        <input
                        type="text"
                        placeholder="Título"
                        value={newSong.title}
                        onChange={(e) =>
                            setNewSong({ ...newSong, title: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg 
                            placeholder-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                            hover:border-gray-500 transition"
                        />

                        <input
                        type="text"
                        placeholder="Artista"
                        value={newSong.artist}
                        onChange={(e) =>
                            setNewSong({ ...newSong, artist: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg 
                            placeholder-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                            hover:border-gray-500 transition"
                        />

                        <input
                        type="text"
                        placeholder="Género"
                        value={newSong.genre}
                        onChange={(e) =>
                            setNewSong({ ...newSong, genre: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-700 text-white rounded-lg 
                            placeholder-gray-500 
                            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                            hover:border-gray-500 transition"
                        />

                        {/* FILE INPUT estilizado */}
                        <label className="block">
                        <span className="text-sm text-gray-400">Archivo de audio</span>

                        <div className="mt-1 flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-green-500 hover:bg-[#2a2a2a] transition">
                            <span className="text-sm text-gray-400">
                            Haz clic para subir o arrastra un archivo
                            </span>
                            <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files[0];

                                if (!file) return;

                                if (!file.type.startsWith("audio/")) {
                                alert("Solo se permiten archivos de audio");
                                return;
                                }

                                const fileUrl = URL.createObjectURL(file);

                                setNewSong({
                                ...newSong,
                                file: fileUrl,
                                });
                            }}
                            />
                        </div>
                        </label>

                        {/* Preview */}
                        {newSong.file && (
                        <div className="bg-[#2a2a2a] p-3 rounded-lg border border-gray-700">
                            <p className="text-xs text-gray-400 mb-2">Preview:</p>
                            <audio controls src={newSong.file} className="w-full" />
                        </div>
                        )}

                        {/* BOTONES */}
                        <div className="flex justify-end gap-2 pt-3">
                        <button
                            type="button"
                            onClick={() => {
                            setIsModalOpen(false);
                            setNewSong({ title: "", artist: "", file: "" });
                            }}
                            className="px-4 py-2 rounded-lg bg-gray-700 text-white 
                            hover:bg-gray-600 transition"
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-green-500 text-white 
                            hover:bg-green-600 active:scale-95 transition"
                        >
                            Guardar
                        </button>
                        </div>
                    </form>
                    </div>
                </div>
            )}
        </>
    );
}