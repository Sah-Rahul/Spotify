import cloudinary from "./config/cloudinary.config.js";
import getBuffer from "./config/DataUri.js";
import { NEONDB } from "./config/db.js";
import TryCatch from "./TryCatch.js";
import { Request, Response } from "express";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
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

    return res.status(201).json({
      message: "Song added successfully",
      song,
    });
  }
);
