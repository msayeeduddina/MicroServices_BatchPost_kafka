import mongoose from "mongoose";

/**
 * Establishes a connection to the MongoDB database.
 * @throws {Error} If the connection fails.
 */
export const connectDB = async (): Promise<void> => {
  try {
    const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/edaTest";
    await mongoose.connect(mongoUrl, {
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};