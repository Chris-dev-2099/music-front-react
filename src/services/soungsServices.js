// services/songsService.js

// Simulación de base de datos
let songsDB = [
  {
    id: 1,
    title: "Freaks",
    artist: "Unknown",
    genre: "Electronic",
    file: "/songs/freaks.mp3",
  },
  {
    id: 2,
    title: "Chill",
    artist: "Unknown",
    genre: "Lo-fi",
    file: "/songs/chill.mp3",
  },
];

// Simular delay
const fakeDelay = (ms) => new Promise((res) => setTimeout(res, ms));

// 📥 Obtener canciones
export const getSongs = async () => {
  await fakeDelay(500);

  return [...songsDB];
};

// ➕ Crear canción
export const createSong = async (data) => {
  await fakeDelay(500);

  const newSong = {
    id: Date.now(),
    title: data.title,
    artist: data.artist,
    file: data.file || null,
  };

  songsDB.push(newSong);

  return newSong;
};

export const updateSong = async (id, data) => {
  await fakeDelay(500);

  songsDB = songsDB.map((song) =>
    song.id === id ? { ...song, ...data } : song
  );

  return songsDB.find((song) => song.id === id);
};

export const deleteSong = async (id) => {
  await fakeDelay(500);

  songsDB = songsDB.filter((song) => song.id !== id);

  return { success: true };
};