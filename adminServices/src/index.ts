import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { NEONDB } from "./config/db.js";
import adminRouter from "./routes.js"
import cookieParser from "cookie-parser";
import { createClient } from "redis";``
import cors from "cors"

const app = express();
const PORT = process.env.PORT || 5000;

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


const initDB = () => {
  NEONDB`
    CREATE TABLE IF NOT EXISTS albums (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
    .then(() => {
      return NEONDB`
        CREATE TABLE IF NOT EXISTS songs (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          description VARCHAR(255) NOT NULL,
          thumbnail VARCHAR(255),
          audio VARCHAR(255) NOT NULL,
          album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;
    })
    .then(() => {
      console.log("Tables created successfully!");
    })
    .catch((error) => {
      console.error("DB Init Error:", error);
    });
};

initDB();


app.use(express.json())
app.use(cookieParser())
app.use(cors(
  {
    origin: process.env.CLIENT,
    credentials: true
  }
))
app.use(express.urlencoded({ extended: true}))

app.get("/", (req, res) => {
  res.send("adminServer is running...");
});

app.use('/api/v1', adminRouter)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
