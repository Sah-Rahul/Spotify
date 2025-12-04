import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import songRouter from "./routes";
import { createClient } from "redis";

dotenv.config();

export const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: "redis-10508.c240.us-east-1-3.ec2.cloud.redislabs.com",
    port: 10508,
  },
});

redisClient
  .connect()
  .then(() => console.log("redis connected"))
  .catch((err) => {
    console.log("Redis error:", err.message);
  });

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("server is running...");
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", songRouter);

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
