import mongoose from "mongoose";
import { env } from "./env.js";

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  mongoose.set("strictQuery", true);

  await mongoose.connect(env.mongodbUri);
  isConnected = true;

  console.log(`[db] Connected to MongoDB (${mongoose.connection.name})`);

  mongoose.connection.on("error", (err) => {
    console.error("[db] Connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] Disconnected from MongoDB");
    isConnected = false;
  });
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  isConnected = false;
}
