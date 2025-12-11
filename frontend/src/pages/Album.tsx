import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSong } from "../Context/SongContext";
import Layout from "../components/Layout";
import Loading from "../components/Loading";
import { Heart, PlayCircle } from "lucide-react";
import { useUserData } from "../Context/UserContext";

const Album = () => {
  const { id } = useParams();

  const { albumSongs, albumData, fetchAlbumSongs, loading, setSelectedSong } =
    useSong();

  const { addToPlaylist, user } = useUserData();

  useEffect(() => {
    if (id) fetchAlbumSongs(id);
  }, [id]);

  if (loading) return <Loading />;

  return (
    <Layout>
      <div className="text-white px-10 py-6">
        {albumData && (
          <div className="flex gap-6 items-center mb-10">
            <img
              src={albumData.thumbnail}
              className="w-56 h-56 rounded-lg object-cover shadow-lg"
            />

            <div>
              <p className="uppercase tracking-widest text-sm text-gray-300">
                Playlist
              </p>

              <h1 className="text-5xl font-extrabold mt-2">
                {albumData.title}
              </h1>

              <p className="text-gray-400 mt-3 text-lg">
                {albumData.description}
              </p>
            </div>
          </div>
        )}

        <div className="flex gap-3 mb-8">
          <button className="px-5 py-2 bg-white text-black rounded-full">
            All
          </button>
          <button className="px-5 py-2 bg-[#222] rounded-full">Music</button>
          <button className="px-5 py-2 bg-[#222] rounded-full">Podcasts</button>
        </div>

        <div className="grid grid-cols-12 text-gray-400 border-b border-gray-700 pb-2 mb-3 uppercase text-xs tracking-wider">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Title</div>
          <div className="col-span-4">Description</div>
          <div className="col-span-2">Actions</div>
        </div>

        {albumSongs.map((song, index) => {
          const isSaved = user?.playlist?.includes(song.id);

          return (
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
                  <Heart
                    className={`transition ${
                      isSaved
                        ? "text-green-500 fill-green-500"
                        : "text-gray-300"
                    }`}
                  />
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
          );
        })}
      </div>
    </Layout>
  );
};

export default Album;
