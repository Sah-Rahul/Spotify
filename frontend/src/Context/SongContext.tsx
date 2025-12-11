import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

const server = "http://localhost:7000";

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  audio: string;
  album: string;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
}

interface SongContextType {
  songs: Song[];
  albums: Album[];
  albumSongs: Song[];
  albumData: Album | null;
  loading: boolean;
  error: string | null;

  selectedSong: Song | null;
  setSelectedSong: (song: Song) => void;

  nextSong: () => void;
  prevSong: () => void;

  fetchAlbumSongs: (id: string) => Promise<void>;
}

const SongContext = createContext<SongContextType | null>(null);

export const SongProvider = ({ children }: { children: ReactNode }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumSongs, setAlbumSongs] = useState<Song[]>([]);
  const [albumData, setAlbumData] = useState<Album | null>(null);

  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songRes, albumRes] = await Promise.all([
          fetch(`${server}/api/v1/song/all`),
          fetch(`${server}/api/v1/album/all`),
        ]);

        setSongs(await songRes.json());
        setAlbums(await albumRes.json());
      } catch {
        setError("Failed to fetch songs or albums");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const fetchAlbumSongs = useCallback(async (id: string) => {
    try {
      setLoading(true);

      const res = await fetch(`${server}/api/v1/album/${id}`);
      const data = await res.json();

      setAlbumSongs(data.songs);
      setAlbumData(data.album);
    } catch {
      setError("Failed to fetch album songs");
    } finally {
      setLoading(false);
    }
  }, []);

  const nextSong = () => {
    if (!selectedSong || albumSongs.length === 0) return;
    const idx = albumSongs.findIndex((s) => s.id === selectedSong.id);
    setSelectedSong(albumSongs[(idx + 1) % albumSongs.length]);
  };

  const prevSong = () => {
    if (!selectedSong || albumSongs.length === 0) return;
    const idx = albumSongs.findIndex((s) => s.id === selectedSong.id);
    setSelectedSong(albumSongs[(idx - 1 + albumSongs.length) % albumSongs.length]);
  };

  return (
    <SongContext.Provider
      value={{
        songs,
        albums,
        albumSongs,
        albumData,
        loading,
        error,
        selectedSong,
        setSelectedSong,
        nextSong,
        prevSong,
        fetchAlbumSongs,
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export const useSong = () => {
  const ctx = useContext(SongContext);
  if (!ctx) throw new Error("useSong must be used inside SongProvider");
  return ctx;
};
