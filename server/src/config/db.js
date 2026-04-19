import mongoose from "mongoose";
import { env } from "./env.js";

const DATABASE_READY_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

const normalizeMongoUri = (mongoUri) => {
  if (!mongoUri.startsWith("mongodb://") && !mongoUri.startsWith("mongodb+srv://")) {
    return mongoUri;
  }

  const protocolSeparatorIndex = mongoUri.indexOf("://");
  const protocolPrefix = mongoUri.slice(0, protocolSeparatorIndex + 3);
  const connectionDetails = mongoUri.slice(protocolSeparatorIndex + 3);
  const pathSeparatorIndex = connectionDetails.indexOf("/");
  const authSectionEndIndex = pathSeparatorIndex === -1 ? connectionDetails.length : pathSeparatorIndex;
  const authAndHost = connectionDetails.slice(0, authSectionEndIndex);
  const remainingPath = connectionDetails.slice(authSectionEndIndex);
  const authSeparatorIndex = authAndHost.lastIndexOf("@");

  if (authSeparatorIndex === -1) {
    return mongoUri;
  }

  const rawAuth = authAndHost.slice(0, authSeparatorIndex);
  const host = authAndHost.slice(authSeparatorIndex + 1);
  const credentialSeparatorIndex = rawAuth.indexOf(":");

  if (credentialSeparatorIndex === -1) {
    return mongoUri;
  }

  const username = rawAuth.slice(0, credentialSeparatorIndex);
  const password = rawAuth.slice(credentialSeparatorIndex + 1);

  return `${protocolPrefix}${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}${remainingPath}`;
};

export const getDatabaseStatus = () => DATABASE_READY_STATES[mongoose.connection.readyState] || "unknown";

const connectDatabase = async () => {
  const mongoUri = env.mongoUri;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing. Add it to server/.env before starting the API.");
  }

  mongoose.set("strictQuery", true);

  const connection = await mongoose.connect(normalizeMongoUri(mongoUri), {
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDatabase;
