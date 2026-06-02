import axios from "axios";

const api = axios.create({
  // baseURL: "https://consent-surface-craving.ngrok-free.dev/api/v1",
  baseURL: "https://apimusic.ca-arboleda26.workers.dev/api/v1",
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;