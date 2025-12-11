import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db.config";
import userRouter from "./user.routes";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT as string,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port ${PORT}`);
});
