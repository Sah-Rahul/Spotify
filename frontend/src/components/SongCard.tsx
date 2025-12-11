import React from "react";
import { Play, Heart } from "lucide-react";
import { useSong, type Song } from "../Context/SongContext";
import { useUserData } from "../Context/UserContext";

const SongCard: React.FC<{ song: Song }> = ({ song }) => {
  const { setSelectedSong } = useSong();
  const { user, addToPlaylist } = useUserData();

  const isLiked = user?.playlist.includes(song.id);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToPlaylist(song.id);
  };

  return (
    <div
      className="group bg-[#181818] hover:bg-[#282828] p-4 rounded-lg cursor-pointer transition relative"
      onClick={() => setSelectedSong(song)}
    >
      <img
        src={song.thumbnail}
        alt={song.title}
        className="rounded-md w-full h-40 object-cover"
      />

      <p className="text-white font-semibold mt-3 truncate">{song.title}</p>
      <p className="text-gray-400 text-sm truncate">{song.description}</p>


      <button
        onClick={handleLike}
        className="absolute top-3 right-3 cursor-pointer opacity-0 group-hover:opacity-100 bg-black/50 p-2 rounded-full transition"
      >
        <Heart
          size={18}
          className={isLiked ? "text-red-500 fill-red-500" : "text-white"}
        />
      </button>


      <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 bg-green-500 text-black p-2 rounded-full">
        <Play size={18} fill="black" />
      </button>
    </div>
  );
};

export default SongCard;
