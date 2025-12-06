import Layout from "../components/Layout";
import AlbumCard from "../components/AlbumCard";
import SongCard from "../components/SongCard";
import { useSong } from "../Context/SongContext";

const Home = () => {
  const { albums, songs, loading } = useSong();

  return (
    <Layout>
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Trending Albums</h2>
        {loading && <p className="text-gray-400">Loading albums...</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">Trending Songs</h2>
        {loading && <p className="text-gray-400">Loading songs...</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
