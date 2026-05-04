import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/ai";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Get AI summary of a note
export const getNoteSummary = async (noteId, type = 'summary') => {
  const user = JSON.parse(localStorage.getItem("knowmint_user"));
  const token = user?.token;
  
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return api.get(`/summary/${noteId}?type=${type}`, { headers });
};

// Ask AI a question about a note
export const askNoteQuestion = async (noteId, question) => {
  const user = JSON.parse(localStorage.getItem("knowmint_user"));
  const token = user?.token;
  
  const headers = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  
  return api.post(`/question/${noteId}`, { question }, { headers });
};
