import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="bg-black/40 p-2 rounded-full hover:bg-black/60">
            <ChevronLeft size={20} />
          </button>
          <button className="bg-black/40 p-2 rounded-full hover:bg-black/60">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-4 py-1 rounded-full bg-white text-black text-sm font-medium">
            All
          </button>
          <button className="px-4 py-1 rounded-full bg-[#2a2a2a] text-white text-sm font-medium hover:bg-[#3a3a3a]">
            Music
          </button>
          <button className="px-4 py-1 rounded-full bg-[#2a2a2a] text-white text-sm font-medium hover:bg-[#3a3a3a]">
            Podcasts
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="px-4 py-1 rounded-full bg-white text-black text-sm font-medium hover:scale-105 transition">
          Explore Premium
        </button>

        <button className="px-4 py-1 rounded-full bg-white text-black text-sm font-medium hover:scale-105 transition">
          Install App
        </button>

        <button className="px-4 py-1 rounded-full bg-white text-black text-sm font-medium">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
