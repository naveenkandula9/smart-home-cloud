import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const STORAGE_KEY = "smart-home-v2-token";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let authToken = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) || "" : "";

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

export const persistToken = (token) => {
  authToken = token || "";

  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    window.localStorage.setItem(STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export const getStoredToken = () =>
  typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) || "" : "";

export const clearStoredToken = () => persistToken("");

export const registerUser = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data.data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};

export const fetchDevices = async () => {
  const { data } = await api.get("/devices");
  return data.data;
};

export const saveDeviceState = async (deviceName, payload) => {
  const { data } = await api.put(`/devices/${deviceName}`, payload);
  return data.data;
};

export const executeScene = async (sceneName) => {
  const { data } = await api.post(`/devices/scenes/${sceneName}`);
  return data.data;
};

export const fetchActivities = async (limit = 18) => {
  const { data } = await api.get(`/activities?limit=${limit}`);
  return data.data;
};

export const fetchSchedules = async () => {
  const { data } = await api.get("/schedules");
  return data.data;
};

export const createSchedule = async (payload) => {
  const { data } = await api.post("/schedules", payload);
  return data.data;
};

export const updateSchedule = async (scheduleId, payload) => {
  const { data } = await api.patch(`/schedules/${scheduleId}`, payload);
  return data.data;
};

export const removeSchedule = async (scheduleId) => {
  const { data } = await api.delete(`/schedules/${scheduleId}`);
  return data.data;
};

export const exportReport = async () => {
  const { data } = await api.get("/reports/export");
  return data.data;
};

export default api;
