import cloudinary from "./config/cloudinary.config.js";
import getBuffer from "./config/DataUri.js";
import { NEONDB } from "./config/db.js";
import { redisClient } from "./index.js";
import TryCatch from "./TryCatch.js";
import { Request, Response } from "express";
import multer from "multer";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
  file?: Express.Multer.File;
}

export const addAlbum = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
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

    const fileBuffer = getBuffer(file);
    if (!fileBuffer) {
      return res.status(400).json({
        message: "Invalid file buffer",
      });
    }

    const uploaded = await cloudinary.uploader.upload(fileBuffer, {
      folder: "spotify-albums",
    });

    const result = await NEONDB`
  INSERT INTO albums (title, description, thumbnail)
  VALUES (${title}, ${description}, ${uploaded.secure_url})
  RETURNING *;
`;

    const album = result[0];

    if (redisClient.isReady) {
      await redisClient.del("albums");
    }
    return res.status(201).json({
      message: "Album created successfully",
      album,
    });
  }
);

export const addSong = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
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

    const isAlbum = await NEONDB`SELECT * FROM albums WHERE id = ${album}`;
    if (isAlbum.length === 0) {
      return res.status(404).json({ message: "Album not found this id" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Audio file is required",
      });
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer) {
      return res.status(400).json({
        message: "Invalid file buffer",
      });
    }

    const uploaded = await cloudinary.uploader.upload(fileBuffer, {
      folder: "spotify-songs",
      resource_type: "video",
    });

    const result = await NEONDB`
      INSERT INTO songs (title, description, audio, album_id)
      VALUES (${title},   ${description}, ${uploaded.secure_url}, ${album})
      RETURNING *;
    `;

    const song = result[0];

    if (redisClient.isReady) {
      await redisClient.del("songs");
    }

    return res.status(201).json({
      message: "Song added successfully",
      song,
    });
  }
);

export const addThumbnail = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update song thumbnails",
      });
    }

    const songId = req.params.id;

    const song = await NEONDB`SELECT * FROM songs WHERE id = ${songId}`;

    if (!song.length) {
      return res.status(404).json({ message: "Song not found" });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({
        message: "Thumbnail image is required",
      });
    }

    const fileBuffer = getBuffer(file);
    if (!fileBuffer) {
      return res.status(400).json({
        message: "Invalid file buffer",
      });
    }

    const uploaded = await cloudinary.uploader.upload(fileBuffer, {
      folder: "spotify-songs-thumbnails",
    });

    const result = await NEONDB`
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
  }
);

export const deleteAlbum = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete albums",
      });
    }

    const { id } = req.params;

    const album = await NEONDB`SELECT * FROM albums WHERE id = ${id}`;

    if (album.length === 0) {
      return res.status(404).json({ message: "Album not found" });
    }

    await NEONDB`DELETE FROM songs WHERE album_id = ${id}`;

    await NEONDB`DELETE FROM albums WHERE id = ${id}`;

    return res.status(200).json({
      message: "Album and its songs deleted successfully",
    });
  }
);

export const deleteSong = TryCatch(
  async (req: AuthenticatedRequest, res: Response) => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete songs",
      });
    }

    const { id } = req.params;

    const song = await NEONDB`SELECT * FROM songs WHERE id = ${id}`;
    if (song.length === 0) {
      return res.status(404).json({ message: "Song not found" });
    }

    await NEONDB`DELETE FROM songs WHERE id = ${id}`;

    return res.status(200).json({
      message: "Song deleted successfully",
    });
  }
);
