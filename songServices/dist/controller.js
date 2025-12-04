"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleSong = exports.getAllSongsOfAlbum = exports.getAllSongs = exports.getAllAlbums = void 0;
const db_config_1 = require("./db.config");
const TryCatch_1 = __importDefault(require("./TryCatch"));
exports.getAllAlbums = (0, TryCatch_1.default)(async (req, res) => {
    let albums;
    albums = await (0, db_config_1.NEONDB) `SELECT  * FROM albums`;
    res.json(albums);
});
exports.getAllSongs = (0, TryCatch_1.default)(async (req, res) => {
    let songs;
    songs = await (0, db_config_1.NEONDB) `SELECT  * FROM songs`;
    res.json(songs);
});
exports.getAllSongsOfAlbum = (0, TryCatch_1.default)(async (req, res) => {
    const { id } = req.params;
    let albums, songs;
    albums = await (0, db_config_1.NEONDB) `SELECT  * FROM albums WHERE id =${id}`;
    if (albums.length === 0) {
        res.status(404).json({
            message: "No albums with this id"
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
