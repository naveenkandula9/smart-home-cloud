import { createServer } from "node:http";
import mongoose from "mongoose";
import app from "./app.js";
import connectDatabase from "./config/db.js";
import { env } from "./config/env.js";
import { seedDefaultDevices } from "./services/deviceService.js";
import { initializeScheduleJobs } from "./services/scheduleService.js";
import { initializeSocketServer } from "./services/socketService.js";

const startServer = async () => {
  try {
    await connectDatabase();
    await seedDefaultDevices();
    await initializeScheduleJobs();

    const httpServer = createServer(app);
    initializeSocketServer(httpServer);

    const server = httpServer.listen(env.port, () => {
      console.log(`Smart Home API running on port ${env.port}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing Smart Home API...`);

      server.close(async () => {
        try {
          await mongoose.connection.close();
          process.exit(0);
        } catch (error) {
          console.error("Failed to close MongoDB connection cleanly:", error);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => {
      shutdown("SIGINT");
    });

    process.on("SIGTERM", () => {
      shutdown("SIGTERM");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
