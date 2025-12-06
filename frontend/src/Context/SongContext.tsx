import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const server = "http://localhost:7000";

export interface Song {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
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
  loading: boolean;
  error: string | null;

  selectedSong: Song | null;
  setSelectedSong: (song: Song) => void;

  nextSong: () => void;
  prevSong: () => void;
}

const SongContext = createContext<SongContextType | null>(null);

interface SongProviderProps {
  children: ReactNode;
}

export const SongProvider: React.FC<SongProviderProps> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [songRes, albumRes] = await Promise.all([
          fetch(`${server}/api/v1/song/all`),
          fetch(`${server}/api/v1/album/all`),
        ]);
        const songData = await songRes.json();
        const albumData = await albumRes.json();
        setSongs(songData);
        setAlbums(albumData);
      } catch {
        setError("Failed to fetch songs or albums");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const nextSong = () => {
    if (!selectedSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === selectedSong.id);
    setSelectedSong(songs[(idx + 1) % songs.length]);
  };

  const prevSong = () => {
    if (!selectedSong || songs.length === 0) return;
    const idx = songs.findIndex((s) => s.id === selectedSong.id);
    setSelectedSong(songs[(idx - 1 + songs.length) % songs.length]);
  };

  return (
    <SongContext.Provider
      value={{ songs, albums, loading, error, selectedSong, setSelectedSong, nextSong, prevSong }}
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
