import mongoose from "mongoose";

/**
 * 0: disconnected
 * 1: connected
 * 2: connecting
 * 3: disconnecting
 */

const mongoConnection = {
  isConnected: 0,
};

export const connectDB = async () => {
  if (mongoConnection.isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  if (mongoose.connections.length > 0) {
    mongoConnection.isConnected = mongoose.connections[0].readyState;
    if (mongoConnection.isConnected === 1) {
      console.log("MongoDB already connected");
      return;
    }
    await mongoose.disconnect();
  }

  await mongoose.connect(process.env.MONGO_URL || "");
  mongoConnection.isConnected = 1;
  console.log("MongoDB connected");
};

export const disconnectDB = async () => {
  if (process.env.NODE_ENV === "development") {
    return;
  }

  if (mongoConnection.isConnected === 0) {
    return;
  }

  await mongoose.disconnect();
  mongoConnection.isConnected = 0;
  console.log("MongoDB disconnected");
};
