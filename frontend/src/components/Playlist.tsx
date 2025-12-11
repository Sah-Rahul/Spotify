import { useSong } from "../Context/SongContext";
import { useUserData } from "../Context/UserContext";
import Layout from "./Layout";
import { Heart, PlayCircle } from "lucide-react";

const Playlist = () => {
  const { songs, setSelectedSong } = useSong();
  const { user, addToPlaylist } = useUserData();

  const playlistSongs = songs.filter((song) =>
    user?.playlist?.includes(song.id)
  );

  return (
    <Layout>
      <div className="text-white px-10 py-6">
        <h1 className="text-4xl font-bold mb-6">{user?.username} Playlist</h1>

        {playlistSongs.length === 0 ? (
          <p className="text-gray-400">Your playlist is empty</p>
        ) : (
          <div>
            <div className="grid grid-cols-12 text-gray-400 border-b border-gray-700 pb-2 mb-3 uppercase text-xs tracking-wider">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Title</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2">Actions</div>
            </div>

            {playlistSongs.map((song, index) => (
              <div
                key={song.id}
                className="grid grid-cols-12 py-3 border-b border-gray-800 hover:bg-[#1a1a1a] cursor-pointer"
                onClick={() => setSelectedSong(song)}
              >
                <div className="col-span-1 flex items-center text-gray-300">
                  {index + 1}
                </div>

                <div className="col-span-5 flex items-center gap-3">
                  <img
                    src={song.thumbnail}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <span className="font-medium">{song.title}</span>
                </div>

                <div className="col-span-4 flex items-center text-gray-400 text-sm">
                  {song.description}
                </div>

                <div className="col-span-2 flex items-center gap-5 text-xl">
                  <button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToPlaylist(song.id);
                    }}
                  >
                    <Heart className="text-green-500 fill-green-500" />
                  </button>

                  <button
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSong(song);
                    }}
                  >
                    <PlayCircle className="hover:text-white transition" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Playlist;
