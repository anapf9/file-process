import mongoose from "mongoose";
import { config } from "../config/config";

export const connectDB = async () => {
  try {
    console.log("INIT connection MongoDB", config.mongoUrl);

    await mongoose.connect(config.mongoUrl, {
      dbName: "mydatabase",
      user: "admin",
      pass: "password123",
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
