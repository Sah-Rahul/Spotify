"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const db_js_1 = require("./config/db.js");
const routes_js_1 = __importDefault(require("./routes.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const redis_1 = require("redis");
``;
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
exports.redisClient = (0, redis_1.createClient)({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: "redis-10508.c240.us-east-1-3.ec2.cloud.redislabs.com",
        port: 10508,
    },
});
exports.redisClient
    .connect()
    .then(() => console.log("redis connected"))
    .catch((err) => {
    console.log("Redis error:", err.message);
});
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
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT,
    credentials: true
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("adminServer is running...");
});
app.use('/api/v1', routes_js_1.default);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
