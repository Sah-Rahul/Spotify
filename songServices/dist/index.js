"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const redis_1 = require("redis");
dotenv_1.default.config();
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
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.get("/", (req, res) => {
    res.send("server is running...");
});
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", routes_1.default);
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
