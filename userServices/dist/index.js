"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = require("./db.config");
const user_routes_1 = __importDefault(require("./user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
    res.send("server is running...");
});
app.use("/api/v1/user", user_routes_1.default);
app.listen(PORT, () => {
    (0, db_config_1.connectDB)();
    console.log(`server is running on port ${PORT}`);
});
