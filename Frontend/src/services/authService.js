import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/auth";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const loginUser = async (credentials) => {
  return api.post("/login", credentials);
};

export const registerUser = async (userData) => {
  return api.post("/register", userData);
};

export const fetchProfile = async () => {
  return api.get("/profile");
};

export const logoutUser = async () => {
  return api.post("/logout");
};
