import { Bookmark, House, Search } from "lucide-react";
import React from "react";
import PlayListCard from "./PlayListCard";
import { Link, useNavigate } from "react-router-dom";
import { useUserData } from "../Context/UserContext";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserData();
  return (
    <div className="w-60 bg-black text-gray-300 p-4 hidden lg:block h-full">
      <ul className="space-y-4">
        <Link
          to={"/"}
          className="flex items-center gap-3 hover:text-white cursor-pointer"
        >
          <House size={20} /> Home
        </Link>

        <li className="flex items-center gap-3 hover:text-white cursor-pointer">
          <Search size={20} /> Search
        </li>

        <li className="flex items-center gap-3 hover:text-white cursor-pointer">
          <Bookmark size={20} /> Your Library
        </li>
      </ul>

      <Link to={"/playlist"} className="mt-6">
        <PlayListCard />
      </Link>

      <div className="bg-[#181818] p-4 rounded-lg mt-4 text-white hover:bg-[#282828] cursor-pointer">
        <div className="flex items-center gap-3 mb-3">
          <p className="font-semibold text-sm">
            Let’s find some podcasts to follow
          </p>
        </div>

        <p className="text-xs text-gray-400 mb-4">
          We'll keep you updated on new episodes.
        </p>

        <button className="rounded-full cursor-pointer bg-white text-black text-sm font-semibold px-4 py-2 w-full hover:scale-105 transition">
          Browse Podcasts
        </button>
      </div>
      {user && user.role === "admin" && (
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="rounded-full mt-5 cursor-pointer bg-white text-black text-sm font-semibold px-4 py-2 w-full hover:scale-105 transition"
        >
          Admin Dashboard
        </button>
      )}
    </div>
  );
};

export default Sidebar;
