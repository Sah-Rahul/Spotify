"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.myProfile = exports.logOut = exports.loginUser = exports.registerUser = void 0;
const TryCatch_1 = __importDefault(require("./TryCatch"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = __importDefault(require("./model"));
exports.registerUser = (0, TryCatch_1.default)(async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await model_1.default.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = await model_1.default.create({
        username,
        email,
        password: hashedPassword,
    });
    const token = jsonwebtoken_1.default.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
    res
        .status(201)
        .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
    })
        .json({
        message: "User registered successfully",
        data: {
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                playlist: newUser.playlist,
            },
            token,
        },
    });
});
exports.loginUser = (0, TryCatch_1.default)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const user = await model_1.default.findOne({ email });
    if (!user) {
        return res
            .status(400)
            .json({ message: "User doesn't exist with this email." });
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
    }
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    res
        .status(200)
        .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 60 * 60 * 1000, // 1 hour
    })
        .json({
        message: "Login successful",
        data: {
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                playlist: user.playlist,
            },
            token,
        },
    });
});
exports.logOut = (0, TryCatch_1.default)(async (req, res) => {
    res
        .clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
    })
        .status(200)
        .json({ message: "Logged out successfully" });
});
exports.myProfile = (0, TryCatch_1.default)(async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await model_1.default.findById(userId).select("-password");
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
        message: "User profile fetched successfully",
        data: user,
    });
});
