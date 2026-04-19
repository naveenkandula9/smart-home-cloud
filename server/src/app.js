import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import { allowedOrigins } from "./config/env.js";
import { getDatabaseStatus } from "./config/db.js";
import activityRoutes from "./routes/activityRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import reportsRoutes from "./routes/reportsRoutes.js";
import { authenticateRequest, optionalAuth } from "./middleware/authMiddleware.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      const corsError = new Error("CORS blocked for this origin.");
      corsError.statusCode = 403;
      callback(corsError);
    },
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", optionalAuth, (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Smart Home API is healthy.",
    timestamp: new Date().toISOString(),
    data: {
      database: getDatabaseStatus(),
      mongooseReadyState: mongoose.connection.readyState,
      allowedOrigins,
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/devices", authenticateRequest, deviceRoutes);
app.use("/api/activities", authenticateRequest, activityRoutes);
app.use("/api/schedules", authenticateRequest, scheduleRoutes);
app.use("/api/reports", authenticateRequest, reportsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
