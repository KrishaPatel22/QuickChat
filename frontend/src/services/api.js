// src/services/api.js - Axios API Service
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// Attach token from localStorage before each request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("chatUser") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getMe = () => API.get("/auth/me");

// User APIs
export const getUsers = (search = "") =>
  API.get(`/users${search ? `?search=${search}` : ""}`);
export const getUnreadCounts = () => API.get("/users/unread-counts");

// Message APIs
export const getMessages = (userId) => API.get(`/messages/${userId}`);
export const sendMessage = (data) => API.post("/messages", data);
export const markMessagesRead = (senderId) =>
  API.put(`/messages/read/${senderId}`);

export default API;