// Client / src / api / axios.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL || "http://localhost:4000",
});

export const authHeader = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

export default api;
