import express from "express";
const port = process.env.PORT || 8000;
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotEnv from "dotenv";
import authRoute from "./routes/auth.route.js";

// Dotenv configuration
dotEnv.config();
const app = express();

app.use(express.json());

app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("database connected");
  })
  .catch((err) => {
    console.log("Not Connected", err);
  });
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
app.use("/api/auth", authRoute);
