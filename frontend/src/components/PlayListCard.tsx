import { Music2 } from "lucide-react";
import { useUserData } from "../Context/UserContext";
import Loading from "./Loading";

const PlayListCard = () => {
  const { user, isAuth, loading } = useUserData();

  if (loading) return <p className="text-white"><Loading /></p>;

  return (
    <div className="bg-[#181818] p-4 rounded mt-4 text-white hover:bg-[#282828] cursor-pointer flex items-center gap-4">
      <div className="w-10 h-10 bg-[#2a2a2a] rounded flex items-center justify-center">
        <Music2 size={20} className="text-white" />
      </div>

      <div>
        <p className="text-sm font-semibold">My Playlist</p>
        <p className="text-xs text-gray-400"> 
          Playlist • {isAuth && user ? user.username : "User"}  
        </p>
      </div>
    </div>
  );
};

export default PlayListCard;
