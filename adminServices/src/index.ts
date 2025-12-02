import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { NEONDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get("/", (req, res) => {
  res.send("adminServer is running...");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
