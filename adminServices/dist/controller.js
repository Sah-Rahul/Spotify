"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSong = exports.addAlbum = void 0;
const cloudinary_config_js_1 = __importDefault(require("./config/cloudinary.config.js"));
const DataUri_js_1 = __importDefault(require("./config/DataUri.js"));
const db_js_1 = require("./config/db.js");
const TryCatch_js_1 = __importDefault(require("./TryCatch.js"));
exports.addAlbum = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Only admin can create albums",
        });
    }
    const { title, description } = req.body;
    if (!title || !description) {
        return res
            .status(400)
            .json({ message: "Title and description are required" });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "Thumbnail image is required",
        });
    }
    const fileBuffer = (0, DataUri_js_1.default)(file);
    if (!fileBuffer) {
        return res.status(400).json({
            message: "Invalid file buffer",
        });
    }
    const uploaded = await cloudinary_config_js_1.default.uploader.upload(fileBuffer, {
        folder: "spotify-albums",
    });
    const result = await (0, db_js_1.NEONDB) `
  INSERT INTO albums (title, description, thumbnail)
  VALUES (${title}, ${description}, ${uploaded.secure_url})
  RETURNING *;
`;
    const album = result[0];
    return res.status(201).json({
        message: "Album created successfully",
        album,
    });
});
exports.addSong = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Only admin can add songs",
        });
    }
    const { title, description, album } = req.body;
    if (!title || !description || !album) {
        return res
            .status(400)
            .json({ message: "Title, description, and album are required" });
    }
    const isAlbum = await (0, db_js_1.NEONDB) `SELECT * FROM albums WHERE id = ${album}`;
    if (isAlbum.length === 0) {
        return res.status(404).json({ message: "Album not found this id" });
    }
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            message: "Audio file is required",
        });
    }
    const fileBuffer = (0, DataUri_js_1.default)(file);
    if (!fileBuffer) {
        return res.status(400).json({
            message: "Invalid file buffer",
        });
    }
    const uploaded = await cloudinary_config_js_1.default.uploader.upload(fileBuffer, {
        folder: "spotify-songs",
        resource_type: "video",
    });
    const result = await (0, db_js_1.NEONDB) `
      INSERT INTO songs (title, description, audio, album_id)
      VALUES (${title},   ${description}, ${uploaded.secure_url}, ${album})
      RETURNING *;
    `;
    const song = result[0];
    return res.status(201).json({
        message: "Song added successfully",
        song,
    });
});
