import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("[DATABASE] Conexión a MongoDB establecida correctamente.");
  } catch (error) {
    console.error("[Error] Error De Conexión a MongoDB:", error.message);
    process.exit(1);
  }
}