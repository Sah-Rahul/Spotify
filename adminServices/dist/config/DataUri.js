"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parser_js_1 = __importDefault(require("datauri/parser.js"));
const path_1 = __importDefault(require("path"));
const getBuffer = (file) => {
    if (!file)
        return null;
    const parser = new parser_js_1.default();
    const extName = path_1.default.extname(file.originalname).toString();
    const result = parser.format(extName, file.buffer);
    return result.content;
};
exports.default = getBuffer;
