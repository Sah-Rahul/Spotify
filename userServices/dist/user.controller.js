"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const TryCatch_1 = __importDefault(require("./TryCatch"));
exports.registerUser = (0, TryCatch_1.default)(async (req, res) => {
    const { username, email, password } = req.body;
    res
        .status(201)
        .json({ message: "User registered", data: { username, email } });
});
