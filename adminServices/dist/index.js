"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_js_1 = require("./config/db.js");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const initDB = () => {
    (0, db_js_1.NEONDB) `
    CREATE TABLE IF NOT EXISTS albums (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description VARCHAR(255) NOT NULL,
      thumbnail VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `
        .then(() => {
        return (0, db_js_1.NEONDB) `
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
