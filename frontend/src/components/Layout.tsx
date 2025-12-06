import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Player from "./Player";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <div className="flex-1 m-2 p-4 rounded bg-[#121212] overflow-auto">
          <Navbar />
          {children}
        </div>
      </div>
 <Player />
    </div>
  );
};

export default Layout;
