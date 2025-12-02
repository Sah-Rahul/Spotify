"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const USER_SERVICES_URL = process.env.USER_SERVICES_URL;
const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized: No token provided" });
        }
        const { data } = await axios_1.default.get(`${USER_SERVICES_URL}/api/v1/user/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        req.user = data.data;
        console.log("User object from auth middleware:====>", req.user);
        next();
    }
    catch (error) {
        return res
            .status(401)
            .json({ message: "Invalid or expired token", error: error.message });
    }
};
exports.isAuth = isAuth;
