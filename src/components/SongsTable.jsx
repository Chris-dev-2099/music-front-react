import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSongs,
  uploadSong,
  deleteSong,
  downloadSong,
} from "../services/soungsServices";

export default function SongsTable() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] =
    useState(false);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [songToDelete, setSongToDelete] =
    useState(null);

  const [newSong, setNewSong] = useState({
    nombre_cancion: "",
    artista_cancion: "",
    genero: "",
    file: null,
    image: null,
    preview: "",
    imagePreview: "",
  });

  const loadSongs = async () => {
    try {
      setLoading(true);

      const response = await getSongs();

      setSongs(response.data || []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

    useEffect(() => {
        const fetchSongs = async () => {
            await loadSongs();
        };
        fetchSongs();
    }, []);

  const handleDelete = async () => {
    if (!songToDelete) return;

    try {
      await deleteSong(
        songToDelete.id_cancion
      );

      setSongs((prev) =>
        prev.filter(
          (song) =>
            song.id_cancion !==
            songToDelete.id_cancion
        )
      );

      toast.success("Canción eliminada");

      setSongToDelete(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownload = async (
    archivoKey
  ) => {
    try {
      const blob = await downloadSong(
        archivoKey
      );

      const url =
        window.URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download = archivoKey;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Descarga iniciada");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetForm = () => {
    setNewSong({
      nombre_cancion: "",
      artista_cancion: "",
      genero: "",
      file: null,
      image: null,
      preview: "",
      imagePreview: "",
    });
  };

  const handleUploadSong = async (e) => {
    e.preventDefault();

    try {
      if (
        !newSong.nombre_cancion ||
        !newSong.artista_cancion ||
        !newSong.genero ||
        !newSong.file
      ) {
        toast.error(
          "Todos los campos son obligatorios"
        );

        return;
      }

      await uploadSong({
        nombre_cancion:
          newSong.nombre_cancion,
        artista_cancion:
          newSong.artista_cancion,
        genero: newSong.genero
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        file: newSong.file,
        imagen: newSong.image,
      });

      setIsModalOpen(false);

      resetForm();

      await loadSongs();

      toast.success(
        "Canción subida correctamente"
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className="bg-[#111827]/95 border border-cyan-400/20 rounded-3xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.08)] backdrop-blur-xl">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-white text-2xl font-bold tracking-tight">
              🎵 Canciones
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Administra el catálogo
              musical de Ciafy
            </p>
          </div>

          <button
            onClick={() =>
              setIsModalOpen(true)
            }
            className="bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 px-5 py-2.5 rounded-xl font-medium cursor-pointer hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-300"
          >
            + Agregar
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-cyan-400/20 bg-[#0f172a]/70 shadow-inner shadow-cyan-500/5">

          <table className="w-full text-left text-sm text-gray-300">

            {/* HEAD */}
            <thead className="bg-[#0f172a] text-gray-400 uppercase text-xs tracking-wider border-b border-cyan-500/10">

              <tr>
                <th className="py-4 px-4">
                  ID
                </th>

                <th className="py-4 px-4">
                  Imagen
                </th>

                <th className="py-4 px-4">
                  Nombre
                </th>

                <th className="py-4 px-4">
                  Artista
                </th>

                <th className="py-4 px-4">
                  Géneros
                </th>

                <th className="py-4 px-4">
                  Archivo
                </th>

                <th className="py-4 px-4">
                  Preview
                </th>

                <th className="py-4 px-4 text-right">
                  Acciones
                </th>
              </tr>

            </thead>

            {/* BODY */}
            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8 text-gray-400"
                  >
                    Cargando canciones...
                  </td>
                </tr>

              ) : songs.length === 0 ? (

                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-8 text-gray-400"
                  >
                    No hay canciones
                  </td>
                </tr>

              ) : (

                songs.map((song) => (

                  <tr
                    key={song.id_cancion}
                    className="border-b border-cyan-500/5 hover:bg-cyan-500/5 transition-all duration-300"
                  >

                    {/* ID */}
                    <td className="px-4 py-4">

                      <span className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/10 font-semibold">
                        #{song.id_cancion}
                      </span>

                    </td>

                    {/* IMAGEN */}
                    <td className="px-4 py-4">

                      {song.imagen_url ? (

                        <img
                          src={
                            song.imagen_url
                          }
                          alt={
                            song.nombre_cancion
                          }
                          className="w-14 h-14 rounded-xl object-cover border border-cyan-500/10 shadow-lg"
                        />

                      ) : (

                        <div className="w-14 h-14 rounded-xl bg-[#1e293b] border border-cyan-500/10 flex items-center justify-center text-gray-500 text-xs">
                          Sin imagen
                        </div>

                      )}

                    </td>

                    {/* NOMBRE */}
                    <td className="px-4 py-4">

                      <div className="font-semibold text-white">
                        {
                          song.nombre_cancion
                        }
                      </div>

                    </td>

                    {/* ARTISTA */}
                    <td className="px-4 py-4 text-gray-300">
                      {
                        song.artista_cancion
                      }
                    </td>

                    {/* GENEROS */}
                    <td className="px-4 py-4">

                      <div className="flex flex-wrap gap-2">

                        {Array.isArray(
                          song.genero
                        ) &&
                        song.genero.length >
                          0 ? (

                          song.genero.map(
                            (
                              genre,
                              index
                            ) => (

                              <span
                                key={index}
                                className="px-3 py-1 rounded-full text-xs bg-cyan-500/10 text-cyan-300 border border-cyan-500/10"
                              >
                                {genre}
                              </span>

                            )
                          )

                        ) : (

                          <span className="text-gray-500">
                            Sin género
                          </span>

                        )}

                      </div>

                    </td>

                    {/* ARCHIVO */}
                    <td className="px-4 py-4 text-gray-300 max-w-[220px] truncate">
                      {song.archivo_key}
                    </td>

                    {/* PREVIEW */}
                    <td className="px-4 py-4">

                      {song.url ? (

                        <audio
                          controls
                          src={song.url}
                          className="h-9 opacity-80 hover:opacity-100 transition"
                        />

                      ) : (

                        <span className="text-gray-500">
                          Sin preview
                        </span>

                      )}

                    </td>

                    {/* ACTIONS */}
                    <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">

                      <button
                        onClick={() =>
                          handleDownload(
                            song.archivo_key
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/10 text-cyan-300 text-xs hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all cursor-pointer"
                      >
                        Descargar
                      </button>

                      <button
                        onClick={() =>
                          setSongToDelete(
                            song
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/10 text-red-400 text-xs hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                      >
                        Eliminar
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL CREAR */}
      {isModalOpen && (

        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={() => {
            setIsModalOpen(false);
            resetForm();
          }}
        >

          <div className="min-h-screen flex items-start justify-center p-4 py-10">

            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              className="bg-[#111827] border border-cyan-500/10 w-full max-w-md rounded-3xl shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-hidden"
            >

              <div className="max-h-[90vh] overflow-y-auto p-6 custom-scroll">

                {/* HEADER */}
                <div className="mb-6">

                  <h3 className="text-2xl font-bold text-white">
                    Nueva Canción
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Sube una canción
                    con imagen
                  </p>

                </div>

                {/* FORM */}
                <form
                  onSubmit={
                    handleUploadSong
                  }
                  className="space-y-5"
                >

                  {/* NOMBRE */}
                  <input
                    type="text"
                    placeholder="Nombre canción"
                    value={
                      newSong.nombre_cancion
                    }
                    onChange={(e) =>
                      setNewSong({
                        ...newSong,
                        nombre_cancion:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-500/10 text-white rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                  {/* ARTISTA */}
                  <input
                    type="text"
                    placeholder="Artista"
                    value={
                      newSong.artista_cancion
                    }
                    onChange={(e) =>
                      setNewSong({
                        ...newSong,
                        artista_cancion:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-500/10 text-white rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                  {/* GENEROS */}
                  <input
                    type="text"
                    placeholder="Géneros separados por coma"
                    value={
                      newSong.genero
                    }
                    onChange={(e) =>
                      setNewSong({
                        ...newSong,
                        genero:
                          e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-500/10 text-white rounded-2xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />

                  {/* IMAGEN */}
                  <label className="block">

                    <span className="text-sm text-gray-400">
                      Imagen de portada
                    </span>

                    <div className="mt-2 flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-cyan-500/20 rounded-2xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-500/5 transition-all relative">

                      <span className="text-sm text-gray-400 text-center break-all">
                        {newSong.image
                          ? newSong.image
                              .name
                          : "Haz clic para subir una imagen"}
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const image =
                            e.target
                              .files?.[0];

                          if (!image)
                            return;

                          if (
                            !image.type.startsWith(
                              "image/"
                            )
                          ) {
                            toast.error(
                              "Solo se permiten imágenes"
                            );

                            return;
                          }

                          const imagePreview =
                            URL.createObjectURL(
                              image
                            );

                          setNewSong({
                            ...newSong,
                            image,
                            imagePreview,
                          });
                        }}
                      />

                    </div>

                  </label>

                  {/* IMAGE PREVIEW */}
                  {newSong.imagePreview && (

                    <div className="bg-[#1e293b] p-4 rounded-2xl border border-cyan-500/10">

                      <p className="text-xs text-gray-400 mb-3">
                        Imagen
                      </p>

                      <img
                        src={
                          newSong.imagePreview
                        }
                        alt="preview"
                        className="w-full h-52 object-cover rounded-2xl border border-cyan-500/10"
                      />

                    </div>

                  )}

                  {/* AUDIO */}
                  <label className="block">

                    <span className="text-sm text-gray-400">
                      Archivo de audio
                    </span>

                    <div className="mt-2 flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-cyan-500/20 rounded-2xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-500/5 transition-all relative">

                      <span className="text-sm text-gray-400 text-center break-all">
                        {newSong.file
                          ? newSong.file
                              .name
                          : "Haz clic para subir un archivo"}
                      </span>

                      <input
                        type="file"
                        accept="audio/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file =
                            e.target
                              .files?.[0];

                          if (!file)
                            return;

                          if (
                            !file.type.startsWith(
                              "audio/"
                            )
                          ) {
                            toast.error(
                              "Solo se permiten archivos de audio"
                            );

                            return;
                          }

                          const preview =
                            URL.createObjectURL(
                              file
                            );

                          setNewSong({
                            ...newSong,
                            file,
                            preview,
                          });
                        }}
                      />

                    </div>

                  </label>

                  {/* AUDIO PREVIEW */}
                  {newSong.preview && (

                    <div className="bg-[#1e293b] p-4 rounded-2xl border border-cyan-500/10">

                      <p className="text-xs text-gray-400 mb-3">
                        Preview
                      </p>

                      <audio
                        controls
                        src={
                          newSong.preview
                        }
                        className="w-full"
                      />

                    </div>

                  )}

                  {/* BUTTONS */}
                  <div className="flex justify-end gap-3 pt-2">

                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(
                          false
                        );

                        resetForm();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-semibold hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all cursor-pointer"
                    >
                      Subir
                    </button>

                  </div>

                </form>

              </div>

            </div>

          </div>

        </div>

      )}

      {/* MODAL ELIMINAR */}
      {songToDelete && (

        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() =>
            setSongToDelete(null)
          }
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="w-full max-w-md bg-[#111827] border border-red-500/10 rounded-3xl p-6 shadow-[0_0_50px_rgba(239,68,68,0.15)]"
          >

            <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-red-500/10 border border-red-500/10 mb-5">

              <span className="text-3xl">
                🗑️
              </span>

            </div>

            <h3 className="text-white text-2xl font-bold text-center">
              Eliminar canción
            </h3>

            <p className="text-gray-400 text-sm text-center mt-3 leading-relaxed">

              ¿Seguro que deseas eliminar{" "}
              <span className="text-white font-semibold">
                {
                  songToDelete.nombre_cancion
                }
              </span>
              ?

            </p>

            <div className="flex justify-center gap-3 mt-8">

              <button
                onClick={() =>
                  setSongToDelete(null)
                }
                className="px-5 py-2.5 rounded-xl bg-gray-700 text-white hover:bg-gray-600 transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
              >
                Sí, eliminar
              </button>

            </div>

          </div>

        </div>

      )}

    </>
  );
}