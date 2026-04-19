import { Server } from "socket.io";
import { allowedOrigins } from "../config/env.js";
import User from "../models/User.js";
import { verifyAuthToken } from "../utils/auth.js";

let io;

export const initializeSocketServer = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins.length ? allowedOrigins : true,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        next(new Error("Authentication required."));
        return;
      }

      const payload = verifyAuthToken(token);
      const user = await User.findById(payload.sub).select("_id name email").lean();

      if (!user) {
        next(new Error("Authentication required."));
        return;
      }

      socket.data.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.emit("system:status", {
      connected: true,
      at: new Date().toISOString(),
      user: socket.data.user,
    });
  });

  return io;
};

export const emitSocketEvent = (eventName, payload) => {
  if (!io) {
    return;
  }

  io.emit(eventName, payload);
};

export const getSocketServer = () => io;
