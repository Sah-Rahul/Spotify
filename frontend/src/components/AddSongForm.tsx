import { useState } from "react";
import { useSong, type Song } from "../Context/SongContext";
import toast from "react-hot-toast";

const server = "http://localhost:4000";

interface AddSongFormProps {
  songToEdit?: Song;
  onSuccess?: (newSong: Song) => void;
}

const AddSongForm: React.FC<AddSongFormProps> = ({ songToEdit, onSuccess }) => {
  const { albums } = useSong();
  const [title, setTitle] = useState(songToEdit?.title || "");
  const [description, setDescription] = useState(songToEdit?.description || "");
  const [audio, setAudio] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [album, setAlbum] = useState(songToEdit?.album || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !album) {
      toast.error("Title, description, and album are required!");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("album", album);
    if (audio) form.append("audio", audio);
    if (thumbnail) form.append("thumbnail", thumbnail);

    try {
      setLoading(true);

      const url = songToEdit
        ? `${server}/api/v1/song/${songToEdit.id}`
        : `${server}/api/v1/song/new`;
      const method = songToEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        body: form,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error((data as any).message || "Failed to save song");
        return;
      }

      const newSong: Song = data;

      if (onSuccess) onSuccess(newSong);

      if (!songToEdit) {
        setTitle("");
        setDescription("");
        setAudio(null);
        setThumbnail(null);
        setAlbum("");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 bg-[#333] text-white rounded"
      />

      <textarea
        placeholder="Song Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 bg-[#333] text-white rounded"
      />

      <select
        className="p-2 bg-[#333] rounded text-white"
        value={album}
        onChange={(e) => setAlbum(e.target.value)}
      >
        <option value="">Select Album</option>
        {albums.map((al: any) => (
          <option key={al.id} value={al.id}>
            {al.title}
          </option>
        ))}
      </select>

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] || null)}
        className="p-2 bg-[#333] text-white rounded"
      />

      {/* <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        className="p-2 bg-[#333] text-white rounded"
      /> */}

      <button
        className="bg-blue-500 py-2 rounded text-black font-bold"
        type="submit"
        disabled={loading}
      >
        {loading
          ? songToEdit
            ? "Updating..."
            : "Uploading..."
          : songToEdit
          ? "Update Song"
          : "Add Song"}
      </button>
    </form>
  );
};

export default AddSongForm;
