import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getSongs,
  uploadSong,
  updateSong,
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

  const [isEditMode, setIsEditMode] =
    useState(false);

  const [songToEdit, setSongToEdit] =
    useState(null);

  const [newSong, setNewSong] = useState({
    nombre_cancion: "",
    artista_cancion: "",
    genero: "",
    file: null,
    imagen: null,
    preview: "",
    imagePreview: "",
  });

  const loadSongs = async () => {
    try {
      setLoading(true);

      const response = await getSongs();

      setSongs(response.data || []);
    } catch (error) {
      toast.error(
        error.message ||
          "Error cargando canciones"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const resetForm = () => {
    setNewSong({
      nombre_cancion: "",
      artista_cancion: "",
      genero: "",
      file: null,
      imagen: null,
      preview: "",
      imagePreview: "",
    });

    setIsEditMode(false);

    setSongToEdit(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);

    resetForm();
  };

  const handleEditSong = (song) => {
    setSongToEdit(song);

    setNewSong({
      nombre_cancion:
        song.nombre_cancion || "",
      artista_cancion:
        song.artista_cancion || "",
      genero: Array.isArray(song.genero)
        ? song.genero.join(", ")
        : "",
      file: null,

      // IMPORTANTE:
      // nunca guardar string URL aquí
      // porque "imagen" debe ser File
      imagen: null,

      preview: song.url || "",
      imagePreview:
        song.imagen ||
        song.imagen_url ||
        "",
    });

    setIsEditMode(true);

    setIsModalOpen(true);
  };

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

      toast.success(
        "Canción eliminada"
      );

      setSongToDelete(null);
    } catch (error) {
      toast.error(
        error.message ||
          "Error eliminando canción"
      );
    }
  };

  const handleDownload = async (
    archivoKey
  ) => {
    try {
      const blob = await downloadSong(
        archivoKey
      );

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = archivoKey;
      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success(
        "Descarga iniciada"
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Error descargando canción"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !newSong.nombre_cancion.trim() ||
        !newSong.artista_cancion.trim() ||
        !newSong.genero.trim()
      ) {
        toast.error(
          "Todos los campos son obligatorios"
        );

        return;
      }

      const generoArray =
        newSong.genero
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);

      if (isEditMode) {
        const payload = {
          nombre_cancion:
            newSong.nombre_cancion,
          artista_cancion:
            newSong.artista_cancion,
          genero: generoArray,
        };

        // SOLO enviar imagen
        // si es realmente un File
        if (
          newSong.imagen &&
          newSong.imagen instanceof File
        ) {
          payload.imagen =
            newSong.imagen;
        }

        await updateSong(
          songToEdit.id_cancion,
          payload
        );

        toast.success(
          "Canción actualizada"
        );
      } else {
        if (!newSong.file) {
          toast.error(
            "Debes subir un archivo de audio"
          );

          return;
        }

        await uploadSong({
          nombre_cancion:
            newSong.nombre_cancion,
          artista_cancion:
            newSong.artista_cancion,
          genero: generoArray,
          file: newSong.file,
          imagen: newSong.imagen,
        });

        toast.success(
          "Canción subida correctamente"
        );
      }

      closeModal();

      await loadSongs();
    } catch (error) {
      toast.error(
        error.message ||
          "Ocurrió un error"
      );
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
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="bg-cyan-500/20 border border-cyan-400/20 text-cyan-300 px-5 py-2.5 rounded-xl font-medium cursor-pointer hover:bg-cyan-400 hover:text-black transition-all duration-300"
          >
            + Agregar
          </button>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-cyan-400/20 bg-[#0f172a]/70">

          <table className="w-full text-left text-sm text-gray-300">

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

                    <td className="px-4 py-4">

                      <span className="px-3 py-1 rounded-full text-xs bg-purple-500/10 text-purple-300 border border-purple-500/10 font-semibold">
                        #{song.id_cancion}
                      </span>

                    </td>

                    <td className="px-4 py-4">

                      {song.imagen ||
                      song.imagen_url ? (

                        <img
                          src={
                            song.imagen ||
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

                    <td className="px-4 py-4">

                      <div className="font-semibold text-white">
                        {
                          song.nombre_cancion
                        }
                      </div>

                    </td>

                    <td className="px-4 py-4 text-gray-300">
                      {
                        song.artista_cancion
                      }
                    </td>

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

                    <td className="px-4 py-4 text-gray-300 max-w-[220px] truncate">
                      {song.archivo_key}
                    </td>

                    <td className="px-4 py-4">

                      {song.url ? (

                        <audio
                          controls
                          src={song.url}
                          className="h-9 opacity-80"
                        />

                      ) : (

                        <span className="text-gray-500">
                          Sin preview
                        </span>

                      )}

                    </td>

                    <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">

                      <button
                        onClick={() =>
                          handleDownload(
                            song.archivo_key
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/10 text-cyan-300 text-xs hover:bg-cyan-400 hover:text-black transition-all cursor-pointer"
                      >
                        Descargar
                      </button>

                      <button
                        onClick={() =>
                          handleEditSong(song)
                        }
                        className="px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/10 text-yellow-300 text-xs hover:bg-yellow-400 hover:text-black transition-all cursor-pointer"
                      >
                        Editar
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

      {/* MODAL CREAR / EDITAR */}
      {isModalOpen && (

        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto"
          onClick={closeModal}
        >

          <div className="min-h-screen flex items-start justify-center p-4 py-10">

            <div
              onClick={(e) =>
                e.stopPropagation()
              }
              className="bg-[#111827] border border-cyan-500/10 w-full max-w-md rounded-3xl overflow-hidden"
            >

              <div className="max-h-[90vh] overflow-y-auto p-6">

                <div className="mb-6">

                  <h3 className="text-2xl font-bold text-white">
                    {isEditMode
                      ? "Editar Canción"
                      : "Nueva Canción"}
                  </h3>

                </div>

                <form
                  onSubmit={
                    handleSubmit
                  }
                  className="space-y-5"
                >

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
                    className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-500/10 text-white rounded-2xl"
                  />

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
                    className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-500/10 text-white rounded-2xl"
                  />

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
                    className="w-full px-4 py-3 bg-[#1e293b] border border-cyan-500/10 text-white rounded-2xl"
                  />

                  {/* IMAGEN */}
                  <label className="block">

                    <span className="text-sm text-gray-400">
                      Imagen de portada
                    </span>

                    <div className="mt-2 flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-cyan-500/20 rounded-2xl cursor-pointer relative">

                      <span className="text-sm text-gray-400 text-center break-all">
                        {newSong.imagen
                          ? newSong.imagen
                              .name
                          : "Haz clic para subir una imagen"}
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const imagen =
                            e.target
                              .files?.[0];

                          if (!imagen)
                            return;

                          if (
                            !imagen.type.startsWith(
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
                              imagen
                            );

                          setNewSong({
                            ...newSong,
                            imagen,
                            imagePreview,
                          });
                        }}
                      />

                    </div>

                  </label>

                  {newSong.imagePreview && (

                    <img
                      src={
                        newSong.imagePreview
                      }
                      alt="preview"
                      className="w-full h-52 object-cover rounded-2xl"
                    />

                  )}

                  {!isEditMode && (

                    <label className="block">

                      <span className="text-sm text-gray-400">
                        Archivo de audio
                      </span>

                      <div className="mt-2 flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-cyan-500/20 rounded-2xl cursor-pointer relative">

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
                                "Solo se permiten audios"
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

                  )}

                  <div className="flex justify-end gap-3 pt-2">

                    <button
                      type="button"
                      onClick={
                        closeModal
                      }
                      className="px-5 py-2.5 rounded-xl bg-gray-700 text-white"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-cyan-400 text-black font-semibold"
                    >
                      {isEditMode
                        ? "Guardar cambios"
                        : "Subir"}
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
            className="w-full max-w-md bg-[#111827] border border-red-500/10 rounded-3xl p-6"
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
                className="px-5 py-2.5 rounded-xl bg-gray-700 text-white"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold"
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