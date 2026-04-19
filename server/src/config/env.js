import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serverRoot = path.resolve(__dirname, "..", "..");

dotenv.config({
  path: path.join(serverRoot, ".env"),
});

const splitOrigins = (value = "") =>
  value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGODB_URI || "",
  clientUrl: process.env.CLIENT_URL || "",
  jwtSecret: process.env.JWT_SECRET || "smart-home-v2-dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  schedulerTimezone: process.env.SCHEDULER_TIMEZONE || "Asia/Kolkata",
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  awsRegion: process.env.AWS_REGION || "us-east-1",
  awsS3Bucket: process.env.AWS_S3_BUCKET || "",
};

export const allowedOrigins = splitOrigins(env.clientUrl);
export const isProduction = env.nodeEnv === "production";
