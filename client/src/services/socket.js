import { io } from "socket.io-client";

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api").replace(/\/+$/, "");
const socketBaseUrl = apiBaseUrl.replace(/\/api$/, "");

export const createDashboardSocket = (token) =>
  io(socketBaseUrl, {
    autoConnect: true,
    transports: ["websocket"],
    auth: {
      token,
    },
  });
