import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
    });
  } catch (error) {
  
    console.error("MongoDB connection failed:", error.message);
    throw error; 
  }
}

export default connectDB;