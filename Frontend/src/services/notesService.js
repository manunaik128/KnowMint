import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/notes";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Upload a note
export const uploadNote = async (formData) => {
  // Get token from localStorage as fallback
  const user = JSON.parse(localStorage.getItem("knowmint_user"));
  const token = user?.token;
  
  const headers = {};
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  // Don't set Content-Type header for multipart/form-data - let axios handle it
  return api.post("/upload", formData, { headers });
};

// Get all public notes (Explore page)
export const getPublicNotes = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.semester) params.append("semester", filters.semester);
  if (filters.subject) params.append("subject", filters.subject);
  if (filters.branch) params.append("branch", filters.branch);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);

  return api.get(`/explore?${params.toString()}`);
};

// Get user's own notes (My Notes page)
export const getMyNotes = async (filters = {}) => {
  const user = JSON.parse(localStorage.getItem("knowmint_user"));
  const token = user?.token;
  
  console.log("getMyNotes - User from localStorage:", user);
  console.log("getMyNotes - Token:", token ? "Present" : "Missing");
  
  const params = new URLSearchParams();
  
  if (filters.semester) params.append("semester", filters.semester);
  if (filters.subject) params.append("subject", filters.subject);
  if (filters.branch) params.append("branch", filters.branch);
  if (filters.search) params.append("search", filters.search);
  if (filters.sort) params.append("sort", filters.sort);

  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("getMyNotes - Request headers:", headers);
  const response = await api.get(`/my-notes?${params.toString()}`, { headers });
  console.log("getMyNotes - Response:", response.data);
  return response;
};

// Get single note by ID
export const getNoteById = async (noteId) => {
  return api.get(`/${noteId}`);
};

// Download a note
export const downloadNote = async (noteId) => {
  const user = JSON.parse(localStorage.getItem("knowmint_user"));
  const token = user?.token;
  
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return api.get(`/download/${noteId}`, {
    responseType: "blob",
    headers
  });
};

// Delete a note
export const deleteNote = async (noteId) => {
  const user = JSON.parse(localStorage.getItem("knowmint_user"));
  const token = user?.token;
  
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return api.delete(`/${noteId}`, { headers });
};

// Update note visibility
export const updateNoteVisibility = async (noteId, isPublic) => {
  const user = JSON.parse(localStorage.getItem("knowmint_user"));
  const token = user?.token;
  
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return api.patch(`/${noteId}/visibility`, { isPublic }, { headers });
};

// Rate a note
export const rateNote = async (noteId, rating) => {
  const user = JSON.parse(localStorage.getItem("knowmint_user"));
  const token = user?.token;
  
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return api.post(`/${noteId}/rate`, { rating }, { headers });
};
