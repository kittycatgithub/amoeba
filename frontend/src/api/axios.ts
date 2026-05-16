import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,   // ← sends cookies on every request automatically
});

// No request interceptor needed — cookie is sent automatically by the browser

// Handle 401 — redirect to login (no token to clear)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';   // optional: redirect on session expiry
    }
    return Promise.reject(error);
  }
);

export default api;