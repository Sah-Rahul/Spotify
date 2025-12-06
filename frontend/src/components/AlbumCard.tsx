import React from "react";
import type { Album } from "../Context/SongContext";

interface Props {
  album: Album;
}

const AlbumCard: React.FC<Props> = ({ album }) => {
  return (
    <div className="bg-[#181818] hover:bg-[#282828] p-4 rounded-lg cursor-pointer transition group">
      <img
        src={album.thumbnail}
        alt={album.title}
        className="rounded-md w-full h-40 object-cover mb-4"
      />

      <p className="text-white font-semibold truncate">{album.title}</p>
      <p className="text-gray-400 text-sm truncate">{album.description}</p>
    </div>
  );
};

export default AlbumCard;
