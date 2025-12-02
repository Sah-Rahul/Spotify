import { Router } from "express";
import { addAlbum, addSong } from "./controller.js";
import { isAuth } from "./middleware.js";
import upload from "./multer.js";

const adminRouter = Router();

adminRouter.post("/album/new", isAuth, upload.single("thumbnail"), addAlbum);
adminRouter.post("/song/new", isAuth, upload.single("audio"), addSong);

export default adminRouter;
