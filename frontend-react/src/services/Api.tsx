import axios, { AxiosRequestConfig, AxiosError } from "axios";

// Création de l'instance Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
});

// Fonction pour récupérer le token
function getToken(): string | null {
  return localStorage.getItem("accessToken");
}

// Ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gère automatiquement les erreurs 401 (non autorisé)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("Session expired, redirecting to login...");
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; // Redirection vers la page de login
    }
    return Promise.reject(error);
  }
);

export default api;
