import { useState } from "react";
import toast from "react-hot-toast";
import type { Album } from "../Context/SongContext";

const server = "http://localhost:4000";

interface AddAlbumFormProps {
  onSuccess?: (newAlbum: Album) => void;
}

const AddAlbumForm: React.FC<AddAlbumFormProps> = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !thumbnail) {
      toast.error("All fields are required!");
      return;
    }

    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("thumbnail", thumbnail);

    try {
      setLoading(true);

      const res = await fetch(`${server}/api/v1/album/new`, {
        method: "POST",
        credentials: "include",
        body: form,
      });

      const data: { album?: Album; message?: string } = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to create album");
        return;
      }

      if (onSuccess && data.album) onSuccess(data.album);

      setTitle("");
      setDescription("");
      setThumbnail(null);
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
        placeholder="Album Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-2 bg-[#333] text-white rounded"
      />
      <textarea
        placeholder="Album Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="p-2 bg-[#333] text-white rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
        className="p-2 bg-[#333] text-white rounded"
      />
      <button
        className="bg-green-500 py-2 rounded text-black font-bold"
        type="submit"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Album"}
      </button>
    </form>
  );
};

export default AddAlbumForm;
