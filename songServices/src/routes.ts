import { Router } from "express";  
import { getAllAlbums, getAllSongs, getAllSongsOfAlbum, getSingleSong } from "./controller";

const songRouter = Router()

songRouter.get("/album/all",  getAllAlbums) 
songRouter.get("/song/all",  getAllSongs) 
songRouter.get("/album/:id",  getAllSongsOfAlbum) 
songRouter.get("/song/:id",  getSingleSong

) 

export default songRouter