import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { useSong } from "../Context/SongContext";
import { useUserData } from "../Context/UserContext";
import { useNavigate } from "react-router-dom";

import Modal from "../components/Modal";
import AddAlbumForm from "../components/AddAlbumForm";
import AddSongForm from "../components/AddSongForm";
import toast from "react-hot-toast";

const server = "http://localhost:4000";

interface Song {
  id: string;
  title: string;
  description: string;
  album: string;
  thumbnail?: string;
  audio: string;
}

interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  const { songs: initialSongs, albums: initialAlbums } = useSong();

  const [songs, setSongs] = useState<Song[]>(initialSongs);
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);
  const [activeTab, setActiveTab] = useState<"songs" | "albums">("songs");
  const [openAlbumModal, setOpenAlbumModal] = useState(false);
  const [openSongModal, setOpenSongModal] = useState(false);
  const [editingSong, setEditingSong] = useState<Song | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") navigate("/login");
  }, [user, navigate]);

  
  const handleAlbumAdded = (newAlbum: Album) => {
    setAlbums([newAlbum, ...albums]);
    setOpenAlbumModal(false);
    toast.success("Album added successfully!");
  };

  const handleSongAdded = (newSong: Song) => {
   
    if (editingSong) {
      setSongs(songs.map((s) => (s.id === newSong.id ? newSong : s)));
      setEditingSong(null);
    } else {
      setSongs([newSong, ...songs]);
    }
    setOpenSongModal(false);
    toast.success(editingSong ? "Song updated!" : "Song added successfully!");
  };

  const handleDeleteAlbum = async (id: string) => {
    if (!confirm("Are you sure you want to delete this album?")) return;

    try {
      const res = await fetch(`${server}/api/v1/album/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete album");

      setAlbums(albums.filter((album) => album.id !== id));
      toast.success("Album deleted ✔");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteSong = async (id: string) => {
    if (!confirm("Are you sure you want to delete this song?")) return;

    try {
      const res = await fetch(`${server}/api/v1/song/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to delete song");

      setSongs(songs.filter((song) => song.id !== id));
      toast.success("Song deleted ✔");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditSong = (song: Song) => {
    setEditingSong(song);
    setOpenSongModal(true);
  };

  return (
    <Layout>
      <div className="text-white p-10">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-[#222] p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">Total Songs</h3>
            <p className="text-4xl mt-3">{songs.length}</p>
          </div>

          <div className="bg-[#222] p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">Total Albums</h3>
            <p className="text-4xl mt-3">{albums.length}</p>
          </div>

          <div className="bg-[#222] p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold">Admin</h3>
            <p className="text-3xl mt-3">{user?.username}</p>
          </div>
        </div>

        <div className="flex gap-4 mb-5">
          <button
            onClick={() => setActiveTab("songs")}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === "songs" ? "bg-blue-500 text-black" : "bg-[#333]"
            }`}
          >
            Songs
          </button>
          <button
            onClick={() => setActiveTab("albums")}
            className={`px-4 py-2 rounded font-semibold ${
              activeTab === "albums" ? "bg-green-500 text-black" : "bg-[#333]"
            }`}
          >
            Albums
          </button>
        </div>

        {activeTab === "songs" ? (
          <div>
            <button
              className="bg-blue-500 cursor-pointer px-6 py-2 rounded font-bold text-black mb-4"
              onClick={() => {
                setEditingSong(null);
                setOpenSongModal(true);
              }}
            >
              + Add Song
            </button>

            <div className="grid grid-cols-3 gap-6">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="bg-[#222] p-4 rounded-xl flex flex-col justify-between shadow-md"
                >
                  {song.thumbnail ? (
                    <img
                      src={song?.thumbnail}
                      alt={song.title}
                      className="w-full h-48 object-cover rounded-md mb-3"
                    />
                  ) : (
                    <div className="w-full h-48 bg-[#333] flex items-center justify-center rounded-md mb-3 text-gray-400">
                      No Image
                    </div>
                  )}

                  <div>
                    <p className="font-semibold text-lg">{song.title}</p>
                    <p className="text-sm text-gray-400">{song.album}</p>
                  </div>

                  <div className="flex items-center gap-5">
                    <button
                      className="bg-yellow-500 cursor-pointer px-2 py-1 rounded text-black font-bold mt-4"
                      onClick={() => handleEditSong(song)}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 cursor-pointer px-2 py-1 rounded text-black font-bold mt-4"
                      onClick={() => handleDeleteSong(song.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <button
              className="bg-green-500 cursor-pointer px-6 py-2 rounded font-bold text-black mb-4"
              onClick={() => setOpenAlbumModal(true)}
            >
              + Add Album
            </button>

            <div className="grid grid-cols-3 gap-6">
              {albums.map((album) => (
                <div
                  key={album.id}
                  className="bg-[#222] p-4 rounded-xl flex flex-col items-center shadow-md"
                >
                  <img
                    src={album.thumbnail}
                    alt={album.title}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                  <p className="font-semibold text-lg">{album.title}</p>
                  <p className="text-sm text-gray-400 mb-3">
                    {album.description}
                  </p>
                  <button
                    className="bg-red-500 px-3 py-1 rounded text-black font-bold"
                    onClick={() => handleDeleteAlbum(album.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Modal
          open={openAlbumModal}
          onClose={() => setOpenAlbumModal(false)}
          title="Add New Album"
        >
          <AddAlbumForm onSuccess={handleAlbumAdded} />
        </Modal>

        <Modal
          open={openSongModal}
          onClose={() => setOpenSongModal(false)}
          title={editingSong ? "Update Song" : "Add New Song"}
        >
          <AddSongForm
            songToEdit={editingSong || undefined}
            onSuccess={handleSongAdded}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Dashboard;
