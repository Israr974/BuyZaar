import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    // Log to error tracking service in production instead of console
    console.error("MongoDB connection failed:", error.message);
    throw error; // Throw instead of exiting to let app handle graceful shutdown
  }
}

export default connectDB;