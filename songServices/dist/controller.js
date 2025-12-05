"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleSong = exports.getAllSongsOfAlbum = exports.getAllSongs = exports.getAllAlbums = void 0;
const db_config_1 = require("./db.config");
const TryCatch_1 = __importDefault(require("./TryCatch"));
const index_1 = require("./index");
exports.getAllAlbums = (0, TryCatch_1.default)(async (req, res) => {
    const CACHE_EXPIRY = 1800; // 30 minutes
    let albums;
    if (index_1.redisClient.isReady) {
        const cached = await index_1.redisClient.get("albums");
        if (cached) {
            console.log("Cache hit");
            return res.json(JSON.parse(cached));
        }
    }
    console.log("Cache miss");
    albums = await (0, db_config_1.NEONDB) `SELECT * FROM albums`;
    if (index_1.redisClient.isReady) {
        await index_1.redisClient.set("albums", JSON.stringify(albums), {
            EX: CACHE_EXPIRY,
        });
    }
    res.json(albums);
});
exports.getAllSongs = (0, TryCatch_1.default)(async (req, res) => {
    const CACHE_KEY = "songs";
    const CACHE_EXPIRY = 1800; // 30 minutes
    let songs;
    if (index_1.redisClient.isReady) {
        const cached = await index_1.redisClient.get(CACHE_KEY);
        if (cached) {
            console.log("Songs Cache Hit");
            return res.json(JSON.parse(cached));
        }
    }
    console.log("Songs Cache Miss");
    songs = await (0, db_config_1.NEONDB) `SELECT * FROM songs`;
    if (index_1.redisClient.isReady) {
        await index_1.redisClient.set(CACHE_KEY, JSON.stringify(songs), {
            EX: CACHE_EXPIRY,
        });
    }
    res.json(songs);
});
exports.getAllSongsOfAlbum = (0, TryCatch_1.default)(async (req, res) => {
    const { id } = req.params;
    let albums, songs;
    albums = await (0, db_config_1.NEONDB) `SELECT  * FROM albums WHERE id =${id}`;
    if (albums.length === 0) {
        res.status(404).json({
            message: "No albums with this id",
        });
        return;
    }
    songs = await (0, db_config_1.NEONDB) ` SELECT * FROM songs WHERE album_id = ${id}`;
    const response = { songs, album: albums[0] };
    res.json(response);
});
exports.getSingleSong = (0, TryCatch_1.default)(async (req, res) => {
    const songs = await (0, db_config_1.NEONDB) ` SELECT * FROM songs WHERE id = ${req.params.id}`;
    res.json(songs[0]);
});
