import { Router } from "express";
import { addAlbum, addSong, addThumbnail, deleteAlbum } from "./controller.js";
import { isAuth } from "./middleware.js";
import upload from "./multer.js";

const adminRouter = Router();

adminRouter.post("/album/new", isAuth, upload.single("thumbnail"), addAlbum);
adminRouter.post("/song/new", isAuth, upload.single("audio"), addSong);
adminRouter.patch("/song/:id/thumbnail", isAuth, upload.single("thumbnail"),addThumbnail);
adminRouter.delete("/album/:id", isAuth, deleteAlbum);
export default adminRouter;
