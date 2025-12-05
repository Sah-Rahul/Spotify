import { NEONDB } from "./db.config";
import TryCatch from "./TryCatch";
import { redisClient } from "./index";

export const getAllAlbums = TryCatch(async (req, res) => {
  const CACHE_EXPIRY = 1800; // 30 minutes
  let albums;

  if (redisClient.isReady) {
    const cached = await redisClient.get("albums");
    if (cached) {
      console.log("Cache hit");
      return res.json(JSON.parse(cached));
    }
  }

  console.log("Cache miss");
  albums = await NEONDB`SELECT * FROM albums`;

  if (redisClient.isReady) {
    await redisClient.set("albums", JSON.stringify(albums), {
      EX: CACHE_EXPIRY,
    });
  }

  res.json(albums);
});

export const getAllSongs = TryCatch(async (req, res) => {
  const CACHE_KEY = "songs";
  const CACHE_EXPIRY = 1800; // 30 minutes
  let songs;

  if (redisClient.isReady) {
    const cached = await redisClient.get(CACHE_KEY);
    if (cached) {
      console.log("Songs Cache Hit");
      return res.json(JSON.parse(cached));
    }
  }

  console.log("Songs Cache Miss");
  songs = await NEONDB`SELECT * FROM songs`;

  if (redisClient.isReady) {
    await redisClient.set(CACHE_KEY, JSON.stringify(songs), {
      EX: CACHE_EXPIRY,
    });
  }

  res.json(songs);
});

export const getAllSongsOfAlbum = TryCatch(async (req, res) => {
  const { id } = req.params;
  let albums, songs;

  albums = await NEONDB`SELECT  * FROM albums WHERE id =${id}`;

  if (albums.length === 0) {
    res.status(404).json({
      message: "No albums with this id",
    });
    return;
  }

  songs = await NEONDB` SELECT * FROM songs WHERE album_id = ${id}`;

  const response = { songs, album: albums[0] };
  res.json(response);
});

export const getSingleSong = TryCatch(async (req, res) => {
  const songs = await NEONDB` SELECT * FROM songs WHERE id = ${req.params.id}`;
  res.json(songs[0]);
});
