"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSong = exports.deleteAlbum = exports.addThumbnail = exports.addSong = exports.addAlbum = void 0;
const cloudinary_config_js_1 = __importDefault(require("./config/cloudinary.config.js"));
const DataUri_js_1 = __importDefault(require("./config/DataUri.js"));
const db_js_1 = require("./config/db.js");
const index_js_1 = require("./index.js");
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
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.del("albums");
    }
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
    if (index_js_1.redisClient.isReady) {
        await index_js_1.redisClient.del("songs");
    }
    return res.status(201).json({
        message: "Song added successfully",
        song,
    });
});
exports.addThumbnail = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Only admin can update song thumbnails",
        });
    }
    const songId = req.params.id;
    const song = await (0, db_js_1.NEONDB) `SELECT * FROM songs WHERE id = ${songId}`;
    if (!song.length) {
        return res.status(404).json({ message: "Song not found" });
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
        folder: "spotify-songs-thumbnails",
    });
    const result = await (0, db_js_1.NEONDB) `
      UPDATE songs
      SET thumbnail = ${uploaded.secure_url}
      WHERE id = ${songId}
      RETURNING *;
    `;
    const updatedSong = result[0];
    return res.status(200).json({
        message: "Thumbnail added successfully",
        song: updatedSong,
    });
});
exports.deleteAlbum = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Only admin can delete albums",
        });
    }
    const { id } = req.params;
    const album = await (0, db_js_1.NEONDB) `SELECT * FROM albums WHERE id = ${id}`;
    if (album.length === 0) {
        return res.status(404).json({ message: "Album not found" });
    }
    await (0, db_js_1.NEONDB) `DELETE FROM songs WHERE album_id = ${id}`;
    await (0, db_js_1.NEONDB) `DELETE FROM albums WHERE id = ${id}`;
    return res.status(200).json({
        message: "Album and its songs deleted successfully",
    });
});
exports.deleteSong = (0, TryCatch_js_1.default)(async (req, res) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            message: "Only admin can delete songs",
        });
    }
    const { id } = req.params;
    const song = await (0, db_js_1.NEONDB) `SELECT * FROM songs WHERE id = ${id}`;
    if (song.length === 0) {
        return res.status(404).json({ message: "Song not found" });
    }
    await (0, db_js_1.NEONDB) `DELETE FROM songs WHERE id = ${id}`;
    return res.status(200).json({
        message: "Song deleted successfully",
    });
});
