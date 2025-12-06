import { Bookmark, House,   Search } from "lucide-react";
import React from "react";
import PlayListCard from "./PlayListCard";

const Sidebar: React.FC = () => {
  return (
    <div className="w-60 bg-black text-gray-300 p-4 hidden lg:block h-full">
      <ul className="space-y-4">
        <li className="flex items-center gap-3 hover:text-white cursor-pointer">
          <House size={20} /> Home
        </li>

        <li className="flex items-center gap-3 hover:text-white cursor-pointer">
          <Search size={20} /> Search
        </li>

        <li className="flex items-center gap-3 hover:text-white cursor-pointer">
          <Bookmark size={20} /> Your Library
        </li>
      </ul>

      <div className="mt-6">
        <PlayListCard />
      </div>

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
    </div>
  );
};

export default Sidebar;
