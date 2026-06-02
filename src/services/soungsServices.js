// services/songsService.js

import api from "./api";

let isMock = false;

let songsDB = [
  {
    id_cancion: 1,
    nombre_cancion: "Freaks",
    artista_cancion: "pepito",
    genero: ["pop", "rock"],
    archivo_key: "freaks.mp3",
    imagen: "/songs/freaks.jpg",
    url: "/songs/freaks.mp3",
  },
  {
    id_cancion: 2,
    nombre_cancion: "Chill",
    artista_cancion: "unknown",
    genero: ["lofi"],
    archivo_key: "chill.mp3",
    imagen: "/songs/chill.jpg",
    url: "/songs/chill.mp3",
  },
];

const fakeDelay = (ms) =>
  new Promise((resolve) =>
    setTimeout(resolve, ms)
  );

export const getSongs = async () => {
  try {
    if (isMock) {
      await fakeDelay(500);

      return {
        success: true,
        data: songsDB,
      };
    }

    const response = await api.get("/song");

    return response.data;

  } catch (error) {
    throw {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error obteniendo canciones",
      status: error.response?.status || 500,
    };
  }
};

export const uploadSong = async ({
  file,
  imagen,
  nombre_cancion,
  artista_cancion,
  genero,
}) => {
  try {
    if (isMock) {
      await fakeDelay(1000);

      const newSong = {
        id_cancion: Date.now(),
        nombre_cancion,
        artista_cancion,
        genero,
        archivo_key: file.name,
        imagen_url: imagen
          ? URL.createObjectURL(imagen)
          : null,
        url: URL.createObjectURL(file),
      };

      songsDB.push(newSong);

      return {
        success: true,
        data: newSong,
      };
    }

    const formData = new FormData();

    formData.append(
      "nombre",
      nombre_cancion
    );

    formData.append(
      "artista",
      artista_cancion
    );

    formData.append(
      "archivo",
      file
    );

    if (imagen) {
      formData.append(
        "imagen",
        imagen
      );
    }

    genero.forEach((item) => {
      formData.append(
        "genero",
        item
      );
    });

    const response = await api.post(
      "/song",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    return response.data;

  } catch (error) {
    throw {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error subiendo canción",
      status:
        error.response?.status || 500,
    };
  }
};

export const updateSong = async (
  id,
  {
    nombre_cancion,
    artista_cancion,
    genero,
    imagen,
  }
) => {
  console.log("Updating song with ID:", id, "Data:", {
    nombre_cancion,
    artista_cancion,
    genero,
    imagen,
  });
  try {
    if (isMock) {
      await fakeDelay(500);

      songsDB = songsDB.map((song) =>
        song.id_cancion === id
          ? {
              ...song,
              nombre_cancion,
              artista_cancion,
              genero,
              imagen: imagen
                ? URL.createObjectURL(imagen)
                : song.imagen,
            }
          : song
      );

      return {
        success: true,
        data: songsDB.find(
          (song) => song.id_cancion === id
        ),
      };
    }

    const formData = new FormData();

    formData.append("nombre", nombre_cancion);
    formData.append("artista", artista_cancion);

    genero.forEach((item) => {
      formData.append("genero", item);
    });

    if (imagen) {
      formData.append("imagen", imagen);
    }

    const response = await api.put(
      `/song/${id}`,
      formData,
        {
          headers: {
            "Content-Type":"multipart/form-data",
          },
        }
    );

    return response.data;

  } catch (error) {
    throw {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error actualizando canción",
      status: error.response?.status || 500,
    };
  }
};

export const downloadSong = async (filename) => {
  try {
    if (isMock) {
      await fakeDelay(500);

      const song = songsDB.find(
        (song) => song.archivo_key === filename
      );

      if (!song) {
        throw {
          message: "Archivo no encontrado",
          status: 404,
        };
      }

      return fetch(song.url).then((res) =>
        res.blob()
      );
    }

    const response = await api.get(
      `/song/${filename}`,
      {
        responseType: "blob",
      }
    );

    return response.data;

  } catch (error) {
    throw {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error descargando canción",
      status: error.response?.status || 500,
    };
  }
};

export const deleteSong = async (id) => {
  try {
    if (isMock) {
      await fakeDelay(500);

      songsDB = songsDB.filter(
        (song) => song.id_cancion !== id
      );

      return {
        success: true,
      };
    }

    const response = await api.delete(
      `/song/${id}`
    );

    return response.data;

  } catch (error) {
    throw {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Error eliminando canción",
      status:
        error.response?.status || 500,
    };
  }
};