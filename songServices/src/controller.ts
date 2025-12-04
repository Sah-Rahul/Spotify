 
import { NEONDB } from "./db.config";
import TryCatch from "./TryCatch";

export const getAllAlbums = TryCatch ( async (req,res) =>{
    let albums;

    albums = await NEONDB`SELECT  * FROM albums`

    res.json(albums)
})


export const getAllSongs = TryCatch ( async (req,res) =>{
    let songs;

    songs = await NEONDB`SELECT  * FROM songs`

    res.json(songs)
})

export const getAllSongsOfAlbum = TryCatch ( async (req,res) =>{
    const { id } = req.params
    let albums, songs;

    albums = await NEONDB`SELECT  * FROM albums WHERE id =${id}`

   if(albums.length === 0){
    res.status(404).json({
        message:"No albums with this id"
    })
    return
   }

   songs = await NEONDB` SELECT * FROM songs WHERE album_id = ${id}`

   const response = { songs, album: albums[0]}
   res.json(response)
})

export const getSingleSong = TryCatch(async (req,res) =>{
    const songs = await NEONDB` SELECT * FROM songs WHERE id = ${req.params.id}`
    res.json(songs[0])
})