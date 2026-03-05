import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem("campusai_user") || "{}");
  if (user.token) req.headers.Authorization = `Bearer ${user.token}`;
  return req;
});

export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const getNotices = (params) => API.get("/notices", { params });
export const createNotice = (data) => API.post("/notices", data);
export const deleteNotice = (id) => API.delete(`/notices/${id}`);
export const getNotes = (params) => API.get("/notes", { params });
export const uploadNote = (data) => API.post("/notes", data);
export const downloadNote = (id) => API.put(`/notes/${id}/download`);
export const rateNote = (id, rating) => API.put(`/notes/${id}/rate`, { rating });
export const getTodayMenu = () => API.get("/canteen/today");
export const updateMenu = (data) => API.post("/canteen", data);
export const getLostItems = (params) => API.get("/lostfound", { params });
export const postLostItem = (data) => API.post("/lostfound", data);
export const resolveItem = (id) => API.put(`/lostfound/${id}/resolve`);
export const getAttendance = () => API.get("/attendance");
export const updateAttendance = (data) => API.post("/attendance", data);
export const logClass = (data) => API.post("/attendance/log", data);
export const sendChat = (data) => API.post("/chat", data);
export const getQuickQuestions = () => API.get("/chat/questions");

export default API;